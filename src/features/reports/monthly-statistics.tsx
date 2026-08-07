"use client";

import { BarChart3, Flame, Medal, Smile } from "lucide-react";
import { useMemo } from "react";

import { useDailyActivity } from "@/hooks/use-daily-activity";
import { getLocalDateKey } from "@/lib/date";

function monthDays(): string[] {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const count = new Date(year, month + 1, 0).getDate();
  return Array.from(
    { length: count },
    (_, index) =>
      `${year}-${String(month + 1).padStart(2, "0")}-${String(index + 1).padStart(2, "0")}`,
  );
}

export function MonthlyStatistics() {
  const { state, streak } = useDailyActivity();
  const days = useMemo(monthDays, []);
  const completed = days.filter((date) => state.completedDates.includes(date));
  const weekly = [0, 1, 2, 3, 4].map(
    (week) =>
      completed.filter(
        (date) => Math.floor((Number(date.slice(-2)) - 1) / 7) === week,
      ).length,
  );
  const max = Math.max(1, ...weekly);

  return (
    <section
      className="bg-surface shadow-warm rounded-[2rem] border p-5"
      aria-labelledby="monthly-statistics-title"
    >
      <p className="text-muted text-xs font-bold">
        {getLocalDateKey().slice(0, 7)} 월간 리포트
      </p>
      <h2
        id="monthly-statistics-title"
        className="mt-1 flex items-center gap-2 text-xl font-black"
      >
        <BarChart3 className="text-accent h-5 w-5" /> 이번 달의 따뜻함
      </h2>
      <div className="mt-5 grid grid-cols-2 gap-2">
        {[
          {
            label: "웃게 한 사람",
            value: completed.length,
            suffix: "명",
            icon: Smile,
          },
          { label: "연속 기록", value: streak, suffix: "일", icon: Flame },
          { label: "포인트", value: state.points, suffix: "P", icon: Medal },
          {
            label: "배지",
            value: state.awardedMilestones.length,
            suffix: "개",
            icon: Medal,
          },
        ].map(({ label, value, suffix, icon: Icon }) => (
          <div key={label} className="bg-surface-soft rounded-2xl p-4">
            <Icon className="text-accent h-4 w-4" />
            <p className="text-muted mt-2 text-[10px] font-bold">{label}</p>
            <p className="mt-1 text-xl font-black tabular-nums">
              {value}
              {suffix}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-6" aria-label={`주간 완료 횟수 ${weekly.join(", ")}`}>
        <p className="text-xs font-black">주차별 실천</p>
        <div className="mt-3 flex h-28 items-end justify-around gap-3 border-b pb-1">
          {weekly.map((value, index) => (
            <div
              key={index}
              className="flex h-full flex-1 flex-col items-center justify-end gap-2"
            >
              <div
                className="from-primary to-accent w-full max-w-10 rounded-t-xl bg-gradient-to-t"
                style={{ height: `${Math.max(8, (value / max) * 88)}%` }}
              />
              <span className="text-muted text-[9px] font-bold">
                {index + 1}주
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-6">
        <p className="text-xs font-black">Calendar Heatmap</p>
        <div className="mt-3 grid grid-cols-7 gap-1.5">
          {days.map((date) => {
            const active = state.completedDates.includes(date);
            return (
              <span
                key={date}
                title={date}
                aria-label={`${date} ${active ? "완료" : "미완료"}`}
                className={`aspect-square rounded-md ${active ? "bg-success" : "bg-border/55"}`}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
