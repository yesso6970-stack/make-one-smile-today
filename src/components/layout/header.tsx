"use client";

import { ArrowLeft, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface HeaderProps {
  title?: string;
  showBack?: boolean;
}

export function Header({
  title = "오늘 한 사람 웃기기",
  showBack = false,
}: HeaderProps) {
  const router = useRouter();
  const { resolvedTheme } = useTheme();
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return (
    <header className="safe-top border-border/70 flex min-h-[72px] shrink-0 items-center justify-between border-b px-5 pb-3">
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
              Make One Smile Today
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-1">
        <Button asChild variant="ghost" size="icon">
          <Link href="/settings" aria-label="화면 모드와 앱 설정 열기">
            {mounted && resolvedTheme === "dark" ? (
              <Sun className="h-[18px] w-[18px]" />
            ) : (
              <Moon className="h-[18px] w-[18px]" />
            )}
          </Link>
        </Button>
        <Link
          href="/profile"
          aria-label="내 프로필 열기"
          className="rounded-full focus-visible:outline-3"
        >
          <Avatar className="h-9 w-9">
            <AvatarImage src={session?.user.image ?? undefined} alt="" />
            <AvatarFallback>
              {session?.user.name?.slice(0, 1) ?? "👤"}
            </AvatarFallback>
          </Avatar>
        </Link>
      </div>
    </header>
  );
}
