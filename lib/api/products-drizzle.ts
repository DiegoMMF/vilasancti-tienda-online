import { and, asc, eq, inArray } from "drizzle-orm";
import { db } from "../db/index";
import { collections, productCollections, productImages, products, productVariants } from "../db/schema";
import type { Collection, Product } from "../types";

function reshapeProduct(dbProduct: any, variants: any[], images: any[]): Product | undefined {
  if (!dbProduct) {
    return undefined;
  }

  const reshapedVariants = variants.map(variant => ({
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

  const reshapedImages = images.map(image => ({
    url: image.url,
    altText: image.altText || dbProduct.title,
    width: image.width || 800,
    height: image.height || 600,
  }));

  const featuredImage = reshapedImages.find(img => img.url) || {
    url: "",
    altText: dbProduct.title,
    width: 800,
    height: 600,
  };

  const priceRange = {
    maxVariantPrice: {
      amount: Math.max(...reshapedVariants.map(v => Number(v.price.amount))).toString(),
      currencyCode: reshapedVariants[0]?.price.currencyCode || "ARS",
    },
    minVariantPrice: {
      amount: Math.min(...reshapedVariants.map(v => Number(v.price.amount))).toString(),
      currencyCode: reshapedVariants[0]?.price.currencyCode || "ARS",
    },
  };

  const options = reshapedVariants.reduce((acc: any[], variant) => {
    variant.selectedOptions.forEach((option: any) => {
      const existingOption = acc.find(opt => opt.name === option.name);
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
      description: dbCollection.seoDescription || dbCollection.description || "",
    },
    updatedAt: dbCollection.updatedAt?.toISOString() || new Date().toISOString(),
    path: `/category/${dbCollection.handle}`,
  };
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  const [dbProduct] = await db.select().from(products).where(eq(products.handle, handle));
  
  if (!dbProduct) {
    return undefined;
  }

  const variants = await db.select().from(productVariants).where(eq(productVariants.productId, dbProduct.id));
  const images = await db.select().from(productImages).where(eq(productImages.productId, dbProduct.id));

  return reshapeProduct(dbProduct, variants, images);
}

export async function getProducts(): Promise<Product[]> {
  const dbProducts = await db.select().from(products);
  const results = [];

  for (const product of dbProducts) {
    const variants = await db.select().from(productVariants).where(eq(productVariants.productId, product.id));
    const images = await db.select().from(productImages).where(eq(productImages.productId, product.id));
    
    const reshapedProduct = reshapeProduct(product, variants, images);
    if (reshapedProduct) {
      results.push(reshapedProduct);
    }
  }

  return results;
}

export async function getCollection(handle: string): Promise<Collection | undefined> {
  const [dbCollection] = await db.select().from(collections).where(eq(collections.handle, handle));
  return reshapeCollection(dbCollection);
}

export async function getCollections(): Promise<Collection[]> {
  const dbCollections = await db.select().from(collections).orderBy(asc(collections.title));
  return dbCollections.map(reshapeCollection).filter(Boolean) as Collection[];
}

export async function getCollectionProducts(collection: string): Promise<Product[]> {
  const collectionProducts = await db.select()
    .from(products)
    .innerJoin(productCollections, eq(products.id, productCollections.productId))
    .innerJoin(collections, eq(productCollections.collectionId, collections.id))
    .where(eq(collections.handle, collection));

  const results = [];

  for (const cp of collectionProducts) {
    const variants = await db.select().from(productVariants).where(eq(productVariants.productId, cp.products.id));
    const images = await db.select().from(productImages).where(eq(productImages.productId, cp.products.id));
    
    const reshapedProduct = reshapeProduct(cp.products, variants, images);
    if (reshapedProduct) {
      results.push(reshapedProduct);
    }
  }

  return results;
}

export async function getProductRecommendations(productId: string): Promise<Product[]> {
  const [currentProduct] = await db.select().from(products).where(eq(products.id, productId));
  
  if (!currentProduct) {
    return [];
  }

  const relatedProducts = await db.select()
    .from(products)
    .innerJoin(productCollections, eq(products.id, productCollections.productId))
    .innerJoin(collections, eq(productCollections.collectionId, collections.id))
    .where(
      and(
        eq(products.id, productId),
        eq(products.availableForSale, true)
      )
    );

  const collectionIds = relatedProducts.map(rp => rp.collections.id);

  if (collectionIds.length === 0) {
    return [];
  }

  const recommendations = await db.select()
    .from(products)
    .innerJoin(productCollections, eq(products.id, productCollections.productId))
    .where(
      and(
        inArray(productCollections.collectionId, collectionIds),
        eq(products.id, productId),
        eq(products.availableForSale, true)
      )
    )
    .limit(4);

  const results = [];

  for (const rec of recommendations) {
    const variants = await db.select().from(productVariants).where(eq(productVariants.productId, rec.products.id));
    const images = await db.select().from(productImages).where(eq(productImages.productId, rec.products.id));
    
    const reshapedProduct = reshapeProduct(rec.products, variants, images);
    if (reshapedProduct) {
      results.push(reshapedProduct);
    }
  }

  return results;
}
