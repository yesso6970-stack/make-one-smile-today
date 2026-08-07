import type { AppPreferences } from "@/types/preferences";

export const APP_VERSION = "1.1.0";
export const PREFERENCES_STORAGE_KEY = "make-one-smile:preferences:v1";

export const DEFAULT_PREFERENCES: AppPreferences = {
  notifications: false,
  reminderTime: "20:00",
  vibration: true,
  sound: true,
};

export const LOCAL_APP_STORAGE_KEYS = [
  "make-one-smile:daily-activity:v1",
  "make-one-smile:stats:v1",
  "make-one-smile:stats:v2",
  "make-one-smile:device:v1",
] as const;
