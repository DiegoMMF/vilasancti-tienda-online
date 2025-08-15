import { and, asc, eq, inArray, like, ne, or, sql } from "drizzle-orm";
import { db } from "../db/index";
import {
    collections,
    productCollections,
    productImages,
    products,
    productVariants,
} from "../db/schema";
import type { Collection, Product } from "../types";

function reshapeProduct(
  dbProduct: any,
  variants: any[],
  images: any[],
): Product | undefined {
  if (!dbProduct) {
    return undefined;
  }

  const reshapedVariants = variants.map((variant) => ({
    id: variant.id,
    title: variant.title,
    availableForSale: variant.availableForSale,
    inventoryQuantity: variant.inventoryQuantity,
    selectedOptions: JSON.parse(variant.selectedOptions || "[]"),
    price: {
      amount: variant.price.toString(),
      currencyCode: variant.currencyCode,
    },
  }));

  const reshapedImages = images.map((image) => ({
    url: image.url,
    altText: image.altText || dbProduct.title,
    width: image.width || 800,
    height: image.height || 600,
  }));

  const featuredImage = reshapedImages.find((img) => img.url) || {
    url: "",
    altText: dbProduct.title,
    width: 800,
    height: 600,
  };

  const priceRange = {
    maxVariantPrice: {
      amount: Math.max(
        ...reshapedVariants.map((v) => Number(v.price.amount)),
      ).toString(),
      currencyCode: reshapedVariants[0]?.price.currencyCode || "ARS",
    },
    minVariantPrice: {
      amount: Math.min(
        ...reshapedVariants.map((v) => Number(v.price.amount)),
      ).toString(),
      currencyCode: reshapedVariants[0]?.price.currencyCode || "ARS",
    },
  };

  const options = reshapedVariants.reduce((acc: any[], variant) => {
    variant.selectedOptions.forEach((option: any) => {
      const existingOption = acc.find((opt) => opt.name === option.name);
      if (existingOption) {
        if (!existingOption.values.includes(option.value)) {
          existingOption.values.push(option.value);
        }
      } else {
        acc.push({
          id: option.name,
          name: option.name,
          values: [option.value],
        });
      }
    });
    return acc;
  }, []);

  return {
    id: dbProduct.id,
    handle: dbProduct.handle,
    availableForSale: dbProduct.availableForSale,
    title: dbProduct.title,
    description: dbProduct.description,
    descriptionHtml: dbProduct.descriptionHtml,
    options,
    priceRange,
    variants: reshapedVariants,
    featuredImage,
    images: reshapedImages,
    seo: {
      title: dbProduct.seoTitle || dbProduct.title,
      description: dbProduct.seoDescription || dbProduct.description,
    },
    tags: JSON.parse(dbProduct.tags || "[]"),
    updatedAt: dbProduct.updatedAt?.toISOString() || new Date().toISOString(),
  };
}

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
      description:
        dbCollection.seoDescription || dbCollection.description || "",
    },
    updatedAt:
      dbCollection.updatedAt?.toISOString() || new Date().toISOString(),
    path: `/category/${dbCollection.handle}`,
  };
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  const [dbProduct] = await db
    .select()
    .from(products)
    .where(eq(products.handle, handle));

  if (!dbProduct) {
    return undefined;
  }

  const variants = await db
    .select()
    .from(productVariants)
    .where(eq(productVariants.productId, dbProduct.id));
  const images = await db
    .select()
    .from(productImages)
    .where(eq(productImages.productId, dbProduct.id));

  return reshapeProduct(dbProduct, variants, images);
}

export async function getProducts({
  query,
  colors,
  sizes,
}: {
  query?: string;
  colors?: string[];
  sizes?: string[];
} = {}): Promise<Product[]> {
  let whereConditions = [];

  // Búsqueda por texto en título y descripción
  if (query) {
    const searchTerm = `%${query.toLowerCase()}%`;
    whereConditions.push(
      or(
        like(sql`LOWER(${products.title})`, searchTerm),
        like(sql`LOWER(${products.description})`, searchTerm)
      )
    );
  }

  // Filtros por colores y tallas
  if (colors && colors.length > 0 || sizes && sizes.length > 0) {
    const variantConditions = [];
    
    if (colors && colors.length > 0) {
      variantConditions.push(
        or(...colors.map(color => 
          like(productVariants.selectedOptions, `%"value":"${color}"%`)
        ))
      );
    }
    
    if (sizes && sizes.length > 0) {
      // Mapeo de términos de búsqueda a tallas
      const sizeMapping: { [key: string]: string[] } = {
        'chico': ['S'],
        'pequeño': ['S'],
        'pequeña': ['S'],
        'small': ['S'],
        'mediano': ['M'],
        'mediana': ['M'],
        'medium': ['M'],
        'grande': ['L'],
        'large': ['L'],
        'xl': ['XL'],
        'extra grande': ['XL'],
        'extra large': ['XL']
      };

      const searchSizes = sizes.flatMap(size => {
        const lowerSize = size.toLowerCase();
        return sizeMapping[lowerSize] || [size];
      });

      variantConditions.push(
        or(...searchSizes.map(size => 
          like(productVariants.selectedOptions, `%"value":"${size}"%`)
        ))
      );
    }

    if (variantConditions.length > 0) {
      const productIdsWithVariants = await db
        .selectDistinct({ productId: productVariants.productId })
        .from(productVariants)
        .where(or(...variantConditions));
      
      if (productIdsWithVariants.length > 0) {
        whereConditions.push(
          inArray(products.id, productIdsWithVariants.map(v => v.productId))
        );
      } else {
        // Si no hay variantes que coincidan, devolver array vacío
        return [];
      }
    }
  }

  const dbProducts = await db
    .select()
    .from(products)
    .where(whereConditions.length > 0 ? and(...whereConditions) : undefined);

  if (dbProducts.length === 0) return [];

  const productIds = dbProducts.map((p) => p.id);

  const [allVariants, allImages] = await Promise.all([
    db
      .select()
      .from(productVariants)
      .where(inArray(productVariants.productId, productIds)),
    db
      .select()
      .from(productImages)
      .where(inArray(productImages.productId, productIds)),
  ]);

  const variantsByProduct = new Map<string, any[]>();
  for (const v of allVariants) {
    const arr = variantsByProduct.get(v.productId) || [];
    arr.push(v);
    variantsByProduct.set(v.productId, arr);
  }

  const imagesByProduct = new Map<string, any[]>();
  for (const img of allImages) {
    const arr = imagesByProduct.get(img.productId) || [];
    arr.push(img);
    imagesByProduct.set(img.productId, arr);
  }

  return dbProducts
    .map((p) =>
      reshapeProduct(
        p,
        variantsByProduct.get(p.id) || [],
        imagesByProduct.get(p.id) || [],
      ),
    )
    .filter(Boolean) as Product[];
}

