import type { PointRule } from "@/types/daily-activity";

export const POINT_RULES: readonly PointRule[] = [
  {
    id: "daily",
    label: "오늘의 미션",
    points: 10,
    description: "하루 한 번 완료",
  },
  {
    id: "streak-7",
    label: "7일 연속",
    points: 100,
    description: "일주일의 따뜻한 습관",
  },
  {
    id: "streak-30",
    label: "30일 연속",
    points: 500,
    description: "한 달의 꾸준한 미소",
  },
] as const;

export const DAILY_MISSION_POINTS = 10;
export const STREAK_BONUSES = { 7: 100, 30: 500 } as const;
