import type { Metadata, Viewport } from "next";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";

import { AppProviders } from "@/components/providers/app-providers";

import "./globals.css";

const deploymentUrl =
  process.env.NEXT_PUBLIC_APP_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(deploymentUrl),
  title: {
    default: "Make One Smile Today",
    template: "%s | Make One Smile Today",
  },
  description: "하루 한 사람에게 작은 미소를 선물하는 따뜻한 습관",
  applicationName: "Make One Smile Today",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Make One Smile Today",
  },
  formatDetection: { telephone: false },
  openGraph: {
    title: "Make One Smile Today",
    description: "하루 한 사람에게 작은 미소를 선물하는 따뜻한 습관",
    type: "website",
    locale: "ko_KR",
    url: "/",
    siteName: "Make One Smile Today",
  },
  twitter: {
    card: "summary",
    title: "Make One Smile Today",
    description: "오늘, 한 사람을 웃게 해볼까요? 😊",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FFD54F" },
    { media: "(prefers-color-scheme: dark)", color: "#171612" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
