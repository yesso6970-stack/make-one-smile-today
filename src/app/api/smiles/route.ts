import { createHash } from "node:crypto";

import { count } from "drizzle-orm";
import { NextResponse } from "next/server";

import { db } from "@/db/client";
import { smileEvents } from "@/db/schema";
import { getLocalDateKey } from "@/lib/date";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function json(data: Record<string, boolean | number>, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

async function getCommunityTotal() {
  const [result] = await db.select({ total: count() }).from(smileEvents);
  return result?.total ?? 0;
}

export async function GET() {
  try {
    return json({ total: await getCommunityTotal() });
  } catch {
    return json({ error: true, total: 0 }, 503);
  }
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();
    if (typeof body !== "object" || body === null) {
      return json({ error: true, total: 0 }, 400);
    }

    const deviceId = (body as Record<string, unknown>).deviceId;
    if (typeof deviceId !== "string" || !UUID_PATTERN.test(deviceId)) {
      return json({ error: true, total: 0 }, 400);
    }

    const deviceHash = createHash("sha256").update(deviceId).digest("hex");
    const inserted = await db
      .insert(smileEvents)
      .values({ deviceHash, successDate: getLocalDateKey() })
      .onConflictDoNothing()
      .returning({ deviceHash: smileEvents.deviceHash });

    return json({
      counted: inserted.length > 0,
      total: await getCommunityTotal(),
    });
  } catch {
    return json({ error: true, total: 0 }, 503);
  }
}
