import { BarChart3, Bot, Crown, Users } from "lucide-react";
import Link from "next/link";

const items = [
  {
    href: "/coach",
    label: "AI 웃음 코치",
    caption: "상황별 한마디",
    icon: Bot,
    tone: "bg-[#eee7ff] text-[#8067bd] dark:bg-[#493d60] dark:text-[#dfd2ff]",
  },
  {
    href: "/reports",
    label: "행복 리포트",
    caption: "주간·월간 통계",
    icon: BarChart3,
    tone: "bg-primary/25 text-accent",
  },
  {
    href: "/family",
    label: "가족 챌린지",
    caption: "초대·함께 실천",
    icon: Users,
    tone: "bg-success/10 text-success",
  },
  {
    href: "/premium",
    label: "Premium",
    caption: "더 깊은 다정함",
    icon: Crown,
    tone: "bg-[#fff0c7] text-[#a06d00] dark:bg-[#564a22] dark:text-[#ffe28a]",
  },
] as const;

export function PremiumHub() {
  return (
    <section aria-labelledby="smart-features-title">
      <div className="mb-3 flex items-end justify-between">
        <div>
          <p className="text-muted text-xs font-bold">더 오래 이어가는 방법</p>
          <h2 id="smart-features-title" className="text-lg font-black">
            스마트 미소 도구
          </h2>
        </div>
        <span className="text-accent text-[10px] font-black">STEP 4</span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {items.map(({ href, label, caption, icon: Icon, tone }) => (
          <Link
            key={href}
            href={href}
            className="bg-surface shadow-warm group rounded-[1.6rem] border p-4 transition-transform hover:-translate-y-1"
          >
            <span
              className={`flex h-10 w-10 items-center justify-center rounded-2xl ${tone}`}
            >
              <Icon className="h-5 w-5" />
            </span>
            <p className="mt-3 text-sm font-black">{label}</p>
            <p className="text-muted mt-0.5 text-[10px] font-semibold">
              {caption}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
