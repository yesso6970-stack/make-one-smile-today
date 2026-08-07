"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import { Card, CardContent } from "@/components/ui/card";
import type { SmileTarget } from "@/types";

interface TargetCardProps {
  target: SmileTarget;
  index: number;
}

export function TargetCard({ target, index }: TargetCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.055 }}
      whileHover={{ y: -4, scale: 1.015 }}
      whileTap={{ scale: 0.97 }}
    >
      <Link
        href={`/card?target=${target.id}`}
        aria-label={`${target.label}을 웃게 할 카드 고르기`}
      >
        <Card className="group shadow-warm h-[170px] overflow-hidden border-0 transition-shadow hover:shadow-xl">
          <CardContent className="relative flex h-full flex-col p-4">
            <div
              className="absolute -top-5 -right-6 h-20 w-20 rounded-full opacity-70"
              style={{ backgroundColor: target.color }}
              aria-hidden="true"
            />
            <motion.span
              className="relative flex h-12 w-12 items-center justify-center rounded-2xl text-2xl"
              style={{ backgroundColor: target.color }}
              aria-hidden="true"
              whileHover={{ rotate: [0, -10, 10, -6, 0], scale: 1.12 }}
              transition={{ duration: 0.45 }}
            >
              {target.emoji}
            </motion.span>
            <div className="mt-auto">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-extrabold">{target.label}</h2>
                <ArrowUpRight className="text-muted h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </div>
              <p className="text-muted mt-1 text-[11px] leading-relaxed font-medium">
                {target.description}
              </p>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
