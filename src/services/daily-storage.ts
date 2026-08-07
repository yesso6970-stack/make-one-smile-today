import { createInitialDailyActivityState } from "@/lib/daily-activity";
import type { DailyActivityState } from "@/types/daily-activity";

export const DAILY_ACTIVITY_STORAGE_KEY = "make-one-smile:daily-activity:v1";
const SMILE_STATS_STORAGE_KEY = "make-one-smile:stats:v2";

export interface SmileStatsBridge {
  mySmiles: number;
  streak: number;
  lastSuccessDate: string;
}

function isStringRecord(value: unknown): value is Record<string, string> {
  return (
    typeof value === "object" &&
    value !== null &&
    Object.values(value).every((item) => typeof item === "string")
  );
}

function parseDailyActivityState(value: unknown): DailyActivityState | null {
  if (typeof value !== "object" || value === null) return null;
  const candidate = value as Record<string, unknown>;

  const hasBaseState =
    (candidate.version === 1 || candidate.version === 2) &&
    isStringRecord(candidate.missionByDate) &&
    Array.isArray(candidate.completedDates) &&
    candidate.completedDates.every((date) => typeof date === "string") &&
    isStringRecord(candidate.journalByDate) &&
    typeof candidate.points === "number" &&
    Number.isFinite(candidate.points) &&
    candidate.points >= 0 &&
    Array.isArray(candidate.awardedMilestones) &&
    candidate.awardedMilestones.every((id) => typeof id === "string");

  if (!hasBaseState) return null;

  return {
    version: 2,
    missionByDate: candidate.missionByDate as Record<string, string>,
    completedDates: candidate.completedDates as string[],
    journalByDate: candidate.journalByDate as Record<string, string>,
    points: candidate.points as number,
    awardedMilestones: candidate.awardedMilestones as string[],
    completedCountBaseline:
      candidate.version === 2 &&
      typeof candidate.completedCountBaseline === "number"
        ? Math.max(0, candidate.completedCountBaseline)
        : 0,
    streakBaseline:
      candidate.version === 2 && typeof candidate.streakBaseline === "number"
        ? Math.max(0, candidate.streakBaseline)
        : 0,
  };
}

/** Local dummy database adapter. Replace this module with a Neon-backed adapter after authentication. */
export const dailyActivityStorage = {
  read(): DailyActivityState {
    try {
      const raw = window.localStorage.getItem(DAILY_ACTIVITY_STORAGE_KEY);
      if (!raw) return createInitialDailyActivityState();
      const parsed: unknown = JSON.parse(raw);
      return (
        parseDailyActivityState(parsed) ?? createInitialDailyActivityState()
      );
    } catch {
      return createInitialDailyActivityState();
    }
  },

  write(state: DailyActivityState): void {
    try {
      window.localStorage.setItem(
        DAILY_ACTIVITY_STORAGE_KEY,
        JSON.stringify(state),
      );
    } catch {
      // Private browsing or full storage must not block the daily experience.
    }
  },

  parse(raw: string): DailyActivityState | null {
    try {
      const parsed: unknown = JSON.parse(raw);
      return parseDailyActivityState(parsed);
    } catch {
      return null;
    }
  },

  readSmileStatsBridge(): SmileStatsBridge | null {
    try {
      const raw = window.localStorage.getItem(SMILE_STATS_STORAGE_KEY);
      if (!raw) return null;
      const value: unknown = JSON.parse(raw);
      if (typeof value !== "object" || value === null) return null;
      const candidate = value as Record<string, unknown>;
      if (
        typeof candidate.mySmiles !== "number" ||
        typeof candidate.streak !== "number" ||
        typeof candidate.lastSuccessDate !== "string"
      ) {
        return null;
      }
      return {
        mySmiles: Math.max(0, candidate.mySmiles),
        streak: Math.max(0, candidate.streak),
        lastSuccessDate: candidate.lastSuccessDate,
      };
    } catch {
      return null;
    }
  },
};
