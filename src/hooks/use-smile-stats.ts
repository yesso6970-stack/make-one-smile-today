"use client";

import { useCallback, useEffect, useState } from "react";

import { PRAISE_STICKERS } from "@/constants/praise-stickers";
import { getLocalDateKey, getYesterdayDateKey } from "@/lib/date";

const STORAGE_KEY = "make-one-smile:stats:v1";

export interface SmileStats {
  communitySmiles: number;
  mySmiles: number;
  streak: number;
  lastSuccessDate: string;
  earnedStickerIds: string[];
  lastStickerId: string | null;
}

function createInitialStats(): SmileStats {
  return {
    communitySmiles: 153_294,
    mySmiles: 27,
    streak: 8,
    lastSuccessDate: getYesterdayDateKey(),
    earnedStickerIds: [],
    lastStickerId: null,
  };
}

function isSmileStats(value: unknown): value is SmileStats {
  if (typeof value !== "object" || value === null) return false;

  const candidate = value as Record<string, unknown>;
  const hasBaseStats =
    typeof candidate.communitySmiles === "number" &&
    typeof candidate.mySmiles === "number" &&
    typeof candidate.streak === "number" &&
    typeof candidate.lastSuccessDate === "string";

  if (!hasBaseStats) return false;

  return (
    Array.isArray(candidate.earnedStickerIds) &&
    candidate.earnedStickerIds.every((id) => typeof id === "string") &&
    (typeof candidate.lastStickerId === "string" ||
      candidate.lastStickerId === null)
  );
}

function migrateStats(value: unknown): SmileStats | null {
  if (isSmileStats(value)) return value;
  if (typeof value !== "object" || value === null) return null;

  const candidate = value as Record<string, unknown>;
  if (
    typeof candidate.communitySmiles !== "number" ||
    typeof candidate.mySmiles !== "number" ||
    typeof candidate.streak !== "number" ||
    typeof candidate.lastSuccessDate !== "string"
  ) {
    return null;
  }

  return {
    communitySmiles: candidate.communitySmiles,
    mySmiles: candidate.mySmiles,
    streak: candidate.streak,
    lastSuccessDate: candidate.lastSuccessDate,
    earnedStickerIds: [],
    lastStickerId: null,
  };
}

function readStats() {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;

    const parsed: unknown = JSON.parse(saved);
    return migrateStats(parsed);
  } catch {
    return null;
  }
}

function saveStats(stats: SmileStats) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  } catch {
    // 저장 공간이 차단된 환경에서도 현재 세션의 카운트는 정상 동작합니다.
  }
}

export function useSmileStats() {
  const [stats, setStats] = useState<SmileStats>(createInitialStats);

  useEffect(() => {
    const savedStats = readStats();
    if (savedStats) {
      setStats(savedStats);
    } else {
      saveStats(createInitialStats());
    }

    const syncStoredStats = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY || event.newValue === null) return;

      try {
        const syncedStats = migrateStats(JSON.parse(event.newValue) as unknown);
        if (syncedStats) setStats(syncedStats);
      } catch {
        // 다른 탭의 손상된 값은 무시하고 현재의 정상 기록을 유지합니다.
      }
    };

    window.addEventListener("storage", syncStoredStats);
    return () => window.removeEventListener("storage", syncStoredStats);
  }, []);

  const registerSmile = useCallback(() => {
    setStats((current) => {
      const today = getLocalDateKey();
      const yesterday = getYesterdayDateKey();
      const alreadySucceededToday = current.lastSuccessDate === today;
      const continuedFromYesterday = current.lastSuccessDate === yesterday;
      const nextSticker =
        PRAISE_STICKERS[current.mySmiles % PRAISE_STICKERS.length];
      const earnedStickerIds = current.earnedStickerIds.includes(nextSticker.id)
        ? current.earnedStickerIds
        : [...current.earnedStickerIds, nextSticker.id];

      const nextStats: SmileStats = {
        communitySmiles: current.communitySmiles + 1,
        mySmiles: current.mySmiles + 1,
        streak: alreadySucceededToday
          ? current.streak
          : continuedFromYesterday
            ? current.streak + 1
            : 1,
        lastSuccessDate: today,
        earnedStickerIds,
        lastStickerId: nextSticker.id,
      };

      saveStats(nextStats);
      return nextStats;
    });
  }, []);

  return { stats, registerSmile };
}
