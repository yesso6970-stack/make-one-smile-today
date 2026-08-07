import type { Metadata } from "next";

import { AppShell } from "@/components/layout/app-shell";
import { Header } from "@/components/layout/header";
import { ProfileCard } from "@/components/profile/profile-card";
import { GOOGLE_AUTH_CONFIGURED } from "@/lib/auth";

export const metadata: Metadata = { title: "내 프로필" };

export default function ProfilePage() {
  return (
    <AppShell>
      <Header title="내 프로필" showBack />
      <main id="main-content" className="flex-1 px-5 pt-7 pb-12">
        <ProfileCard googleConfigured={GOOGLE_AUTH_CONFIGURED} />
      </main>
    </AppShell>
  );
}
