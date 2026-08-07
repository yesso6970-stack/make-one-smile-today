import type { MetadataRoute } from "next";

import { APP_URL } from "@/constants/app";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    "",
    "/target",
    "/settings",
    "/about",
    "/privacy",
    "/terms",
    "/contact",
    "/licenses",
  ];
  return routes.map((route) => ({
    url: `${APP_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "monthly",
    priority: route === "" ? 1 : 0.6,
  }));
}
