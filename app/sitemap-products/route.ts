export const dynamic = "force-dynamic";

import { getProducts } from "lib/api/products-drizzle";
import { baseUrl } from "lib/utils";

export async function GET(): Promise<Response> {
  const products = await getProducts();
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${products
    .map(
      (p) =>
        `  <url><loc>${baseUrl}/product/${p.handle}</loc><lastmod>${p.updatedAt}</lastmod></url>`,
    )
    .join("\n")}\n</urlset>`;
  return new Response(body, { headers: { "Content-Type": "application/xml" } });
}
