"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

import { TargetCard } from "@/components/cards/target-card";
import { AppShell } from "@/components/layout/app-shell";
import { BottomNavigation } from "@/components/layout/bottom-navigation";
import { Header } from "@/components/layout/header";
import { TARGETS } from "@/constants/targets";

export default function TargetPage() {
  return (
    <AppShell>
      <Header title="누구를 웃게 할까요?" showBack />
      <main className="flex-1 px-5 pt-7 pb-28">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="mb-7">
            <div className="text-accent mb-2 flex items-center gap-2 text-xs font-bold">
              <Sparkles className="h-4 w-4" /> TODAY&apos;S SMILE
            </div>
            <h1 className="text-[1.7rem] leading-tight font-black tracking-[-0.04em]">
              오늘 떠오르는 한 사람을
              <br />
              골라주세요
            </h1>
            <p className="text-muted mt-2 text-sm font-medium">
              작은 선택이 누군가의 하루를 바꿀 수 있어요.
            </p>
          </div>
          <section
            className="grid grid-cols-2 gap-3"
            aria-label="웃게 할 사람 선택"
          >
            {TARGETS.map((target, index) => (
              <TargetCard key={target.id} target={target} index={index} />
            ))}
          </section>
        </motion.div>
      </main>
      <BottomNavigation active="target" />
    </AppShell>
  );
}
