import { getCollection, getCollectionProducts } from "lib/api/products-drizzle";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import Grid from "components/grid";
import ProductGridItems from "components/layout/product-grid-items";
import { defaultSort, sorting } from "lib/constants";

// Revalidate collection search pages periodically to cache listing content
export const revalidate = 600;

export async function generateMetadata(props: {
  params: Promise<{ collection: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const params = await props.params;
  const searchParams = (await props.searchParams) || {};
  const collection = await getCollection(params.collection);

  if (!collection) return notFound();

  const hasFacets = Boolean(
    searchParams["color"] || searchParams["size"] || searchParams["q"],
  );

  return {
    title: collection.seo?.title || collection.title,
    description:
      collection.seo?.description ||
      collection.description ||
      `${collection.title} products`,
    robots: hasFacets
      ? { index: false, follow: true }
      : { index: true, follow: true },
    alternates: { canonical: `/search/${collection.handle}` },
  };
}

export default async function CategoryPage(props: {
  params: Promise<{ collection: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const params = await props.params;
  const { sort, color, size } = searchParams as { [key: string]: string };
  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;
  const colors = color ? color.split(",").filter(Boolean) : undefined;
  const sizes = size ? size.split(",").filter(Boolean) : undefined;
  const products = await getCollectionProducts(
    params.collection,
    sortKey,
    reverse,
  );
  const itemListJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: products.map((p, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      url: `/product/${p.handle}`,
      name: p.title,
    })),
    numberOfItems: products.length,
  };

  return (
    <section className="mx-auto max-w-[70vw] px-6 py-8 lg:px-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      {products.length === 0 ? (
        <p className="py-3 text-lg text-[#bf9d6d] font-cormorant">{`No products found in this collection`}</p>
      ) : (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems products={products} />
        </Grid>
      )}
    </section>
  );
}
