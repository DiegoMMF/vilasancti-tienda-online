import Grid from "components/grid";
import { GridTileImage } from "components/grid/tile";
import { Product } from "lib/types";
import Link from "next/link";
import { OverlayLink } from "components/ui/overlay-link";

export default function ProductGridItems({
  products,
}: {
  products: Product[];
}) {
  return (
    <>
      {products.map((product, index) => (
        <Grid.Item key={product.handle} className="animate-fadeIn">
          <OverlayLink
            className="relative inline-block h-full w-full"
            href={`/product/${product.handle}`}
            prefetch={true}
          >
            <GridTileImage
              alt={product.title}
              label={{
                title: product.title,
                amount: product.priceRange.maxVariantPrice.amount,
                currencyCode: product.priceRange.maxVariantPrice.currencyCode,
              }}
              src={product.featuredImage?.url}
              fill
              // Prioritize the first item image to improve LCP
              priority={index === 0}
              loading={index === 0 ? "eager" : "lazy"}
              fetchPriority={index === 0 ? "high" : undefined}
              sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
          </OverlayLink>
        </Grid.Item>
      ))}
    </>
  );
}
