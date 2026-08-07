"use client";

import { motion, useReducedMotion } from "framer-motion";

const COLORS = ["#FFD54F", "#FFB300", "#4CAF50", "#FF8A80", "#8C9EFF"];
const PIECES = Array.from({ length: 34 }, (_, index) => ({
  id: index,
  left: `${(index * 37) % 100}%`,
  color: COLORS[index % COLORS.length],
  delay: (index % 11) * 0.08,
  duration: 2.4 + (index % 5) * 0.22,
  rotate: 180 + (index % 4) * 120,
}));

export function ConfettiEffect() {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return null;

  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden="true"
    >
      {PIECES.map((piece) => (
        <motion.span
          key={piece.id}
          className="absolute -top-5 h-3 w-2 rounded-[2px]"
          style={{ left: piece.left, backgroundColor: piece.color }}
          initial={{ y: -20, rotate: 0, opacity: 1 }}
          animate={{ y: "110vh", rotate: piece.rotate, opacity: [1, 1, 0] }}
          transition={{
            duration: piece.duration,
            delay: piece.delay,
            ease: "easeIn",
          }}
        />
      ))}
    </div>
  );
}
