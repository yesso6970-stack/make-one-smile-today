"use client";

import { useMemo, useState } from "react";

import { useDailyActivity } from "@/hooks/use-daily-activity";
import {
  formatMonthTitle,
  getCalendarDays,
  getMonthKey,
  shiftMonth,
} from "@/lib/daily-activity";

export function useActivityCalendar() {
  const { state, todayKey } = useDailyActivity();
  const [monthKey, setMonthKey] = useState(getMonthKey);
  const days = useMemo(
    () => getCalendarDays(monthKey, state.completedDates, todayKey),
    [monthKey, state.completedDates, todayKey],
  );

  return {
    monthKey,
    monthTitle: formatMonthTitle(monthKey),
    days,
    goPreviousMonth: () => setMonthKey((current) => shiftMonth(current, -1)),
    goNextMonth: () => setMonthKey((current) => shiftMonth(current, 1)),
    goToday: () => setMonthKey(getMonthKey()),
    isCurrentMonth: monthKey === getMonthKey(),
  };
}
