import { Heart, Mail, Scale, ScrollText, ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import { AppShell } from "@/components/layout/app-shell";
import { Header } from "@/components/layout/header";
import { Card, CardContent } from "@/components/ui/card";
import { APP_VERSION } from "@/constants/preferences";

export const metadata: Metadata = { title: "앱 정보" };

const links = [
  { href: "/privacy", label: "개인정보 처리방침", icon: ShieldCheck },
  { href: "/terms", label: "이용약관", icon: ScrollText },
  { href: "/contact", label: "문의하기", icon: Mail },
  { href: "/licenses", label: "오픈소스 라이선스", icon: Scale },
] as const;

export default function AboutPage() {
  return (
    <AppShell>
      <Header title="앱 정보" showBack />
      <main id="main-content" className="flex-1 px-5 pt-8 pb-12">
        <section className="from-primary to-primary/55 shadow-warm rounded-[2rem] bg-gradient-to-br p-7 text-[#333]">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/70 text-3xl">
            😊
          </div>
          <h1 className="mt-5 text-2xl font-black">오늘 한 사람 웃기기</h1>
          <p className="mt-1 text-sm font-bold">Make One Smile Today</p>
          <p className="mt-5 text-sm leading-6 font-semibold">
            매일 30초의 다정함으로 나와 누군가의 하루를 조금 더 따뜻하게 만드는
            앱입니다.
          </p>
        </section>

        <Card className="mt-5">
          <CardContent className="divide-border divide-y p-2">
            {links.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="hover:bg-surface-soft flex items-center gap-3 rounded-2xl px-4 py-4 text-sm font-black"
              >
                <Icon className="text-accent h-5 w-5" /> {label}
                <span className="text-muted ml-auto">›</span>
              </Link>
            ))}
          </CardContent>
        </Card>

        <div className="text-muted mt-7 text-center text-xs font-semibold">
          <Heart className="fill-accent text-accent mx-auto mb-2 h-4 w-4" />
          버전 {APP_VERSION} · Made with kindness
        </div>
      </main>
    </AppShell>
  );
}
