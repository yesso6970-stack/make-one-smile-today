import Link from "next/link";

import { AppShell } from "@/components/layout/app-shell";
import { Header } from "@/components/layout/header";

interface InformationSection {
  title: string;
  body: React.ReactNode;
}

interface InformationPageProps {
  title: string;
  eyebrow: string;
  description: string;
  sections: readonly InformationSection[];
}

export function InformationPage({
  title,
  eyebrow,
  description,
  sections,
}: InformationPageProps) {
  return (
    <AppShell>
      <Header title={title} showBack />
      <main id="main-content" className="flex-1 px-5 pt-7 pb-12">
        <p className="text-accent text-xs font-black">{eyebrow}</p>
        <h1 className="mt-2 text-3xl font-black tracking-tight">{title}</h1>
        <p className="text-muted mt-3 text-sm leading-6 font-semibold">
          {description}
        </p>
        <div className="mt-7 space-y-4">
          {sections.map((section) => (
            <section
              key={section.title}
              className="bg-surface shadow-warm rounded-[1.75rem] border p-5"
            >
              <h2 className="text-base font-black">{section.title}</h2>
              <div className="text-muted mt-2 text-sm leading-7 font-medium">
                {section.body}
              </div>
            </section>
          ))}
        </div>
        <Link
          href="/about"
          className="text-accent mt-8 block text-center text-sm font-black"
        >
          앱 정보로 돌아가기
        </Link>
      </main>
    </AppShell>
  );
}
