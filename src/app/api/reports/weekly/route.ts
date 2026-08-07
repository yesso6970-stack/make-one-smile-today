import { and, eq, gte } from "drizzle-orm";
import { getServerSession } from "next-auth";
import OpenAI from "openai";

import { getDb, reportDatabaseError } from "@/db";
import { userDailyActivities, weeklyReports } from "@/db/schema";
import { authOptions } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function weekStartKey() {
  const now = new Date();
  const day = now.getDay();
  now.setDate(now.getDate() + (day === 0 ? -6 : 1 - day));
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user.id)
    return Response.json({ error: "UNAUTHORIZED" }, { status: 401 });
  const weekStart = weekStartKey();
  try {
    const database = getDb();
    const [existing] = await database
      .select()
      .from(weeklyReports)
      .where(
        and(
          eq(weeklyReports.userId, session.user.id),
          eq(weeklyReports.weekStart, weekStart),
        ),
      )
      .limit(1);
    if (existing)
      return Response.json(
        { report: existing },
        { headers: { "Cache-Control": "private, max-age=300" } },
      );

    const activities = await database
      .select()
      .from(userDailyActivities)
      .where(
        and(
          eq(userDailyActivities.userId, session.user.id),
          gte(userDailyActivities.activityDate, weekStart),
        ),
      );
    const completed = activities.filter((activity) => activity.completed);
    const journalCount = activities.filter((activity) =>
      Boolean(activity.journal),
    ).length;
    const metrics = {
      completed: completed.length,
      journalCount,
      peopleSmiled: completed.length,
      streak: completed.length,
    };
    let summary =
      completed.length > 0
        ? `이번 주 ${completed.length}번의 다정한 실천을 이어갔어요. 누군가의 미소를 위해 마음을 낸 당신 덕분에 평범한 하루가 조금 더 따뜻해졌습니다.`
        : "이번 주의 첫 미소는 아직 기다리고 있어요. 오늘 건네는 짧은 안부 한마디부터 시작해보세요.";

    if (session.user.plan === "premium" && process.env.OPENAI_API_KEY) {
      const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
      const response = await client.responses.create({
        model: process.env.OPENAI_MODEL ?? "gpt-5.6-luna",
        instructions:
          "한국어로 따뜻하고 과장 없이 2문장의 주간 행복 리포트를 작성하세요.",
        input: JSON.stringify(metrics),
      });
      if (response.output_text.trim()) summary = response.output_text.trim();
    }
    const report = {
      id: crypto.randomUUID(),
      userId: session.user.id,
      weekStart,
      summary,
      metrics,
    };
    const [saved] = await database
      .insert(weeklyReports)
      .values(report)
      .onConflictDoUpdate({
        target: [weeklyReports.userId, weeklyReports.weekStart],
        set: { summary, metrics },
      })
      .returning();
    return Response.json({ report: saved });
  } catch (error) {
    reportDatabaseError("generate weekly report", error);
    return Response.json({ error: "REPORT_UNAVAILABLE" }, { status: 503 });
  }
}
