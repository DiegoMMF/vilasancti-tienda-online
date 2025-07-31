import { cookies } from 'next/headers';
import { prisma } from '../db';
import type { Cart, CartItem } from '../types';

const CART_COOKIE_NAME = 'cartId';

function calculateItemCost(quantity: number, price: string): string {
  return (Number(price) * quantity).toString();
}

function reshapeCart(dbCart: any): Cart {
  const lines: CartItem[] = dbCart.items.map((item: any) => ({
    id: item.id,
    quantity: item.quantity,
    cost: {
      totalAmount: {
        amount: calculateItemCost(item.quantity, item.variant.price.toString()),
        currencyCode: item.variant.currencyCode
      }
    },
    merchandise: {
      id: item.variant.id,
      title: item.variant.title,
      selectedOptions: JSON.parse(item.variant.selectedOptions || '[]'),
      product: {
        id: item.variant.product.id,
        handle: item.variant.product.handle,
        title: item.variant.product.title,
        featuredImage: {
          url: item.variant.product.images.find((img: any) => img.isFeatured)?.url || '',
          altText: item.variant.product.title,
          width: 800,
          height: 600
        }
      }
    }
  }));

  const totalQuantity = lines.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = lines.reduce(
    (sum, item) => sum + Number(item.cost.totalAmount.amount),
    0
  );
  const currencyCode = lines[0]?.cost.totalAmount.currencyCode ?? 'USD';

  return {
    id: dbCart.id,
    checkoutUrl: `/checkout?cart=${dbCart.id}`,
    totalQuantity,
    lines,
    cost: {
      subtotalAmount: { amount: totalAmount.toString(), currencyCode },
      totalAmount: { amount: totalAmount.toString(), currencyCode },
      totalTaxAmount: { amount: '0', currencyCode }
    }
  };
}

async function getOrCreateCart(): Promise<string> {
  const cookieStore = await cookies();
  let cartId = cookieStore.get(CART_COOKIE_NAME)?.value;

  if (!cartId) {
    const sessionId = Math.random().toString(36).substring(2);
    const cart = await prisma.cart.create({
      data: {
        sessionId
      }
    });
    cartId = cart.id;
    
    // Set cookie
    cookieStore.set(CART_COOKIE_NAME, cartId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 30 // 30 days
    });
  }

  return cartId;
}

export async function createCart(): Promise<Cart> {
  const cartId = await getOrCreateCart();
  
  const dbCart = await prisma.cart.findUnique({
    where: { id: cartId },
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: {
                include: {
                  images: true
                }
              }
            }
          }
        }
      }
    }
  });

  if (!dbCart) {
    return {
      id: undefined,
      checkoutUrl: '',
      totalQuantity: 0,
      lines: [],
      cost: {
        subtotalAmount: { amount: '0', currencyCode: 'USD' },
        totalAmount: { amount: '0', currencyCode: 'USD' },
        totalTaxAmount: { amount: '0', currencyCode: 'USD' }
      }
    };
  }

  return reshapeCart(dbCart);
}

export async function addToCart(
  lines: { merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  const cartId = await getOrCreateCart();

  for (const line of lines) {
    await prisma.cartItem.upsert({
      where: {
        cartId_variantId: {
          cartId,
          variantId: line.merchandiseId
        }
      },
      update: {
        quantity: {
          increment: line.quantity
        }
      },
      create: {
        cartId,
        variantId: line.merchandiseId,
        quantity: line.quantity
      }
    });
  }

  const dbCart = await prisma.cart.findUnique({
    where: { id: cartId },
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: {
                include: {
                  images: true
                }
              }
            }
          }
        }
      }
    }
  });

  return reshapeCart(dbCart!);
}

export async function removeFromCart(lineIds: string[]): Promise<Cart> {
  const cartId = await getOrCreateCart();

  await prisma.cartItem.deleteMany({
    where: {
      id: { in: lineIds },
      cartId
    }
  });

  const dbCart = await prisma.cart.findUnique({
    where: { id: cartId },
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: {
                include: {
                  images: true
                }
              }
            }
          }
        }
      }
    }
  });

  if (!dbCart) {
    return {
      id: undefined,
      checkoutUrl: '',
      totalQuantity: 0,
      lines: [],
      cost: {
        subtotalAmount: { amount: '0', currencyCode: 'USD' },
        totalAmount: { amount: '0', currencyCode: 'USD' },
        totalTaxAmount: { amount: '0', currencyCode: 'USD' }
      }
    };
  }

  return reshapeCart(dbCart);
}

export async function updateCart(
  lines: { id: string; merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  const cartId = await getOrCreateCart();

  for (const line of lines) {
    if (line.quantity <= 0) {
      await prisma.cartItem.delete({
        where: {
          id: line.id
        }
      });
    } else {
      await prisma.cartItem.update({
        where: {
          id: line.id
        },
        data: {
          quantity: line.quantity
        }
      });
    }
  }

  const dbCart = await prisma.cart.findUnique({
    where: { id: cartId },
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: {
                include: {
                  images: true
                }
              }
            }
          }
        }
      }
    }
  });

  if (!dbCart) {
    return {
      id: undefined,
      checkoutUrl: '',
      totalQuantity: 0,
      lines: [],
      cost: {
        subtotalAmount: { amount: '0', currencyCode: 'USD' },
        totalAmount: { amount: '0', currencyCode: 'USD' },
        totalTaxAmount: { amount: '0', currencyCode: 'USD' }
      }
    };
  }

  return reshapeCart(dbCart);
}

export async function getCart(): Promise<Cart | undefined> {
  const cookieStore = await cookies();
  const cartId = cookieStore.get(CART_COOKIE_NAME)?.value;

  if (!cartId) {
    return undefined;
  }

  const dbCart = await prisma.cart.findUnique({
    where: { id: cartId },
    include: {
      items: {
        include: {
          variant: {
            include: {
              product: {
                include: {
                  images: true
                }
              }
            }
          }
        }
      }
    }
  });

  if (!dbCart) {
    return undefined;
  }

  return reshapeCart(dbCart);
} 