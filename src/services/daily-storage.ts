import { createInitialDailyActivityState } from "@/lib/daily-activity";
import type { DailyActivityState } from "@/types/daily-activity";

export const DAILY_ACTIVITY_STORAGE_KEY = "make-one-smile:daily-activity:v1";

function isStringRecord(value: unknown): value is Record<string, string> {
  return (
    typeof value === "object" &&
    value !== null &&
    Object.values(value).every((item) => typeof item === "string")
  );
}

function isDailyActivityState(value: unknown): value is DailyActivityState {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;

  return (
    candidate.version === 1 &&
    isStringRecord(candidate.missionByDate) &&
    Array.isArray(candidate.completedDates) &&
    candidate.completedDates.every((date) => typeof date === "string") &&
    isStringRecord(candidate.journalByDate) &&
    typeof candidate.points === "number" &&
    Number.isFinite(candidate.points) &&
    candidate.points >= 0 &&
    Array.isArray(candidate.awardedMilestones) &&
    candidate.awardedMilestones.every((id) => typeof id === "string")
  );
}

/** Local dummy database adapter. Replace this module with a Neon-backed adapter after authentication. */
export const dailyActivityStorage = {
  read(): DailyActivityState {
    try {
      const raw = window.localStorage.getItem(DAILY_ACTIVITY_STORAGE_KEY);
      if (!raw) return createInitialDailyActivityState();
      const parsed: unknown = JSON.parse(raw);
      return isDailyActivityState(parsed)
        ? parsed
        : createInitialDailyActivityState();
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
      return isDailyActivityState(parsed) ? parsed : null;
    } catch {
      return null;
    }
  },
};
