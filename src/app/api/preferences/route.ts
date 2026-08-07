import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";

import { getDb, reportDatabaseError } from "@/db";
import { userPreferences } from "@/db/schema";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user.id)
    return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
  try {
    const [preferences] = await getDb()
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, session.user.id))
      .limit(1);
    return Response.json(
      { preferences },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch (error) {
    reportDatabaseError("read preferences", error);
    return Response.json({ error: "DATABASE_UNAVAILABLE" }, { status: 503 });
  }
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user.id)
    return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
  const body: unknown = await request.json().catch(() => null);
  if (typeof body !== "object" || body === null)
    return Response.json({ error: "INVALID_BODY" }, { status: 400 });
  const candidate = body as Record<string, unknown>;
  const reminderTime =
    typeof candidate.reminderTime === "string" &&
    /^([01]\d|2[0-3]):[0-5]\d$/.test(candidate.reminderTime)
      ? candidate.reminderTime
      : "20:00";
  try {
    await getDb()
      .insert(userPreferences)
      .values({
        userId: session.user.id,
        notifications: candidate.notifications === true,
        reminderTime,
        vibration: candidate.vibration !== false,
        sound: candidate.sound !== false,
      })
      .onConflictDoUpdate({
        target: userPreferences.userId,
        set: {
          notifications: candidate.notifications === true,
          reminderTime,
          vibration: candidate.vibration !== false,
          sound: candidate.sound !== false,
          updatedAt: new Date(),
        },
      });
    return Response.json({ saved: true });
  } catch (error) {
    reportDatabaseError("save preferences", error);
    return Response.json({ error: "DATABASE_UNAVAILABLE" }, { status: 503 });
  }
}
