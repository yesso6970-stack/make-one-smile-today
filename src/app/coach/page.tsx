import type { Metadata } from "next";

import { AppShell } from "@/components/layout/app-shell";
import { Header } from "@/components/layout/header";
import { AiCoach } from "@/features/coach/ai-coach";

export const metadata: Metadata = { title: "AI 웃음 코치" };

export default function CoachPage() {
  return (
    <AppShell>
      <Header title="AI 웃음 코치" showBack />
      <main id="main-content" className="flex-1 px-5 pt-7 pb-12">
        <AiCoach />
      </main>
    </AppShell>
  );
}
