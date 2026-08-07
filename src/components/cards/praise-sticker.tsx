"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import type { PraiseStickerData } from "@/types";

interface PraiseStickerProps {
  sticker: PraiseStickerData;
  compact?: boolean;
  className?: string;
}

export function PraiseSticker({
  sticker,
  compact = false,
  className,
}: PraiseStickerProps) {
  if (compact) {
    return (
      <motion.div
        className={cn(
          `flex h-12 w-12 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br ${sticker.gradient} text-2xl shadow-md`,
          className,
        )}
        initial={{ scale: 0, rotate: -18 }}
        animate={{ scale: 1, rotate: 0 }}
        whileHover={{ scale: 1.12, rotate: 7 }}
        transition={{ type: "spring", stiffness: 260, damping: 16 }}
        title={sticker.title}
      >
        {sticker.emoji}
      </motion.div>
    );
  }

  return (
    <motion.section
      className={cn(
        `relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br ${sticker.gradient} shadow-warm p-5 text-[#333333]`,
        className,
      )}
      initial={{ opacity: 0, scale: 0.55, rotate: -12, y: 24 }}
      animate={{ opacity: 1, scale: 1, rotate: 0, y: 0 }}
      transition={{ type: "spring", stiffness: 180, damping: 13, delay: 0.55 }}
      whileHover={{ rotate: 1.5, scale: 1.02 }}
    >
      <Sparkles className="absolute top-4 right-4 h-5 w-5 text-white/70" />
      <div className="flex items-center gap-4">
        <motion.div
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 border-white/80 bg-white/45 text-4xl shadow-sm"
          animate={{ rotate: [0, -7, 7, 0], scale: [1, 1.06, 1] }}
          transition={{
            duration: 1.8,
            delay: 1,
            repeat: Infinity,
            repeatDelay: 2.5,
          }}
        >
          {sticker.emoji}
        </motion.div>
        <div className="text-left">
          <p className="text-[10px] font-black tracking-[0.16em] text-[#333333]/50">
            오늘의 칭찬 스티커
          </p>
          <h2 className="mt-1 text-lg font-black tracking-tight">
            {sticker.title}
          </h2>
          <p className="mt-1 text-xs leading-relaxed font-bold text-[#333333]/65">
            {sticker.message}
          </p>
        </div>
      </div>
    </motion.section>
  );
}
