import { ImageResponse } from "next/og";

import { APP_NAME } from "@/constants/app";

export const alt = "Make One Smile Today — 오늘 한 사람 웃기기";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const dynamic = "force-dynamic";
export const revalidate = 0;

/** Social preview used by KakaoTalk, Facebook, LinkedIn and other messengers. */
export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        alignItems: "center",
        background: "#FFFDF8",
        color: "#333333",
        display: "flex",
        height: "100%",
        justifyContent: "center",
        padding: 52,
        width: "100%",
      }}
    >
      <div
        style={{
          alignItems: "center",
          background: "linear-gradient(135deg, #FFD54F 0%, #FFE89B 100%)",
          borderRadius: 56,
          boxShadow: "0 26px 60px rgba(126, 91, 0, 0.16)",
          display: "flex",
          height: "100%",
          justifyContent: "space-between",
          overflow: "hidden",
          padding: "72px 80px",
          position: "relative",
          width: "100%",
        }}
      >
        <div
          style={{
            background: "rgba(255, 255, 255, 0.28)",
            borderRadius: "50%",
            height: 360,
            position: "absolute",
            right: -90,
            top: -150,
            width: 360,
          }}
        />
        <div
          style={{ display: "flex", flexDirection: "column", maxWidth: 680 }}
        >
          <div
            style={{
              background: "rgba(255, 253, 248, 0.8)",
              alignSelf: "flex-start",
              borderRadius: 999,
              display: "flex",
              fontSize: 24,
              fontWeight: 700,
              marginBottom: 36,
              padding: "12px 24px",
            }}
          >
            오늘 한 사람 웃기기
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 66,
              fontWeight: 900,
              letterSpacing: -3,
              lineHeight: 1.08,
            }}
          >
            {APP_NAME}
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 29,
              fontWeight: 600,
              lineHeight: 1.5,
              marginTop: 28,
            }}
          >
            오늘도 세상을 조금 더 따뜻하게
          </div>
        </div>
        <div
          style={{
            alignItems: "center",
            background: "#FFFDF8",
            borderRadius: "50%",
            boxShadow: "0 20px 48px rgba(51, 51, 51, 0.14)",
            display: "flex",
            height: 260,
            justifyContent: "center",
            position: "relative",
            width: 260,
          }}
        >
          <svg
            aria-hidden="true"
            height="210"
            viewBox="0 0 210 210"
            width="210"
          >
            <circle cx="42" cy="130" fill="#FFD37D" opacity="0.8" r="18" />
            <circle cx="168" cy="130" fill="#FFD37D" opacity="0.8" r="18" />
            <path d="M39 82 Q59 51 79 82 Q59 68 39 82 Z" fill="#333333" />
            <path d="M131 82 Q151 51 171 82 Q151 68 131 82 Z" fill="#333333" />
            <path
              d="M52 124 Q105 181 158 124"
              fill="none"
              stroke="#333333"
              strokeLinecap="round"
              strokeWidth="17"
            />
          </svg>
        </div>
      </div>
    </div>,
    {
      ...size,
      headers: {
        "Cache-Control": "public, max-age=0, must-revalidate",
      },
    },
  );
}
