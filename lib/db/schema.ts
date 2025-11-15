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
  currencyCode: text("currencyCode").notNull().default("ARS"),
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

// Tabla Users
export const users = pgTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  email: text("email").notNull().unique(),
  passwordHash: text("passwordHash").notNull(),
  name: text("name"),
  role: text("role").notNull().default("client"),
  emailVerified: boolean("emailVerified").notNull().default(false),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

// Tabla Discounts
export const discounts = pgTable("discounts", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  code: text("code"),
  name: text("name").notNull(),
  type: text("type").notNull(),
  value: decimal("value", { precision: 10, scale: 2 }).notNull(),
  startsAt: timestamp("startsAt"),
  endsAt: timestamp("endsAt"),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

// Tabla Analytics Events
export const analyticsEvents = pgTable("analytics_events", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  type: text("type").notNull(),
  productId: text("productId"),
  variantId: text("variantId"),
  metadata: text("metadata"),
  createdAt: timestamp("createdAt").defaultNow(),
});

// Tabla Sessions
export const sessions = pgTable("sessions", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  token: text("token").notNull().unique(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("createdAt").defaultNow(),
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
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Discount = typeof discounts.$inferSelect;
export type NewDiscount = typeof discounts.$inferInsert;
export type AnalyticsEvent = typeof analyticsEvents.$inferSelect;
export type NewAnalyticsEvent = typeof analyticsEvents.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;