export async function getCollection(
  handle: string,
): Promise<Collection | undefined> {
  const [dbCollection] = await db
    .select()
    .from(collections)
    .where(eq(collections.handle, handle));
  return reshapeCollection(dbCollection);
}

export async function getCollections(): Promise<Collection[]> {
  const dbCollections = await db
    .select()
    .from(collections)
    .orderBy(asc(collections.title));
  return dbCollections.map(reshapeCollection).filter(Boolean) as Collection[];
}

export async function getCollectionProducts(
  collection: string,
): Promise<Product[]> {
  const collectionProducts = await db
    .select()
    .from(products)
    .innerJoin(
      productCollections,
      eq(products.id, productCollections.productId),
    )
    .innerJoin(collections, eq(productCollections.collectionId, collections.id))
    .where(eq(collections.handle, collection));
  if (collectionProducts.length === 0) return [];

  const productIds = collectionProducts.map((cp) => cp.products.id);
  const [allVariants, allImages] = await Promise.all([
    db
      .select()
      .from(productVariants)
      .where(inArray(productVariants.productId, productIds)),
    db
      .select()
      .from(productImages)
      .where(inArray(productImages.productId, productIds)),
  ]);

  const variantsByProduct = new Map<string, any[]>();
  for (const v of allVariants) {
    const arr = variantsByProduct.get(v.productId) || [];
    arr.push(v);
    variantsByProduct.set(v.productId, arr);
  }

  const imagesByProduct = new Map<string, any[]>();
  for (const img of allImages) {
    const arr = imagesByProduct.get(img.productId) || [];
    arr.push(img);
    imagesByProduct.set(img.productId, arr);
  }

  return collectionProducts
    .map((cp) =>
      reshapeProduct(
        cp.products,
        variantsByProduct.get(cp.products.id) || [],
        imagesByProduct.get(cp.products.id) || [],
      ),
    )
    .filter(Boolean) as Product[];
}

export async function getProductRecommendations(
  productId: string,
): Promise<Product[]> {
  const [currentProduct] = await db
    .select()
    .from(products)
    .where(eq(products.id, productId));

  if (!currentProduct) {
    return [];
  }

  const relatedProducts = await db
    .select()
    .from(products)
    .innerJoin(
      productCollections,
      eq(products.id, productCollections.productId),
    )
    .innerJoin(collections, eq(productCollections.collectionId, collections.id))
    .where(
      and(eq(products.id, productId), eq(products.availableForSale, true)),
    );

  const collectionIds = relatedProducts.map((rp) => rp.collections.id);

  if (collectionIds.length === 0) {
    return [];
  }

  // First, fetch distinct product IDs of recommendations to satisfy GROUP BY rules
  const recIdRows = await db
    .select({ id: products.id })
    .from(products)
    .innerJoin(
      productCollections,
      eq(products.id, productCollections.productId),
    )
    .where(
      and(
        inArray(productCollections.collectionId, collectionIds),
        ne(products.id, productId),
        eq(products.availableForSale, true),
      ),
    )
    .orderBy(sql`random()`)
    .groupBy(products.id)
    .limit(4);

  if (recIdRows.length === 0) return [];

  const recIds = recIdRows.map((r) => r.id);

  // Then fetch full product records for those IDs
  const dbRecProducts = await db
    .select()
    .from(products)
    .where(inArray(products.id, recIds));
  const [allVariants, allImages] = await Promise.all([
    db
      .select()
      .from(productVariants)
      .where(inArray(productVariants.productId, recIds)),
    db
      .select()
      .from(productImages)
      .where(inArray(productImages.productId, recIds)),
  ]);

  const variantsByProduct = new Map<string, any[]>();
  for (const v of allVariants) {
    const arr = variantsByProduct.get(v.productId) || [];
    arr.push(v);
    variantsByProduct.set(v.productId, arr);
  }

  const imagesByProduct = new Map<string, any[]>();
  for (const img of allImages) {
    const arr = imagesByProduct.get(img.productId) || [];
    arr.push(img);
    imagesByProduct.set(img.productId, arr);
  }

  return dbRecProducts
    .map((rec) =>
      reshapeProduct(
        rec,
        variantsByProduct.get(rec.id) || [],
        imagesByProduct.get(rec.id) || [],
      ),
    )
    .filter(Boolean) as Product[];
}
