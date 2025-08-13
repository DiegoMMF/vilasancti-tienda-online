import { and, eq, inArray } from "drizzle-orm";
import { cookies } from "next/headers";
import { db } from "../db/index";
import {
  cartItems,
  carts,
  productImages,
  productVariants,
  products,
} from "../db/schema";
import type { Cart, CartItem } from "../types";

const CART_COOKIE_NAME = "cartId";

function calculateItemCost(quantity: number, price: string): string {
  return (Number(price) * quantity).toString();
}

function reshapeCart(cartData: any, itemsData: any[]): Cart {
  const lines: CartItem[] = itemsData.map((item) => ({
    id: item.id,
    quantity: item.quantity,
    cost: {
      totalAmount: {
        amount: calculateItemCost(item.quantity, item.variant.price.toString()),
        currencyCode: item.variant.currencyCode,
      },
    },
    merchandise: {
      id: item.variant.id,
      title: item.variant.title,
      availableForSale: item.variant.availableForSale,
      inventoryQuantity: item.variant.inventoryQuantity,
      selectedOptions: JSON.parse(item.variant.selectedOptions || "[]"),
      product: {
        id: item.product.id,
        handle: item.product.handle,
        title: item.product.title,
        featuredImage: (() => {
          const featured =
            item.images.find((img: any) => img.isFeatured) || item.images[0];
          return {
            url: featured?.url || "",
            altText: item.product.title,
            width: featured?.width || 800,
            height: featured?.height || 600,
          };
        })(),
      },
    },
  }));

  const totalQuantity = lines.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = lines.reduce(
    (sum, item) => sum + Number(item.cost.totalAmount.amount),
    0,
  );
  const currencyCode = lines[0]?.cost.totalAmount.currencyCode ?? "USD";

  return {
    id: cartData.id,
    checkoutUrl: `/checkout?cart=${cartData.id}`,
    totalQuantity,
    lines,
    cost: {
      subtotalAmount: { amount: totalAmount.toString(), currencyCode },
      totalAmount: { amount: totalAmount.toString(), currencyCode },
      totalTaxAmount: { amount: "0", currencyCode },
    },
  };
}

