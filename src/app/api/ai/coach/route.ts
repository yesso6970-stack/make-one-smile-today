import { createHash } from "node:crypto";

import { and, eq, sql } from "drizzle-orm";
import { getServerSession } from "next-auth";
import OpenAI from "openai";

import { getDb, reportDatabaseError } from "@/db";
import { aiUsage } from "@/db/schema";
import { authOptions } from "@/lib/auth";
import { getLocalDateKey } from "@/lib/date";
import type { CoachCategory, CoachRequest } from "@/types/ai-coach";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const encoder = new TextEncoder();
const FREE_DAILY_LIMIT = 3;
const categories = new Set<CoachCategory>([
  "praise",
  "thanks",
  "support",
  "joke",
  "idea",
]);

function isCoachRequest(value: unknown): value is CoachRequest {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.situation === "string" &&
    candidate.situation.trim().length >= 2 &&
    candidate.situation.length <= 300 &&
    typeof candidate.audience === "string" &&
    candidate.audience.length <= 60 &&
    typeof candidate.category === "string" &&
    categories.has(candidate.category as CoachCategory)
  );
}

function localCoachText(request: CoachRequest): string {
  const audience = request.audience.trim() || "소중한 사람";
  const messages: Record<CoachCategory, string> = {
    praise: `${audience}에게 이렇게 전해보세요. “오늘 보여준 다정한 모습이 정말 멋졌어요. 당신 덕분에 주변까지 따뜻해졌어요.”`,
    thanks: `${audience}에게 “${request.situation}을 함께해 줘서 정말 고마워요. 덕분에 오래 기억하고 싶은 하루가 되었어요.”라고 진심을 전해보세요.`,
    support: `${audience}에게 “충분히 잘하고 있어요. 잠시 쉬어가도 괜찮고, 나는 언제나 당신 편이에요.”라고 말해주세요.`,
    joke: `${audience}에게 가볍게 물어보세요. “오늘 웃음 충전이 부족해 보이는데, 제가 급속 충전기 역할을 해도 될까요? 😊”`,
    idea: `${request.situation}을 떠올릴 수 있는 작은 사진이나 간식을 준비하고, ${audience}에게 짧은 손글씨 메모를 함께 건네보세요.`,
  };
  return messages[request.category];
}

async function consumeFreeUsage(userId: string): Promise<number> {
  const date = getLocalDateKey();
  const database = getDb();
  const [existing] = await database
    .select({ count: aiUsage.requestCount })
    .from(aiUsage)
    .where(and(eq(aiUsage.userId, userId), eq(aiUsage.usageDate, date)))
    .limit(1);
  if ((existing?.count ?? 0) >= FREE_DAILY_LIMIT) return -1;
  const [updated] = await database
    .insert(aiUsage)
    .values({ userId, usageDate: date, requestCount: 1 })
    .onConflictDoUpdate({
      target: [aiUsage.userId, aiUsage.usageDate],
      set: {
        requestCount: sql`${aiUsage.requestCount} + 1`,
        updatedAt: new Date(),
      },
    })
    .returning({ count: aiUsage.requestCount });
  return Math.max(0, FREE_DAILY_LIMIT - (updated?.count ?? 1));
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "INVALID_BODY" }, { status: 400 });
  }
  if (!isCoachRequest(body))
    return Response.json({ error: "INVALID_REQUEST" }, { status: 400 });

  const session = await getServerSession(authOptions);
  let remaining: number | null = null;
  if (session?.user.id && session.user.plan !== "premium") {
    try {
      remaining = await consumeFreeUsage(session.user.id);
      if (remaining < 0)
        return Response.json({ error: "DAILY_LIMIT" }, { status: 429 });
    } catch (error) {
      reportDatabaseError("consume AI daily usage", error);
      return Response.json({ error: "USAGE_UNAVAILABLE" }, { status: 503 });
    }
  }

  const apiKey = process.env.OPENAI_API_KEY;
  const headers = {
    "Content-Type": "text/plain; charset=utf-8",
    "Cache-Control": "no-store",
    "X-AI-Mode": apiKey ? "openai" : "local",
    "X-AI-Remaining": remaining === null ? "" : String(remaining),
  };

  if (!apiKey) {
    const text = localCoachText(body);
    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        for (const part of text.match(/.{1,5}/gu) ?? [text]) {
          controller.enqueue(encoder.encode(part));
          await new Promise((resolve) => setTimeout(resolve, 24));
        }
        controller.close();
      },
    });
    return new Response(stream, { headers });
  }

  const client = new OpenAI({ apiKey });
  const safetyIdentifier = createHash("sha256")
    .update(session?.user.id ?? request.headers.get("x-device-id") ?? "guest")
    .digest("hex");
  const openaiStream = await client.responses.create({
    model: process.env.OPENAI_MODEL ?? "gpt-5.6-luna",
    instructions:
      "당신은 따뜻하고 안전한 한국어 웃음 코치입니다. 관계와 높임말을 자연스럽게 맞추고, 바로 전달할 수 있는 한두 문장만 제안하세요. 비꼬기, 외모 평가, 차별, 부담스러운 표현은 피하세요.",
    input: `대상: ${body.audience || "소중한 사람"}\n종류: ${body.category}\n상황: ${body.situation}`,
    safety_identifier: safetyIdentifier,
    stream: true,
  });
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of openaiStream) {
          if (event.type === "response.output_text.delta")
            controller.enqueue(encoder.encode(event.delta));
        }
        controller.close();
      } catch (error) {
        controller.error(error);
      }
    },
  });
  return new Response(stream, { headers });
}
