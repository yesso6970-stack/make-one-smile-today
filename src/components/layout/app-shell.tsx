import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function AppShell({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "app-shell bg-background relative mx-auto flex min-h-dvh w-full max-w-[480px] flex-col",
        className,
      )}
      {...props}
    >
      <a
        href="#main-content"
        className="bg-primary text-ink fixed top-2 left-1/2 z-[80] -translate-x-1/2 -translate-y-20 rounded-xl px-4 py-2 text-sm font-black focus:translate-y-0"
      >
        본문으로 바로가기
      </a>
      {children}
    </div>
  );
}
