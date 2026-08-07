import type { AiSmileIdea } from "@/types/daily-activity";

const DUMMY_AI_IDEAS = [
  "{상대}, 오늘도 제 편이 되어줘서 고마워요. 덕분에 저는 참 든든하고 행복해요. 😊",
  "{상대}, 웃는 모습이 제일 예쁜 거 알고 계세요? 오늘은 제가 더 많이 웃게 해드릴게요!",
  "{상대}, 오늘의 최고 멋진 사람 상을 드립니다! 이유는 그냥 존재만으로 힘이 되어주기 때문이에요. 🏆",
  "{상대}, 혹시 피곤함이 말을 걸면 전해 주세요. 제가 오늘 웃음으로 혼내주겠다고요! 😄",
  "{상대}, 함께했던 순간을 떠올리니 저도 모르게 웃게 돼요. 앞으로도 재미있는 추억 많이 만들어요.",
  "{상대}, 오늘 하루도 정말 수고했어요. 지금 이 순간만큼은 걱정을 내려놓고 환하게 웃어도 좋아요.",
  "{상대}, 제 하루에 따뜻함을 더해주는 사람이 바로 당신이에요. 늘 고맙고 많이 아껴요. 💛",
  "{상대}, 긴급 속보입니다! 오늘도 당신의 다정함 덕분에 주변 사람들의 행복 지수가 올라갔습니다. 📢",
  "{상대}, 맛있는 것 먹고 재미있는 이야기 나누면서 오늘의 피곤함을 함께 웃어넘겨요!",
  "{상대}, 오늘 거울을 보면 꼭 웃어주세요. 제가 좋아하는 멋진 사람이 바로 거기 있으니까요. ✨",
] as const;

function wait(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

/**
 * Dummy AI boundary for STEP 2.
 * TODO: Replace only this function body with a secure server-side OpenAI API call.
 */
export async function recommendSmileIdea(
  audience: string,
  previousIdeaId?: string,
): Promise<AiSmileIdea> {
  await wait(650);

  const candidates = DUMMY_AI_IDEAS.map((message, index) => ({
    id: `dummy-ai-${index + 1}`,
    message,
  })).filter((idea) => idea.id !== previousIdeaId);
  const idea = candidates[Math.floor(Math.random() * candidates.length)];
  const subject = audience.trim() || "그 사람";

  return {
    ...idea,
    message: idea.message.replace("{상대}", subject),
  };
}

export const AI_DUMMY_IDEA_COUNT = DUMMY_AI_IDEAS.length;
