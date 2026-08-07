import type { DailyMission, MissionCategory } from "@/types/daily-activity";

export const MISSION_CATEGORY_META: Record<
  MissionCategory,
  { label: string; emoji: string; color: string }
> = {
  family: { label: "가족", emoji: "🏠", color: "bg-[#fff1c7] text-[#7a5600]" },
  friend: { label: "친구", emoji: "🫶", color: "bg-[#ffe4ec] text-[#8b3652]" },
  work: { label: "직장", emoji: "💼", color: "bg-[#e3efff] text-[#315c91]" },
  lover: { label: "연인", emoji: "💗", color: "bg-[#ffe2e2] text-[#9b3a46]" },
  stranger: {
    label: "낯선 사람",
    emoji: "🌿",
    color: "bg-[#e3f5e8] text-[#39714a]",
  },
  self: { label: "자신", emoji: "✨", color: "bg-[#eee7ff] text-[#654a91]" },
};

export const MISSIONS: readonly DailyMission[] = [
  {
    id: "family-01",
    category: "family",
    message: "가족에게 진심 어린 칭찬 한마디 건네기",
  },
  {
    id: "family-02",
    category: "family",
    message: "먼저 다가가 오늘 하루 어땠는지 물어보기",
  },
  {
    id: "family-03",
    category: "family",
    message: "가족이 좋아하는 간식 하나 챙겨주기",
  },
  {
    id: "family-04",
    category: "family",
    message: "고마웠던 일을 하나 떠올려 직접 말해주기",
  },
  {
    id: "family-05",
    category: "family",
    message: "집안일 하나를 말없이 먼저 해두기",
  },
  {
    id: "family-06",
    category: "family",
    message: "가족사진을 보며 즐거웠던 추억 꺼내기",
  },
  {
    id: "family-07",
    category: "family",
    message: "사랑한다는 말을 평소보다 다정하게 전하기",
  },
  {
    id: "family-08",
    category: "family",
    message: "가족의 작은 수고를 발견하고 박수 보내기",
  },
  {
    id: "family-09",
    category: "family",
    message: "짧아도 좋으니 가족과 눈을 맞추고 웃기",
  },
  {
    id: "friend-01",
    category: "friend",
    message: "친구에게 네 덕분에 좋았던 순간을 알려주기",
  },
  {
    id: "friend-02",
    category: "friend",
    message: "오래 연락하지 못한 친구에게 안부 보내기",
  },
  {
    id: "friend-03",
    category: "friend",
    message: "친구의 장점을 구체적으로 세 가지 말해주기",
  },
  {
    id: "friend-04",
    category: "friend",
    message: "둘만 아는 추억 사진과 짧은 농담 보내기",
  },
  {
    id: "friend-05",
    category: "friend",
    message: "친구의 고민을 판단하지 않고 끝까지 들어주기",
  },
  {
    id: "friend-06",
    category: "friend",
    message: "오늘도 네 편이라고 따뜻한 메시지 보내기",
  },
  {
    id: "friend-07",
    category: "friend",
    message: "친구가 잘한 일을 한 번 더 크게 축하해주기",
  },
  {
    id: "friend-08",
    category: "friend",
    message: "다음에 같이 하고 싶은 작은 약속 정하기",
  },
  {
    id: "friend-09",
    category: "friend",
    message: "친구의 말투를 따라 하며 귀여운 웃음 만들기",
  },
  {
    id: "work-01",
    category: "work",
    message: "동료의 도움에 구체적인 감사 인사 전하기",
  },
  {
    id: "work-02",
    category: "work",
    message: "오늘 고생한 동료에게 따뜻한 음료 권하기",
  },
  {
    id: "work-03",
    category: "work",
    message: "회의에서 누군가의 좋은 아이디어를 인정하기",
  },
  {
    id: "work-04",
    category: "work",
    message: "바쁜 동료의 작은 업무 하나 도와주기",
  },
  {
    id: "work-05",
    category: "work",
    message: "출근 인사를 평소보다 밝고 유쾌하게 건네기",
  },
  {
    id: "work-06",
    category: "work",
    message: "오늘의 수고를 칭찬하는 메모 한 줄 남기기",
  },
  {
    id: "work-07",
    category: "work",
    message: "점심시간에 가벼운 웃음 질문 하나 던지기",
  },
  {
    id: "work-08",
    category: "work",
    message: "퇴근하는 동료에게 진심으로 수고했다고 말하기",
  },
  {
    id: "lover-01",
    category: "lover",
    message: "상대의 오늘 모습에서 예쁜 점 하나 말해주기",
  },
  {
    id: "lover-02",
    category: "lover",
    message: "처음 설렜던 순간을 짧게 들려주기",
  },
  {
    id: "lover-03",
    category: "lover",
    message: "보고 싶다는 말을 귀여운 이모지와 함께 보내기",
  },
  {
    id: "lover-04",
    category: "lover",
    message: "상대가 좋아하는 노래 한 곡 공유하기",
  },
  {
    id: "lover-05",
    category: "lover",
    message: "오늘 가장 고마웠던 행동을 꼭 집어 칭찬하기",
  },
  {
    id: "lover-06",
    category: "lover",
    message: "둘만의 애칭으로 다정하게 불러주기",
  },
  {
    id: "lover-07",
    category: "lover",
    message: "다음 데이트에서 하고 싶은 소소한 일 제안하기",
  },
  {
    id: "lover-08",
    category: "lover",
    message: "말없이 꼭 안아주거나 손을 따뜻하게 잡아주기",
  },
  {
    id: "stranger-01",
    category: "stranger",
    message: "문을 잡아주며 눈을 맞추고 미소 짓기",
  },
  {
    id: "stranger-02",
    category: "stranger",
    message: "서비스를 받은 뒤 진심을 담아 감사 인사하기",
  },
  {
    id: "stranger-03",
    category: "stranger",
    message: "엘리베이터에서 먼저 층 버튼을 물어보기",
  },
  {
    id: "stranger-04",
    category: "stranger",
    message: "길을 양보하며 따뜻한 표정으로 인사하기",
  },
  {
    id: "stranger-05",
    category: "stranger",
    message: "택배 기사님께 수고하신다는 한마디 전하기",
  },
  {
    id: "stranger-06",
    category: "stranger",
    message: "칭찬하고 싶었던 옷이나 소품을 예쁘다고 말하기",
  },
  {
    id: "stranger-07",
    category: "stranger",
    message: "주변의 작은 쓰레기 하나를 조용히 줍기",
  },
  {
    id: "stranger-08",
    category: "stranger",
    message: "계산대에서 서두르지 않고 친절하게 기다리기",
  },
  {
    id: "self-01",
    category: "self",
    message: "거울을 보며 오늘의 나에게 잘하고 있다고 말하기",
  },
  {
    id: "self-02",
    category: "self",
    message: "좋아하는 노래 한 곡에 맞춰 마음껏 몸 흔들기",
  },
  {
    id: "self-03",
    category: "self",
    message: "오늘 해낸 작은 일 세 가지를 적어보기",
  },
  {
    id: "self-04",
    category: "self",
    message: "따뜻한 차를 천천히 마시며 3분 쉬어가기",
  },
  {
    id: "self-05",
    category: "self",
    message: "내가 좋아하는 표정으로 셀카 한 장 남기기",
  },
  {
    id: "self-06",
    category: "self",
    message: "실수한 나에게 괜찮다고 다정하게 말해주기",
  },
  {
    id: "self-07",
    category: "self",
    message: "오늘의 나를 위한 작은 선물 하나 허락하기",
  },
  {
    id: "self-08",
    category: "self",
    message: "잠들기 전 내 마음에게 수고했다고 인사하기",
  },
] as const;
