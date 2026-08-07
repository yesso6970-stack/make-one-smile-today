"use client";

import { useCallback, useEffect, useState } from "react";

import { PRAISE_STICKERS } from "@/constants/praise-stickers";
import { getOrCreateDeviceId } from "@/lib/device-id";
import { getLocalDateKey, getYesterdayDateKey } from "@/lib/date";

const STORAGE_KEY = "make-one-smile:stats:v2";
const LEGACY_STORAGE_KEY = "make-one-smile:stats:v1";
const LEGACY_COMMUNITY_SEED = 153_294;
const LEGACY_PERSONAL_SEED = 27;
const LEGACY_STREAK_SEED = 8;
const COMMUNITY_REFRESH_INTERVAL = 15_000;

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
    communitySmiles: 0,
    mySmiles: 0,
    streak: 0,
    lastSuccessDate: "",
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
    if (saved) {
      const parsed: unknown = JSON.parse(saved);
      return migrateStats(parsed);
    }

    const legacy = window.localStorage.getItem(LEGACY_STORAGE_KEY);
    if (!legacy) return null;

    const legacyStats = migrateStats(JSON.parse(legacy) as unknown);
    if (!legacyStats) return null;

    const migratedStats: SmileStats = {
      ...legacyStats,
      communitySmiles: Math.max(
        0,
        legacyStats.communitySmiles - LEGACY_COMMUNITY_SEED,
      ),
      mySmiles: Math.max(0, legacyStats.mySmiles - LEGACY_PERSONAL_SEED),
      streak:
        legacyStats.streak >= LEGACY_STREAK_SEED
          ? legacyStats.streak - LEGACY_STREAK_SEED
          : legacyStats.streak,
    };

    saveStats(migratedStats);
    return migratedStats;
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

function isCommunityResponse(value: unknown): value is { total: number } {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as Record<string, unknown>).total === "number"
  );
}

export function useSmileStats() {
  const [stats, setStats] = useState<SmileStats>(createInitialStats);

  const updateCommunityTotal = useCallback((total: number) => {
    setStats((current) => {
      if (current.communitySmiles === total) return current;
      const nextStats = { ...current, communitySmiles: total };
      saveStats(nextStats);
      return nextStats;
    });
  }, []);

  const refreshCommunityTotal = useCallback(
    async (signal?: AbortSignal) => {
      try {
        const response = await fetch("/api/smiles", {
          cache: "no-store",
          signal,
        });
        if (!response.ok) return;

        const data: unknown = await response.json();
        if (isCommunityResponse(data)) updateCommunityTotal(data.total);
      } catch {
        // 오프라인일 때는 마지막으로 동기화한 숫자를 유지합니다.
      }
    },
    [updateCommunityTotal],
  );

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
    const controller = new AbortController();
    void refreshCommunityTotal(controller.signal);

    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") void refreshCommunityTotal();
    }, COMMUNITY_REFRESH_INTERVAL);
    const refreshWhenVisible = () => {
      if (document.visibilityState === "visible") void refreshCommunityTotal();
    };
    document.addEventListener("visibilitychange", refreshWhenVisible);

    return () => {
      controller.abort();
      window.clearInterval(interval);
      window.removeEventListener("storage", syncStoredStats);
      document.removeEventListener("visibilitychange", refreshWhenVisible);
    };
  }, [refreshCommunityTotal]);

  const registerCommunitySmile = useCallback(async () => {
    try {
      const response = await fetch("/api/smiles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ deviceId: getOrCreateDeviceId() }),
      });
      if (!response.ok) return;

      const data: unknown = await response.json();
      if (isCommunityResponse(data)) updateCommunityTotal(data.total);
    } catch {
      // 네트워크 복구 후 다음 조회에서 공용 합계를 다시 동기화합니다.
    }
  }, [updateCommunityTotal]);

  const registerSmile = useCallback(() => {
    setStats((current) => {
      const today = getLocalDateKey();
      const yesterday = getYesterdayDateKey();
      const alreadySucceededToday = current.lastSuccessDate === today;
      if (alreadySucceededToday) return current;

      const continuedFromYesterday = current.lastSuccessDate === yesterday;
      const nextSticker =
        PRAISE_STICKERS[current.mySmiles % PRAISE_STICKERS.length];
      const earnedStickerIds = current.earnedStickerIds.includes(nextSticker.id)
        ? current.earnedStickerIds
        : [...current.earnedStickerIds, nextSticker.id];

      const nextStats: SmileStats = {
        communitySmiles: current.communitySmiles,
        mySmiles: current.mySmiles + 1,
        streak: continuedFromYesterday ? current.streak + 1 : 1,
        lastSuccessDate: today,
        earnedStickerIds,
        lastStickerId: nextSticker.id,
      };

      saveStats(nextStats);
      return nextStats;
    });

    void registerCommunitySmile();
  }, [registerCommunitySmile]);

  return { stats, registerSmile };
}
