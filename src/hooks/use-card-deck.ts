"use client";

import { useCallback, useState } from "react";

import type { SmileCardData } from "@/types";

export function useCardDeck(cards: readonly SmileCardData[], initialIndex = 0) {
  const [currentIndex, setCurrentIndex] = useState(() =>
    cards.length > 0 ? initialIndex % cards.length : 0,
  );

  const drawNext = useCallback(() => {
    // 카드 번호가 1 → 2 → 3 순서로 진행되고, 마지막 다음에는 1로 돌아갑니다.
    setCurrentIndex((index) =>
      cards.length <= 1 ? 0 : (index + 1) % cards.length,
    );
  }, [cards.length]);

  return { card: cards[currentIndex], currentIndex, drawNext };
}
