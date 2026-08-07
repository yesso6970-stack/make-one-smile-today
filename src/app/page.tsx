"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { CalendarDays, Heart } from "lucide-react";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

import { AnimatedCounter } from "@/components/animations/animated-counter";
import { AnimatedButton } from "@/components/buttons/animated-button";
import { CounterCard } from "@/components/cards/counter-card";
import { AppShell } from "@/components/layout/app-shell";
import { BottomNavigation } from "@/components/layout/bottom-navigation";
import { Header } from "@/components/layout/header";
import { DailyMissionCard } from "@/components/mission/daily-mission-card";
import { PointsCard } from "@/components/points/points-card";
import { PremiumHub } from "@/components/premium/premium-hub";
import { DailyQuoteCard } from "@/components/quote/daily-quote-card";
import { Skeleton } from "@/components/ui/skeleton";
import { useKoreanDate } from "@/hooks/use-korean-date";
import { useSmileStats } from "@/hooks/use-smile-stats";
import { formatKoreanDate } from "@/lib/date";

const SPLASH_DURATION = 2000;

const sectionLoading = () => <Skeleton className="h-64 rounded-[2rem]" />;
const SmileCalendar = dynamic(
  () =>
    import("@/components/calendar/smile-calendar").then(
      (module) => module.SmileCalendar,
    ),
  { loading: sectionLoading },
);
const DailyJournal = dynamic(
  () =>
    import("@/components/journal/daily-journal").then(
      (module) => module.DailyJournal,
    ),
  { loading: sectionLoading },
);
const AiSmileIdeas = dynamic(
  () =>
    import("@/components/mission/ai-smile-ideas").then(
      (module) => module.AiSmileIdeas,
    ),
  { loading: sectionLoading },
);
const BadgeShowcase = dynamic(
  () =>
    import("@/components/badge/badge-showcase").then(
      (module) => module.BadgeShowcase,
    ),
  { loading: sectionLoading },
);
const StickerShelf = dynamic(
  () =>
    import("@/components/cards/sticker-shelf").then(
      (module) => module.StickerShelf,
    ),
  { loading: sectionLoading },
);

function SplashScreen() {
  return (
    <motion.main
      className="bg-primary relative flex min-h-dvh flex-col items-center justify-center overflow-hidden px-8 text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.45 }}
    >
      <div className="splash-orb splash-orb-left" aria-hidden="true" />
      <div className="splash-orb splash-orb-right" aria-hidden="true" />
      <motion.div
        initial={{ scale: 0.5, rotate: -12 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 15, delay: 0.1 }}
        className="mb-7 text-7xl drop-shadow-sm"
      >
        😊
      </motion.div>
      <motion.div
        initial={{ y: 16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.25, duration: 0.5 }}
      >
        <h1 className="text-ink text-2xl font-extrabold tracking-tight">
          오늘 한 사람 웃기기
        </h1>
        <p className="text-ink/55 mt-2 text-sm font-semibold tracking-wide">
          Make One Smile Today
        </p>
      </motion.div>
      <motion.p
        className="text-ink mt-14 text-[1.65rem] leading-[1.45] font-extrabold tracking-[-0.04em]"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.55, duration: 0.55 }}
      >
        오늘도
        <br />
        누군가를
        <br />
        웃게 해볼까요?
      </motion.p>
      <motion.div
        className="bg-ink/10 absolute bottom-12 h-1 w-24 overflow-hidden rounded-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        <motion.div
          className="bg-ink/40 h-full rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 1.1, delay: 0.9, ease: "linear" }}
        />
      </motion.div>
    </motion.main>
  );
}

function HomeScreen() {
  const { stats } = useSmileStats();
  const { now } = useKoreanDate();

  return (
    <AppShell>
      <Header />
      <motion.main
        id="main-content"
        className="flex flex-1 flex-col gap-4 px-5 pt-6 pb-28"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45 }}
      >
        <DailyMissionCard />
        <PointsCard />
        <PremiumHub />

        <section className="from-primary via-primary shadow-warm relative overflow-hidden rounded-[2rem] bg-gradient-to-br to-[#ffe996] px-6 py-7">
          <div
            className="absolute -top-10 -right-7 h-32 w-32 rounded-full bg-white/30"
            aria-hidden="true"
          />
          <div className="relative flex items-center justify-between gap-3">
            <p className="text-ink/60 text-sm font-bold">
              우리 모두가 만든 미소
            </p>
            <span className="text-ink/55 flex items-center gap-1 text-[10px] font-extrabold">
              <CalendarDays className="h-3.5 w-3.5" /> {formatKoreanDate(now)}
            </span>
          </div>
          <p className="text-ink mt-2 text-[2.75rem] leading-none font-black tracking-[-0.05em] tabular-nums">
            <AnimatedCounter value={stats.communitySmiles} />
          </p>
          <div className="text-ink/70 mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/55 px-3 py-1.5 text-xs font-bold backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="bg-success absolute inline-flex h-full w-full animate-ping rounded-full opacity-60" />
              <span className="bg-success relative inline-flex h-2 w-2 rounded-full" />
            </span>
            미소가 바로 기록되고 있어요
          </div>
        </section>

        <section className="grid grid-cols-2 gap-3" aria-label="나의 미소 기록">
          <CounterCard
            label="내가 웃게 한 사람"
            value={stats.mySmiles}
            suffix="명"
            emoji="😊"
          />
          <CounterCard
            label="연속 성공"
            value={stats.streak}
            suffix="일"
            emoji="🔥"
          />
        </section>

        <SmileCalendar />
        <DailyJournal />
        <AiSmileIdeas />
        <DailyQuoteCard />
        <BadgeShowcase />
        <StickerShelf earnedStickerIds={stats.earnedStickerIds} />

        <div className="pt-5">
          <AnimatedButton
            href="/target"
            size="xl"
            className="shadow-button w-full"
          >
            <span className="text-2xl" aria-hidden="true">
              😊
            </span>
            오늘 웃기기 시작
          </AnimatedButton>
          <p className="text-muted mt-5 flex items-center justify-center gap-1.5 text-sm font-semibold">
            <Heart
              className="fill-accent text-accent h-3.5 w-3.5"
              aria-hidden="true"
            />
            오늘도 세상을 조금 더 따뜻하게
          </p>
        </div>
      </motion.main>
      <BottomNavigation active="home" />
    </AppShell>
  );
}

export default function HomePage() {
  const [isSplashVisible, setIsSplashVisible] = useState(true);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const timer = window.setTimeout(
      () => setIsSplashVisible(false),
      reduceMotion ? 400 : SPLASH_DURATION,
    );
    return () => window.clearTimeout(timer);
  }, [reduceMotion]);

  return (
    <AnimatePresence mode="wait">
      {isSplashVisible ? (
        <SplashScreen key="splash" />
      ) : (
        <HomeScreen key="home" />
      )}
    </AnimatePresence>
  );
}
