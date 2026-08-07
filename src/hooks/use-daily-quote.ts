"use client";

import { QUOTES } from "@/constants/quotes";
import { getDailyCardIndex } from "@/lib/date";
import { useDailyActivity } from "@/hooks/use-daily-activity";

export function useDailyQuote() {
  const { todayKey } = useDailyActivity();
  const quote = QUOTES[getDailyCardIndex(`quote:${todayKey}`, QUOTES.length)];
  return { quote, todayKey };
}
