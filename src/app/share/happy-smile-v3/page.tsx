import type { Metadata } from "next";

import {
  APP_NAME,
  APP_OG_IMAGE_URL,
  APP_SHARE_URL,
  APP_TWITTER_IMAGE_URL,
  APP_URL,
} from "@/constants/app";

import { ShareRedirect } from "../app-smile-20260807/share-redirect";

const description = "하루 한 사람에게 작은 미소를 선물하는 따뜻한 습관";

/** Versioned metadata URL prevents messenger caches from serving an old OG. */
export const metadata: Metadata = {
  title: { absolute: APP_NAME },
  description,
  alternates: { canonical: APP_URL },
  robots: { index: false, follow: true },
  openGraph: {
    title: APP_NAME,
    description,
    type: "website",
    locale: "ko_KR",
    url: APP_SHARE_URL,
    siteName: APP_NAME,
    images: [
      {
        url: APP_OG_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: "Make One Smile Today — 활짝 웃는 미소",
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

export default function SharePage() {
  return <ShareRedirect />;
}
