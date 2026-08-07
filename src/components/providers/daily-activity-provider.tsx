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
import { fetchPraiseJournal, upsertPraiseJournal } from "@/services/journal";
import type {
  DailyActivityState,
  DailyMission,
  JournalSyncStatus,
  MissionCompletionResult,
  PraiseJournalEntry,
} from "@/types/daily-activity";

export interface DailyActivityContextValue {
  state: DailyActivityState;
  todayKey: string;
  todayMission: DailyMission;
  todayJournal: string;
  isTodayCompleted: boolean;
  streak: number;
  hydrated: boolean;
  journalSyncStatus: JournalSyncStatus;
  completeMission: () => MissionCompletionResult | null;
  rerollMission: () => DailyMission | null;
  saveJournal: (content: string) => Promise<boolean>;
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

function entriesToRecord(
  entries: readonly PraiseJournalEntry[],
): Record<string, string> {
  return Object.fromEntries(
    entries.map((entry) => [entry.date, entry.content]),
  );
}

export function DailyActivityProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [state, setState] = useState<DailyActivityState>(
    createInitialDailyActivityState,
  );
  const [hydrated, setHydrated] = useState(false);
  const [journalSyncStatus, setJournalSyncStatus] =
    useState<JournalSyncStatus>("idle");
  const todayKey = getLocalDateKey();

  useEffect(() => {
    const stored = dailyActivityStorage.read();
    const smileStats = dailyActivityStorage.readSmileStatsBridge();
    const storedMission = MISSIONS.some(
      (mission) => mission.id === stored.missionByDate[todayKey],
    );
    const missionReady = storedMission
      ? stored
      : {
          ...stored,
          missionByDate: {
            ...stored.missionByDate,
            [todayKey]: getDefaultMission(todayKey).id,
          },
        };
    const bridgedDates = new Set(missionReady.completedDates);
    if (smileStats?.lastSuccessDate)
      bridgedDates.add(smileStats.lastSuccessDate);
    const bridgeStreakIsCurrent = smileStats?.lastSuccessDate
      ? calculateStreak([smileStats.lastSuccessDate], todayKey) > 0
      : false;
    const initialized: DailyActivityState = {
      ...missionReady,
      completedDates: [...bridgedDates].sort(),
      completedCountBaseline: Math.max(
        missionReady.completedCountBaseline,
        smileStats?.mySmiles ?? 0,
      ),
      streakBaseline: Math.max(
        missionReady.streakBaseline,
        bridgeStreakIsCurrent ? (smileStats?.streak ?? 0) : 0,
      ),
      points: Math.max(
        missionReady.points,
        (smileStats?.mySmiles ?? 0) * DAILY_MISSION_POINTS,
      ),
    };

    setState(persist(initialized));
    setHydrated(true);
    const controller = new AbortController();

    const syncRemoteJournal = async () => {
      try {
        const entries = await fetchPraiseJournal(controller.signal);
        const remoteJournal = entriesToRecord(entries);
        setState((current) =>
          persist({
            ...current,
            journalByDate: { ...current.journalByDate, ...remoteJournal },
          }),
        );

        const missingRemoteEntries = Object.entries(
          initialized.journalByDate,
        ).filter(([date]) => remoteJournal[date] === undefined);
        await Promise.allSettled(
          missingRemoteEntries.map(([date, content]) =>
            upsertPraiseJournal(date, content),
          ),
        );
        setJournalSyncStatus("saved");
      } catch (error) {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setJournalSyncStatus("offline");
        }
      }
    };

    void syncRemoteJournal();

    const syncAcrossTabs = (event: StorageEvent) => {
      if (event.key !== DAILY_ACTIVITY_STORAGE_KEY || event.newValue === null) {
        return;
      }
      const synced = dailyActivityStorage.parse(event.newValue);
      if (synced) setState(synced);
    };

    window.addEventListener("storage", syncAcrossTabs);
    const syncWhenVisible = () => {
      if (document.visibilityState === "visible") void syncRemoteJournal();
    };
    document.addEventListener("visibilitychange", syncWhenVisible);
    const syncWhenOnline = () => void syncRemoteJournal();
    window.addEventListener("online", syncWhenOnline);
    return () => {
      controller.abort();
      window.removeEventListener("storage", syncAcrossTabs);
      document.removeEventListener("visibilitychange", syncWhenVisible);
      window.removeEventListener("online", syncWhenOnline);
    };
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
  const streak = Math.max(
    calculateStreak(state.completedDates, todayKey),
    state.streakBaseline,
  );
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

    const beforeCount = Math.max(
      state.completedDates.length,
      state.completedCountBaseline,
    );
    const afterCount = Math.max(completedDates.length, beforeCount + 1);
    const newBadgeIds = ACHIEVEMENT_BADGES.filter(
      (badge) =>
        beforeCount < badge.requiredDays && afterCount >= badge.requiredDays,
    ).map((badge) => badge.id);

    setState(
      persist({
        ...state,
        completedDates,
        completedCountBaseline: afterCount,
        awardedMilestones,
        points: state.points + awardedPoints,
      }),
    );

    return { awardedPoints, newBadgeIds, streak: nextStreak };
  }, [isTodayCompleted, state, todayKey]);

  const saveJournal = useCallback(
    async (content: string) => {
      const normalized = content.trim().slice(0, 200);
      if (!normalized) return false;
      setJournalSyncStatus("saving");
      setState((current) =>
        persist({
          ...current,
          journalByDate: {
            ...current.journalByDate,
            [todayKey]: normalized,
          },
        }),
      );

      try {
        await upsertPraiseJournal(todayKey, normalized);
        setJournalSyncStatus("saved");
        return true;
      } catch {
        setJournalSyncStatus("offline");
        return false;
      }
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
      journalSyncStatus,
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
      journalSyncStatus,
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
