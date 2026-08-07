"use client";

import { useDailyActivity } from "@/hooks/use-daily-activity";

export function useDailyMission() {
  const {
    todayMission,
    isTodayCompleted,
    completeMission,
    rerollMission,
    hydrated,
  } = useDailyActivity();

  return {
    mission: todayMission,
    completed: isTodayCompleted,
    completeMission,
    rerollMission,
    hydrated,
  };
}
