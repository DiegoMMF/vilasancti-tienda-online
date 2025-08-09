import type { Prisma } from "@prisma/client";
import { prisma } from "../db";
import type { Collection, Product } from "../types";

const HIDDEN_PRODUCT_TAG = "hidden";

// Helper function to reshape product data
function reshapeProduct(dbProduct: any): Product | undefined {
  if (!dbProduct) {
    return undefined;
  }

  const tags = JSON.parse(dbProduct.tags || "[]");

  // Check if product is hidden
  if (tags.includes(HIDDEN_PRODUCT_TAG)) {
    return undefined;
  }
  const variants = dbProduct.variants.map((variant: any) => ({
    id: variant.id,
    title: variant.title,
    availableForSale: variant.availableForSale,
    selectedOptions: JSON.parse(variant.selectedOptions || "[]"),
    price: {
      amount: variant.price.toString(),
      currencyCode: variant.currencyCode,
    },
  }));

  const images = dbProduct.images.map((image: any) => ({
    url: image.url,
    altText: image.altText || `${dbProduct.title} - ${image.url.split("/").pop()}`,
    width: image.width,
    height: image.height,
    // Nota: isFeatured no está en el tipo público Image, pero lo usamos internamente
    isFeatured: image.isFeatured,
  }));

  const featuredImage =
    images.find((img: any) => img.isFeatured) ||
    images[0] || {
      url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&h=600&fit=crop",
      altText: dbProduct.title,
      width: 800,
      height: 600,
    };

  // Opciones derivadas para el selector de variantes
  const sizeValues = ["XS", "S", "M", "L", "XL"]; // mostrar siempre todos los talles
  const colorValuesSet = new Set<string>();
  for (const variant of variants) {
    for (const opt of variant.selectedOptions) {
      if (opt.name.toLowerCase() === "color") {
        colorValuesSet.add(opt.value);
      }
    }
  }
  const colorValues = Array.from(colorValuesSet);
  const options = [
    { id: "color", name: "Color", values: colorValues },
    { id: "talla", name: "Talla", values: sizeValues },
  ];

  // Calculate price range (set to a fixed ARS price for all variants)
  const prices = variants.map((v: any) => 79999);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  return {
    id: dbProduct.id,
    handle: dbProduct.handle,
    // Disponible si al menos una variante está disponible
    availableForSale: variants.some((v: any) => v.availableForSale === true),
    title: dbProduct.title,
    description: dbProduct.description,
    descriptionHtml: dbProduct.descriptionHtml,
    options,
    priceRange: {
      maxVariantPrice: {
        amount: maxPrice.toString(),
        currencyCode: "ARS",
      },
      minVariantPrice: {
        amount: minPrice.toString(),
        currencyCode: "ARS",
      },
    },
    variants,
    featuredImage,
    images,
    seo: {
      title: dbProduct.seoTitle || dbProduct.title,
      description: dbProduct.seoDescription || dbProduct.description,
    },
    tags,
    updatedAt: dbProduct.updatedAt.toISOString(),
  };
}

// Helper function to reshape collection data
function reshapeCollection(dbCollection: any): Collection | undefined {
  if (!dbCollection) {
    return undefined;
  }

  return {
    handle: dbCollection.handle,
    title: dbCollection.title,
    description: dbCollection.description || "",
    seo: {
      title: dbCollection.seoTitle || dbCollection.title,
      description: dbCollection.seoDescription || dbCollection.description || "",
    },
    updatedAt: dbCollection.updatedAt.toISOString(),
    path: `/category/${dbCollection.handle}`,
  };
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  const dbProduct = await prisma.product.findUnique({
    where: { handle },
    include: {
      variants: true,
      images: true,
      collections: {
        include: {
          collection: true,
        },
      },
    },
  });

  return reshapeProduct(dbProduct);
}

