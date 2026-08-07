"use client";

import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";

import {
  DAILY_ACTIVITY_CHANGED_EVENT,
  DAILY_ACTIVITY_STORAGE_KEY,
  SMILE_STATS_STORAGE_KEY,
  dailyActivityStorage,
} from "@/services/daily-storage";
import type { CloudSyncResponse } from "@/types/cloud-sync";

function isCloudSyncResponse(value: unknown): value is CloudSyncResponse {
  return (
    typeof value === "object" &&
    value !== null &&
    typeof (value as Record<string, unknown>).syncedAt === "string" &&
    typeof (value as Record<string, unknown>).activity === "object"
  );
}

export function CloudSyncProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const { status } = useSession();
  const syncingRef = useRef(false);
  const firstSyncRef = useRef(false);

  const sync = useCallback(
    async (announce = false) => {
      if (status !== "authenticated" || syncingRef.current || !navigator.onLine)
        return;
      syncingRef.current = true;
      try {
        const rawStats = window.localStorage.getItem(SMILE_STATS_STORAGE_KEY);
        const parsedStats: unknown = rawStats ? JSON.parse(rawStats) : null;
        const stats =
          typeof parsedStats === "object" && parsedStats !== null
            ? (parsedStats as Record<string, unknown>)
            : {};
        const response = await fetch("/api/activity/sync", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            activity: dailyActivityStorage.read(),
            smileStats: {
              mySmiles: typeof stats.mySmiles === "number" ? stats.mySmiles : 0,
              streak: typeof stats.streak === "number" ? stats.streak : 0,
              earnedStickerIds: Array.isArray(stats.earnedStickerIds)
                ? stats.earnedStickerIds
                : [],
            },
          }),
        });
        const data: unknown = await response.json();
        if (!response.ok || !isCloudSyncResponse(data))
          throw new Error("sync failed");
        const activityJson = JSON.stringify(data.activity);
        window.localStorage.setItem(DAILY_ACTIVITY_STORAGE_KEY, activityJson);
        window.dispatchEvent(
          new StorageEvent("storage", {
            key: DAILY_ACTIVITY_STORAGE_KEY,
            newValue: activityJson,
          }),
        );
        if (announce) toast.success("계정에 기록을 안전하게 연결했어요");
      } catch {
        if (announce)
          toast.warning("기기 기록을 유지하고 있어요", {
            description: "연결이 안정되면 자동으로 다시 동기화합니다.",
          });
      } finally {
        syncingRef.current = false;
      }
    },
    [status],
  );

  useEffect(() => {
    if (status !== "authenticated") {
      firstSyncRef.current = false;
      return;
    }
    if (!firstSyncRef.current) {
      firstSyncRef.current = true;
      void sync(true);
    }
    let timer: number | undefined;
    const schedule = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(() => void sync(), 900);
    };
    window.addEventListener(DAILY_ACTIVITY_CHANGED_EVENT, schedule);
    window.addEventListener("online", schedule);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener(DAILY_ACTIVITY_CHANGED_EVENT, schedule);
      window.removeEventListener("online", schedule);
    };
  }, [status, sync]);

  return children;
}
