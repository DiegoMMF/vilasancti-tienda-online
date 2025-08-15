import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { GridTileImage } from "components/grid/tile";
import Footer from "components/layout/footer";
import { Gallery } from "components/product/gallery";
import { ProductProvider } from "components/product/product-context";
import { ProductDescription } from "components/product/product-description";
import { OverlayLink } from "components/ui/overlay-link";
import {
  getProduct,
  getProductRecommendations,
} from "lib/api/products-drizzle";
import { HIDDEN_PRODUCT_TAG } from "lib/constants";
import { Image } from "lib/types";
import { Suspense } from "react";

export async function generateMetadata(props: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  const { url, width, height, altText: alt } = product.featuredImage || {};
  const indexable = !product.tags.includes(HIDDEN_PRODUCT_TAG);

  return {
    title: product.seo.title || product.title,
    description: product.seo.description || product.description,
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: {
        index: indexable,
        follow: indexable,
      },
    },
    openGraph: url
      ? {
          images: [
            {
              url,
              width,
              height,
              alt,
            },
          ],
        }
      : null,
  };
}

export default async function ProductPage(props: {
  params: Promise<{ handle: string }>;
}) {
  const params = await props.params;
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.featuredImage.url,
    brand: product.seo?.title || "Marca",
    offers: {
      "@type": "AggregateOffer",
      availability: product.availableForSale
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      highPrice: product.priceRange.maxVariantPrice.amount,
      lowPrice: product.priceRange.minVariantPrice.amount,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: "/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Pijamas Mujer",
        item: "/search/pijamas-mujer",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.title,
        item: `/product/${product.handle}`,
      },
    ],
  };

  return (
    <ProductProvider product={product}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />

      {/* Botón Volver Flotante */}
      <div className="fixed top-20 left-4 z-50">
        <OverlayLink
          href="/search/pijamas-mujer"
          className="flex h-12 w-12 items-center justify-center rounded-full border border-[#bf9d6d]/20 bg-[#f0e3d7]/90 backdrop-blur-sm text-[#bf9d6d] transition-all duration-200 hover:bg-[#f0e3d7] hover:scale-110 hover:shadow-lg"
          aria-label="Volver a Pijamas"
        >
          <ArrowLeftIcon className="h-5 w-5" />
        </OverlayLink>
      </div>

      <div className="mx-auto max-w-[80vw] px-6 lg:px-12">
        <div className="flex flex-col rounded-lg border border-[#bf9d6d]/20 bg-[#f0e3d7] p-8 md:p-12 lg:flex-row lg:gap-8">
          {/* Espacio adicional entre secciones en mobile */}
          <div className="mb-6 lg:mb-0" />
          {/* Información del producto - arriba en mobile, derecha en desktop */}
          <div className="order-1 basis-full lg:order-2 lg:basis-2/6">
            <Suspense fallback={null}>
              <ProductDescription product={product} />
            </Suspense>
          </div>

          {/* Galería de imágenes - abajo en mobile, izquierda en desktop */}
          <div className="order-2 h-full w-full basis-full lg:order-1 lg:basis-4/6">
            <Suspense
              fallback={
                <div className="relative aspect-square h-full max-h-[80vh] w-full max-w-[80vw] mx-auto overflow-hidden" />
              }
            >
              <Gallery
                images={product.images.slice(0, 5).map((image: Image) => ({
                  src: image.url,
                  altText: image.altText,
                }))}
              />
            </Suspense>
          </div>
        </div>
        <RelatedProducts id={product.id} />
      </div>
      <Footer />
    </ProductProvider>
  );
}

async function RelatedProducts({ id }: { id: string }) {
  const relatedProducts = await getProductRecommendations(id);
  // Deduplicate by product id to avoid duplicate keys if backend returns duplicates
  const unique = relatedProducts.filter(
    (p, idx, arr) => arr.findIndex((x) => x.id === p.id) === idx,
  );

  if (!unique.length) return null;

  return (
    <div className="py-8 max-w-[80vw] mx-auto">
      <h2 className="mb-4 text-2xl font-bold text-[#bf9d6d] font-cormorant">
        Related Products
      </h2>
      <ul className="flex w-full gap-4 overflow-x-auto pt-1">
        {unique.map((product) => (
          <li
            key={product.id}
            className="aspect-square w-full flex-none min-[475px]:w-1/2 sm:w-1/3 md:w-1/4 lg:w-1/5"
          >
            <OverlayLink
              className="relative h-full w-full"
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
                sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
              />
            </OverlayLink>
          </li>
        ))}
      </ul>
    </div>
  );
}
