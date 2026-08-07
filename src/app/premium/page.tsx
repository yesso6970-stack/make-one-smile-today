import type { Metadata } from "next";

import { AppShell } from "@/components/layout/app-shell";
import { Header } from "@/components/layout/header";
import { PremiumPlans } from "@/features/premium/premium-plans";

export const metadata: Metadata = { title: "Smile Premium" };

export default function PremiumPage() {
  return (
    <AppShell>
      <Header title="Smile Premium" showBack />
      <main id="main-content" className="flex-1 px-5 pt-7 pb-12">
        <PremiumPlans />
      </main>
    </AppShell>
  );
}
