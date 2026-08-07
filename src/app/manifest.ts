import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Make One Smile Today",
    short_name: "One Smile",
    description: "하루 한 사람에게 작은 미소를 선물하는 따뜻한 습관",
    start_url: "/",
    display: "standalone",
    background_color: "#FFFDF8",
    theme_color: "#FFD54F",
    lang: "ko-KR",
    orientation: "portrait",
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
