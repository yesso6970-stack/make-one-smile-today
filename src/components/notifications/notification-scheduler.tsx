"use client";

import { useEffect } from "react";

import { useAppPreferences } from "@/hooks/use-app-preferences";
import { useDailyActivity } from "@/hooks/use-daily-activity";

export function NotificationScheduler() {
  const { preferences, hydrated } = useAppPreferences();
  const { streak } = useDailyActivity();

  useEffect(() => {
    if (
      !hydrated ||
      !preferences.notifications ||
      !("Notification" in window) ||
      Notification.permission !== "granted"
    )
      return;
    const [hour, minute] = preferences.reminderTime.split(":").map(Number);
    const next = new Date();
    next.setHours(hour, minute, 0, 0);
    if (next.getTime() <= Date.now()) next.setDate(next.getDate() + 1);
    const timeout = window.setTimeout(
      () => {
        const registrationPromise = navigator.serviceWorker?.ready;
        if (registrationPromise) {
          void registrationPromise.then((registration) =>
            registration.showNotification("오늘 한 사람 웃기기", {
              body:
                streak > 0
                  ? `${streak}일 연속 기록을 오늘도 따뜻하게 이어가볼까요? 😊`
                  : "오늘 한 사람을 웃게 해볼까요? 😊",
              icon: "/icons/icon-192.png",
              tag: "daily-smile-reminder",
            }),
          );
        } else {
          new Notification("오늘 한 사람 웃기기", {
            body:
              streak > 0
                ? `${streak}일 연속 기록을 오늘도 따뜻하게 이어가볼까요? 😊`
                : "오늘 한 사람을 웃게 해볼까요? 😊",
            icon: "/icons/icon-192.png",
            tag: "daily-smile-reminder",
          });
        }
      },
      Math.min(next.getTime() - Date.now(), 2_147_000_000),
    );
    return () => window.clearTimeout(timeout);
  }, [hydrated, preferences.notifications, preferences.reminderTime, streak]);

  return null;
}
