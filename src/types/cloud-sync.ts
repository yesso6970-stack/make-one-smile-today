import type { DailyActivityState } from "@/types/daily-activity";

export interface CloudSmileStats {
  mySmiles: number;
  streak: number;
  earnedStickerIds: string[];
}

export interface CloudSyncPayload {
  activity: DailyActivityState;
  smileStats: CloudSmileStats;
}

export interface CloudSyncResponse extends CloudSyncPayload {
  syncedAt: string;
}
