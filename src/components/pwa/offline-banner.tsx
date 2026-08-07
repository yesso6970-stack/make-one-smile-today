"use client";

import { AnimatePresence, motion } from "framer-motion";
import { WifiOff } from "lucide-react";

import { useOnlineStatus } from "@/hooks/use-online-status";

export function OfflineBanner() {
  const isOnline = useOnlineStatus();
  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          role="status"
          aria-live="polite"
          className="fixed top-0 left-1/2 z-[70] flex w-full max-w-[480px] -translate-x-1/2 items-center justify-center gap-2 bg-[#333] px-4 py-2 text-xs font-bold text-white"
          initial={{ y: -48 }}
          animate={{ y: 0 }}
          exit={{ y: -48 }}
        >
          <WifiOff className="h-3.5 w-3.5" /> 오프라인 모드 · 저장된 내용으로
          이용 중
        </motion.div>
      )}
    </AnimatePresence>
  );
}
