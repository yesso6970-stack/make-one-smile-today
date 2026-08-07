"use client";

import { useEffect, useState } from "react";

export interface WeatherSnapshot {
  code: number;
  temperature: number;
}

interface OpenMeteoResponse {
  current?: {
    weather_code?: unknown;
    temperature_2m?: unknown;
  };
}

const SEOUL_WEATHER_URL =
  "https://api.open-meteo.com/v1/forecast?latitude=37.5665&longitude=126.9780&current=temperature_2m,weather_code&timezone=Asia%2FSeoul&forecast_days=1";

export function useSeoulWeather() {
  const [weather, setWeather] = useState<WeatherSnapshot | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadWeather = async () => {
      try {
        const response = await fetch(SEOUL_WEATHER_URL, {
          signal: controller.signal,
        });
        if (!response.ok) return;

        const data = (await response.json()) as OpenMeteoResponse;
        const code = data.current?.weather_code;
        const temperature = data.current?.temperature_2m;
        if (typeof code === "number" && typeof temperature === "number") {
          setWeather({ code, temperature });
        }
      } catch {
        // 네트워크 오류 시 달력과 계절 정보만으로 카드를 구성합니다.
      }
    };

    void loadWeather();
    return () => controller.abort();
  }, []);

  return weather;
}
