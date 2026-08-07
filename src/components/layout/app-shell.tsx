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
      {children}
    </div>
  );
}
