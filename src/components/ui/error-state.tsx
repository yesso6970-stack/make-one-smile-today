"use client";

import { RefreshCw } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  emoji?: string;
  title: string;
  description: string;
  retry?: () => void;
}

export function ErrorState({
  emoji = "😌",
  title,
  description,
  retry,
}: ErrorStateProps) {
  return (
    <div className="flex min-h-[70dvh] flex-col items-center justify-center px-8 text-center">
      <div
        className="bg-primary/20 flex h-24 w-24 items-center justify-center rounded-[2rem] text-5xl shadow-sm"
        aria-hidden="true"
      >
        {emoji}
      </div>
      <h1 className="mt-7 text-2xl font-black">{title}</h1>
      <p className="text-muted mt-3 max-w-xs text-sm leading-6 font-semibold">
        {description}
      </p>
      <div className="mt-8 flex w-full max-w-xs gap-2">
        <Button asChild variant="outline" className="flex-1">
          <Link href="/">홈으로</Link>
        </Button>
        {retry && (
          <Button className="flex-1" onClick={retry}>
            <RefreshCw className="h-4 w-4" /> 다시 시도
          </Button>
        )}
      </div>
    </div>
  );
}
