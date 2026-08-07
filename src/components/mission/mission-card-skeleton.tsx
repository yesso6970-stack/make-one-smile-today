export function MissionCardSkeleton() {
  return (
    <div
      className="bg-surface shadow-warm animate-pulse rounded-[2rem] border p-6"
      aria-label="오늘의 미션을 불러오는 중"
      role="status"
    >
      <div className="bg-border h-6 w-28 rounded-full" />
      <div className="bg-border mt-7 h-7 w-full rounded-xl" />
      <div className="bg-border mt-2 h-7 w-4/5 rounded-xl" />
      <div className="mt-7 grid grid-cols-2 gap-3">
        <div className="bg-border h-12 rounded-2xl" />
        <div className="bg-border h-12 rounded-2xl" />
      </div>
      <span className="sr-only">오늘의 미션을 준비하고 있어요.</span>
    </div>
  );
}
