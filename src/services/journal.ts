import { getOrCreateDeviceId } from "@/lib/device-id";
import type { PraiseJournalEntry } from "@/types/daily-activity";

function isEntry(value: unknown): value is PraiseJournalEntry {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.date === "string" &&
    typeof candidate.content === "string" &&
    typeof candidate.updatedAt === "string"
  );
}

export async function fetchPraiseJournal(
  signal?: AbortSignal,
): Promise<PraiseJournalEntry[]> {
  const response = await fetch("/api/journal", {
    headers: { "x-device-id": getOrCreateDeviceId() },
    cache: "no-store",
    signal,
  });
  if (!response.ok) throw new Error("Journal sync failed.");

  const data: unknown = await response.json();
  if (typeof data !== "object" || data === null) return [];
  const entries = (data as Record<string, unknown>).entries;
  return Array.isArray(entries) ? entries.filter(isEntry) : [];
}

export async function upsertPraiseJournal(
  date: string,
  content: string,
): Promise<PraiseJournalEntry> {
  const response = await fetch("/api/journal", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-device-id": getOrCreateDeviceId(),
    },
    body: JSON.stringify({ date, content }),
  });
  if (!response.ok) throw new Error("Journal save failed.");

  const data: unknown = await response.json();
  const entry =
    typeof data === "object" && data !== null
      ? (data as Record<string, unknown>).entry
      : null;
  if (!isEntry(entry)) throw new Error("Journal response is invalid.");
  return entry;
}
