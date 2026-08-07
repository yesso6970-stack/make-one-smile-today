import type { Metadata } from "next";

import {
  APP_NAME,
  APP_OG_IMAGE_URL,
  APP_SHARE_URL,
  APP_TWITTER_IMAGE_URL,
} from "@/constants/app";

import HomePage from "../page";

const description = "하루 한 사람에게 작은 미소를 선물하는 따뜻한 습관";

/**
 * A permanent, non-redirecting share URL. Keeping this URL in the address bar
 * prevents users from accidentally copying the messenger-cached home URL.
 */
export const metadata: Metadata = {
  title: { absolute: APP_NAME },
  description,
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
        alt: "Make One Smile Today — 분홍 볼의 활짝 웃는 미소",
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

export default function PermanentSharePage() {
  return <HomePage />;
}
