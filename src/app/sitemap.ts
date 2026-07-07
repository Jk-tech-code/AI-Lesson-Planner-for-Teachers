import type { MetadataRoute } from "next"
import { siteConfig } from "@/config/site"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url

  // Static routes with their change frequency and priority
  const routes: MetadataRoute.Sitemap = [
    { url: baseUrl, changeFrequency: "weekly", priority: 1.0 },
    { url: `${baseUrl}/privacy`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/terms`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/refund-policy`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${baseUrl}/login`, changeFrequency: "monthly", priority: 0.2 },
    { url: `${baseUrl}/register`, changeFrequency: "monthly", priority: 0.5 },
  ]

  return routes
}