export async function getProducts({
  query,
  reverse,
  sortKey,
  colors,
  sizes,
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
  colors?: string[];
  sizes?: string[];
}): Promise<Product[]> {
  const baseWhere: any = query
    ? {
        OR: [{ title: { contains: query } }, { description: { contains: query } }],
      }
    : {};

  // Filtros por variantes basados en JSON string en selectedOptions
  const variantFilters: any[] = [];
  if (colors && colors.length > 0) {
    variantFilters.push({
      OR: colors.map((c) => ({
        selectedOptions: { contains: `\"name\":\"Color\",\"value\":\"${c}\"` },
      })),
    });
  }
  if (sizes && sizes.length > 0) {
    variantFilters.push({
      OR: sizes.map((s) => ({
        selectedOptions: { contains: `\"name\":\"Talla\",\"value\":\"${s}\"` },
      })),
    });
  }

  const where =
    variantFilters.length > 0
      ? {
          AND: [
            baseWhere,
            {
              variants: {
                some: {
                  AND: variantFilters,
                },
              },
            },
          ],
        }
      : baseWhere;

  const orderBy: Prisma.ProductOrderByWithRelationInput =
    sortKey === "CREATED_AT"
      ? { createdAt: reverse ? "desc" : "asc" }
      : sortKey === "TITLE"
        ? { title: reverse ? "desc" : "asc" }
        : { updatedAt: reverse ? "desc" : "asc" };

  const dbProducts = await prisma.product.findMany({
    where,
    orderBy,
    include: {
      variants: true,
      images: true,
    },
  });

  return dbProducts.map(reshapeProduct).filter(Boolean) as Product[];
}

export async function getCollection(
  handle: string
): Promise<Collection | undefined> {
  const dbCollection = await prisma.collection.findUnique({
    where: { handle },
  });

  return reshapeCollection(dbCollection);
}

export async function getCollections(): Promise<Collection[]> {
  const dbCollections = await prisma.collection.findMany({
    orderBy: { title: "asc" as const },
  });

  const collections = [
    {
      handle: "",
      title: "All",
      description: "All products",
      seo: {
        title: "All",
        description: "All products",
      },
      path: "/search",
      updatedAt: new Date().toISOString(),
    },
    ...dbCollections
      .map(reshapeCollection)
      .filter(Boolean)
      .filter((collection) => !collection?.handle.startsWith("hidden")),
  ] as Collection[];

  return collections;
}

export async function getCollectionProducts({
  collection,
  reverse,
  sortKey,
  colors,
  sizes,
}: {
  collection: string;
  reverse?: boolean;
  sortKey?: string;
  colors?: string[];
  sizes?: string[];
}): Promise<Product[]> {
  if (!collection) {
    return getProducts({ reverse, sortKey, colors, sizes });
  }

  const variantFilters: any[] = [];
  if (colors && colors.length > 0) {
    variantFilters.push({
      OR: colors.map((c) => ({
        selectedOptions: { contains: `\"name\":\"Color\",\"value\":\"${c}\"` },
      })),
    });
  }
  if (sizes && sizes.length > 0) {
    variantFilters.push({
      OR: sizes.map((s) => ({
        selectedOptions: { contains: `\"name\":\"Talla\",\"value\":\"${s}\"` },
      })),
    });
  }

  const dbProducts = await prisma.product.findMany({
    where: {
      collections: {
        some: {
          collection: {
            handle: collection,
          },
        },
      },
      ...(variantFilters.length > 0 && {
        variants: { some: { AND: variantFilters } },
      }),
    },
    include: {
      variants: true,
      images: true,
    },
    orderBy:
      sortKey === "CREATED_AT"
        ? ({ createdAt: reverse ? "desc" : "asc" } as const)
        : sortKey === "TITLE"
          ? ({ title: reverse ? "desc" : "asc" } as const)
          : ({ updatedAt: reverse ? "desc" : "asc" } as const),
  });

  return dbProducts.map(reshapeProduct).filter(Boolean) as Product[];
}

export async function getProductRecommendations(
  productId: string
): Promise<Product[]> {
  // Simple recommendation: get products from the same collections
  const dbProduct = await prisma.product.findUnique({
    where: { id: productId },
    include: {
      collections: {
        include: {
          collection: {
            include: {
              products: {
                include: {
                  product: {
                    include: {
                      variants: true,
                      images: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!dbProduct) return [];

  // Use a Map to deduplicate products by ID
  const productMap = new Map();

  dbProduct.collections
    .flatMap((c) => c.collection.products)
    .map((pc) => pc.product)
    .filter((p) => p.id !== productId)
    .forEach((product) => {
      if (!productMap.has(product.id)) {
        productMap.set(product.id, product);
      }
    });

  const recommendedProducts = Array.from(productMap.values()).slice(0, 4);

  return recommendedProducts.map(reshapeProduct).filter(Boolean) as Product[];
}
