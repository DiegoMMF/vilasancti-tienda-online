import { CategorySchema } from "components/category/category-schema";
import Grid from "components/grid";
import { BreadcrumbSchema } from "components/layout/breadcrumb-schema";
import ProductGridItems from "components/layout/product-grid-items";
import { getCollection, getCollectionProducts } from "lib/api/products-drizzle";
import { baseUrl } from "lib/utils";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

// Revalidate category pages periodically to cache listing content
export const revalidate = 600;

export async function generateMetadata({
  params,
  searchParams,
}: {
  params: Promise<{ handle: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const resolvedSearchParams = (await searchParams) || {};

  const collection = await getCollection(resolvedParams.handle);
  const hasFilters = Object.keys(resolvedSearchParams).length > 0;

  if (!collection) {
    return {
      title: "Categoría no encontrada | Vilasancti",
      robots: { index: false, follow: true },
    };
  }

  // No indexar páginas con filtros complejos
  if (hasFilters) {
    return {
      robots: { index: false, follow: true },
      alternates: {
        canonical: `${baseUrl}/category/${resolvedParams.handle}`,
      },
    };
  }

  const products = await getCollectionProducts(
    resolvedParams.handle,
    "RELEVANCE",
    false,
  );

  return {
    title: `${collection.title} - ${products.length} Pijamas Elegantes | Vilasancti`,
    description: `Descubre ${products.length} ${collection.title.toLowerCase()} de la más alta calidad. Pijamas que realzan tu belleza y transmiten distinción. Envío gratis en Argentina.`,
    keywords: [
      `pijamas ${collection.title.toLowerCase()}`,
      "sleepwear",
      "elegancia",
      "Vilasancti",
      "Argentina",
    ],
    alternates: {
      canonical: `${baseUrl}/category/${resolvedParams.handle}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title: `${collection.title} | Vilasancti`,
      description: `Los mejores ${collection.title.toLowerCase()} del mercado. Envío gratis en Argentina.`,
      images: [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${collection.title} | Vilasancti`,
      description: `Los mejores ${collection.title.toLowerCase()} del mercado.`,
    },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ handle: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = (await searchParams) || {};

  const collection = await getCollection(resolvedParams.handle);
  const products = await getCollectionProducts(
    resolvedParams.handle,
    "RELEVANCE",
    false,
  );

  if (!collection) {
    notFound();
  }

  // Generar breadcrumbs
  const breadcrumbs = [
    { name: "Inicio", url: "/" },
    { name: collection.title, url: `/category/${collection.handle}` },
  ];

  return (
    <>
      {/* Schema.org Category */}
      <CategorySchema collection={collection} products={products} />

      {/* Schema.org Breadcrumbs */}
      <BreadcrumbSchema breadcrumbs={breadcrumbs} />
      {/* Products Grid */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-6">
          {products.length === 0 ? (
            <p className="py-3 text-lg text-[#bf9d6d] font-cormorant text-center">
              No se encontraron productos en esta categoría
            </p>
          ) : (
            <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              <ProductGridItems products={products} />
            </Grid>
          )}
        </div>
      </section>
    </>
  );
}
