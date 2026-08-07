import type { WeatherSnapshot } from "@/hooks/use-seoul-weather";
import { getDailyCardIndex } from "@/lib/date";
import type { SmileCardData, SmileTarget } from "@/types";

interface CardTheme {
  id: string;
  category: SmileCardData["category"];
  emoji: string;
  eyebrow: string;
  message: (subject: string) => string;
  prompt: string;
  gradient: string;
}

const DAILY_FINISHES = [
  "오늘은 상대의 이름을 먼저 불러주세요.",
  "말끝에 작은 손하트를 더해주세요.",
  "웃으면 함께 하이파이브해주세요.",
  "평소보다 한 톤 밝게 말해주세요.",
  "마지막 3초는 웃음을 참아보세요.",
  "좋아하는 이모지를 하나 붙여 보내세요.",
  "진지한 표정으로 반전을 만들어보세요.",
  "고마웠던 순간 하나도 덧붙여주세요.",
  "엄지를 척 올리며 마무리해주세요.",
  "따뜻한 음료와 함께 전해주세요.",
  "오늘만의 별명을 붙여 불러주세요.",
  "작은 박수 두 번을 더해주세요.",
  "뜻밖의 타이밍에 툭 건네보세요.",
] as const;

const FIXED_DAY_THEMES: Readonly<Record<string, CardTheme>> = {
  "01-01": {
    id: "new-year",
    category: "응원",
    emoji: "🌅",
    eyebrow: "새해 첫 미소",
    message: (subject) =>
      `새해 첫 페이지에는\n${subject} 환한 웃음부터 저장할게요!`,
    prompt: "올해 함께 웃고 싶은 일을 하나 말해주세요.",
    gradient: "from-[#FFF0B8] to-[#FFD36D]",
  },
  "02-14": {
    id: "valentine",
    category: "칭찬",
    emoji: "🍫",
    eyebrow: "달콤함이 필요한 날",
    message: (subject) =>
      `초콜릿보다 더 기분 좋은 건\n${subject} 웃는 얼굴이에요.`,
    prompt: "작은 간식과 함께 건네면 달콤함이 두 배예요.",
    gradient: "from-[#FFE0E6] to-[#F7B2C0]",
  },
  "05-05": {
    id: "children-day",
    category: "미션",
    emoji: "🎈",
    eyebrow: "우리 안의 어린이날",
    message: () =>
      "오늘만큼은 어른 모드 잠시 OFF!\n가장 장난스러운 표정으로 웃어보기!",
    prompt: "어릴 적 좋아했던 간식이나 놀이를 함께 떠올려보세요.",
    gradient: "from-[#DFF3FF] to-[#AEDAF5]",
  },
  "05-08": {
    id: "parents-day",
    category: "칭찬",
    emoji: "🌹",
    eyebrow: "마음에 카네이션 한 송이",
    message: () => "익숙해서 자주 못 했던 말,\n사랑하고 고맙습니다.",
    prompt: "짧은 말 뒤에 따뜻한 포옹을 더해주세요.",
    gradient: "from-[#FFE0E0] to-[#FFB6B6]",
  },
  "08-07": {
    id: "ipchu",
    category: "유머",
    emoji: "🍂",
    eyebrow: "달력에는 벌써 입추",
    message: (subject) =>
      `가을이 출근 도장을 찍었다는데\n${subject} 미소는 아직 여름 휴가 중인가요?`,
    prompt: "손부채 바람과 함께 시원한 웃음을 보내주세요.",
    gradient: "from-[#FFF0BF] to-[#F5CA79]",
  },
  "08-15": {
    id: "liberation-day",
    category: "응원",
    emoji: "🇰🇷",
    eyebrow: "고마움을 기억하는 광복절",
    message: () => "소중한 오늘을 마음껏 누리며\n우리도 환하게 웃어봐요.",
    prompt: "오늘의 자유와 평화에 감사하는 마음을 나눠보세요.",
    gradient: "from-[#E3EEFF] to-[#BCD2F5]",
  },
  "10-09": {
    id: "hangeul-day",
    category: "칭찬",
    emoji: "🇰🇷",
    eyebrow: "예쁜 우리말을 건네는 날",
    message: (subject) => `오늘의 가장 예쁜 우리말은\n${subject} 이름이에요.`,
    prompt: "좋아하는 순우리말 하나도 함께 알려주세요.",
    gradient: "from-[#E4F0FF] to-[#BBD5F5]",
  },
  "11-11": {
    id: "pepero-day",
    category: "농담",
    emoji: "🥨",
    eyebrow: "11월 11일의 길쭉한 마음",
    message: () =>
      "과자는 길쭉해도 우리 대화는 길게!\n오늘 웃음도 한 봉지 나눠요.",
    prompt: "간식 하나를 반으로 나누며 건네보세요.",
    gradient: "from-[#F4E5D6] to-[#DDBD9A]",
  },
  "12-24": {
    id: "christmas-eve",
    category: "미션",
    emoji: "🎅",
    eyebrow: "크리스마스이브 미소 배달",
    message: () => "산타보다 하루 먼저\n웃음 선물을 배달하러 왔어요!",
    prompt: "종소리를 흉내 낸 뒤 카드를 읽어주세요.",
    gradient: "from-[#E0F3E5] to-[#AFD8BA]",
  },
  "12-25": {
    id: "christmas",
    category: "칭찬",
    emoji: "🎄",
    eyebrow: "메리 스마일 크리스마스",
    message: (subject) =>
      `오늘 가장 반가운 선물은\n${subject} 환한 웃음이에요.`,
    prompt: "메리 크리스마스와 함께 따뜻하게 건네주세요.",
    gradient: "from-[#DDF2E3] to-[#A9D5B5]",
  },
  "12-31": {
    id: "year-end",
    category: "칭찬",
    emoji: "🎇",
    eyebrow: "올해의 마지막 칭찬",
    message: () =>
      "올해도 정말 수고 많았어요.\n당신 덕분에 좋은 장면이 많았습니다.",
    prompt: "올해 가장 고마웠던 순간 하나를 말해주세요.",
    gradient: "from-[#E7E2FF] to-[#C9BDF5]",
  },
};

