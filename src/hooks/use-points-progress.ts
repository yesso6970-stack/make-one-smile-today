"use client";

import { ACHIEVEMENT_BADGES } from "@/constants/badges";
import { useDailyActivity } from "@/hooks/use-daily-activity";

export function usePointsProgress() {
  const { state, streak } = useDailyActivity();
  const completedDays = state.completedDates.length;
  const unlockedBadgeIds = ACHIEVEMENT_BADGES.filter(
    (badge) => completedDays >= badge.requiredDays,
  ).map((badge) => badge.id);
  const nextBadge = ACHIEVEMENT_BADGES.find(
    (badge) => completedDays < badge.requiredDays,
  );
  const previousRequirement =
    [...ACHIEVEMENT_BADGES]
      .reverse()
      .find((badge) => completedDays >= badge.requiredDays)?.requiredDays ?? 0;
  const progress = nextBadge
    ? Math.min(
        100,
        ((completedDays - previousRequirement) /
          (nextBadge.requiredDays - previousRequirement)) *
          100,
      )
    : 100;

  return {
    points: state.points,
    streak,
    completedDays,
    unlockedBadgeIds,
    nextBadge,
    progress,
  };
}
