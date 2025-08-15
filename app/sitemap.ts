import { MetadataRoute } from "next";
import { db } from "lib/db";
import { products, collections } from "lib/db/schema";

async function getProducts() {
  return await db
    .select({
      handle: products.handle,
      updatedAt: products.updatedAt,
    })
    .from(products);
}

async function getCollections() {
  return await db
    .select({
      handle: collections.handle,
      updatedAt: collections.updatedAt,
    })
    .from(collections);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, collections] = await Promise.all([
    getProducts(),
    getCollections(),
  ]);

  return [
    {
      url: "https://vilasancti.vercel.app/",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    // Páginas estáticas importantes
    {
      url: "https://vilasancti.vercel.app/nuestra-historia",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: "https://vilasancti.vercel.app/envios-y-devoluciones",
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    // Colecciones principales (excluyendo las ocultas del sistema)
    ...collections
      .filter((collection) => !collection.handle.startsWith("hidden-"))
      .map((collection) => ({
        url: `https://vilasancti.vercel.app/category/${collection.handle}`,
        lastModified: collection.updatedAt || new Date(),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
    // Productos
    ...products.map((product) => ({
      url: `https://vilasancti.vercel.app/product/${product.handle}`,
      lastModified: product.updatedAt || new Date(),
      changeFrequency: "daily" as const,
      priority: 0.7,
    })),
  ];
}
