"use client";

import type { Cart, CartItem, Product, ProductVariant } from "lib/types";
import React, {
  createContext,
  use,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type UpdateType = "plus" | "minus" | "delete";

type CartContextType = {
  cartPromise: Promise<Cart | undefined>;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

// Función helper para calcular el precio unitario
function getUnitPrice(item: CartItem): number {
  return Number(item.cost.totalAmount.amount) / item.quantity;
}

export function CartProvider({
  children,
  cartPromise,
}: {
  children: React.ReactNode;
  cartPromise: Promise<Cart | undefined>;
}) {
  return (
    <CartContext.Provider value={{ cartPromise }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }

  const initialCart = use(context.cartPromise);
  const [cart, setCart] = useState<Cart | undefined>(initialCart);

  // Sincronizar con el carrito inicial
  useEffect(() => {
    setCart(initialCart);
  }, [initialCart]);

  const updateCartItem = useCallback(
    async (merchandiseId: string, updateType: UpdateType) => {
      if (!cart) return;

      // Crear una copia del carrito actual
      const updatedLines = [...cart.lines];
      const itemIndex = updatedLines.findIndex(
        (item) => item.merchandise.id === merchandiseId,
      );

      if (itemIndex === -1) return;

      if (updateType === "delete") {
        // Eliminar el item
        updatedLines.splice(itemIndex, 1);
      } else {
        // Actualizar cantidad
        const item = updatedLines[itemIndex];
        if (!item) return;

        const newQuantity =
          updateType === "plus" ? item.quantity + 1 : item.quantity - 1;

        if (newQuantity <= 0) {
          // Eliminar si la cantidad llega a 0
          updatedLines.splice(itemIndex, 1);
        } else if (
          updateType === "plus" &&
          newQuantity > item.merchandise.inventoryQuantity
        ) {
          // No exceder inventario
          return;
        } else {
          // Actualizar cantidad usando el precio unitario calculado
          const unitPrice = getUnitPrice(item);
          const newTotalAmount = (unitPrice * newQuantity).toFixed(2);

          updatedLines[itemIndex] = {
            ...item,
            quantity: newQuantity,
            cost: {
              ...item.cost,
              totalAmount: {
                ...item.cost.totalAmount,
                amount: newTotalAmount,
              },
            },
          };
        }
      }

      // Calcular nuevos totales
      const totalQuantity = updatedLines.reduce(
        (sum, item) => sum + item.quantity,
        0,
      );
      const totalAmount = updatedLines.reduce(
        (sum, item) => sum + Number(item.cost.totalAmount.amount),
        0,
      );
      const currencyCode =
        updatedLines[0]?.cost.totalAmount.currencyCode ?? "ARS";

      const updatedCart: Cart = {
        ...cart,
        totalQuantity,
        lines: updatedLines,
        cost: {
          subtotalAmount: { amount: totalAmount.toFixed(2), currencyCode },
          totalAmount: { amount: totalAmount.toFixed(2), currencyCode },
          totalTaxAmount: { amount: "0", currencyCode },
        },
      };

      setCart(updatedCart);
    },
    [cart],
  );

  const addCartItem = useCallback(
    (variant: ProductVariant, product: Product) => {
      if (!cart) return;

      const existingItemIndex = cart.lines.findIndex(
        (item) => item.merchandise.id === variant.id,
      );
      const updatedLines = [...cart.lines];

      if (existingItemIndex !== -1) {
        // Actualizar item existente
        const existingItem = updatedLines[existingItemIndex];
        if (!existingItem) return;

        const newQuantity = Math.min(
          existingItem.quantity + 1,
          variant.inventoryQuantity,
        );
        // Usar el precio unitario de la variante directamente
        const newTotalAmount = (
          Number(variant.price.amount) * newQuantity
        ).toFixed(2);

        updatedLines[existingItemIndex] = {
          ...existingItem,
          quantity: newQuantity,
          cost: {
            ...existingItem.cost,
            totalAmount: {
              ...existingItem.cost.totalAmount,
              amount: newTotalAmount,
            },
          },
        };
      } else {
        // Agregar nuevo item
        const newItem: CartItem = {
          id: "",
          quantity: 1,
          cost: {
            totalAmount: {
              amount: variant.price.amount,
              currencyCode: variant.price.currencyCode,
            },
          },
          merchandise: {
            id: variant.id,
            title: variant.title,
            availableForSale: variant.availableForSale,
            inventoryQuantity: variant.inventoryQuantity,
            selectedOptions: variant.selectedOptions,
            product: {
              id: product.id,
              handle: product.handle,
              title: product.title,
              featuredImage: product.featuredImage,
            },
          },
        };
        updatedLines.push(newItem);
      }

      // Calcular nuevos totales
      const totalQuantity = updatedLines.reduce(
        (sum, item) => sum + item.quantity,
        0,
      );
      const totalAmount = updatedLines.reduce(
        (sum, item) => sum + Number(item.cost.totalAmount.amount),
        0,
      );
      const currencyCode =
        updatedLines[0]?.cost.totalAmount.currencyCode ?? "ARS";

      const updatedCart: Cart = {
        ...cart,
        totalQuantity,
        lines: updatedLines,
        cost: {
          subtotalAmount: { amount: totalAmount.toFixed(2), currencyCode },
          totalAmount: { amount: totalAmount.toFixed(2), currencyCode },
          totalTaxAmount: { amount: "0", currencyCode },
        },
      };

      setCart(updatedCart);
    },
    [cart],
  );

  return useMemo(
    () => ({
      cart,
      updateCartItem,
      addCartItem,
    }),
    [cart, updateCartItem, addCartItem],
  );
}
