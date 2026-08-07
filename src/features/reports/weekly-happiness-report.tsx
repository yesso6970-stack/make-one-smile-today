"use client";

import { HeartHandshake } from "lucide-react";
import { useMemo } from "react";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import { ShareAchievementCard } from "@/features/reports/share-achievement-card";
import { MISSIONS } from "@/constants/missions";
import { useDailyActivity } from "@/hooks/use-daily-activity";

function startOfWeekKey() {
  const now = new Date();
  const day = now.getDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  now.setDate(now.getDate() + mondayOffset);
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export function WeeklyHappinessReport() {
  const { state, streak } = useDailyActivity();
  const { status } = useSession();
  const [cloudSummary, setCloudSummary] = useState<string | null>(null);
  const weekStart = useMemo(startOfWeekKey, []);
  const weeklyDates = state.completedDates.filter((date) => date >= weekStart);
  const journalCount = Object.keys(state.journalByDate).filter(
    (date) => date >= weekStart,
  ).length;
  const favoriteMission = useMemo(() => {
    const counts = weeklyDates.reduce<Record<string, number>>(
      (result, date) => {
        const missionId = state.missionByDate[date];
        if (missionId) result[missionId] = (result[missionId] ?? 0) + 1;
        return result;
      },
      {},
    );
    const missionId = Object.entries(counts).sort(
      (a, b) => b[1] - a[1],
    )[0]?.[0];
    return MISSIONS.find((mission) => mission.id === missionId);
  }, [state.missionByDate, weeklyDates]);
  const message =
    weeklyDates.length > 0
      ? `이번 주 ${weeklyDates.length}번의 다정한 실천을 이어갔어요. 누군가의 미소를 위해 마음을 낸 당신 덕분에 평범한 하루가 조금 더 따뜻해졌습니다.`
      : "이번 주의 첫 미소는 아직 기다리고 있어요. 거창하지 않아도 괜찮아요. 오늘 건네는 짧은 안부 한마디부터 시작해보세요.";

  useEffect(() => {
    if (status !== "authenticated") return;
    const controller = new AbortController();
    void fetch("/api/reports/weekly", {
      cache: "no-store",
      signal: controller.signal,
    })
      .then(async (response) =>
        response.ok
          ? (response.json() as Promise<{ report?: { summary?: string } }>)
          : null,
      )
      .then((data) => {
        if (data?.report?.summary) setCloudSummary(data.report.summary);
      })
      .catch(() => undefined);
    return () => controller.abort();
  }, [status]);

  return (
    <section className="to-primary shadow-warm rounded-[2rem] bg-gradient-to-br from-[#fff1b8] p-6 text-[#333]">
      <p className="flex items-center gap-1.5 text-xs font-black text-[#8f6a00]">
        <HeartHandshake className="h-4 w-4" /> WEEKLY HAPPINESS
      </p>
      <h1 className="mt-2 text-2xl font-black">이번 주 행복 리포트</h1>
      <div className="mt-5 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-2xl bg-white/55 p-3">
          <strong className="text-xl">{weeklyDates.length}</strong>
          <p className="mt-1 text-[9px] font-bold">실천</p>
        </div>
        <div className="rounded-2xl bg-white/55 p-3">
          <strong className="text-xl">{streak}</strong>
          <p className="mt-1 text-[9px] font-bold">연속 일</p>
        </div>
        <div className="rounded-2xl bg-white/55 p-3">
          <strong className="text-xl">{journalCount}</strong>
          <p className="mt-1 text-[9px] font-bold">마음 기록</p>
        </div>
      </div>
      <p className="mt-5 text-sm leading-7 font-bold">
        {cloudSummary ?? message}
      </p>
      <div className="mt-4 rounded-2xl bg-white/55 px-4 py-3 text-xs leading-5 font-bold">
        ❤️ 가장 많이 선택한 미션 ·{" "}
        {favoriteMission?.message ?? "아직 선택한 미션이 없어요"}
      </div>
      <div className="mt-5">
        <ShareAchievementCard people={weeklyDates.length} streak={streak} />
      </div>
    </section>
  );
}
