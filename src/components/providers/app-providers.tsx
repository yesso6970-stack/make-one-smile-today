"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

import { OfflineBanner } from "@/components/pwa/offline-banner";
import { NotificationScheduler } from "@/components/notifications/notification-scheduler";
import { useServiceWorker } from "@/hooks/use-service-worker";
import { AppPreferencesProvider } from "@/providers/app-preferences-provider";
import { AuthProvider } from "@/providers/auth-provider";
import { CloudSyncProvider } from "@/providers/cloud-sync-provider";

import { DailyActivityProvider } from "./daily-activity-provider";

function PwaRegistration() {
  useServiceWorker();
  return null;
}

export function AppProviders({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <AuthProvider>
        <PwaRegistration />
        <AppPreferencesProvider>
          <DailyActivityProvider>
            <NotificationScheduler />
            <CloudSyncProvider>{children}</CloudSyncProvider>
          </DailyActivityProvider>
        </AppPreferencesProvider>
      </AuthProvider>
      <OfflineBanner />
      <Toaster
        position="top-center"
        richColors
        closeButton
        toastOptions={{ className: "font-sans" }}
      />
    </ThemeProvider>
  );
}
