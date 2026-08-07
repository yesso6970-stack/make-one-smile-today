export type CoachCategory = "praise" | "thanks" | "support" | "joke" | "idea";

export interface CoachRequest {
  situation: string;
  audience: string;
  category: CoachCategory;
}

export interface CoachStreamResult {
  stream: AsyncGenerator<string, void, undefined>;
  mode: "openai" | "local";
  remaining: number | null;
}
