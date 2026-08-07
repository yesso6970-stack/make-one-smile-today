import type { Metadata } from "next";

import { AppShell } from "@/components/layout/app-shell";
import { Header } from "@/components/layout/header";
import { FamilyChallenge } from "@/features/family/family-challenge";

export const metadata: Metadata = { title: "가족 챌린지" };

export default function FamilyPage() {
  return (
    <AppShell>
      <Header title="가족 챌린지" showBack />
      <main id="main-content" className="flex-1 px-5 pt-7 pb-12">
        <FamilyChallenge />
      </main>
    </AppShell>
  );
}
