"use client";

import { createContext } from "react";

import type { AppPreferences } from "@/types/preferences";

export interface AppPreferencesContextValue {
  preferences: AppPreferences;
  hydrated: boolean;
  updatePreference: <Key extends keyof AppPreferences>(
    key: Key,
    value: AppPreferences[Key],
  ) => void;
  resetLocalData: () => void;
}

export const AppPreferencesContext =
  createContext<AppPreferencesContextValue | null>(null);
