"use client";

import { useEffect, useState } from "react";

import { getLocalDateKey } from "@/lib/date";

/** 한국 날짜를 유지하고 자정이 지나면 화면을 자동 갱신합니다. */
export function useKoreanDate() {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const interval = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(interval);
  }, []);

  return { now, dateKey: getLocalDateKey(now) };
}
