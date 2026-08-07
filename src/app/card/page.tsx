"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, Copy, RefreshCw, Share2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";

import { AnimatedButton } from "@/components/buttons/animated-button";
import { SmileCard } from "@/components/cards/smile-card";
import { AppShell } from "@/components/layout/app-shell";
import { Header } from "@/components/layout/header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import { APP_NAME, APP_SHARE_URL } from "@/constants/app";
import { createContextualCard } from "@/constants/contextual-cards";
import { SMILE_CARDS } from "@/constants/dummy-data";
import { TARGETS } from "@/constants/targets";
import { useCardDeck } from "@/hooks/use-card-deck";
import { useKoreanDate } from "@/hooks/use-korean-date";
import { useSeoulWeather } from "@/hooks/use-seoul-weather";
import { useSmileStats } from "@/hooks/use-smile-stats";
import { copyText } from "@/lib/clipboard";
import { getDailyOrder } from "@/lib/date";

function SmileCardContent() {
  const searchParams = useSearchParams();
  const targetId = searchParams.get("target") ?? "random";
  const target =
    TARGETS.find((item) => item.id === targetId) ?? TARGETS[TARGETS.length - 1];
  const { dateKey } = useKoreanDate();
  const weather = useSeoulWeather();
  const targetCards = useMemo(
    () => SMILE_CARDS.filter((card) => card.targetIds.includes(target.id)),
    [target.id],
  );
  const shuffledCards = useMemo(
    () => getDailyOrder(targetCards, `${dateKey}-${target.id}`),
    [dateKey, target.id, targetCards],
  );
  const contextualCard = useMemo(
    () => createContextualCard(target, dateKey, weather),
    [dateKey, target, weather],
  );
  const dailyCards = useMemo(
    () => [contextualCard, ...shuffledCards],
    [contextualCard, shuffledCards],
  );
  const { card, currentIndex, drawNext } = useCardDeck(dailyCards);
  const { registerSmile } = useSmileStats();

  const copyCard = async () => {
    const copied = await copyText(card.message);
    if (copied) {
      toast.success("보낼 문장만 복사했어요", {
        description: "원하는 대화창에 바로 붙여넣어보세요.",
      });
      return;
    }

    toast.error("복사하지 못했어요", {
      description: "브라우저의 클립보드 권한을 확인해주세요.",
    });
  };

  const shareApp = async () => {
    const shareData = {
      title: APP_NAME,
      text: "오늘, 한 사람을 웃게 해볼까요? 😊",
      url: APP_SHARE_URL,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success("앱을 공유했어요", {
          description: "따뜻한 미소가 한 사람 더 이어질 거예요.",
        });
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError")
          return;
        toast.error("공유하지 못했어요");
      }
      return;
    }

    const copied = await copyText(
      `${shareData.text}\n${shareData.title}\n${shareData.url}`,
    );
    if (copied) {
      toast.success("앱 링크를 복사했어요", {
        description: "메신저에 붙여넣어 친구에게 전달해보세요.",
      });
      return;
    }

    toast.error("앱 링크를 공유하지 못했어요");
  };

  return (
    <AppShell>
      <Header title="오늘의 미소 카드" showBack />
      <main className="flex flex-1 flex-col px-5 pt-4 pb-7">
        <div className="mb-4 flex items-center justify-between">
          <Badge variant="soft">
            {target.emoji} {target.label}에게
          </Badge>
          <div className="text-right">
            <p className="text-muted text-[10px] font-bold">오늘의 맞춤 카드</p>
            <p className="text-xs font-extrabold">
              {currentIndex + 1} / {dailyCards.length}
            </p>
          </div>
        </div>

        <div className="relative flex min-h-[360px] flex-1 items-center justify-center py-3 [perspective:1000px]">
          <div
            className="bg-primary/25 absolute h-[82%] w-[88%] rotate-3 rounded-[2rem]"
            aria-hidden="true"
          />
          <div
            className="bg-accent/10 absolute h-[86%] w-[92%] -rotate-2 rounded-[2rem]"
            aria-hidden="true"
          />
          <AnimatePresence mode="wait">
            <SmileCard key={card.id} card={card} />
          </AnimatePresence>
        </div>

        <p className="text-muted my-4 text-center text-xs font-semibold">
          카드를 넘기듯 다시 뽑아보세요
        </p>
        <div className="grid grid-cols-2 gap-3">
          <Button variant="secondary" size="lg" onClick={drawNext}>
            <motion.span
              animate={{ rotate: currentIndex * 180 }}
              className="inline-flex"
            >
              <RefreshCw className="h-4 w-4" />
            </motion.span>
            다시 뽑기
          </Button>
          <Button variant="outline" size="lg" onClick={copyCard}>
            <Copy className="h-4 w-4" />
            내용 복사
          </Button>
        </div>
        <Button
          variant="secondary"
          size="lg"
          className="mt-3 w-full"
          onClick={shareApp}
        >
          <Share2 className="h-4 w-4" />이 앱 공유하기
        </Button>
        <AnimatedButton
          href="/success"
          size="xl"
          onClick={registerSmile}
          className="bg-success hover:bg-success/90 mt-3 w-full text-white shadow-[0_12px_24px_rgba(76,175,80,0.2)]"
        >
          <Check className="h-5 w-5" /> 상대가 웃었어요
        </AnimatedButton>
      </main>
    </AppShell>
  );
}

export default function SmileCardPage() {
  return (
    <Suspense
      fallback={
        <AppShell>
          <Header title="오늘의 미소 카드" showBack />
          <main className="flex flex-1 items-center justify-center">
            <div className="bg-primary/15 h-80 w-[calc(100%-2.5rem)] animate-pulse rounded-[2rem]" />
          </main>
        </AppShell>
      }
    >
      <SmileCardContent />
    </Suspense>
  );
}
