import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

/**
 * Only the real production domain may ever be indexed. Previews get Vercel's
 * X-Robots-Tag: noindex automatically; this adds an explicit second layer and
 * also covers the *.vercel.app production alias: until `lumensync.io` is
 * attached as the project's production domain (a separately authorized
 * cutover), every deployment serves `Disallow: /`.
 */
export default function robots(): MetadataRoute.Robots {
  const isRealProduction =
    process.env.VERCEL_ENV === "production" &&
    process.env.VERCEL_PROJECT_PRODUCTION_URL === "lumensync.io";

  if (!isRealProduction) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
