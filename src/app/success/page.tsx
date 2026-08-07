"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Heart, Home, Sparkles } from "lucide-react";
import { useState } from "react";

import { ConfettiEffect } from "@/components/animations/confetti-effect";
import { AnimatedButton } from "@/components/buttons/animated-button";
import { PraiseSticker } from "@/components/cards/praise-sticker";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { PRAISE_STICKERS } from "@/constants/praise-stickers";
import { useSmileStats } from "@/hooks/use-smile-stats";
import { useFeedback } from "@/hooks/use-feedback";

const HEARTS = ["💛", "✨", "😊", "🧡", "🌼"];

export default function SuccessPage() {
  const { stats } = useSmileStats();
  const [didSelfSmile, setDidSelfSmile] = useState(false);
  const feedback = useFeedback();
  const sticker =
    PRAISE_STICKERS.find((item) => item.id === stats.lastStickerId) ??
    PRAISE_STICKERS[0];

  return (
    <AppShell className="overflow-hidden">
      <ConfettiEffect />
      <main
        id="main-content"
        className="relative z-10 flex min-h-dvh flex-col items-center justify-center overflow-y-auto px-6 py-8 text-center"
      >
        <motion.div
          className="bg-primary/25 shadow-warm mb-4 flex h-24 w-24 items-center justify-center rounded-full text-6xl"
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: [1, 1.08, 1], rotate: [0, 5, -3, 0] }}
          transition={{
            scale: { duration: 1.2, repeat: Infinity, repeatDelay: 2.5 },
            rotate: { duration: 0.8 },
          }}
        >
          🎉
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="bg-primary/20 text-accent mx-auto mb-2 flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-[10px] font-extrabold">
            <Sparkles className="h-3.5 w-3.5" /> MISSION COMPLETE
          </div>
          <h1 className="text-[1.75rem] font-black tracking-[-0.05em]">
            오늘도 미소 배달 성공!
          </h1>
          <p className="text-ink/70 mt-2 text-sm font-bold">
            누군가를 웃게 한 당신, 정말 다정한 사람이에요.
          </p>
        </motion.div>

        <PraiseSticker sticker={sticker} className="mt-5 w-full" />

        <div className="relative mt-4 w-full">
          <AnimatePresence>
            {didSelfSmile &&
              HEARTS.map((heart, index) => (
                <motion.span
                  key={`${heart}-${index}`}
                  className="pointer-events-none absolute top-1/2 left-1/2 text-xl"
                  initial={{ x: -10, y: 0, opacity: 1, scale: 0.5 }}
                  animate={{
                    x: (index - 2) * 42,
                    y: -55 - (index % 2) * 22,
                    opacity: 0,
                    scale: 1.2,
                    rotate: (index - 2) * 18,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1.1, delay: index * 0.05 }}
                >
                  {heart}
                </motion.span>
              ))}
          </AnimatePresence>
          <Button
            type="button"
            variant={didSelfSmile ? "secondary" : "outline"}
            size="lg"
            className="w-full"
            onClick={() => {
              setDidSelfSmile(true);
              feedback("success");
            }}
          >
            <Heart
              className={
                didSelfSmile ? "fill-accent text-accent h-4 w-4" : "h-4 w-4"
              }
            />
            {didSelfSmile ? "그 미소, 정말 잘 어울려요!" : "나도 한번 웃어보기"}
          </Button>
        </div>

        <motion.div
          className="mt-3 w-full"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
        >
          <AnimatedButton href="/" size="xl" className="shadow-button w-full">
            <Home className="h-5 w-5" />
            홈으로
          </AnimatedButton>
          <p className="text-muted mt-3 text-xs font-semibold">
            오늘은 상대의 미소와 내 미소, 두 개를 만들었어요 😊
          </p>
        </motion.div>
      </main>
    </AppShell>
  );
}
