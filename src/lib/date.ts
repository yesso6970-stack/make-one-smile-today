export const APP_TIME_ZONE = "Asia/Seoul";

function getDateParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: APP_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

  const findPart = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? "";

  return {
    year: findPart("year"),
    month: findPart("month"),
    day: findPart("day"),
  };
}

/** 배포 서버와 사용자 위치에 관계없이 한국 날짜를 사용합니다. */
export function getLocalDateKey(date = new Date()) {
  const { year, month, day } = getDateParts(date);
  return `${year}-${month}-${day}`;
}

export function getYesterdayDateKey(date = new Date()) {
  return getLocalDateKey(new Date(date.getTime() - 24 * 60 * 60 * 1000));
}

function hashText(value: string) {
  return [...value].reduce(
    (hash, character) => (hash * 31 + character.charCodeAt(0)) >>> 0,
    0,
  );
}

export function getDailyCardIndex(dateKey: string, cardCount: number) {
  if (cardCount <= 0) return 0;
  return hashText(dateKey) % cardCount;
}

/** 같은 날에는 같은 순서, 다음 날에는 새로운 전체 카드 순서를 만듭니다. */
export function getDailyOrder<T>(items: readonly T[], seedKey: string) {
  const result = [...items];
  let seed = hashText(seedKey) || 1;

  const random = () => {
    seed = (seed * 1_664_525 + 1_013_904_223) >>> 0;
    return seed / 4_294_967_296;
  };

  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }

  return result;
}

export function formatKoreanDate(date = new Date()) {
  return new Intl.DateTimeFormat("ko-KR", {
    timeZone: APP_TIME_ZONE,
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(date);
}
