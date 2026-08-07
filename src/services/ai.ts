import type { AiSmileIdea } from "@/types/daily-activity";

const DUMMY_AI_IDEAS = [
  "예전 사진 한 장을 함께 보며 그때 가장 웃겼던 순간을 물어보세요.",
  "상대의 장점을 뉴스 속보처럼 진지한 목소리로 발표해보세요.",
  "좋아하는 간식에 짧은 칭찬 메모를 붙여 깜짝 선물해보세요.",
  "둘만 아는 유행어를 귀여운 이모지 세 개와 함께 보내보세요.",
  "오늘 고마웠던 일을 아주 구체적으로 한 문장에 담아보세요.",
  "상대가 주인공인 10초짜리 응원 구호를 만들어 외쳐보세요.",
  "미래의 행복한 하루를 상상하며 짧고 엉뚱한 예고편을 들려주세요.",
  "상대의 말투를 다정하게 따라 하며 칭찬 한마디를 건네보세요.",
  "지금 가장 듣고 싶은 노래를 물어보고 함께 한 소절 흥얼거려보세요.",
  "오늘의 수고를 상으로 표현해 재미있는 상장 제목을 만들어주세요.",
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
    message: `${subject}에게 이렇게 해보세요. ${idea.message}`,
  };
}

export const AI_DUMMY_IDEA_COUNT = DUMMY_AI_IDEAS.length;