async function getOrCreateCart(): Promise<string> {
  const cookieStore = await cookies();
  let cartId = cookieStore.get(CART_COOKIE_NAME)?.value;

  if (!cartId) {
    const sessionId = Math.random().toString(36).substring(2);
    const [cart] = await db
      .insert(carts)
      .values({
        sessionId,
      })
      .returning();

    if (!cart) {
      throw new Error("Failed to create cart");
    }

    const newCartId: string = cart.id;
    cartId = newCartId;

    // Set cookie
    cookieStore.set(CART_COOKIE_NAME, newCartId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  }

  return cartId;
}

async function getCartWithItems(cartId: string) {
  // Obtener el carrito
  const [cartData] = await db.select().from(carts).where(eq(carts.id, cartId));

  if (!cartData) {
    return null;
  }

  // Obtener items del carrito con sus variantes
  const itemsData = await db
    .select()
    .from(cartItems)
    .innerJoin(productVariants, eq(cartItems.variantId, productVariants.id))
    .innerJoin(products, eq(productVariants.productId, products.id))
    .where(eq(cartItems.cartId, cartId));

  // Obtener imágenes para todos los productos
  const productIds = itemsData.map((item) => item.products.id);
  const allImages =
    productIds.length > 0
      ? await db
          .select()
          .from(productImages)
          .where(inArray(productImages.productId, productIds))
      : [];

  // Agrupar imágenes por producto
  const imagesByProduct = allImages.reduce(
    (acc, image) => {
      if (!acc[image.productId]) acc[image.productId] = [];
      acc[image.productId]!.push(image);
      return acc;
    },
    {} as { [key: string]: any[] },
  );

  // Combinar datos
  const itemsWithImages = itemsData.map((item) => ({
    ...item,
    images: imagesByProduct[item.products?.id || ""] || [],
  }));

  return { cartData, itemsData: itemsWithImages };
}

export async function createCart(): Promise<Cart> {
  const cartId = await getOrCreateCart();
  const cartWithItems = await getCartWithItems(cartId);

  if (!cartWithItems) {
    return {
      id: undefined,
      checkoutUrl: "",
      totalQuantity: 0,
      lines: [],
      cost: {
        subtotalAmount: { amount: "0", currencyCode: "USD" },
        totalAmount: { amount: "0", currencyCode: "USD" },
        totalTaxAmount: { amount: "0", currencyCode: "USD" },
      },
    };
  }

  return reshapeCart(cartWithItems.cartData, cartWithItems.itemsData);
}

export async function addToCart(
  lines: { merchandiseId: string; quantity: number }[],
): Promise<Cart> {
  const cartId = await getOrCreateCart();

  for (const line of lines) {
    // Verificar si el item ya existe
    const [existingItem] = await db
      .select()
      .from(cartItems)
      .where(
        and(
          eq(cartItems.cartId, cartId),
          eq(cartItems.variantId, line.merchandiseId),
        ),
      );

    if (existingItem) {
      // Actualizar cantidad
      await db
        .update(cartItems)
        .set({ quantity: existingItem.quantity + line.quantity })
        .where(eq(cartItems.id, existingItem.id));
    } else {
      // Crear nuevo item
      await db.insert(cartItems).values({
        cartId,
        variantId: line.merchandiseId,
        quantity: line.quantity,
      });
    }
  }

  const cartWithItems = await getCartWithItems(cartId);
  if (!cartWithItems) {
    throw new Error("Failed to get cart with items");
  }
  return reshapeCart(cartWithItems.cartData, cartWithItems.itemsData);
}

export async function removeFromCart(lineIds: string[]): Promise<Cart> {
  const cartId = await getOrCreateCart();

  await db
    .delete(cartItems)
    .where(and(inArray(cartItems.id, lineIds), eq(cartItems.cartId, cartId)));

  const cartWithItems = await getCartWithItems(cartId);

  if (!cartWithItems) {
    return {
      id: undefined,
      checkoutUrl: "",
      totalQuantity: 0,
      lines: [],
      cost: {
        subtotalAmount: { amount: "0", currencyCode: "USD" },
        totalAmount: { amount: "0", currencyCode: "USD" },
        totalTaxAmount: { amount: "0", currencyCode: "USD" },
      },
    };
  }

  return reshapeCart(cartWithItems.cartData, cartWithItems.itemsData);
}

export async function updateCart(
  lines: { id: string; merchandiseId: string; quantity: number }[],
): Promise<Cart> {
  const cartId = await getOrCreateCart();

  for (const line of lines) {
    if (line.quantity <= 0) {
      await db.delete(cartItems).where(eq(cartItems.id, line.id));
    } else {
      await db
        .update(cartItems)
        .set({ quantity: line.quantity })
        .where(eq(cartItems.id, line.id));
    }
  }

  const cartWithItems = await getCartWithItems(cartId);

  if (!cartWithItems) {
    return {
      id: undefined,
      checkoutUrl: "",
      totalQuantity: 0,
      lines: [],
      cost: {
        subtotalAmount: { amount: "0", currencyCode: "USD" },
        totalAmount: { amount: "0", currencyCode: "USD" },
        totalTaxAmount: { amount: "0", currencyCode: "USD" },
      },
    };
  }

  return reshapeCart(cartWithItems.cartData, cartWithItems.itemsData);
}

export async function getCart(): Promise<Cart | undefined> {
  const cookieStore = await cookies();
  const cartId = cookieStore.get(CART_COOKIE_NAME)?.value;

  if (!cartId) {
    return undefined;
  }

  const cartWithItems = await getCartWithItems(cartId);

  if (!cartWithItems) {
    return undefined;
  }

  return reshapeCart(cartWithItems.cartData, cartWithItems.itemsData);
}
