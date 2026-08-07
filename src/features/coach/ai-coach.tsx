"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bot, Copy, Sparkles } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { copyText } from "@/lib/clipboard";
import { getLocalDateKey } from "@/lib/date";
import { streamSmileCoach } from "@/services/ai";
import type { CoachCategory } from "@/types/ai-coach";

const categories: Array<{ id: CoachCategory; label: string; emoji: string }> = [
  { id: "praise", label: "칭찬", emoji: "✨" },
  { id: "thanks", label: "감사", emoji: "💛" },
  { id: "support", label: "격려", emoji: "🌱" },
  { id: "joke", label: "농담", emoji: "😄" },
  { id: "idea", label: "아이디어", emoji: "💡" },
];

const GUEST_USAGE_KEY = "make-one-smile:guest-ai-usage:v1";

function useGuestQuota() {
  const { status } = useSession();
  const [used, setUsed] = useState(() => {
    if (typeof window === "undefined") return 0;
    try {
      const value: unknown = JSON.parse(
        window.localStorage.getItem(GUEST_USAGE_KEY) ?? "null",
      );
      if (
        typeof value === "object" &&
        value !== null &&
        (value as Record<string, unknown>).date === getLocalDateKey()
      ) {
        return Number((value as Record<string, unknown>).count) || 0;
      }
    } catch {}
    return 0;
  });
  const consume = () => {
    if (status === "authenticated") return true;
    if (used >= 3) return false;
    const next = used + 1;
    setUsed(next);
    window.localStorage.setItem(
      GUEST_USAGE_KEY,
      JSON.stringify({ date: getLocalDateKey(), count: next }),
    );
    return true;
  };
  return {
    remaining: status === "authenticated" ? null : Math.max(0, 3 - used),
    consume,
  };
}

export function AiCoach() {
  const { data: session } = useSession();
  const [audience, setAudience] = useState("부모님");
  const [situation, setSituation] = useState("");
  const [category, setCategory] = useState<CoachCategory>("praise");
  const [answer, setAnswer] = useState("");
  const [mode, setMode] = useState<"openai" | "local" | null>(null);
  const [loading, setLoading] = useState(false);
  const quota = useGuestQuota();

  const generate = async () => {
    if (situation.trim().length < 2) {
      toast.error("상황을 두 글자 이상 알려주세요");
      return;
    }
    if (session?.user.plan !== "premium" && !quota.consume()) {
      toast.error("오늘의 무료 추천 3회를 모두 사용했어요");
      return;
    }
    setLoading(true);
    setAnswer("");
    try {
      const result = await streamSmileCoach({ audience, situation, category });
      setMode(result.mode);
      for await (const chunk of result.stream)
        setAnswer((current) => current + chunk);
    } catch (error) {
      toast.error(
        error instanceof Error && error.message === "DAILY_LIMIT"
          ? "오늘의 무료 추천 3회를 모두 사용했어요"
          : "추천을 불러오지 못했어요",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eee7ff] dark:bg-[#493d60]">
          <Bot className="h-6 w-6 text-[#8067bd]" />
        </span>
        <div>
          <p className="text-muted text-xs font-bold">상황을 이해하는</p>
          <h1 className="text-xl font-black">AI 웃음 코치</h1>
        </div>
      </div>
      <div
        className="grid grid-cols-5 gap-1.5"
        role="group"
        aria-label="추천 종류"
      >
        {categories.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={category === item.id}
            onClick={() => setCategory(item.id)}
            className={`rounded-2xl px-1 py-3 text-[10px] font-black ${category === item.id ? "bg-primary text-[#333]" : "bg-surface border"}`}
          >
            <span className="block text-lg">{item.emoji}</span>
            {item.label}
          </button>
        ))}
      </div>
      <label className="text-xs font-black">
        누구에게 전하나요?
        <input
          value={audience}
          maxLength={60}
          onChange={(event) => setAudience(event.target.value)}
          className="bg-surface mt-2 h-12 w-full rounded-2xl border px-4 text-sm font-bold outline-none"
        />
      </label>
      <label className="text-xs font-black">
        어떤 상황인가요?
        <textarea
          value={situation}
          maxLength={300}
          onChange={(event) => setSituation(event.target.value)}
          placeholder="예: 오랜만에 부모님과 저녁을 먹었어요"
          className="bg-surface mt-2 min-h-28 w-full resize-none rounded-2xl border p-4 text-sm leading-6 font-semibold outline-none"
        />
      </label>
      <Button
        className="w-full"
        size="lg"
        onClick={() => void generate()}
        disabled={loading}
      >
        <Sparkles className="h-4 w-4" />{" "}
        {loading ? "다정한 문장을 만들고 있어요…" : "웃음 아이디어 받기"}
      </Button>
      {session?.user.plan !== "premium" && (
        <p className="text-muted text-center text-[10px] font-bold">
          무료 추천{" "}
          {quota.remaining === null
            ? "하루 3회"
            : `오늘 ${quota.remaining}회 남음`}{" "}
          · Premium은 무제한
        </p>
      )}
      <AnimatePresence>
        {answer && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[2rem] border border-[#d9ccf6] bg-[#eee7ff] p-5 text-[#493d60] dark:border-white/15 dark:bg-[#493d60] dark:text-[#f5efff]"
          >
            <p className="text-xs font-black">
              {mode === "openai" ? "AI가 만든 추천" : "무료 스마트 추천"}
            </p>
            <p
              aria-live="polite"
              className="mt-3 text-base leading-7 font-bold"
            >
              {answer}
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() =>
                void copyText(answer).then(() =>
                  toast.success("추천 문구를 복사했어요"),
                )
              }
            >
              <Copy className="h-4 w-4" /> 복사하기
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
