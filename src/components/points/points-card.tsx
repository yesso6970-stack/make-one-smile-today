"use client";

import { motion } from "framer-motion";
import { Flame, Sparkles, Trophy } from "lucide-react";

import { usePointsProgress } from "@/hooks/use-points-progress";

export function PointsCard() {
  const { points, streak, completedDays, nextBadge, progress } =
    usePointsProgress();

  return (
    <motion.section
      className="shadow-warm rounded-[2rem] border border-white/60 bg-white/80 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/5"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.08 }}
      aria-label="나의 웃음 포인트"
    >
      <div className="grid grid-cols-3 gap-2">
        <Stat
          icon={<Sparkles className="h-4 w-4" />}
          label="포인트"
          value={`${points}P`}
        />
        <Stat
          icon={<Flame className="h-4 w-4" />}
          label="연속"
          value={`${streak}일`}
        />
        <Stat
          icon={<Trophy className="h-4 w-4" />}
          label="완료"
          value={`${completedDays}회`}
        />
      </div>

      {nextBadge ? (
        <div className="mt-5">
          <div className="text-muted flex justify-between text-[11px] font-bold">
            <span>다음 배지: {nextBadge.title}</span>
            <span>
              {completedDays}/{nextBadge.requiredDays}일
            </span>
          </div>
          <div className="bg-surface-soft mt-2 h-2 overflow-hidden rounded-full">
            <motion.div
              className="from-accent to-primary h-full rounded-full bg-gradient-to-r"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            />
          </div>
        </div>
      ) : (
        <p className="text-success mt-4 text-center text-xs font-black">
          모든 배지를 모았어요! 정말 멋져요.
        </p>
      )}
    </motion.section>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-surface-soft rounded-2xl px-2 py-3 text-center">
      <span
        className="text-accent mx-auto flex w-fit items-center justify-center"
        aria-hidden="true"
      >
        {icon}
      </span>
      <strong className="text-ink mt-1 block text-base font-black tabular-nums">
        {value}
      </strong>
      <span className="text-muted block text-[10px] font-bold">{label}</span>
    </div>
  );
}
