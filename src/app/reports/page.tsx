import type { Metadata } from "next";

import { AppShell } from "@/components/layout/app-shell";
import { Header } from "@/components/layout/header";
import { MonthlyStatistics } from "@/features/reports/monthly-statistics";
import { WeeklyHappinessReport } from "@/features/reports/weekly-happiness-report";

export const metadata: Metadata = { title: "행복 리포트" };

export default function ReportsPage() {
  return (
    <AppShell>
      <Header title="행복 리포트" showBack />
      <main id="main-content" className="flex-1 space-y-4 px-5 pt-7 pb-12">
        <WeeklyHappinessReport />
        <MonthlyStatistics />
      </main>
    </AppShell>
  );
}
