"use server";

import {
  addToCart,
  createCart,
  getCart,
  removeFromCart,
  updateCart,
} from "lib/api/cart-drizzle";
import { TAGS } from "lib/constants";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function addItem(
  prevState: any,
  selectedVariantId: string | undefined,
) {
  if (!selectedVariantId) {
    return "Error adding item to cart";
  }

  try {
    await addToCart([{ merchandiseId: selectedVariantId, quantity: 1 }]);
    revalidateTag(TAGS.cart);
    return null; // Success
  } catch (e) {
    console.error(e);
    return "Error adding item to cart";
  }
}

export async function removeItem(prevState: any, merchandiseId: string) {
  try {
    const cart = await getCart();

    if (!cart) {
      return "Error fetching cart";
    }

    const lineItem = cart.lines.find(
      (line) => line.merchandise.id === merchandiseId,
    );

    if (lineItem && lineItem.id) {
      await removeFromCart([lineItem.id]);
      revalidateTag(TAGS.cart);
      return null; // Success
    } else {
      return "Item not found in cart";
    }
  } catch (e) {
    console.error(e);
    return "Error removing item from cart";
  }
}

export async function updateItemQuantity(
  prevState: any,
  payload: {
    merchandiseId: string;
    quantity: number;
  },
) {
  const { merchandiseId, quantity } = payload;

  try {
    const cart = await getCart();

    if (!cart) {
      return "Error fetching cart";
    }

    const lineItem = cart.lines.find(
      (line) => line.merchandise.id === merchandiseId,
    );

    if (lineItem && lineItem.id) {
      if (quantity === 0) {
        await removeFromCart([lineItem.id]);
      } else if (quantity > 0) {
        await updateCart([
          {
            id: lineItem.id,
            merchandiseId,
            quantity,
          },
        ]);
      } else {
        return "Invalid quantity";
      }
    } else if (quantity > 0) {
      // If the item doesn't exist in the cart and quantity > 0, add it
      await addToCart([{ merchandiseId, quantity }]);
    } else {
      return "Item not found in cart";
    }

    revalidateTag(TAGS.cart);
    return null; // Success
  } catch (e) {
    console.error(e);
    return "Error updating item quantity";
  }
}

export async function redirectToCheckout() {
  const cart = await getCart();
  const phone = "5493544543637";
  const lines = cart?.lines ?? [];

  if (lines.length === 0) {
    // Si el carrito está vacío, mensaje genérico
    const text =
      "Hola, me han redirigido de la web Vilasancti. Quisiera hacer una consulta.";
    const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
    redirect(url);
  }

  // Construir mensaje con todos los items
  let messageBase =
    "Hola, me han redirigido de la web Vilasancti. Quisiera comprar:\n\n";

  const itemsList = lines
    .map((line, index) => {
      const productTitle = line.merchandise.product.title || "pijama";
      const variantTitle = line.merchandise.title || "";
      const quantity = line.quantity;

      // Extraer talle y color desde selectedOptions
      const opts = line.merchandise.selectedOptions || [];
      const talla =
        opts.find((o) => o.name.toLowerCase() === "talla")?.value || "";
      const color =
        opts.find((o) => o.name.toLowerCase() === "color")?.value || "";

      // Construir detalles del item
      const details = [talla && `talle ${talla}`, color && `color ${color}`]
        .filter(Boolean)
        .join(" ");

      const itemText = details
        ? `• ${productTitle} ${details} (cantidad: ${quantity})`
        : `• ${productTitle} (cantidad: ${quantity})`;

      return itemText;
    })
    .join("\n");

  const totalAmount = cart?.cost?.totalAmount?.amount || "0";
  const currencyCode = cart?.cost?.totalAmount?.currencyCode || "ARS";

  const text = `${messageBase}${itemsList}\n\nTotal: $${totalAmount} ${currencyCode}`;
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  redirect(url);
}

export async function createCartAndSetCookie() {
  let cart = await createCart();
  (await cookies()).set("cartId", cart.id!);
}
