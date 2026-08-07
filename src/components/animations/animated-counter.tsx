"use client";

import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { useEffect } from "react";

import { cn } from "@/lib/utils";

interface AnimatedCounterProps {
  value: number;
  className?: string;
}

export function AnimatedCounter({ value, className }: AnimatedCounterProps) {
  const count = useMotionValue(value);
  const displayValue = useTransform(count, (latest) =>
    Math.round(latest).toLocaleString("ko-KR"),
  );

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1],
    });
    return () => controls.stop();
  }, [count, value]);

  return (
    <motion.span className={cn("tabular-nums", className)}>
      {displayValue}
    </motion.span>
  );
}
