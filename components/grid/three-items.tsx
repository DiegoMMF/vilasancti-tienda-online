import { GridTileImage } from "components/grid/tile";
import { OverlayLink } from "components/ui/overlay-link";
import { getCollectionProducts } from "lib/api/products-drizzle";
import type { Product } from "lib/types";

function ThreeItemGridItem({
  item,
  size,
  priority,
}: {
  item: Product;
  size: "full" | "half";
  priority?: boolean;
}) {
  return (
    <div
      className={
        size === "full"
          ? "md:col-span-4 md:row-span-2"
          : "md:col-span-2 md:row-span-1"
      }
    >
      <OverlayLink
        className="relative block aspect-square h-full w-full"
        href={`/product/${item.handle}`}
        prefetch={true}
      >
        <GridTileImage
          src={item.featuredImage.url}
          fill
          sizes={
            size === "full"
              ? "(min-width: 768px) 66vw, 100vw"
              : "(min-width: 768px) 33vw, 100vw"
          }
          priority={priority}
          alt={item.title}
          label={{
            position: size === "full" ? "center" : "bottom",
            title: item.title as string,
            amount: item.priceRange.maxVariantPrice.amount,
            currencyCode: item.priceRange.maxVariantPrice.currencyCode,
          }}
        />
      </OverlayLink>
    </div>
  );
}

export async function ThreeItemGrid() {
  // Obtener todos los productos de la colección
  const allHomepageItems = await getCollectionProducts(
    "hidden-homepage-featured-items",
  );

  // Seleccionar específicamente los productos que queremos mostrar
  const firstProduct = allHomepageItems.find(item => item.handle === "pijama-animal-print-largo");
  const secondProduct = allHomepageItems.find(item => item.handle === "pijama-liso-plateado-corto");
  const thirdProduct = allHomepageItems.find(item => item.handle === "pijama-azul-cuadritos");

  if (!firstProduct || !secondProduct || !thirdProduct) return null;

  return (
    <section className="mx-auto grid max-w-[80vw] gap-6 px-6 pb-8 md:grid-cols-6 md:grid-rows-2 lg:gap-8 lg:px-12 lg:pb-16 lg:max-h-[calc(100vh-200px)]">
      <ThreeItemGridItem size="full" item={firstProduct} priority={true} />
      <ThreeItemGridItem size="half" item={secondProduct} priority={true} />
      <ThreeItemGridItem size="half" item={thirdProduct} />
    </section>
  );
}