function getJulianDay(year: number, month: number, day: number) {
  return Math.floor(Date.UTC(year, month - 1, day) / 86_400_000) + 2_440_588;
}

function isGengDay(year: number, month: number, day: number) {
  return (getJulianDay(year, month, day) + 49) % 10 === 6;
}

function findGengDaysAfter(
  year: number,
  month: number,
  day: number,
  count: number,
) {
  const dates: string[] = [];
  const cursor = new Date(Date.UTC(year, month - 1, day + 1));

  while (dates.length < count) {
    const cursorYear = cursor.getUTCFullYear();
    const cursorMonth = cursor.getUTCMonth() + 1;
    const cursorDay = cursor.getUTCDate();
    if (isGengDay(cursorYear, cursorMonth, cursorDay)) {
      dates.push(
        `${cursorYear}-${String(cursorMonth).padStart(2, "0")}-${String(cursorDay).padStart(2, "0")}`,
      );
    }
    cursor.setUTCDate(cursor.getUTCDate() + 1);
  }

  return dates;
}

function getSambokName(dateKey: string) {
  const year = Number(dateKey.slice(0, 4));
  const summerGengDays = findGengDaysAfter(year, 6, 21, 4);
  const autumnGengDay = findGengDaysAfter(year, 8, 7, 1)[0];

  if (dateKey === summerGengDays[2]) return "초복";
  if (dateKey === summerGengDays[3]) return "중복";
  if (dateKey === autumnGengDay) return "말복";
  return null;
}

function getSubject(targetId: SmileTarget["id"]) {
  const subjects: Record<SmileTarget["id"], string> = {
    family: "우리 가족의",
    friend: "네",
    lover: "당신의",
    coworker: "동료님의",
    stranger: "당신의",
    random: "당신의",
  };
  return subjects[targetId];
}

function getSeasonTheme(month: number): CardTheme {
  if (month >= 3 && month <= 5) {
    return {
      id: "spring",
      category: "응원",
      emoji: "🌸",
      eyebrow: "봄처럼 피어나는 미소",
      message: (subject) =>
        `봄바람은 꽃을 피우고,\n${subject} 웃음은 오늘을 피워요.`,
      prompt: "산책하듯 가벼운 마음으로 건네보세요.",
      gradient: "from-[#FFE5ED] to-[#F7BED0]",
    };
  }
  if (month >= 6 && month <= 8) {
    return {
      id: "summer",
      category: "유머",
      emoji: "🌞",
      eyebrow: "더위를 이기는 미소",
      message: (subject) =>
        `날씨는 뜨거워도\n${subject} 미소만은 절전 모드 금지!`,
      prompt: "시원한 음료 한 잔과 함께 웃음을 나눠보세요.",
      gradient: "from-[#FFF0A8] to-[#FFD766]",
    };
  }
  if (month >= 9 && month <= 11) {
    return {
      id: "autumn",
      category: "칭찬",
      emoji: "🍁",
      eyebrow: "선선한 바람 같은 한마디",
      message: (subject) =>
        `가을 햇살이 좋은 줄 알았는데\n${subject} 미소가 더 따뜻하네요.`,
      prompt: "오늘 발견한 멋진 점 하나를 덧붙여주세요.",
      gradient: "from-[#FFE9C8] to-[#F2C88C]",
    };
  }
  return {
    id: "winter",
    category: "응원",
    emoji: "🧣",
    eyebrow: "추위를 녹이는 한마디",
    message: (subject) =>
      `바깥은 추워도 괜찮아요.\n${subject} 웃음이면 마음은 따뜻하니까요.`,
    prompt: "따뜻한 음료처럼 포근하게 건네주세요.",
    gradient: "from-[#E1F1FF] to-[#B9D6F3]",
  };
}

