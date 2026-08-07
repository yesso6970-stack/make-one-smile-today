"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  CalendarCheck2,
  ChevronLeft,
  ChevronRight,
  NotebookPen,
} from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useActivityCalendar } from "@/hooks/use-activity-calendar";
import { useDailyActivity } from "@/hooks/use-daily-activity";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["일", "월", "화", "수", "목", "금", "토"];

export function SmileCalendar() {
  const { state, todayKey } = useDailyActivity();
  const [selectedDate, setSelectedDate] = useState(todayKey);
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
            <h2 className="text-ink mt-0.5 flex items-center gap-1.5 text-lg font-black">
              <CalendarCheck2 className="text-accent h-5 w-5" /> 웃음 챌린더
            </h2>
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
              <button
                key={day.dateKey}
                className="flex h-10 items-center justify-center"
                aria-label={`${day.dateKey}${day.isCompleted ? " 미션 완료" : ""}`}
                type="button"
                onClick={() => setSelectedDate(day.dateKey)}
              >
                <motion.span
                  className={cn(
                    "relative flex h-9 w-9 items-center justify-center rounded-xl text-xs font-bold",
                    !day.isCurrentMonth && "text-muted/30",
                    day.isCurrentMonth && "text-muted",
                    day.isToday &&
                      "ring-accent ring-2 ring-offset-1 ring-offset-[var(--surface)]",
                    selectedDate === day.dateKey &&
                      !day.isToday &&
                      "ring-border ring-2",
                    day.isCompleted && "bg-primary text-base shadow-sm",
                  )}
                  initial={day.isCompleted ? { scale: 0.6 } : false}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 350, damping: 18 }}
                >
                  {day.isCompleted ? "😊" : day.day}
                </motion.span>
              </button>
            ))}
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedDate}
            className="bg-surface-soft text-muted mt-4 rounded-2xl px-4 py-3 text-xs font-semibold"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <p className="text-ink flex items-center gap-1.5 font-extrabold">
              <NotebookPen className="text-accent h-3.5 w-3.5" />
              {selectedDate}의 기록
            </p>
            <p className="mt-1.5 leading-5">
              {state.journalByDate[selectedDate] ||
                (state.completedDates.includes(selectedDate)
                  ? "😊 웃음 챌린지를 완료한 날이에요."
                  : "아직 저장된 기록이 없어요.")}
            </p>
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
