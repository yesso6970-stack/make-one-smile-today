import { MISSION_CATEGORY_META } from "@/constants/missions";
import { cn } from "@/lib/utils";
import type { MissionCategory } from "@/types/daily-activity";

export function MissionCategoryBadge({
  category,
  className,
}: {
  category: MissionCategory;
  className?: string;
}) {
  const meta = MISSION_CATEGORY_META[category];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-extrabold",
        meta.color,
        className,
      )}
    >
      <span aria-hidden="true">{meta.emoji}</span>
      {meta.label}
    </span>
  );
}
