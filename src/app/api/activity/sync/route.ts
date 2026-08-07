import { desc, eq, sql } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

import { getDb, reportDatabaseError } from "@/db";
import { userBadges, userDailyActivities, userStats } from "@/db/schema";
import { authOptions } from "@/lib/auth";
import type { CloudSyncPayload } from "@/types/cloud-sync";
import type { DailyActivityState } from "@/types/daily-activity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function json(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

function isDailyActivityState(value: unknown): value is DailyActivityState {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    candidate.version === 2 &&
    typeof candidate.missionByDate === "object" &&
    candidate.missionByDate !== null &&
    Array.isArray(candidate.completedDates) &&
    typeof candidate.journalByDate === "object" &&
    candidate.journalByDate !== null &&
    typeof candidate.points === "number" &&
    Array.isArray(candidate.awardedMilestones)
  );
}

function isPayload(value: unknown): value is CloudSyncPayload {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  if (!isDailyActivityState(candidate.activity)) return false;
  if (typeof candidate.smileStats !== "object" || candidate.smileStats === null)
    return false;
  const stats = candidate.smileStats as Record<string, unknown>;
  return (
    typeof stats.mySmiles === "number" &&
    typeof stats.streak === "number" &&
    Array.isArray(stats.earnedStickerIds)
  );
}

async function readCloudState(userId: string) {
  const database = getDb();
  const [activities, statsRows, badges] = await Promise.all([
    database
      .select()
      .from(userDailyActivities)
      .where(eq(userDailyActivities.userId, userId))
      .orderBy(desc(userDailyActivities.activityDate))
      .limit(370),
    database
      .select()
      .from(userStats)
      .where(eq(userStats.userId, userId))
      .limit(1),
    database
      .select({ badgeId: userBadges.badgeId })
      .from(userBadges)
      .where(eq(userBadges.userId, userId)),
  ]);
  const stats = statsRows[0];
  const missionByDate: Record<string, string> = {};
  const journalByDate: Record<string, string> = {};
  const completedDates: string[] = [];
  for (const activity of activities) {
    missionByDate[activity.activityDate] = activity.missionId;
    if (activity.journal)
      journalByDate[activity.activityDate] = activity.journal;
    if (activity.completed) completedDates.push(activity.activityDate);
  }
  return {
    activity: {
      version: 2 as const,
      missionByDate,
      completedDates: completedDates.sort(),
      journalByDate,
      points: stats?.points ?? 0,
      awardedMilestones: badges.map((badge) => badge.badgeId),
      completedCountBaseline: stats?.completedMissions ?? 0,
      streakBaseline: stats?.currentStreak ?? 0,
    },
    smileStats: {
      mySmiles: stats?.peopleSmiled ?? 0,
      streak: stats?.currentStreak ?? 0,
      earnedStickerIds: badges
        .map((badge) => badge.badgeId)
        .filter((id) => id.startsWith("sticker-")),
    },
    syncedAt: new Date().toISOString(),
  };
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user.id) return json({ error: "UNAUTHORIZED" }, 401);
  try {
    return json(await readCloudState(session.user.id));
  } catch (error) {
    reportDatabaseError("read user cloud activity", error);
    return json({ error: "DATABASE_UNAVAILABLE" }, 503);
  }
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user.id) return json({ error: "UNAUTHORIZED" }, 401);
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "INVALID_BODY" }, 400);
  }
  if (!isPayload(body)) return json({ error: "INVALID_PAYLOAD" }, 400);

  const userId = session.user.id;
  const activity = body.activity;
  const dates = new Set([
    ...Object.keys(activity.missionByDate),
    ...Object.keys(activity.journalByDate),
    ...activity.completedDates,
  ]);
  if (dates.size > 370) return json({ error: "PAYLOAD_TOO_LARGE" }, 413);

  try {
    await getDb().transaction(async (transaction) => {
      for (const date of dates) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) continue;
        const completed = activity.completedDates.includes(date);
        const journal =
          activity.journalByDate[date]?.trim().slice(0, 200) || null;
        const missionId =
          activity.missionByDate[date]?.slice(0, 80) || "legacy-mission";
        await transaction
          .insert(userDailyActivities)
          .values({ userId, activityDate: date, missionId, journal, completed })
          .onConflictDoUpdate({
            target: [
              userDailyActivities.userId,
              userDailyActivities.activityDate,
            ],
            set: {
              missionId,
              journal: sql`coalesce(${journal}, ${userDailyActivities.journal})`,
              completed: sql`${userDailyActivities.completed} or ${completed}`,
              updatedAt: new Date(),
            },
          });
      }

      const completedCount = Math.max(
        activity.completedDates.length,
        activity.completedCountBaseline,
      );
      await transaction
        .insert(userStats)
        .values({
          userId,
          peopleSmiled: Math.max(0, body.smileStats.mySmiles),
          points: Math.max(0, activity.points),
          currentStreak: Math.max(
            0,
            body.smileStats.streak,
            activity.streakBaseline,
          ),
          longestStreak: Math.max(
            0,
            body.smileStats.streak,
            activity.streakBaseline,
          ),
          completedMissions: completedCount,
        })
        .onConflictDoUpdate({
          target: userStats.userId,
          set: {
            peopleSmiled: sql`greatest(${userStats.peopleSmiled}, ${body.smileStats.mySmiles})`,
            points: sql`greatest(${userStats.points}, ${activity.points})`,
            currentStreak: sql`greatest(${userStats.currentStreak}, ${body.smileStats.streak}, ${activity.streakBaseline})`,
            longestStreak: sql`greatest(${userStats.longestStreak}, ${body.smileStats.streak}, ${activity.streakBaseline})`,
            completedMissions: sql`greatest(${userStats.completedMissions}, ${completedCount})`,
            updatedAt: new Date(),
          },
        });

      const badgeIds = [
        ...new Set([
          ...activity.awardedMilestones,
          ...body.smileStats.earnedStickerIds,
        ]),
      ].slice(0, 100);
      if (badgeIds.length > 0) {
        await transaction
          .insert(userBadges)
          .values(
            badgeIds.map((badgeId) => ({
              userId,
              badgeId: badgeId.slice(0, 80),
            })),
          )
          .onConflictDoNothing();
      }
    });
    return json(await readCloudState(userId));
  } catch (error) {
    reportDatabaseError("merge user cloud activity", error);
    return json({ error: "DATABASE_UNAVAILABLE" }, 503);
  }
}
