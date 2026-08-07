"use client";

import { useEffect } from "react";
import { toast } from "@/components/ui/toast";

export function useServiceWorker() {
  useEffect(() => {
    if (
      process.env.NODE_ENV !== "production" ||
      !("serviceWorker" in navigator)
    )
      return;

    const register = async () => {
      try {
        const registration = await navigator.serviceWorker.register("/sw.js", {
          scope: "/",
          updateViaCache: "none",
        });
        await registration.update();
        registration.addEventListener("updatefound", () => {
          const worker = registration.installing;
          worker?.addEventListener("statechange", () => {
            if (
              worker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              toast.info("새 버전을 준비했어요", {
                description: "다음 화면 이동부터 자동으로 반영됩니다.",
              });
              worker.postMessage("SKIP_WAITING");
            }
          });
        });
      } catch {
        // 설치가 막힌 브라우저에서도 웹 앱 자체는 정상 동작합니다.
      }
    };
    if (document.readyState === "complete") void register();
    else window.addEventListener("load", register, { once: true });
    return () => window.removeEventListener("load", register);
  }, []);
}
