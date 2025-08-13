import { relations } from "drizzle-orm";
import {
  cartItems,
  carts,
  collections,
  productCollections,
  productImages,
  products,
  productVariants,
} from "./schema";

// Relaciones de Collections
export const collectionsRelations = relations(collections, ({ many }) => ({
  productCollections: many(productCollections),
}));

// Relaciones de Products
export const productsRelations = relations(products, ({ many }) => ({
  variants: many(productVariants),
  images: many(productImages),
  productCollections: many(productCollections),
}));

// Relaciones de ProductVariants
export const productVariantsRelations = relations(
  productVariants,
  ({ one, many }) => ({
    product: one(products, {
      fields: [productVariants.productId],
      references: [products.id],
    }),
    cartItems: many(cartItems),
  }),
);

// Relaciones de ProductImages
export const productImagesRelations = relations(productImages, ({ one }) => ({
  product: one(products, {
    fields: [productImages.productId],
    references: [products.id],
  }),
}));

// Relaciones de ProductCollections
export const productCollectionsRelations = relations(
  productCollections,
  ({ one }) => ({
    product: one(products, {
      fields: [productCollections.productId],
      references: [products.id],
    }),
    collection: one(collections, {
      fields: [productCollections.collectionId],
      references: [collections.id],
    }),
  }),
);

// Relaciones de Cart
export const cartsRelations = relations(carts, ({ many }) => ({
  items: many(cartItems),
}));

// Relaciones de CartItem
export const cartItemsRelations = relations(cartItems, ({ one }) => ({
  cart: one(carts, {
    fields: [cartItems.cartId],
    references: [carts.id],
  }),
  productVariant: one(productVariants, {
    fields: [cartItems.variantId],
    references: [productVariants.id],
  }),
}));
