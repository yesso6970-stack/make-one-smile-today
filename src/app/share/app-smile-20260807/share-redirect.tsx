"use client";

import { useEffect } from "react";
import Link from "next/link";

/** Gives crawlers a real page while sending people into the app. */
export function ShareRedirect() {
  useEffect(() => {
    window.location.replace("/");
  }, []);

  return (
    <main className="bg-background flex min-h-dvh flex-col items-center justify-center px-8 text-center">
      <div className="bg-primary mb-6 rounded-3xl p-5 text-6xl shadow-lg">
        😊
      </div>
      <h1 className="text-ink text-2xl font-black">Make One Smile Today</h1>
      <p className="text-muted mt-3 text-sm font-semibold">
        따뜻한 미소 카드를 열고 있어요.
      </p>
      <Link
        className="bg-primary text-ink mt-8 rounded-2xl px-6 py-3 text-sm font-extrabold"
        href="/"
      >
        앱 바로 열기
      </Link>
    </main>
  );
}
