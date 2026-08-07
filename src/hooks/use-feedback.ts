"use client";

import { useCallback } from "react";

import { useAppPreferences } from "@/hooks/use-app-preferences";

export function useFeedback() {
  const { preferences } = useAppPreferences();

  return useCallback(
    (kind: "tap" | "success" = "tap") => {
      if (preferences.vibration) {
        navigator.vibrate?.(kind === "success" ? [35, 35, 55] : 18);
      }
      if (!preferences.sound) return;
      try {
        const context = new AudioContext();
        const oscillator = context.createOscillator();
        const gain = context.createGain();
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(
          kind === "success" ? 660 : 520,
          context.currentTime,
        );
        gain.gain.setValueAtTime(0.035, context.currentTime);
        gain.gain.exponentialRampToValueAtTime(
          0.0001,
          context.currentTime + 0.12,
        );
        oscillator.connect(gain).connect(context.destination);
        oscillator.start();
        oscillator.stop(context.currentTime + 0.12);
        oscillator.addEventListener("ended", () => void context.close(), {
          once: true,
        });
      } catch {
        // 오디오를 제한하는 브라우저에서는 시각 피드백만 유지합니다.
      }
    },
    [preferences.sound, preferences.vibration],
  );
}
