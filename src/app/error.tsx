"use client";

import { useEffect } from "react";

import { AppShell } from "@/components/layout/app-shell";
import { ErrorState } from "@/components/ui/error-state";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") console.error(error);
  }, [error]);
  return (
    <AppShell>
      <main id="main-content">
        <ErrorState
          emoji="🫶"
          title="잠시 쉬어갈게요"
          description="예상하지 못한 문제가 생겼어요. 기록은 그대로 두고 화면만 다시 불러올 수 있어요."
          retry={reset}
        />
      </main>
    </AppShell>
  );
}
