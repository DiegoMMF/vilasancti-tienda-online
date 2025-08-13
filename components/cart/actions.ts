'use server';

import {
    addToCart,
    createCart,
    getCart,
    removeFromCart,
    updateCart
} from 'lib/api/cart-drizzle';
import { TAGS } from 'lib/constants';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function addItem(
  prevState: any,
  selectedVariantId: string | undefined
) {
  if (!selectedVariantId) {
    return 'Error adding item to cart';
  }

  try {
    await addToCart([{ merchandiseId: selectedVariantId, quantity: 1 }]);
    revalidateTag(TAGS.cart);
  } catch (e) {
    return 'Error adding item to cart';
  }
}

export async function removeItem(prevState: any, merchandiseId: string) {
  try {
    const cart = await getCart();

    if (!cart) {
      return 'Error fetching cart';
    }

    const lineItem = cart.lines.find(
      (line) => line.merchandise.id === merchandiseId
    );

    if (lineItem && lineItem.id) {
      await removeFromCart([lineItem.id]);
      revalidateTag(TAGS.cart);
    } else {
      return 'Item not found in cart';
    }
  } catch (e) {
    return 'Error removing item from cart';
  }
}

export async function updateItemQuantity(
  prevState: any,
  payload: {
    merchandiseId: string;
    quantity: number;
  }
) {
  const { merchandiseId, quantity } = payload;

  try {
    const cart = await getCart();

    if (!cart) {
      return 'Error fetching cart';
    }

    const lineItem = cart.lines.find(
      (line) => line.merchandise.id === merchandiseId
    );

    if (lineItem && lineItem.id) {
      if (quantity === 0) {
        await removeFromCart([lineItem.id]);
      } else {
        await updateCart([
          {
            id: lineItem.id,
            merchandiseId,
            quantity
          }
        ]);
      }
    } else if (quantity > 0) {
      // If the item doesn't exist in the cart and quantity > 0, add it
      await addToCart([{ merchandiseId, quantity }]);
    }

    revalidateTag(TAGS.cart);
  } catch (e) {
    console.error(e);
    return 'Error updating item quantity';
  }
}

export async function redirectToCheckout() {
  const cart = await getCart();
  const phone = '5493544543637';
  const lines = cart?.lines ?? [];
  const first = lines[0];
  const productTitle = first?.merchandise.product.title || 'piyama';
  const variantTitle = first?.merchandise.title || '';
  // Intentar extraer talle y color desde selectedOptions si existen
  const opts = first?.merchandise.selectedOptions || [];
  const talla = opts.find((o) => o.name.toLowerCase() === 'talla')?.value || '';
  const color = opts.find((o) => o.name.toLowerCase() === 'color')?.value || '';

  const messageBase = `Hola, me han redirigido de la web Vilasancti. Quisiera comprar el ${productTitle}`;
  const messageDetail = [
    talla && `talle ${talla}`,
    color && `color ${color}`
  ]
    .filter(Boolean)
    .join(' ');

  const text = messageDetail ? `${messageBase} ${messageDetail}.` : `${messageBase}.`;
  const url = `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
  redirect(url);
}

export async function createCartAndSetCookie() {
  let cart = await createCart();
  (await cookies()).set('cartId', cart.id!);
}
