"use client";

import { ArrowLeft, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

interface HeaderProps {
  title?: string;
  showBack?: boolean;
}

export function Header({
  title = "Make One Smile Today",
  showBack = false,
}: HeaderProps) {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header className="safe-top border-border/70 flex h-[72px] shrink-0 items-center justify-between border-b px-5">
      <div className="flex min-w-0 items-center gap-3">
        {showBack ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            aria-label="이전 화면으로"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
        ) : (
          <div
            className="bg-primary flex h-10 w-10 items-center justify-center rounded-2xl text-xl shadow-sm"
            aria-hidden="true"
          >
            😊
          </div>
        )}
        <div className="min-w-0">
          <p className="truncate text-[15px] font-extrabold tracking-[-0.02em]">
            {title}
          </p>
          {!showBack && (
            <p className="text-muted mt-0.5 text-[10px] font-bold tracking-wide">
              오늘 한 사람 웃기기
            </p>
          )}
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        aria-label={
          mounted && resolvedTheme === "dark"
            ? "라이트 모드로 전환"
            : "다크 모드로 전환"
        }
      >
        {mounted && resolvedTheme === "dark" ? (
          <Sun className="h-[18px] w-[18px]" />
        ) : (
          <Moon className="h-[18px] w-[18px]" />
        )}
      </Button>
    </header>
  );
}
