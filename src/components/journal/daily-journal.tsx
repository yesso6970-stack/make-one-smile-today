"use client";

import { motion } from "framer-motion";
import { CheckCircle2, HardDrive, PencilLine, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useDailyActivity } from "@/hooks/use-daily-activity";

const MAX_LENGTH = 200;

export function DailyJournal() {
  const { todayJournal, saveJournal, hydrated } = useDailyActivity();
  const [draft, setDraft] = useState("");

  useEffect(() => setDraft(todayJournal), [todayJournal]);

  const handleSave = () => {
    saveJournal(draft);
    toast.success(
      todayJournal ? "오늘의 기록을 수정했어요" : "오늘을 기록했어요",
      {
        description: "다정했던 순간은 오래 기억될 거예요.",
      },
    );
  };

  return (
    <motion.section
      className="journal-paper shadow-warm relative overflow-hidden rounded-[2rem] border border-[#e8dfc9] p-5 dark:border-white/10"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      aria-labelledby="journal-title"
    >
      <div className="relative flex items-center gap-3">
        <span className="bg-primary/45 flex h-10 w-10 items-center justify-center rounded-2xl">
          <PencilLine className="text-accent h-5 w-5" />
        </span>
        <div>
          <p className="text-muted text-xs font-bold">마음에 남은 한 장면</p>
          <h2 id="journal-title" className="text-ink text-lg font-black">
            오늘 누구를 웃게 했나요?
          </h2>
        </div>
      </div>

      <textarea
        className="text-ink placeholder:text-muted/60 mt-4 min-h-28 w-full resize-none bg-transparent px-1 py-2 text-sm leading-7 font-semibold outline-none"
        value={draft}
        maxLength={MAX_LENGTH}
        disabled={!hydrated}
        onChange={(event) => setDraft(event.target.value)}
        placeholder="예: 지친 친구에게 진심으로 잘하고 있다고 말해줬더니 환하게 웃었다."
        aria-label="오늘의 웃음 기록"
      />
      <div className="relative mt-2 flex items-center justify-between">
        <span className="text-muted text-[11px] font-bold tabular-nums">
          {draft.length}/{MAX_LENGTH}
        </span>
        <Button
          size="sm"
          onClick={handleSave}
          disabled={!hydrated || draft.trim() === todayJournal}
        >
          <Save className="h-3.5 w-3.5" />
          {todayJournal ? "수정 저장" : "기록 저장"}
        </Button>
      </div>
      <div className="text-muted relative mt-4 flex items-start gap-2 rounded-xl bg-white/55 px-3 py-2 text-[10px] leading-4 font-semibold dark:bg-white/5">
        {todayJournal ? (
          <CheckCircle2 className="text-success mt-0.5 h-3.5 w-3.5 shrink-0" />
        ) : (
          <HardDrive className="text-accent mt-0.5 h-3.5 w-3.5 shrink-0" />
        )}
        <span>
          {todayJournal
            ? "오늘 기록이 저장됐어요. 웃음 챌린더에서 오늘 날짜를 누르면 다시 볼 수 있어요."
            : "기록은 이 브라우저에 안전하게 저장되며, 저장 후 웃음 챌린더에서 다시 볼 수 있어요."}
        </span>
      </div>
    </motion.section>
  );
}
