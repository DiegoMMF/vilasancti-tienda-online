import { and, desc, eq, inArray, like, or } from "drizzle-orm";
import { db } from "./index";
import {
  cartItems,
  carts,
  collections,
  productCollections,
  productImages,
  products,
  productVariants,
} from "./schema";

// Utilidades para Collections
export const collectionQueries = {
  getAll: () => db.select().from(collections),
  getByHandle: (handle: string) =>
    db.select().from(collections).where(eq(collections.handle, handle)),
  getById: (id: string) =>
    db.select().from(collections).where(eq(collections.id, id)),
  getByHandles: (handles: string[]) =>
    db.select().from(collections).where(inArray(collections.handle, handles)),
};

// Utilidades para Products
export const productQueries = {
  getAll: () => db.select().from(products),
  getByHandle: (handle: string) =>
    db.select().from(products).where(eq(products.handle, handle)),
  getById: (id: string) =>
    db.select().from(products).where(eq(products.id, id)),
  getAvailable: () =>
    db.select().from(products).where(eq(products.availableForSale, true)),
  getByCollection: (collectionId: string) =>
    db
      .select()
      .from(products)
      .innerJoin(
        productCollections,
        eq(products.id, productCollections.productId),
      )
      .where(eq(productCollections.collectionId, collectionId)),
  getByCollectionHandle: (collectionHandle: string) =>
    db
      .select()
      .from(products)
      .innerJoin(
        productCollections,
        eq(products.id, productCollections.productId),
      )
      .innerJoin(
        collections,
        eq(productCollections.collectionId, collections.id),
      )
      .where(eq(collections.handle, collectionHandle)),
  search: (query: string) =>
    db
      .select()
      .from(products)
      .where(
        or(
          like(products.title, `%${query}%`),
          like(products.description, `%${query}%`),
        ),
      ),
};

// Utilidades para ProductVariants
export const variantQueries = {
  getByProduct: (productId: string) =>
    db
      .select()
      .from(productVariants)
      .where(eq(productVariants.productId, productId)),
  getAvailable: () =>
    db
      .select()
      .from(productVariants)
      .where(eq(productVariants.availableForSale, true)),
  getById: (id: string) =>
    db.select().from(productVariants).where(eq(productVariants.id, id)),
  getByProductWithInventory: (productId: string) =>
    db
      .select()
      .from(productVariants)
      .where(
        and(
          eq(productVariants.productId, productId),
          eq(productVariants.availableForSale, true),
          eq(productVariants.inventoryQuantity, 0),
        ),
      ),
};

// Utilidades para ProductImages
export const imageQueries = {
  getByProduct: (productId: string) =>
    db
      .select()
      .from(productImages)
      .where(eq(productImages.productId, productId)),
  getFeatured: (productId: string) =>
    db
      .select()
      .from(productImages)
      .where(
        and(
          eq(productImages.productId, productId),
          eq(productImages.isFeatured, true),
        ),
      ),
  getByProductOrdered: (productId: string) =>
    db
      .select()
      .from(productImages)
      .where(eq(productImages.productId, productId))
      .orderBy(desc(productImages.isFeatured)),
};

// Utilidades para Cart
export const cartQueries = {
  getBySessionId: (sessionId: string) =>
    db.select().from(carts).where(eq(carts.sessionId, sessionId)),
  getWithItems: (sessionId: string) =>
    db
      .select()
      .from(carts)
      .leftJoin(cartItems, eq(carts.id, cartItems.cartId))
      .where(eq(carts.sessionId, sessionId)),
  createOrGet: async (sessionId: string) => {
    const existing = await db
      .select()
      .from(carts)
      .where(eq(carts.sessionId, sessionId));
    if (existing.length > 0) {
      return existing[0];
    }
    const [newCart] = await db.insert(carts).values({ sessionId }).returning();
    return newCart;
  },
};

// Utilidades para CartItems
export const cartItemQueries = {
  getByCart: (cartId: string) =>
    db
      .select()
      .from(cartItems)
      .innerJoin(productVariants, eq(cartItems.variantId, productVariants.id))
      .innerJoin(products, eq(productVariants.productId, products.id))
      .where(eq(cartItems.cartId, cartId)),
  getByCartAndVariant: (cartId: string, variantId: string) =>
    db
      .select()
      .from(cartItems)
      .where(
        and(eq(cartItems.cartId, cartId), eq(cartItems.variantId, variantId)),
      ),
};

// Utilidades combinadas
export const combinedQueries = {
  getProductWithDetails: (handle: string) =>
    db
      .select()
      .from(products)
      .leftJoin(productVariants, eq(products.id, productVariants.productId))
      .leftJoin(productImages, eq(products.id, productImages.productId))
      .leftJoin(
        productCollections,
        eq(products.id, productCollections.productId),
      )
      .leftJoin(
        collections,
        eq(productCollections.collectionId, collections.id),
      )
      .where(eq(products.handle, handle)),

  getProductsByCollection: (collectionHandle: string) =>
    db
      .select()
      .from(products)
      .innerJoin(
        productCollections,
        eq(products.id, productCollections.productId),
      )
      .innerJoin(
        collections,
        eq(productCollections.collectionId, collections.id),
      )
      .leftJoin(productVariants, eq(products.id, productVariants.productId))
      .leftJoin(productImages, eq(products.id, productImages.productId))
      .where(eq(collections.handle, collectionHandle)),
};
