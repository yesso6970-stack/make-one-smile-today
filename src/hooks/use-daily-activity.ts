"use client";

import { useContext } from "react";

import { DailyActivityContext } from "@/components/providers/daily-activity-provider";

export function useDailyActivity() {
  const context = useContext(DailyActivityContext);
  if (!context) {
    throw new Error(
      "useDailyActivity must be used within DailyActivityProvider.",
    );
  }
  return context;
}
