"use client";

import { motion } from "framer-motion";
import { LockKeyhole } from "lucide-react";

import { ACHIEVEMENT_BADGES } from "@/constants/badges";
import { usePointsProgress } from "@/hooks/use-points-progress";
import { cn } from "@/lib/utils";

export function BadgeShowcase() {
  const { unlockedBadgeIds } = usePointsProgress();

  return (
    <section
      className="shadow-warm rounded-[2rem] border border-white/60 bg-white/80 p-5 backdrop-blur-xl dark:border-white/10 dark:bg-white/5"
      aria-labelledby="badge-title"
    >
      <div>
        <p className="text-muted text-xs font-bold">다정함이 쌓일수록 빛나는</p>
        <h2 id="badge-title" className="text-ink text-lg font-black">
          나의 웃음 배지
        </h2>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3">
        {ACHIEVEMENT_BADGES.map((badge, index) => {
          const unlocked = unlockedBadgeIds.includes(badge.id);
          return (
            <motion.article
              key={badge.id}
              className={cn(
                "relative overflow-hidden rounded-2xl border p-4 text-center",
                unlocked
                  ? "border-primary/60 bg-primary/15"
                  : "border-border bg-surface-soft grayscale",
              )}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", delay: index * 0.06 }}
              viewport={{ once: true }}
            >
              {!unlocked && (
                <LockKeyhole
                  className="text-muted absolute top-2 right-2 h-3.5 w-3.5"
                  aria-label="아직 잠김"
                />
              )}
              <motion.span
                className="block text-4xl"
                animate={
                  unlocked
                    ? { rotate: [0, -8, 8, 0], scale: [1, 1.12, 1] }
                    : undefined
                }
                transition={{ duration: 0.8, delay: 0.2 + index * 0.06 }}
              >
                {badge.emoji}
              </motion.span>
              <strong className="text-ink mt-2 block text-sm font-black">
                {badge.title}
              </strong>
              <p className="text-muted mt-1 text-[10px] leading-4 font-semibold">
                {badge.description}
              </p>
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
