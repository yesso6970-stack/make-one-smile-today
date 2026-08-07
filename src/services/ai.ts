import type { AiSmileIdea, SmileRelationship } from "@/types/daily-activity";
import type { CoachRequest, CoachStreamResult } from "@/types/ai-coach";
import { getOrCreateDeviceId } from "@/lib/device-id";

type MessageTemplate = Record<SmileRelationship, string>;

const DUMMY_AI_IDEAS: readonly MessageTemplate[] = [
  {
    senior:
      "{상대}, 함께해 주셔서 정말 감사해요. 덕분에 오래 기억하고 싶은 행복한 시간이 되었어요. 😊",
    junior:
      "{상대}! 함께해 줘서 정말 고마워. 네 덕분에 오래 기억하고 싶은 행복한 시간이 됐어. 😊",
    peer: "{상대}, 함께해 줘서 진짜 고마워! 네 덕분에 오래 기억할 행복한 추억이 하나 더 생겼어. 😊",
  },
  {
    senior:
      "{상대}, 환하게 웃으시는 모습이 참 보기 좋아요. 오늘도 기분 좋은 일이 가득하시길 바라요.",
    junior:
      "{상대}! 네가 환하게 웃는 모습을 보면 나도 참 행복해. 오늘도 많이 웃는 하루 보내자!",
    peer: "{상대}, 네가 환하게 웃으면 나까지 기분이 좋아져! 오늘도 우리 많이 웃자.",
  },
  {
    senior:
      "{상대}, 늘 따뜻하게 챙겨 주셔서 감사해요. 저도 그 마음 잊지 않고 더 잘할게요. 💛",
    junior:
      "{상대}! 늘 따뜻한 마음을 보여 줘서 고마워. 나도 언제나 네 편이 되어 줄게. 💛",
    peer: "{상대}, 늘 내 편이 되어 줘서 고마워. 나도 언제든 든든한 네 편이 되어 줄게! 💛",
  },
  {
    senior:
      "{상대}, 오늘도 정말 수고 많으셨어요. 잠시 걱정을 내려놓고 편안하게 쉬셨으면 좋겠어요.",
    junior:
      "{상대}! 오늘도 정말 수고했어. 이제 걱정은 잠깐 내려놓고 마음 편히 쉬어도 돼.",
    peer: "{상대}, 오늘도 고생 많았어! 이제 걱정은 잠깐 내려놓고 푹 쉬자.",
  },
  {
    senior:
      "{상대}, 곁에 계셔 주시는 것만으로도 큰 힘이 돼요. 늘 감사하고 많이 존경해요.",
    junior:
      "{상대}! 네가 곁에 있어 주는 것만으로도 큰 힘이 돼. 늘 고맙고 많이 아껴.",
    peer: "{상대}, 네가 곁에 있어 줘서 얼마나 든든한지 몰라. 늘 고맙고 많이 아낀다!",
  },
  {
    senior:
      "{상대}, 오늘의 멋진 분으로 선정되셨어요! 늘 주변을 따뜻하게 만들어 주시는 덕분이에요. 🏆",
    junior:
      "{상대}! 오늘의 멋진 사람으로 선정됐어! 네가 주변을 환하게 만들어 주기 때문이야. 🏆",
    peer: "{상대}, 오늘의 최고 멋진 사람은 바로 너야! 이건 만장일치니까 이의 신청은 안 받아. 🏆",
  },
  {
    senior:
      "{상대}, 함께 나눈 이야기를 떠올리니 절로 미소가 나요. 앞으로도 좋은 추억 많이 만들어요.",
    junior:
      "{상대}! 함께 나눈 이야기를 떠올리면 절로 웃음이 나. 앞으로도 재미있는 추억 많이 만들자.",
    peer: "{상대}, 우리 같이 웃었던 일 생각하니까 또 웃음이 난다. 앞으로도 재미있는 추억 많이 만들자!",
  },
  {
    senior:
      "{상대}, 오늘도 건강하고 행복하게 지내세요. 웃으실 일이 하나 더 생기도록 제가 응원할게요. ✨",
    junior:
      "{상대}! 오늘도 건강하고 행복하게 지내자. 네가 웃을 일이 더 많아지도록 늘 응원할게. ✨",
    peer: "{상대}, 오늘도 건강하고 행복하자! 네가 웃을 일이 더 많아지도록 내가 열심히 응원할게. ✨",
  },
  {
    senior:
      "{상대}, 좋은 시간을 선물해 주셔서 감사해요. 다음에는 제가 더 즐거운 시간을 만들어 드릴게요.",
    junior:
      "{상대}! 좋은 시간을 함께 만들어 줘서 고마워. 다음에는 내가 더 재미있게 해 줄게!",
    peer: "{상대}, 즐거운 시간 만들어 줘서 고마워! 다음번 웃음 담당은 내가 맡을게.",
  },
  {
    senior:
      "{상대}, 언제나 배울 점이 참 많으세요. 오늘도 따뜻한 모습을 보여 주셔서 감사해요.",
    junior:
      "{상대}! 오늘 보여 준 다정한 마음이 정말 멋졌어. 그런 네가 참 자랑스러워.",
    peer: "{상대}, 오늘 네가 보여 준 다정함 정말 멋졌어. 역시 내가 사람 보는 눈은 정확하다니까!",
  },
] as const;

