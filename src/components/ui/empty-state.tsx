import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: LucideIcon;
}

export function EmptyState({
  title = "아직 기록이 없습니다",
  description = "오늘 첫 번째 웃음을 만들어보세요.",
  icon: Icon,
}: EmptyStateProps) {
  return (
    <div className="bg-surface-soft flex flex-col items-center rounded-2xl px-5 py-6 text-center">
      {Icon ? (
        <Icon className="text-accent h-8 w-8" />
      ) : (
        <span className="text-3xl">😊</span>
      )}
      <p className="text-ink mt-3 text-sm font-black">{title}</p>
      <p className="text-muted mt-1 text-xs font-semibold">{description}</p>
    </div>
  );
}
