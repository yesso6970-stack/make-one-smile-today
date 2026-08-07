"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useActivityCalendar } from "@/hooks/use-activity-calendar";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

export function SmileCalendar() {
  const {
    monthKey,
    monthTitle,
    days,
    goPreviousMonth,
    goNextMonth,
    goToday,
    isCurrentMonth,
  } = useActivityCalendar();

  return (
    <Card className="shadow-warm overflow-hidden border-white/60 dark:border-white/10">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted text-xs font-bold">나의 따뜻한 발자국</p>
            <h2 className="text-ink mt-0.5 text-lg font-black">웃음 캘린더</h2>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={goPreviousMonth}
              aria-label="이전 달"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={goNextMonth}
              aria-label="다음 달"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-ink text-sm font-extrabold">{monthTitle}</p>
          {!isCurrentMonth && (
            <button
              className="text-accent text-xs font-extrabold"
              onClick={goToday}
              type="button"
            >
              오늘로
            </button>
          )}
        </div>

        <div className="mt-3 grid grid-cols-7 text-center text-[10px] font-bold text-[#9a958a]">
          {WEEKDAYS.map((weekday) => (
            <span key={weekday}>{weekday}</span>
          ))}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={monthKey}
            className="mt-2 grid grid-cols-7 gap-y-1"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            transition={{ duration: 0.22 }}
          >
            {days.map((day) => (
              <div
                key={day.dateKey}
                className="flex h-10 items-center justify-center"
                aria-label={`${day.dateKey}${day.isCompleted ? " 미션 완료" : ""}`}
              >
                <motion.span
                  className={cn(
                    "relative flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold",
                    !day.isCurrentMonth && "text-muted/30",
                    day.isCurrentMonth && "text-muted",
                    day.isToday &&
                      "ring-accent ring-2 ring-offset-1 ring-offset-[var(--surface)]",
                    day.isCompleted && "bg-primary text-base shadow-sm",
                  )}
                  initial={day.isCompleted ? { scale: 0.6 } : false}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 350, damping: 18 }}
                >
                  {day.isCompleted ? "😊" : day.day}
                </motion.span>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        <div className="bg-surface-soft text-muted mt-4 rounded-2xl px-4 py-3 text-center text-xs font-semibold">
          미션을 완료한 날마다 달력에 미소가 피어나요.
        </div>
      </CardContent>
    </Card>
  );
}
