"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

import { useDailyQuote } from "@/hooks/use-daily-quote";

export function DailyQuoteCard() {
  const { quote } = useDailyQuote();

  return (
    <motion.figure
      className="shadow-warm relative overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,#fff1b8,#ffd765)] p-6 text-[#333] dark:bg-[linear-gradient(135deg,#564a22,#806820)] dark:text-white"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
    >
      <Quote
        className="absolute -top-2 -right-2 h-24 w-24 text-white/30"
        aria-hidden="true"
      />
      <figcaption className="text-xs font-black text-[#8f6a00] dark:text-[#ffe28a]">
        오늘의 마음 한 줄
      </figcaption>
      <blockquote className="relative mt-4 text-lg leading-7 font-black tracking-[-0.02em]">
        “{quote.text}”
      </blockquote>
      <p className="mt-4 text-xs font-bold opacity-60">
        오늘 하루 동안 변하지 않는 문장이에요.
      </p>
    </motion.figure>
  );
}
