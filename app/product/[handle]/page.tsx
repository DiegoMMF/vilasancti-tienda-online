import { GridTileImage } from "components/grid/tile";
import { BreadcrumbSchema } from "components/layout/breadcrumb-schema";
import { Gallery } from "components/product/gallery";
import { ProductProvider } from "components/product/product-context";
import { ProductDescription } from "components/product/product-description";
import { ProductSchema } from "components/product/product-schema";
import PromotionalBanner from "components/promotional-banner";
import {
    getProduct,
    getProductRecommendations,
} from "lib/api/products-drizzle";
import { Image } from "lib/types";
import { baseUrl } from "lib/utils";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export const revalidate = 600; // 10 minutos

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.handle);

  if (!product) {
    return {
      title: "Producto no encontrado | Vilasancti",
      robots: { index: false, follow: true },
    };
  }

  return {
    title: `${product.title} - Pijamas Elegantes | Vilasancti`,
    description:
      product.seo?.description ||
      product.description?.slice(0, 155) ||
      `Descubre ${product.title}, pijama elegante de Vilasancti. Calidad premium y diseño sofisticado.`,
    keywords: [
      product.title,
      "pijamas elegantes",
      "sleepwear",
      "Vilasancti",
      "Argentina",
    ],
    alternates: {
      canonical: `${baseUrl}/product/${product.handle}`,
    },
    robots: {
      index: product.availableForSale,
      follow: true,
      googleBot: {
        index: product.availableForSale,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      title: product.title,
      description: product.seo?.description || product.description,
      images: product.images.map((img) => ({
        url: img.url,
        width: img.width,
        height: img.height,
        alt: img.altText || product.title,
      })),
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description: product.seo?.description || product.description,
      images: product.featuredImage?.url ? [product.featuredImage.url] : [],
    },
  };
}

async function RelatedProducts({ id }: { id: string }) {
  const relatedProducts = await getProductRecommendations(id);

  if (!relatedProducts.length) return null;

  return (
    <div className="py-8">
      <h2 className="mb-4 text-2xl font-bold">Productos Relacionados</h2>
      <ul className="flex w-full gap-4 overflow-x-auto pt-1">
        {relatedProducts.map((product) => (
          <li
            key={product.handle}
            className="aspect-square w-full flex-none min-[475px]:w-4/5 sm:w-2/5 md:w-1/3 lg:w-1/4"
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
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const resolvedParams = await params;
  const product = await getProduct(resolvedParams.handle);

  if (!product) {
    notFound();
  }

  return (
    <>
      {/* Generar breadcrumbs para la página de producto */}
      <BreadcrumbSchema breadcrumbs={[
        { name: "Inicio", url: "/" },
        { name: "Productos", url: "/category/lisos" },
        { name: product.title, url: `/product/${product.handle}` }
      ]} />
      <ProductSchema product={product} />
      
      {/* Banner Promocional */}
      <PromotionalBanner />

      <ProductProvider product={product}>
        <div className="mx-auto max-w-screen-2xl px-4">
          <div className="flex flex-col rounded-lg border border-[#bf9d6d]/20 bg-[#f0e3d7]/95 p-8 md:p-12 lg:flex-row lg:gap-8">
            <div className="h-full w-full basis-full lg:basis-4/6">
              <Gallery
                images={product.images.map((image: Image) => ({
                  src: image.url,
                  altText: image.altText || image.altText || product.title,
                }))}
              />
            </div>
            <div className="basis-full lg:basis-2/6">
              <ProductDescription product={product} />
            </div>
          </div>
          <Suspense fallback={<div className="py-8">Cargando productos relacionados...</div>}>
            <RelatedProducts id={product.id} />
          </Suspense>
        </div>
      </ProductProvider>
    </>
  );
}
