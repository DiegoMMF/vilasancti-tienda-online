import { CategorySchema } from "components/category/category-schema";
import { BreadcrumbSchema } from "components/layout/breadcrumb-schema";
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

      {/* Hero Section */}
      <section className="category-intro py-16 lg:py-24">
        <div className="relative mx-auto max-w-4xl px-6">
          <div className="bg-white/30 backdrop-blur-sm rounded-3xl p-6 md:p-12 border border-[#bf9d6d]/10 shadow-2xl">
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-[#bf9d6d] font-cormorant tracking-wider leading-tight">
              {collection.title}
            </h1>
            <p className="text-base md:text-lg lg:text-xl text-[#bf9d6d]/85 font-inter font-medium leading-relaxed mt-6">
              {collection.description}
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="product-card">
                {/* Product card content */}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
