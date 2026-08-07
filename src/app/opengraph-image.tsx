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
            <circle cx="37" cy="130" fill="#FFB6A3" opacity="0.72" r="18" />
            <circle cx="173" cy="130" fill="#FFB6A3" opacity="0.72" r="18" />
            <path d="M39 82 Q59 51 79 82 Q59 68 39 82 Z" fill="#333333" />
            <path d="M131 82 Q151 51 171 82 Q151 68 131 82 Z" fill="#333333" />
            <path
              d="M45 116 Q105 150 165 116 Q159 188 105 190 Q51 188 45 116 Z"
              fill="#333333"
            />
            <path
              d="M60 123 Q105 145 150 123 Q145 148 105 151 Q65 148 60 123 Z"
              fill="#FFFDF8"
            />
            <path
              d="M75 171 Q105 148 135 171 Q125 186 105 188 Q85 186 75 171 Z"
              fill="#FF7F72"
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
