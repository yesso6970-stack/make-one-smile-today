import type { Metadata, Viewport } from "next";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";

import { AppProviders } from "@/components/providers/app-providers";
import {
  APP_NAME,
  APP_OG_IMAGE_URL,
  APP_TWITTER_IMAGE_URL,
  APP_URL,
} from "@/constants/app";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: "하루 한 사람에게 작은 미소를 선물하는 따뜻한 습관",
  applicationName: APP_NAME,
  keywords: [
    "웃음",
    "칭찬",
    "오늘의 미션",
    "감정 기록",
    "PWA",
    "Make One Smile Today",
  ],
  authors: [{ name: "Make One Smile Today" }],
  creator: "Make One Smile Today",
  publisher: "Make One Smile Today",
  category: "lifestyle",
  alternates: { canonical: APP_URL },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_NAME,
  },
  formatDetection: { telephone: false },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icons/icon-192.png", type: "image/png", sizes: "192x192" },
    ],
    apple: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
  },
  robots: { index: true, follow: true },
  openGraph: {
    title: APP_NAME,
    description: "하루 한 사람에게 작은 미소를 선물하는 따뜻한 습관",
    type: "website",
    locale: "ko_KR",
    url: APP_URL,
    siteName: APP_NAME,
    images: [
      {
        url: APP_OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: "오늘 한 사람 웃기기 — 활짝 웃는 미소",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: APP_NAME,
    description: "오늘, 한 사람을 웃게 해볼까요? 😊",
    images: [APP_TWITTER_IMAGE_URL],
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
