"use client";

import { createContext, useContext, useState } from "react";

type CartModalContextType = {
  openCart: () => void;
  closeCart: () => void;
  isOpen: boolean;
};

const CartModalContext = createContext<CartModalContextType | undefined>(undefined);

export function CartModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  return (
    <CartModalContext.Provider value={{ openCart, closeCart, isOpen }}>
      {children}
    </CartModalContext.Provider>
  );
}

export function useCartModal() {
  const context = useContext(CartModalContext);
  if (context === undefined) {
    throw new Error("useCartModal must be used within a CartModalProvider");
  }
  return context;
}
