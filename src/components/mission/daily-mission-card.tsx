"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Check, Dices, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useDailyMission } from "@/hooks/use-daily-mission";

import { MissionCardSkeleton } from "./mission-card-skeleton";
import { MissionCategoryBadge } from "./mission-category-badge";

export function DailyMissionCard() {
  const { mission, completed, completeMission, rerollMission, hydrated } =
    useDailyMission();
  const [celebrating, setCelebrating] = useState(false);
  const reduceMotion = useReducedMotion();

  if (!hydrated) return <MissionCardSkeleton />;

  const handleComplete = () => {
    const result = completeMission();
    if (!result) return;
    setCelebrating(true);
    window.setTimeout(() => setCelebrating(false), 1500);
    toast.success(`오늘의 미션 완료 · +${result.awardedPoints}P`, {
      description:
        result.newBadgeIds.length > 0
          ? "새로운 칭찬 배지를 획득했어요!"
          : `${result.streak}일째 따뜻한 마음을 이어가고 있어요.`,
    });
  };

  const handleReroll = () => {
    const next = rerollMission();
    if (next) toast("새로운 미션을 준비했어요 🎲");
  };

  return (
    <motion.section
      className="shadow-warm relative overflow-hidden rounded-[2rem] border border-white/60 bg-[linear-gradient(145deg,rgba(255,255,255,.88),rgba(255,244,199,.78))] p-6 backdrop-blur-xl dark:border-white/10 dark:bg-[linear-gradient(145deg,rgba(43,40,29,.94),rgba(34,33,28,.88))]"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.45 }}
      aria-labelledby="daily-mission-title"
    >
      <div className="bg-primary/35 absolute -top-14 -right-10 h-40 w-40 rounded-full blur-2xl" />
      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-accent flex items-center gap-1.5 text-xs font-black tracking-wide">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              매일 30초의 따뜻한 습관
            </p>
            <h2
              id="daily-mission-title"
              className="text-ink mt-1 text-xl font-black"
            >
              😊 오늘의 미션
            </h2>
          </div>
          <MissionCategoryBadge category={mission.category} />
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.blockquote
            key={mission.id}
            className="text-ink mt-6 min-h-20 text-[1.3rem] leading-[1.45] font-black tracking-[-0.025em]"
            initial={{ opacity: 0, x: 16, rotateY: -8 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            exit={{ opacity: 0, x: -16, rotateY: 8 }}
            transition={{ duration: reduceMotion ? 0 : 0.28 }}
          >
            “{mission.message}”
          </motion.blockquote>
        </AnimatePresence>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Button
            variant={completed ? "success" : "default"}
            size="lg"
            onClick={handleComplete}
            disabled={completed}
            className="w-full"
          >
            <Check className="h-4 w-4" />
            {completed ? "오늘 완료했어요" : "완료하기 · +10P"}
          </Button>
          <motion.div whileTap={{ scale: 0.94 }}>
            <Button
              variant="outline"
              size="lg"
              onClick={handleReroll}
              disabled={completed}
              aria-label="다른 미션 보기"
              className="w-full px-3"
            >
              <Dices className="h-5 w-5" />
              <span>다른 미션 보기</span>
            </Button>
          </motion.div>
        </div>
        {completed && (
          <p className="text-success mt-3 text-center text-xs font-extrabold">
            내일 새로운 미션으로 다시 만나요
          </p>
        )}
      </div>

      <AnimatePresence>
        {celebrating && (
          <motion.div
            className="absolute inset-0 z-10 flex items-center justify-center bg-white/72 backdrop-blur-sm dark:bg-black/55"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="text-center"
              initial={{ scale: 0.4, rotate: -12 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0.7, opacity: 0 }}
              transition={{ type: "spring", stiffness: 280, damping: 16 }}
            >
              <div className="bg-success mx-auto flex h-20 w-20 items-center justify-center rounded-full text-white shadow-xl">
                <Check className="h-10 w-10" strokeWidth={3} />
              </div>
              <p className="text-ink mt-3 font-black">오늘도 따뜻함 +1</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
