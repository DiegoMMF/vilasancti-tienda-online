export const dynamic = 'force-dynamic';

import { getCollections } from 'lib/api/products';
import { baseUrl } from 'lib/utils';

export async function GET(): Promise<Response> {
  const collections = await getCollections();
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${collections
    .map((c) => `  <url><loc>${baseUrl}${c.path}</loc><lastmod>${c.updatedAt}</lastmod></url>`) 
    .join('\n')}\n</urlset>`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml' } });
}


