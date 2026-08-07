"use client";

import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface SettingSwitchProps {
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  icon: LucideIcon;
  onCheckedChange: (checked: boolean) => void;
}

export function SettingSwitch({
  label,
  description,
  checked,
  disabled,
  icon: Icon,
  onCheckedChange,
}: SettingSwitchProps) {
  return (
    <div className="flex items-center gap-3 py-3">
      <span className="bg-surface-soft flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl">
        <Icon className="text-accent h-5 w-5" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-ink text-sm font-black">{label}</p>
        <p className="text-muted text-[11px] font-semibold">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={() => onCheckedChange(!checked)}
        className={cn(
          "relative h-7 w-12 shrink-0 rounded-full transition-colors disabled:opacity-50",
          checked ? "bg-success" : "bg-border",
        )}
      >
        <span
          className={cn(
            "absolute top-1 left-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
            checked ? "translate-x-5" : "translate-x-0",
          )}
        />
      </button>
    </div>
  );
}
