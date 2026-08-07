"use client";

import { ThemeProvider } from "next-themes";
import { Toaster } from "sonner";

import { useServiceWorker } from "@/hooks/use-service-worker";

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
      <DailyActivityProvider>{children}</DailyActivityProvider>
      <Toaster position="top-center" richColors closeButton />
    </ThemeProvider>
  );
}