function getWeatherTheme(weather: WeatherSnapshot | null): CardTheme | null {
  if (!weather) return null;

  if (
    [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82, 95, 96, 99].includes(
      weather.code,
    )
  ) {
    return {
      id: "rain",
      category: "유머",
      emoji: "☔",
      eyebrow: "비 오는 날의 맑음 예보",
      message: (subject) => `하늘은 흐림이어도\n${subject} 웃음은 오늘도 맑음!`,
      prompt: "우산을 살짝 기울여 자리를 나누듯 마음도 나눠보세요.",
      gradient: "from-[#DCEBFA] to-[#AAC9E8]",
    };
  }
  if ([71, 73, 75, 77, 85, 86].includes(weather.code)) {
    return {
      id: "snow",
      category: "칭찬",
      emoji: "❄️",
      eyebrow: "눈 오는 날의 특별한 발견",
      message: (subject) =>
        `눈송이도 예쁘지만\n${subject} 웃는 모습이 더 반짝여요.`,
      prompt: "창밖의 눈을 함께 보며 건네보세요.",
      gradient: "from-[#EDF7FF] to-[#C9E4F6]",
    };
  }
  if (weather.temperature >= 30) {
    return {
      id: "hot",
      category: "유머",
      emoji: "🧊",
      eyebrow: `${Math.round(weather.temperature)}°C 폭염 탈출 작전`,
      message: () => "오늘 너무 덥죠?\n웃음은 시원하게, 걱정은 녹여버려요!",
      prompt: "시원한 물 한 잔을 먼저 챙겨주세요.",
      gradient: "from-[#DDF6FF] to-[#A8DFEF]",
    };
  }
  if (weather.temperature <= 0) {
    return {
      id: "cold",
      category: "응원",
      emoji: "🧤",
      eyebrow: `${Math.round(weather.temperature)}°C 마음 보온 주의보`,
      message: (subject) =>
        `손끝은 차가워도\n${subject} 마음은 오늘도 따뜻하네요.`,
      prompt: "따뜻하게 입었는지 먼저 물어봐 주세요.",
      gradient: "from-[#E4F2FF] to-[#BAD6F0]",
    };
  }
  return null;
}

export function createContextualCard(
  target: SmileTarget,
  dateKey: string,
  weather: WeatherSnapshot | null,
): SmileCardData {
  const monthDay = dateKey.slice(5);
  const month = Number(dateKey.slice(5, 7));
  const sambokName = getSambokName(dateKey);
  const subject = getSubject(target.id);

  const sambokTheme: CardTheme | null = sambokName
    ? {
        id: `sambok-${sambokName}`,
        category: "응원",
        emoji: "🐔",
        eyebrow: `${sambokName}, 웃음으로 기력 충전`,
        message: () =>
          `${sambokName}엔 삼계탕도 좋지만,\n웃음 한 그릇 먼저 든든하게 드세요!`,
        prompt: "시원한 물과 맛있는 보양식도 함께 챙겨주세요.",
        gradient: "from-[#FFF0BB] to-[#F7CD7A]",
      }
    : null;

  const theme =
    sambokTheme ??
    FIXED_DAY_THEMES[monthDay] ??
    getWeatherTheme(weather) ??
    getSeasonTheme(month);
  const dailyFinish =
    DAILY_FINISHES[getDailyCardIndex(dateKey, DAILY_FINISHES.length)];

  return {
    id: `context-${dateKey}-${target.id}-${theme.id}`,
    targetIds: [target.id],
    category: theme.category,
    emoji: theme.emoji,
    eyebrow: theme.eyebrow,
    message: theme.message(subject),
    prompt: `${theme.prompt} ${dailyFinish}`,
    gradient: theme.gradient,
  };
}
