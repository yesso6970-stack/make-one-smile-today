"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Quote } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import type { SmileCardData } from "@/types";

interface SmileCardProps {
  card: SmileCardData;
}

export function SmileCard({ card }: SmileCardProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.article
      className={`relative z-10 flex min-h-[340px] w-full flex-col overflow-hidden rounded-[2rem] bg-gradient-to-br ${card.gradient} shadow-warm p-6 text-[#333333]`}
      initial={{ rotateY: -90, opacity: 0, scale: 0.94 }}
      animate={{ rotateY: 0, opacity: 1, scale: 1 }}
      exit={{ rotateY: 90, opacity: 0, scale: 0.94 }}
      transition={{ duration: 0.38, ease: [0.2, 0.8, 0.2, 1] }}
    >
      <div
        className="absolute -top-12 -right-12 h-40 w-40 rounded-full bg-white/30"
        aria-hidden="true"
      />
      <div
        className="absolute -bottom-16 -left-12 h-40 w-40 rounded-full bg-white/20"
        aria-hidden="true"
      />
      <div className="relative flex items-center justify-between">
        <Badge className="bg-white/65 text-[#333333]">{card.category}</Badge>
        <Quote className="h-6 w-6 fill-white/40 text-white/40" />
      </div>
      <div className="relative flex flex-1 flex-col items-center justify-center text-center">
        <motion.span
          className="text-6xl drop-shadow-sm"
          initial={{ scale: 0.6 }}
          animate={
            reduceMotion
              ? { scale: 1 }
              : { scale: [1, 1.1, 1], rotate: [0, -4, 4, 0] }
          }
          transition={{
            delay: 0.18,
            duration: 1.4,
            ease: "easeInOut",
            repeat: reduceMotion ? 0 : Infinity,
            repeatDelay: 2.2,
          }}
        >
          {card.emoji}
        </motion.span>
        <p className="mt-5 text-xs font-extrabold tracking-wide text-[#333333]/55">
          {card.eyebrow}
        </p>
        <h1 className="mt-3 text-xl leading-[1.55] font-black tracking-[-0.035em] whitespace-pre-line">
          {card.message}
        </h1>
      </div>
      <p className="relative rounded-2xl bg-white/55 px-4 py-3 text-center text-xs font-bold text-[#333333]/70 backdrop-blur-sm">
        💡 {card.prompt}
      </p>
    </motion.article>
  );
}
