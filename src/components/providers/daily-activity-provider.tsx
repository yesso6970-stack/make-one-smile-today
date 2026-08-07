"use client";

import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { ACHIEVEMENT_BADGES } from "@/constants/badges";
import { MISSIONS } from "@/constants/missions";
import { DAILY_MISSION_POINTS, STREAK_BONUSES } from "@/constants/points";
import {
  calculateStreak,
  createInitialDailyActivityState,
  getDefaultMission,
} from "@/lib/daily-activity";
import { getLocalDateKey } from "@/lib/date";
import {
  DAILY_ACTIVITY_STORAGE_KEY,
  dailyActivityStorage,
} from "@/services/daily-storage";
import type {
  DailyActivityState,
  DailyMission,
  MissionCompletionResult,
} from "@/types/daily-activity";

export interface DailyActivityContextValue {
  state: DailyActivityState;
  todayKey: string;
  todayMission: DailyMission;
  todayJournal: string;
  isTodayCompleted: boolean;
  streak: number;
  hydrated: boolean;
  completeMission: () => MissionCompletionResult | null;
  rerollMission: () => DailyMission | null;
  saveJournal: (content: string) => void;
}

export const DailyActivityContext =
  createContext<DailyActivityContextValue | null>(null);

function randomIndex(max: number): number {
  if (max <= 1) return 0;
  try {
    const buffer = new Uint32Array(1);
    window.crypto.getRandomValues(buffer);
    return buffer[0] % max;
  } catch {
    return Math.floor(Math.random() * max);
  }
}

function persist(nextState: DailyActivityState): DailyActivityState {
  dailyActivityStorage.write(nextState);
  return nextState;
}

export function DailyActivityProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [state, setState] = useState<DailyActivityState>(
    createInitialDailyActivityState,
  );
  const [hydrated, setHydrated] = useState(false);
  const todayKey = getLocalDateKey();

  useEffect(() => {
    const stored = dailyActivityStorage.read();
    const storedMission = MISSIONS.some(
      (mission) => mission.id === stored.missionByDate[todayKey],
    );
    const initialized = storedMission
      ? stored
      : {
          ...stored,
          missionByDate: {
            ...stored.missionByDate,
            [todayKey]: getDefaultMission(todayKey).id,
          },
        };

    setState(persist(initialized));
    setHydrated(true);

    const syncAcrossTabs = (event: StorageEvent) => {
      if (event.key !== DAILY_ACTIVITY_STORAGE_KEY || event.newValue === null) {
        return;
      }
      const synced = dailyActivityStorage.parse(event.newValue);
      if (synced) setState(synced);
    };

    window.addEventListener("storage", syncAcrossTabs);
    return () => window.removeEventListener("storage", syncAcrossTabs);
  }, [todayKey]);

  const todayMission = useMemo(() => {
    const missionId = state.missionByDate[todayKey];
    return (
      MISSIONS.find((mission) => mission.id === missionId) ??
      getDefaultMission(todayKey)
    );
  }, [state.missionByDate, todayKey]);

  const isTodayCompleted = state.completedDates.includes(todayKey);
  const completionLockRef = useRef(isTodayCompleted);
  const streak = calculateStreak(state.completedDates, todayKey);
  const todayJournal = state.journalByDate[todayKey] ?? "";

  useEffect(() => {
    completionLockRef.current = isTodayCompleted;
  }, [isTodayCompleted, todayKey]);

  const rerollMission = useCallback(() => {
    if (isTodayCompleted) return null;
    const candidates = MISSIONS.filter(
      (mission) => mission.id !== todayMission.id,
    );
    const nextMission = candidates[randomIndex(candidates.length)];

    setState((current) =>
      persist({
        ...current,
        missionByDate: {
          ...current.missionByDate,
          [todayKey]: nextMission.id,
        },
      }),
    );
    return nextMission;
  }, [isTodayCompleted, todayKey, todayMission.id]);

  const completeMission = useCallback(() => {
    if (isTodayCompleted || completionLockRef.current) return null;
    completionLockRef.current = true;

    const completedDates = [...state.completedDates, todayKey].sort();
    const nextStreak = calculateStreak(completedDates, todayKey);
    const awardedMilestones = [...state.awardedMilestones];
    let awardedPoints = DAILY_MISSION_POINTS;

    for (const [daysText, bonus] of Object.entries(STREAK_BONUSES)) {
      const milestoneId = `streak-${daysText}`;
      if (
        nextStreak === Number(daysText) &&
        !awardedMilestones.includes(milestoneId)
      ) {
        awardedMilestones.push(milestoneId);
        awardedPoints += bonus;
      }
    }

    const beforeCount = state.completedDates.length;
    const afterCount = completedDates.length;
    const newBadgeIds = ACHIEVEMENT_BADGES.filter(
      (badge) =>
        beforeCount < badge.requiredDays && afterCount >= badge.requiredDays,
    ).map((badge) => badge.id);

    setState(
      persist({
        ...state,
        completedDates,
        awardedMilestones,
        points: state.points + awardedPoints,
      }),
    );

    return { awardedPoints, newBadgeIds, streak: nextStreak };
  }, [isTodayCompleted, state, todayKey]);

  const saveJournal = useCallback(
    (content: string) => {
      const normalized = content.trim().slice(0, 200);
      setState((current) =>
        persist({
          ...current,
          journalByDate: {
            ...current.journalByDate,
            [todayKey]: normalized,
          },
        }),
      );
    },
    [todayKey],
  );

  const value = useMemo<DailyActivityContextValue>(
    () => ({
      state,
      todayKey,
      todayMission,
      todayJournal,
      isTodayCompleted,
      streak,
      hydrated,
      completeMission,
      rerollMission,
      saveJournal,
    }),
    [
      state,
      todayKey,
      todayMission,
      todayJournal,
      isTodayCompleted,
      streak,
      hydrated,
      completeMission,
      rerollMission,
      saveJournal,
    ],
  );

  return (
    <DailyActivityContext.Provider value={value}>
      {children}
    </DailyActivityContext.Provider>
  );
}
