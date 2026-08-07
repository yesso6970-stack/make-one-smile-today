export type TargetId =
  "family" | "friend" | "lover" | "coworker" | "stranger" | "random";

export interface SmileTarget {
  id: TargetId;
  label: string;
  emoji: string;
  description: string;
  color: string;
}

export type SmileCardCategory = "유머" | "칭찬" | "응원" | "미션" | "농담";

export interface SmileCardData {
  id: string;
  targetIds: readonly TargetId[];
  category: SmileCardCategory;
  emoji: string;
  eyebrow: string;
  message: string;
  prompt: string;
  gradient: string;
}

export interface PraiseStickerData {
  id: string;
  emoji: string;
  title: string;
  message: string;
  gradient: string;
}
