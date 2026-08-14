import type { MetadataRoute } from "next";
import { SITE_URL, allPages } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return allPages.map((page) => ({
    url: `${SITE_URL}${page.path === "/" ? "" : page.path}`,
    changeFrequency: "monthly",
    priority: page.path === "/" ? 1 : 0.7,
  }));
}
