import Grid from 'components/grid';
import ProductGridItems from 'components/layout/product-grid-items';
import { getCollection, getCollectionProducts } from 'lib/api/products-drizzle';
import { defaultSort, sorting } from 'lib/constants';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export async function generateMetadata(props: {
  params: Promise<{ handle: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const params = await props.params;
  const searchParams = (await props.searchParams) || {};
  const collection = await getCollection(params.handle);
  if (!collection) return notFound();
  const hasFacets = Boolean(searchParams['color'] || searchParams['size'] || searchParams['q']);
  return {
    title: collection.seo?.title || collection.title,
    description: collection.seo?.description || collection.description || `${collection.title} products`,
    robots: hasFacets ? { index: false, follow: true } : { index: true, follow: true },
    alternates: { canonical: `/category/${collection.handle}` }
  };
}

export default async function CategoryPage(props: {
  params: Promise<{ handle: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { sort, color, size } = (searchParams || {}) as { [key: string]: string };
  const { sortKey, reverse } = sorting.find((item) => item.slug === sort) || defaultSort;
  const colors = color ? color.split(',').filter(Boolean) : undefined;
  const sizes = size ? size.split(',').filter(Boolean) : undefined;
  const products = await getCollectionProducts(params.handle);
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: products.map((p, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      url: `/product/${p.handle}`,
      name: p.title
    })),
    numberOfItems: products.length
  };

  if (!products.length) {
    const collection = await getCollection(params.handle);
    if (!collection) return notFound();
  }

  return (
    <section>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      {products.length === 0 ? (
        <p className="py-3 text-lg">{`No products found in this category`}</p>
      ) : (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems products={products} />
        </Grid>
      )}
    </section>
  );
}


