import { AnimatedCounter } from "@/components/animations/animated-counter";
import { Card, CardContent } from "@/components/ui/card";

interface CounterCardProps {
  label: string;
  value: number;
  suffix: string;
  emoji: string;
}

export function CounterCard({ label, value, suffix, emoji }: CounterCardProps) {
  return (
    <Card className="shadow-warm border-0">
      <CardContent className="p-4">
        <div className="mb-4 flex items-center justify-between">
          <span className="text-muted text-xs font-bold">{label}</span>
          <span
            className="bg-surface-soft flex h-8 w-8 items-center justify-center rounded-xl text-base"
            aria-hidden="true"
          >
            {emoji}
          </span>
        </div>
        <p className="text-2xl font-black tracking-tight tabular-nums">
          <AnimatedCounter value={value} />
          <span className="text-muted ml-1 text-sm font-bold">{suffix}</span>
        </p>
      </CardContent>
    </Card>
  );
}
