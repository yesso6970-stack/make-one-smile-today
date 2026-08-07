"use client";

import { Check, Crown, Sparkles } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const freeFeatures = [
  "AI 추천 하루 3회",
  "오늘의 미션과 일지",
  "기본 통계와 배지",
  "가족·친구 초대",
];
const premiumFeatures = [
  "AI 웃음 코치 무제한",
  "Premium 전용 배지",
  "월간 행복 리포트",
  "광고 없는 집중 경험",
  "새 기능 우선 사용",
];

export function PremiumPlans() {
  const { data: session } = useSession();
  const premium = session?.user.plan === "premium";
  return (
    <div className="space-y-4">
      <section className="via-primary shadow-warm relative overflow-hidden rounded-[2.2rem] bg-gradient-to-br from-[#fff1b8] to-[#ffc44f] p-7 text-[#333]">
        <div className="absolute -top-12 -right-10 h-40 w-40 rounded-full bg-white/30" />
        <Crown className="h-10 w-10 text-[#8f6a00]" />
        <p className="mt-5 text-xs font-black text-[#8f6a00]">
          MAKE KINDNESS A HABIT
        </p>
        <h1 className="mt-1 text-3xl font-black">Smile Premium</h1>
        <p className="mt-3 text-sm leading-6 font-bold">
          더 많은 사람에게, 더 자연스러운 한마디를 전하고 싶은 날을 위한 따뜻한
          확장입니다.
        </p>
      </section>
      <section className="bg-surface rounded-[2rem] border p-5">
        <h2 className="text-lg font-black">무료</h2>
        <p className="text-muted mt-1 text-xs font-semibold">
          매일의 핵심 습관은 계속 무료예요.
        </p>
        <ul className="mt-4 space-y-3">
          {freeFeatures.map((feature) => (
            <li
              key={feature}
              className="flex items-center gap-2 text-sm font-bold"
            >
              <Check className="text-success h-4 w-4" /> {feature}
            </li>
          ))}
        </ul>
      </section>
      <section className="shadow-warm relative overflow-hidden rounded-[2rem] border-2 border-[#e4b83e] bg-[linear-gradient(145deg,#fffaf0,#fff0b3)] p-5 text-[#333] dark:bg-[linear-gradient(145deg,#393321,#554617)] dark:text-white">
        <span className="absolute top-4 right-4 rounded-full bg-[#333] px-2.5 py-1 text-[9px] font-black text-white">
          PREMIUM
        </span>
        <h2 className="flex items-center gap-2 text-lg font-black">
          <Sparkles className="text-accent h-5 w-5" /> 무제한 다정함
        </h2>
        <ul className="mt-4 space-y-3">
          {premiumFeatures.map((feature) => (
            <li
              key={feature}
              className="flex items-center gap-2 text-sm font-bold"
            >
              <Check className="text-success h-4 w-4" /> {feature}
            </li>
          ))}
        </ul>
        {premium ? (
          <div className="bg-success/15 text-success mt-6 rounded-2xl p-3 text-center text-sm font-black">
            현재 Premium을 이용 중이에요
          </div>
        ) : session ? (
          <Button className="mt-6 w-full" disabled>
            안전한 결제 연동 준비 중
          </Button>
        ) : (
          <Button asChild className="mt-6 w-full">
            <Link href="/profile">로그인하고 시작하기</Link>
          </Button>
        )}
        <p className="mt-3 text-center text-[10px] font-semibold opacity-65">
          결제 제공자 연결 전에는 요금이 청구되지 않습니다.
        </p>
      </section>
    </div>
  );
}
