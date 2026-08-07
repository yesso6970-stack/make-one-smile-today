"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bot, SendHorizontal, Sparkles } from "lucide-react";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { recommendSmileIdea } from "@/services/ai";
import type { AiSmileIdea } from "@/types/daily-activity";

export function AiSmileIdeas() {
  const [audience, setAudience] = useState("");
  const [idea, setIdea] = useState<AiSmileIdea | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!audience.trim()) {
      toast.error("누구를 웃게 하고 싶은지 알려주세요.");
      return;
    }

    setIsLoading(true);
    try {
      const nextIdea = await recommendSmileIdea(audience, idea?.id);
      setIdea(nextIdea);
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

      <form className="mt-4 flex gap-2" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="smile-audience">
          웃게 하고 싶은 사람
        </label>
        <input
          id="smile-audience"
          value={audience}
          onChange={(event) => setAudience(event.target.value)}
          placeholder="예: 60대 부모님"
          maxLength={40}
          className="border-border bg-surface text-ink placeholder:text-muted/60 min-w-0 flex-1 rounded-2xl border px-4 text-sm font-semibold outline-none focus:ring-2 focus:ring-[#9b84cf]/40"
        />
        <Button type="submit" disabled={isLoading} className="px-4">
          <SendHorizontal className="h-4 w-4" />
          <span className="sr-only">AI 추천받기</span>
          추천
        </Button>
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
              key={idea.id}
              className="relative rounded-[1.5rem] bg-[#eee7ff] px-5 py-4 text-sm leading-6 font-semibold text-[#493d60] dark:bg-[#493d60] dark:text-[#f5efff]"
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, x: -10 }}
            >
              <Sparkles className="mb-2 h-4 w-4" aria-hidden="true" />
              {idea.message}
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
