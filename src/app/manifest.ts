import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "오늘 한 사람 웃기기 · Make One Smile Today",
    short_name: "오늘 한 사람 웃기기",
    description: "하루 한 사람에게 작은 미소를 선물하는 따뜻한 습관",
    start_url: "/",
    scope: "/",
    display: "standalone",
    display_override: ["window-controls-overlay", "standalone"],
    background_color: "#FFFDF8",
    theme_color: "#FFD54F",
    lang: "ko-KR",
    orientation: "portrait",
    categories: ["lifestyle", "social"],
    shortcuts: [
      {
        name: "오늘 웃기기 시작",
        short_name: "웃기기",
        description: "오늘 웃게 할 사람을 선택합니다.",
        url: "/target",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
      {
        name: "앱 설정",
        short_name: "설정",
        url: "/settings",
        icons: [{ src: "/icons/icon-192.png", sizes: "192x192" }],
      },
    ],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
