import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/cart",
          "/checkout",
          "/admin",
          "/api",
          "/search",
          "/*?*utm_*",
          "/*?*gclid*",
          "/*?*fbclid*",
        ],
      },
    ],
    sitemap: [
      "https://vilasancti.vercel.app/sitemap.xml",
      "https://vilasancti.vercel.app/sitemap-products/route",
      "https://vilasancti.vercel.app/sitemap-collections/route",
    ],
    host: "https://vilasancti.vercel.app",
  };
}
