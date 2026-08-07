import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { getDb, reportDatabaseError } from "@/db";
import { praiseJournalEntries } from "@/db/schema";
import { getLocalDateKey } from "@/lib/date";
import { hashDeviceId } from "@/lib/server-device";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function json(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function getRequestDeviceHash(request: Request): string | null {
  return hashDeviceId(request.headers.get("x-device-id"));
}

function isValidEntryDate(value: unknown): value is string {
  if (typeof value !== "string" || !DATE_PATTERN.test(value)) return false;
  const parsed = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(parsed.getTime()) && value <= getLocalDateKey();
}

export async function GET(request: Request) {
  const deviceHash = getRequestDeviceHash(request);
  if (!deviceHash) return json({ error: true, entries: [] }, 400);

  try {
    const entries = await getDb()
      .select({
        date: praiseJournalEntries.entryDate,
        content: praiseJournalEntries.content,
        updatedAt: praiseJournalEntries.updatedAt,
      })
      .from(praiseJournalEntries)
      .where(eq(praiseJournalEntries.deviceHash, deviceHash))
      .orderBy(desc(praiseJournalEntries.entryDate))
      .limit(120);

    return json({
      entries: entries.map((entry) => ({
        ...entry,
        updatedAt: entry.updatedAt.toISOString(),
      })),
    });
  } catch (error) {
    reportDatabaseError("read praise journal", error);
    return json({ error: true, entries: [] }, 503);
  }
}

export async function POST(request: Request) {
  const deviceHash = getRequestDeviceHash(request);
  if (!deviceHash) return json({ error: true }, 400);

  try {
    const body: unknown = await request.json();
    if (typeof body !== "object" || body === null) {
      return json({ error: true }, 400);
    }

    const candidate = body as Record<string, unknown>;
    const content =
      typeof candidate.content === "string" ? candidate.content.trim() : "";
    if (!isValidEntryDate(candidate.date) || !content || content.length > 200) {
      return json({ error: true }, 400);
    }

    const [entry] = await getDb()
      .insert(praiseJournalEntries)
      .values({
        deviceHash,
        entryDate: candidate.date,
        content,
      })
      .onConflictDoUpdate({
        target: [
          praiseJournalEntries.deviceHash,
          praiseJournalEntries.entryDate,
        ],
        set: { content, updatedAt: new Date() },
      })
      .returning({
        date: praiseJournalEntries.entryDate,
        content: praiseJournalEntries.content,
        updatedAt: praiseJournalEntries.updatedAt,
      });

    return json({
      entry: entry
        ? { ...entry, updatedAt: entry.updatedAt.toISOString() }
        : null,
    });
  } catch (error) {
    reportDatabaseError("save praise journal", error);
    return json({ error: true }, 503);
  }
}
