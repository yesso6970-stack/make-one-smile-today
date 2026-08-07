"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Bot,
  Check,
  Copy,
  MessageCircleHeart,
  SendHorizontal,
} from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { copyText } from "@/lib/clipboard";
import { recommendSmileIdea } from "@/services/ai";
import type { AiSmileIdea, SmileRelationship } from "@/types/daily-activity";

type RelationshipSelection = SmileRelationship | "auto";

const RELATIONSHIP_LABELS: Record<SmileRelationship, string> = {
  senior: "윗사람께 · 존댓말",
  junior: "아랫사람에게 · 편한 말",
  peer: "친구에게 · 친근한 말",
};

export function AiSmileIdeas() {
  const [audience, setAudience] = useState("");
  const [idea, setIdea] = useState<AiSmileIdea | null>(null);
  const [relationship, setRelationship] =
    useState<RelationshipSelection>("auto");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIdeaId, setCopiedIdeaId] = useState<string | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!idea) return;
    resultRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [idea]);

  const handleCopy = async () => {
    if (!idea) return;
    const copied = await copyText(idea.message);
    if (!copied) {
      toast.error("복사하지 못했어요. 브라우저 권한을 확인해주세요.");
      return;
    }
    setCopiedIdeaId(idea.id);
    window.setTimeout(() => setCopiedIdeaId(null), 1600);
    toast.success("추천 문장만 복사했어요", {
      description: "메신저나 문자에 바로 붙여넣어 사용해보세요.",
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!audience.trim()) {
      toast.error("누구를 웃게 하고 싶은지 알려주세요.");
      return;
    }

    setIsLoading(true);
    try {
      const nextIdea = await recommendSmileIdea(
        audience,
        relationship,
        idea?.id,
      );
      setIdea(nextIdea);
      setCopiedIdeaId(null);
      toast.success("추천 문구가 도착했어요", {
        description: "아래 문장을 복사해서 바로 사용할 수 있어요.",
      });
    } catch {
      toast.error("아이디어를 준비하지 못했어요. 잠시 후 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.section
      className="shadow-warm overflow-hidden rounded-[2rem] border border-white/60 bg-[linear-gradient(145deg,rgba(255,255,255,.9),rgba(245,240,255,.82))] p-5 backdrop-blur-xl dark:border-white/10 dark:bg-[linear-gradient(145deg,rgba(34,33,28,.96),rgba(39,34,45,.9))]"
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      aria-labelledby="ai-idea-title"
    >
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#eee7ff] dark:bg-[#493d60]">
          <Bot className="h-5 w-5 text-[#8067bd]" aria-hidden="true" />
        </span>
        <div>
          <p className="text-muted text-xs font-bold">
            상대에게 꼭 맞는 한마디
          </p>
          <h2 id="ai-idea-title" className="text-ink text-lg font-black">
            AI 웃음 아이디어
          </h2>
        </div>
      </div>

      <form className="mt-4" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="smile-audience">
          웃게 하고 싶은 사람
        </label>
        <div className="flex gap-2">
          <input
            id="smile-audience"
            value={audience}
            onChange={(event) => {
              setAudience(event.target.value);
              setIdea(null);
            }}
            placeholder="예: 아들 예준, 어머니, 친구 민지"
            maxLength={40}
            className="border-border bg-surface text-ink placeholder:text-muted/60 min-w-0 flex-1 rounded-2xl border px-4 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#9b84cf]/40"
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="px-4"
            aria-label={idea ? "다른 문구 추천받기" : "AI 추천받기"}
          >
            <SendHorizontal className="h-4 w-4" />
            {idea ? "다시 추천" : "추천"}
          </Button>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <label
            htmlFor="smile-relationship"
            className="text-muted shrink-0 text-xs font-extrabold"
          >
            누구에게 보내나요?
          </label>
          <select
            id="smile-relationship"
            value={relationship}
            onChange={(event) => {
              setRelationship(event.target.value as RelationshipSelection);
              setIdea(null);
            }}
            className="border-border bg-surface text-ink min-w-0 flex-1 rounded-xl border px-3 py-2 text-xs font-bold outline-none focus:ring-2 focus:ring-[#9b84cf]/40"
          >
            <option value="auto">자동으로 말투 맞춤</option>
            <option value="senior">윗사람께 · 존댓말</option>
            <option value="junior">아랫사람에게 · 편한 말</option>
            <option value="peer">친구에게 · 친근한 말</option>
          </select>
        </div>
        <p className="text-muted mt-2 text-[10px] leading-4 font-semibold">
          이름이나 호칭만 입력하고 관계를 고르면 자연스러운 어법으로 만들어요.
        </p>
      </form>

      <div className="mt-4 min-h-24" aria-live="polite">
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              className="bg-surface-soft flex h-24 items-center gap-2 rounded-[1.5rem] px-5"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {[0, 1, 2].map((index) => (
                <motion.span
                  key={index}
                  className="bg-accent h-2 w-2 rounded-full"
                  animate={{ y: [0, -6, 0] }}
                  transition={{
                    duration: 0.7,
                    repeat: Infinity,
                    delay: index * 0.12,
                  }}
                />
              ))}
              <span className="text-muted ml-1 text-xs font-bold">
                다정한 아이디어를 고르고 있어요
              </span>
            </motion.div>
          ) : idea ? (
            <motion.div
              ref={resultRef}
              key={idea.id}
              className="relative rounded-[1.5rem] border border-[#d9ccf6] bg-[#eee7ff] px-5 py-4 text-[#493d60] shadow-[0_10px_24px_rgba(105,78,158,.12)] dark:border-white/15 dark:bg-[#493d60] dark:text-[#f5efff]"
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, x: -10 }}
              role="status"
            >
              <p className="flex items-center gap-1.5 text-xs font-black text-[#8067bd] dark:text-[#d9c8ff]">
                <MessageCircleHeart className="h-4 w-4" aria-hidden="true" />
                그대로 복사해 보내는 추천 문구
              </p>
              <span className="mt-2 inline-flex rounded-full bg-white/65 px-2.5 py-1 text-[10px] font-black text-[#8067bd] dark:bg-white/10 dark:text-[#dfd2ff]">
                {RELATIONSHIP_LABELS[idea.relationship]}
              </span>
              <blockquote className="mt-3 text-[15px] leading-7 font-bold">
                “{idea.message}”
              </blockquote>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCopy}
                className="mt-3 border-[#cfc0ef] bg-white/70 text-[#493d60] hover:bg-white dark:border-white/20 dark:bg-white/10 dark:text-white"
              >
                {copiedIdeaId === idea.id ? (
                  <Check className="h-3.5 w-3.5" />
                ) : (
                  <Copy className="h-3.5 w-3.5" />
                )}
                {copiedIdeaId === idea.id ? "복사했어요" : "추천 내용 복사"}
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              className="border-border text-muted flex h-24 items-center justify-center rounded-[1.5rem] border border-dashed px-6 text-center text-xs font-semibold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              대상을 알려주면 10가지 예시 중 어울리는 아이디어를 골라드려요.
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
