import type { Metadata, Viewport } from "next";
import "pretendard/dist/web/variable/pretendardvariable-dynamic-subset.css";

import { AppProviders } from "@/components/providers/app-providers";
import { APP_NAME, APP_URL } from "@/constants/app";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: APP_NAME,
    template: `%s | ${APP_NAME}`,
  },
  description: "하루 한 사람에게 작은 미소를 선물하는 따뜻한 습관",
  applicationName: APP_NAME,
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_NAME,
  },
  formatDetection: { telephone: false },
  openGraph: {
    title: APP_NAME,
    description: "하루 한 사람에게 작은 미소를 선물하는 따뜻한 습관",
    type: "website",
    locale: "ko_KR",
    url: "/",
    siteName: APP_NAME,
    images: [
      {
        url: "/opengraph-image?v=smile-2",
        width: 1200,
        height: 630,
        alt: "Make One Smile Today — 오늘 한 사람 웃기기",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: APP_NAME,
    description: "오늘, 한 사람을 웃게 해볼까요? 😊",
    images: ["/twitter-image?v=smile-2"],
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
