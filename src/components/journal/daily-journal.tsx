"use client";

import { motion } from "framer-motion";
import {
  CheckCircle2,
  Cloud,
  CloudOff,
  LoaderCircle,
  PencilLine,
  Save,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useDailyActivity } from "@/hooks/use-daily-activity";

const MAX_LENGTH = 200;

export function DailyJournal() {
  const { state, todayJournal, saveJournal, hydrated, journalSyncStatus } =
    useDailyActivity();
  const [draft, setDraft] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const latestDraftRef = useRef("");

  const recentEntries = useMemo(
    () =>
      Object.entries(state.journalByDate)
        .filter(([, content]) => content.trim().length > 0)
        .sort(([left], [right]) => right.localeCompare(left))
        .slice(0, 5),
    [state.journalByDate],
  );

  useEffect(() => {
    if (isDirty) return;
    setDraft(todayJournal);
    latestDraftRef.current = todayJournal;
  }, [isDirty, todayJournal]);

  useEffect(() => {
    const normalized = draft.trim();
    if (!hydrated || !isDirty || !normalized || normalized === todayJournal) {
      return;
    }

    const timer = window.setTimeout(() => {
      void saveJournal(normalized).then((synced) => {
        if (synced && latestDraftRef.current.trim() === normalized) {
          setIsDirty(false);
        }
      });
    }, 900);
    return () => window.clearTimeout(timer);
  }, [draft, hydrated, isDirty, saveJournal, todayJournal]);

  const handleSave = async () => {
    const synced = await saveJournal(draft);
    if (synced) {
      setIsDirty(false);
      toast.success(
        todayJournal ? "오늘의 기록을 수정했어요" : "오늘을 기록했어요",
        { description: "나만의 칭찬 일지에 바로 반영됐어요." },
      );
      return;
    }
    toast.warning("이 기기에 먼저 저장했어요", {
      description: "인터넷이 연결되면 Neon 일지와 다시 동기화해요.",
    });
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
          <p className="text-muted text-xs font-bold">오늘의 다정함을 모으는</p>
          <h2 id="journal-title" className="text-ink text-lg font-black">
            나만의 칭찬 일지
          </h2>
        </div>
      </div>

      <textarea
        className="text-ink placeholder:text-muted/60 mt-4 min-h-28 w-full resize-none bg-transparent px-1 py-2 text-sm leading-7 font-semibold outline-none"
        value={draft}
        maxLength={MAX_LENGTH}
        disabled={!hydrated}
        onChange={(event) => {
          setDraft(event.target.value);
          latestDraftRef.current = event.target.value;
          setIsDirty(true);
        }}
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
          disabled={!hydrated || !draft.trim() || !isDirty}
        >
          <Save className="h-3.5 w-3.5" />
          지금 저장
        </Button>
      </div>
      <div className="text-muted relative mt-4 flex items-start gap-2 rounded-xl bg-white/55 px-3 py-2 text-[10px] leading-4 font-semibold dark:bg-white/5">
        <JournalSyncIcon status={journalSyncStatus} />
        <span>{getSyncMessage(journalSyncStatus, Boolean(todayJournal))}</span>
      </div>

      <div className="relative mt-5 border-t border-[#e8dfc9] pt-4 dark:border-white/10">
        <p className="text-ink text-xs font-black">최근 칭찬 기록</p>
        {recentEntries.length > 0 ? (
          <div className="mt-2 space-y-2">
            {recentEntries.map(([date, content]) => (
              <article
                key={date}
                className="rounded-xl bg-white/60 px-3 py-2.5 dark:bg-white/5"
              >
                <time className="text-accent text-[10px] font-black">
                  {date}
                </time>
                <p className="text-ink mt-1 line-clamp-2 text-xs leading-5 font-semibold">
                  {content}
                </p>
              </article>
            ))}
          </div>
        ) : (
          <p className="text-muted mt-2 text-xs font-semibold">
            첫 칭찬 기록을 남기면 이곳에 차곡차곡 모여요.
          </p>
        )}
      </div>
    </motion.section>
  );
}

function JournalSyncIcon({
  status,
}: {
  status: "idle" | "saving" | "saved" | "offline";
}) {
  if (status === "saving") {
    return (
      <LoaderCircle className="text-accent mt-0.5 h-3.5 w-3.5 shrink-0 animate-spin" />
    );
  }
  if (status === "offline") {
    return <CloudOff className="text-muted mt-0.5 h-3.5 w-3.5 shrink-0" />;
  }
  if (status === "saved") {
    return (
      <CheckCircle2 className="text-success mt-0.5 h-3.5 w-3.5 shrink-0" />
    );
  }
  return <Cloud className="text-accent mt-0.5 h-3.5 w-3.5 shrink-0" />;
}

function getSyncMessage(
  status: "idle" | "saving" | "saved" | "offline",
  hasEntry: boolean,
): string {
  if (status === "saving")
    return "수정 내용을 나만의 일지에 자동 저장하고 있어요.";
  if (status === "offline") {
    return "오프라인이라 이 기기에 먼저 저장했어요. 연결되면 자동 동기화해요.";
  }
  if (status === "saved" && hasEntry) {
    return "자동 저장됨 · 이 기기의 익명 일지로 Neon에 안전하게 분리 저장돼요.";
  }
  return "입력 후 잠시 멈추면 자동 저장돼요. 로그인 전에는 이 기기에서만 내 일지를 불러와요.";
}
