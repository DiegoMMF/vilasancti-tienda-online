import { GridTileImage } from "components/grid/tile";
import { BreadcrumbSchema } from "components/layout/breadcrumb-schema";
import { Gallery } from "components/product/gallery";
import { ProductProvider } from "components/product/product-context";
import { ProductDescription } from "components/product/product-description";
import { ProductSchema } from "components/product/product-schema";
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

  // Generar breadcrumbs
  const breadcrumbs = [
    { name: "Inicio", url: "/" },
    { name: "Productos", url: "/category/lisos" }, // URL genérica de productos
    { name: product.title, url: `/product/${product.handle}` },
  ];

  return (
    <ProductProvider product={product}>
      {/* Schema.org Product */}
      <ProductSchema product={product} />

      {/* Schema.org Breadcrumbs */}
      <BreadcrumbSchema breadcrumbs={breadcrumbs} />

      <div className="mx-auto max-w-[80vw] px-6 lg:px-12">
        <div className="flex flex-col rounded-lg border border-[#bf9d6d]/20 bg-[#f0e3d7] p-8 md:p-12 lg:flex-row lg:gap-8">
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
    </ProductProvider>
  );
}
