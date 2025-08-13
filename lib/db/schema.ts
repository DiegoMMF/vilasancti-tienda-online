import { createId } from "@paralleldrive/cuid2";
import {
  boolean,
  decimal,
  integer,
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

// Tabla Collections
export const collections = pgTable("collections", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  handle: text("handle").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  seoTitle: text("seoTitle"),
  seoDescription: text("seoDescription"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

// Tabla Products
export const products = pgTable("products", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  handle: text("handle").notNull().unique(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  descriptionHtml: text("descriptionHtml").notNull(),
  availableForSale: boolean("availableForSale").notNull().default(true),
  tags: text("tags"), // JSON string
  seoTitle: text("seoTitle"),
  seoDescription: text("seoDescription"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

// Tabla ProductVariants
export const productVariants = pgTable("product_variants", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  productId: text("productId")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  currencyCode: text("currencyCode").notNull().default("USD"),
  availableForSale: boolean("availableForSale").notNull().default(true),
  selectedOptions: text("selectedOptions"), // JSON string
  inventoryQuantity: integer("inventoryQuantity").notNull().default(0),
});

// Tabla ProductImages
export const productImages = pgTable("product_images", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  productId: text("productId")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  url: text("url").notNull(),
  altText: text("altText"),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  isFeatured: boolean("isFeatured").notNull().default(false),
});

// Tabla ProductCollections (relación muchos a muchos)
export const productCollections = pgTable("product_collections", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  productId: text("productId")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  collectionId: text("collectionId")
    .notNull()
    .references(() => collections.id, { onDelete: "cascade" }),
});

// Tabla Cart
export const carts = pgTable("carts", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  sessionId: text("sessionId").notNull().unique(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .$onUpdateFn(() => new Date()),
});

// Tabla CartItem
export const cartItems = pgTable("cart_items", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  cartId: text("cartId")
    .notNull()
    .references(() => carts.id, { onDelete: "cascade" }),
  variantId: text("variantId")
    .notNull()
    .references(() => productVariants.id, { onDelete: "cascade" }),
  quantity: integer("quantity").notNull().default(1),
});

// Tipos TypeScript
export type Collection = typeof collections.$inferSelect;
export type NewCollection = typeof collections.$inferInsert;
export type Product = typeof products.$inferSelect;
export type NewProduct = typeof products.$inferInsert;
export type ProductVariant = typeof productVariants.$inferSelect;
export type NewProductVariant = typeof productVariants.$inferInsert;
export type ProductImage = typeof productImages.$inferSelect;
export type NewProductImage = typeof productImages.$inferInsert;
export type ProductCollection = typeof productCollections.$inferSelect;
export type NewProductCollection = typeof productCollections.$inferInsert;
export type Cart = typeof carts.$inferSelect;
export type NewCart = typeof carts.$inferInsert;
export type CartItem = typeof cartItems.$inferSelect;
export type NewCartItem = typeof cartItems.$inferInsert;
