"use client";

import { useEffect } from "react";

export function useServiceWorker() {
  useEffect(() => {
    if (
      process.env.NODE_ENV !== "production" ||
      !("serviceWorker" in navigator)
    )
      return;

    const register = () =>
      navigator.serviceWorker.register("/sw.js").catch(() => undefined);
    window.addEventListener("load", register);
    return () => window.removeEventListener("load", register);
  }, []);
}
