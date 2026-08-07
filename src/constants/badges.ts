import type { AchievementBadge } from "@/types/daily-activity";

export const ACHIEVEMENT_BADGES: readonly AchievementBadge[] = [
  {
    id: "first-smile",
    title: "첫 미소",
    description: "첫 미션 완료",
    emoji: "🌱",
    requiredDays: 1,
    tone: "green",
  },
  {
    id: "warm-week",
    title: "따뜻한 일주일",
    description: "7일의 미소 기록",
    emoji: "🌈",
    requiredDays: 7,
    tone: "warm",
  },
  {
    id: "smile-month",
    title: "미소 메이커",
    description: "30일의 미소 기록",
    emoji: "🏅",
    requiredDays: 30,
    tone: "purple",
  },
  {
    id: "gold-100",
    title: "Gold Smile",
    description: "100일의 따뜻한 습관",
    emoji: "🏆",
    requiredDays: 100,
    tone: "gold",
  },
] as const;
