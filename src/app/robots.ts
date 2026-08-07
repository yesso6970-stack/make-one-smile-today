import type { MetadataRoute } from "next";

import { APP_URL } from "@/constants/app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: ["/api/"] },
    sitemap: `${APP_URL}/sitemap.xml`,
    host: APP_URL,
  };
}