const SENIOR_KEYWORDS = [
  "엄마",
  "아빠",
  "어머니",
  "아버지",
  "부모님",
  "할머니",
  "할아버지",
  "선생님",
  "어르신",
  "상사",
  "팀장님",
  "부장님",
  "사장님",
] as const;

const JUNIOR_KEYWORDS = [
  "아들",
  "딸",
  "아이",
  "손자",
  "손녀",
  "조카",
  "동생",
  "후배",
  "학생",
] as const;

export function inferSmileRelationship(audience: string): SmileRelationship {
  const normalized = audience.replaceAll(" ", "");
  if (
    ["아들에게", "딸에게", "아이에게", "후배에게", "동생에게"].some((keyword) =>
      normalized.includes(keyword),
    )
  ) {
    return "junior";
  }
  if (SENIOR_KEYWORDS.some((keyword) => normalized.includes(keyword))) {
    return "senior";
  }
  if (JUNIOR_KEYWORDS.some((keyword) => normalized.includes(keyword))) {
    return "junior";
  }
  return "peer";
}

function wait(milliseconds: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
}

/**
 * Dummy AI boundary for STEP 2.
 * TODO: Replace only this function body with a secure server-side OpenAI API call.
 */
export async function recommendSmileIdea(
  audience: string,
  relationship: SmileRelationship | "auto" = "auto",
  previousIdeaId?: string,
): Promise<AiSmileIdea> {
  await wait(650);

  const resolvedRelationship =
    relationship === "auto" ? inferSmileRelationship(audience) : relationship;
  const candidates = DUMMY_AI_IDEAS.map((templates, index) => ({
    id: `dummy-ai-${index + 1}-${resolvedRelationship}`,
    message: templates[resolvedRelationship],
  })).filter((idea) => idea.id !== previousIdeaId);
  const idea = candidates[Math.floor(Math.random() * candidates.length)];
  const subject = audience.trim() || "소중한 사람";

  return {
    ...idea,
    relationship: resolvedRelationship,
    message: idea.message.replace("{상대}", subject),
  };
}

export const AI_DUMMY_IDEA_COUNT = DUMMY_AI_IDEAS.length;

/** Streaming boundary. The server selects OpenAI or the zero-cost local coach. */
export async function streamSmileCoach(
  request: CoachRequest,
): Promise<CoachStreamResult> {
  const response = await fetch("/api/ai/coach", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-device-id": getOrCreateDeviceId(),
    },
    body: JSON.stringify(request),
  });
  if (!response.ok) {
    const error = new Error(
      response.status === 429 ? "DAILY_LIMIT" : "COACH_UNAVAILABLE",
    );
    throw error;
  }
  if (!response.body) throw new Error("COACH_STREAM_UNAVAILABLE");
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  async function* read(): AsyncGenerator<string, void, undefined> {
    try {
      while (true) {
        const result = await reader.read();
        if (result.done) break;
        const text = decoder.decode(result.value, { stream: true });
        if (text) yield text;
      }
    } finally {
      reader.releaseLock();
    }
  }
  const remainingHeader = response.headers.get("X-AI-Remaining");
  return {
    stream: read(),
    mode: response.headers.get("X-AI-Mode") === "openai" ? "openai" : "local",
    remaining: remainingHeader ? Number(remainingHeader) : null,
  };
}
