"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { AppPreferencesContext } from "@/contexts/app-preferences-context";
import {
  DEFAULT_PREFERENCES,
  LOCAL_APP_STORAGE_KEYS,
  PREFERENCES_STORAGE_KEY,
} from "@/constants/preferences";
import type { AppPreferences } from "@/types/preferences";

function parsePreferences(value: unknown): AppPreferences | null {
  if (typeof value !== "object" || value === null) return null;
  const candidate = value as Record<string, unknown>;
  if (
    typeof candidate.notifications !== "boolean" ||
    typeof candidate.vibration !== "boolean" ||
    typeof candidate.sound !== "boolean"
  ) {
    return null;
  }
  return {
    notifications: candidate.notifications,
    vibration: candidate.vibration,
    sound: candidate.sound,
  };
}

export function AppPreferencesProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [preferences, setPreferences] =
    useState<AppPreferences>(DEFAULT_PREFERENCES);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(PREFERENCES_STORAGE_KEY);
      const parsed = raw ? parsePreferences(JSON.parse(raw) as unknown) : null;
      if (parsed) setPreferences(parsed);
    } catch {
      // 저장소 접근이 차단되어도 기본 설정으로 앱을 사용할 수 있습니다.
    } finally {
      setHydrated(true);
    }
  }, []);

  const updatePreference = useCallback(
    <Key extends keyof AppPreferences>(
      key: Key,
      value: AppPreferences[Key],
    ) => {
      setPreferences((current) => {
        const next = { ...current, [key]: value };
        try {
          window.localStorage.setItem(
            PREFERENCES_STORAGE_KEY,
            JSON.stringify(next),
          );
        } catch {
          // 현재 세션의 선택은 유지합니다.
        }
        return next;
      });
    },
    [],
  );

  const resetLocalData = useCallback(() => {
    for (const key of LOCAL_APP_STORAGE_KEYS)
      window.localStorage.removeItem(key);
    window.localStorage.removeItem(PREFERENCES_STORAGE_KEY);
    window.localStorage.removeItem("theme");
    window.location.assign("/");
  }, []);

  const value = useMemo(
    () => ({ preferences, hydrated, updatePreference, resetLocalData }),
    [hydrated, preferences, resetLocalData, updatePreference],
  );

  return (
    <AppPreferencesContext.Provider value={value}>
      {children}
    </AppPreferencesContext.Provider>
  );
}
