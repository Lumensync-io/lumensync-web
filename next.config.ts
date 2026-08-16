import type { NextConfig } from "next";
import { NOINDEX_HEADER, isIndexable } from "./lib/indexing";

/**
 * Response headers are resolved once per deployment, which is exactly the
 * granularity the indexing switch needs: the environment cannot change without
 * a redeploy, and a redeploy re-evaluates this.
 *
 * While the site is not indexable, every response carries an explicit
 * `X-Robots-Tag`. That is a second, independent layer to `robots.txt`: a
 * crawler holding a stale `robots.txt`, or reaching a page through a direct
 * link, still sees the page-level instruction.
 */
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  async headers() {
    const headers = [...securityHeaders];
    if (!isIndexable()) {
      headers.push({ key: "X-Robots-Tag", value: NOINDEX_HEADER });
    }
    return [{ source: "/:path*", headers }];
  },
};

export default nextConfig;
