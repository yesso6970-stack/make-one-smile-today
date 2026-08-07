import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      aria-hidden="true"
      className={cn("bg-border/70 animate-pulse rounded-xl", className)}
      {...props}
    />
  );
}

export function PageSkeleton() {
  return (
    <div
      className="space-y-4 px-5 py-6"
      aria-label="콘텐츠를 불러오는 중"
      role="status"
    >
      <Skeleton className="h-48 rounded-[2rem]" />
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-28 rounded-[1.75rem]" />
        <Skeleton className="h-28 rounded-[1.75rem]" />
      </div>
      <Skeleton className="h-64 rounded-[2rem]" />
      <span className="sr-only">콘텐츠를 불러오는 중입니다.</span>
    </div>
  );
}
