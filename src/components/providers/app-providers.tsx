"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

import { OfflineBanner } from "@/components/pwa/offline-banner";
import { useServiceWorker } from "@/hooks/use-service-worker";
import { AppPreferencesProvider } from "@/providers/app-preferences-provider";

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
      <PwaRegistration />
      <AppPreferencesProvider>
        <DailyActivityProvider>{children}</DailyActivityProvider>
      </AppPreferencesProvider>
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
