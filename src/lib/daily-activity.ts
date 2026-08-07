import { MISSIONS } from "@/constants/missions";
import { getDailyCardIndex, getLocalDateKey } from "@/lib/date";
import type { DailyActivityState, DailyMission } from "@/types/daily-activity";

export interface CalendarDay {
  dateKey: string;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isCompleted: boolean;
}

export function createInitialDailyActivityState(): DailyActivityState {
  return {
    version: 1,
    missionByDate: {},
    completedDates: [],
    journalByDate: {},
    points: 0,
    awardedMilestones: [],
  };
}

export function getDefaultMission(dateKey: string): DailyMission {
  return MISSIONS[getDailyCardIndex(`mission:${dateKey}`, MISSIONS.length)];
}

function parseDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

function addDays(dateKey: string, amount: number): string {
  const date = parseDateKey(dateKey);
  date.setUTCDate(date.getUTCDate() + amount);
  return date.toISOString().slice(0, 10);
}

export function calculateStreak(
  completedDates: readonly string[],
  todayKey = getLocalDateKey(),
): number {
  const completed = new Set(completedDates);
  let cursor = completed.has(todayKey) ? todayKey : addDays(todayKey, -1);
  let streak = 0;

  while (completed.has(cursor)) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  return streak;
}

export function getMonthKey(date = new Date()): string {
  return getLocalDateKey(date).slice(0, 7);
}

export function shiftMonth(monthKey: string, amount: number): string {
  const [year, month] = monthKey.split("-").map(Number);
  const shifted = new Date(Date.UTC(year, month - 1 + amount, 1));
  return `${shifted.getUTCFullYear()}-${String(shifted.getUTCMonth() + 1).padStart(2, "0")}`;
}

export function formatMonthTitle(monthKey: string): string {
  const [year, month] = monthKey.split("-").map(Number);
  return `${year}년 ${month}월`;
}

export function getCalendarDays(
  monthKey: string,
  completedDates: readonly string[],
  todayKey = getLocalDateKey(),
): CalendarDay[] {
  const [year, month] = monthKey.split("-").map(Number);
  const firstWeekday = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const gridStart = new Date(Date.UTC(year, month - 1, 1 - firstWeekday));
  const completed = new Set(completedDates);

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(gridStart);
    date.setUTCDate(gridStart.getUTCDate() + index);
    const dateKey = date.toISOString().slice(0, 10);

    return {
      dateKey,
      day: date.getUTCDate(),
      isCurrentMonth: date.getUTCMonth() === month - 1,
      isToday: dateKey === todayKey,
      isCompleted: completed.has(dateKey),
    };
  });
}
