"use client";

import { Home, Settings, SmilePlus } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

interface BottomNavigationProps {
  active: "home" | "target" | "settings";
}

const items = [
  { id: "home", href: "/", label: "홈", icon: Home },
  { id: "target", href: "/target", label: "웃기기", icon: SmilePlus },
  { id: "settings", href: "/settings", label: "설정", icon: Settings },
] as const;

export function BottomNavigation({ active }: BottomNavigationProps) {
  return (
    <nav
      className="safe-bottom border-border/80 bg-surface/90 fixed bottom-0 left-1/2 z-30 flex w-full max-w-[480px] -translate-x-1/2 items-center justify-around border-t px-5 pt-2 backdrop-blur-xl"
      aria-label="주요 메뉴"
    >
      {items.map(({ id, href, label, icon: Icon }) => {
        const selected = active === id;
        return (
          <Link
            key={id}
            href={href}
            className={cn(
              "flex min-w-20 flex-col items-center gap-1 rounded-xl py-1 text-[11px] font-bold transition-colors",
              selected ? "text-accent" : "text-muted hover:text-ink",
            )}
            aria-current={selected ? "page" : undefined}
          >
            <span
              className={cn(
                "rounded-xl px-5 py-1.5 transition-colors",
                selected && "bg-primary/20",
              )}
            >
              <Icon className={cn("h-5 w-5", selected && "fill-primary/40")} />
            </span>
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
