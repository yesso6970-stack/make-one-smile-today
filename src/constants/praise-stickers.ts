import type { PraiseStickerData } from "@/types";

export const PRAISE_STICKERS: readonly PraiseStickerData[] = [
  {
    id: "warm-heart",
    emoji: "💛",
    title: "따뜻한 마음상",
    message: "당신의 다정함이 오늘을 데웠어요.",
    gradient: "from-[#FFF1A8] to-[#FFD54F]",
  },
  {
    id: "smile-delivery",
    emoji: "😊",
    title: "미소 배달 완료",
    message: "행복을 직접 배달한 멋진 사람이에요.",
    gradient: "from-[#FFE3CD] to-[#FFBF91]",
  },
  {
    id: "courage-star",
    emoji: "⭐",
    title: "용기 반짝상",
    message: "먼저 다가간 용기에 별 하나를 드려요.",
    gradient: "from-[#E9E3FF] to-[#C9BCFF]",
  },
  {
    id: "kindness-hero",
    emoji: "🦸",
    title: "다정함 히어로",
    message: "오늘 세상을 구한 건 작은 웃음이었어요.",
    gradient: "from-[#DDF3FF] to-[#A9DDF7]",
  },
  {
    id: "happy-virus",
    emoji: "🌈",
    title: "행복 전파상",
    message: "좋은 기분을 멀리 퍼뜨리는 재능이 있어요.",
    gradient: "from-[#E1F6E8] to-[#AFE1BF]",
  },
  {
    id: "today-mvp",
    emoji: "🏆",
    title: "오늘의 미소 MVP",
    message: "누군가의 하루에 가장 좋은 장면을 만들었어요.",
    gradient: "from-[#FFF0C8] to-[#FFC96B]",
  },
] as const;
