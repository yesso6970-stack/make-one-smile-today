import type { SmileTarget } from "@/types";

export const TARGETS: readonly SmileTarget[] = [
  {
    id: "family",
    label: "가족",
    emoji: "👨‍👩‍👧",
    description: "가장 가까운 우리 편",
    color: "#FFF3C4",
  },
  {
    id: "friend",
    label: "친구",
    emoji: "👩",
    description: "생각만 해도 편한 사이",
    color: "#FFE8D7",
  },
  {
    id: "lover",
    label: "연인",
    emoji: "❤️",
    description: "마음을 나누는 사람",
    color: "#FFE1E5",
  },
  {
    id: "coworker",
    label: "직장동료",
    emoji: "💼",
    description: "오늘도 함께 힘내는 사이",
    color: "#E7EEFF",
  },
  {
    id: "stranger",
    label: "모르는 사람",
    emoji: "😊",
    description: "우연히 마주친 누군가",
    color: "#E4F6EB",
  },
  {
    id: "random",
    label: "랜덤",
    emoji: "🎲",
    description: "오늘의 운명에게 맡기기",
    color: "#EFE7FF",
  },
] as const;
