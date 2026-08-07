import { eq, sql } from "drizzle-orm";
import { NextResponse } from "next/server";

import { getDb, reportDatabaseError } from "@/db";
import { COMMUNITY_COUNTER_ID, smileCounters, smileEvents } from "@/db/schema";
import { getLocalDateKey } from "@/lib/date";
import { hashDeviceId } from "@/lib/server-device";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function json(data: Record<string, boolean | number>, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function toSafeNumber(value: bigint | undefined): number {
  if (
    value === undefined ||
    value < BigInt(0) ||
    value > BigInt(Number.MAX_SAFE_INTEGER)
  ) {
    throw new Error("Community counter is outside the supported range.");
  }

  return Number(value);
}

async function getCommunityTotal(): Promise<number> {
  const [result] = await getDb()
    .select({ total: smileCounters.total })
    .from(smileCounters)
    .where(eq(smileCounters.id, COMMUNITY_COUNTER_ID))
    .limit(1);

  return toSafeNumber(result?.total ?? BigInt(0));
}

export async function GET() {
  try {
    return json({ total: await getCommunityTotal() });
  } catch (error) {
    reportDatabaseError("read community counter", error);
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
    const deviceHash = hashDeviceId(deviceId);
    if (!deviceHash) {
      return json({ error: true, total: 0 }, 400);
    }

    const result = await getDb().transaction(async (transaction) => {
      const inserted = await transaction
        .insert(smileEvents)
        .values({ deviceHash, successDate: getLocalDateKey() })
        .onConflictDoNothing()
        .returning({ deviceHash: smileEvents.deviceHash });

      if (inserted.length > 0) {
        const [counter] = await transaction
          .insert(smileCounters)
          .values({ id: COMMUNITY_COUNTER_ID, total: BigInt(1) })
          .onConflictDoUpdate({
            target: smileCounters.id,
            set: {
              total: sql`${smileCounters.total} + 1`,
              updatedAt: new Date(),
            },
          })
          .returning({ total: smileCounters.total });

        return { counted: true, total: toSafeNumber(counter?.total) };
      }

      const [counter] = await transaction
        .insert(smileCounters)
        .values({ id: COMMUNITY_COUNTER_ID, total: BigInt(0) })
        .onConflictDoUpdate({
          target: smileCounters.id,
          set: { id: COMMUNITY_COUNTER_ID },
        })
        .returning({ total: smileCounters.total });

      return { counted: false, total: toSafeNumber(counter?.total) };
    });

    return json(result);
  } catch (error) {
    reportDatabaseError("record smile event", error);
    return json({ error: true, total: 0 }, 503);
  }
}
