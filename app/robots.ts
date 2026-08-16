import type { MetadataRoute } from "next";
import { isIndexable } from "@/lib/indexing";
import { SITE_URL } from "@/lib/site";

/**
 * Crawling is denied everywhere until the deployment is explicitly marked
 * indexable — see `lib/indexing.ts` for the three conditions. Previews also get
 * Vercel's own `X-Robots-Tag: noindex`; this is the layer that covers the
 * `*.vercel.app` production alias and any pre-launch production deployment.
 */
export default function robots(): MetadataRoute.Robots {
  if (!isIndexable()) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
