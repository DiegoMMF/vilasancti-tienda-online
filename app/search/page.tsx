import Grid from "components/grid";
import ProductGridItems from "components/layout/product-grid-items";
import { getProducts } from "lib/api/products-drizzle";
import { defaultSort, sorting } from "lib/constants";
import type { Metadata } from "next";

// metadata is generated dynamically via generateMetadata

// Revalidate search page periodically to avoid DB hits for every request
export const revalidate = 600;

export async function generateMetadata(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}): Promise<Metadata> {
  const searchParams = (await props.searchParams) || {};
  const hasFacets = Boolean(
    searchParams["color"] || searchParams["size"] || searchParams["q"],
  );
  return {
    robots: hasFacets
      ? { index: false, follow: true }
      : { index: true, follow: true },
    alternates: { canonical: "/search" },
  };
}
export default async function SearchPage(props: {
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const searchParams = await props.searchParams;
  const {
    sort,
    q: searchValue,
    color,
    size,
  } = searchParams as { [key: string]: string };
  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;

  const colors = color ? color.split(",").filter(Boolean) : undefined;
  const sizes = size ? size.split(",").filter(Boolean) : undefined;

  const products = await getProducts({
    query: searchValue,
    colors,
    sizes,
  });
  const resultsText = products.length > 1 ? "resultados" : "resultado";
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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      {searchValue ? (
        <p className="mb-4 text-[#bf9d6d] font-cormorant">
          {products.length === 0
            ? "No hay productos que coincidan con "
            : `Mostrando ${products.length} ${resultsText} para `}
          <span className="font-bold">&quot;{searchValue}&quot;</span>
        </p>
      ) : null}
      {products.length > 0 ? (
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems products={products} />
        </Grid>
      ) : null}
    </>
  );
}
