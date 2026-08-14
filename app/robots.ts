import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Preview/development deployments must never be indexed — only the real
 * production domain may allow crawling. Vercel also sends X-Robots-Tag:
 * noindex on non-production deployments; this is a second, explicit layer.
 */
export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.VERCEL_ENV === "production";

  if (!isProduction) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
