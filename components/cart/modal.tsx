"use client";

import { ShoppingCartIcon, XMarkIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import LoadingDots from "components/loading-dots";
import Price from "components/price";
import { DEFAULT_OPTION } from "lib/constants";
import { createUrl } from "lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal, useFormStatus } from "react-dom";
import { createCartAndSetCookie, redirectToCheckout } from "./actions";
import { useCart } from "./cart-context";
import { DeleteItemButton } from "./delete-item-button";
import { EditItemQuantityButton } from "./edit-item-quantity-button";
import OpenCart from "./open-cart";
import { useCartModal } from "./use-cart-modal";

type MerchandiseSearchParams = {
  [key: string]: string;
};

export default function CartModal() {
  const { cart, updateCartItem } = useCart();
  const { isOpen, openCart, closeCart } = useCartModal();
  const quantityRef = useRef(cart?.totalQuantity);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (!cart) {
      createCartAndSetCookie();
    }
  }, [cart]);

  useEffect(() => {
    if (
      cart?.totalQuantity &&
      cart?.totalQuantity !== quantityRef.current &&
      cart?.totalQuantity > 0
    ) {
      // Solo abrir el carrito si la cantidad aumentó (nuevo item agregado)
      // No abrir si la cantidad disminuyó (edición dentro del carrito)
      if (!isOpen && cart.totalQuantity > (quantityRef.current ?? 0)) {
        openCart();
      }
      quantityRef.current = cart?.totalQuantity;
    }
  }, [isOpen, cart?.totalQuantity, quantityRef, openCart]);

  // Evitar uso de portal durante SSR
  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <>
      <button aria-label="Abrir carrito" onClick={openCart}>
        <OpenCart quantity={cart?.totalQuantity} />
      </button>

      {/* Cart Modal Overlay */}
      {isOpen && isMounted
        ? createPortal(
            <div className="fixed inset-0 z-[100]">
              {/* Backdrop */}
              <div
                className="fixed inset-0 bg-black/30 transition-opacity duration-300"
                onClick={closeCart}
                aria-hidden="true"
              />

              {/* Cart Panel */}
              <div className="fixed bottom-0 right-0 top-0 flex h-full w-full flex-col border-l border-[#bf9d6d]/20 bg-[#f0e3d7]/95 p-6 text-[#bf9d6d] backdrop-blur-xl md:w-[390px] transition-transform duration-300">
                <div className="flex items-center justify-between">
                  <p className="text-lg font-semibold font-cormorant">Mi Carrito</p>
                  <button
                    aria-label="Cerrar carrito"
                    onClick={closeCart}
                    className="transition-all duration-200 hover:scale-110 active:scale-95"
                  >
                    <CloseCart />
                  </button>
                </div>

            {!cart || cart.lines.length === 0 || cart.totalQuantity === 0 ? (
              <div className="mt-20 flex w-full flex-col items-center justify-center overflow-hidden">
                <ShoppingCartIcon className="h-16" />
                <p className="mt-6 text-center text-2xl font-bold font-cormorant">
                  Tu carrito está vacío.
                </p>
              </div>
            ) : (
              <div className="flex h-full flex-col justify-between overflow-hidden p-1">
                <ul className="grow overflow-auto py-4">
                  {cart.lines
                    .sort((a, b) =>
                      a.merchandise.product.title.localeCompare(
                        b.merchandise.product.title,
                      ),
                    )
                    .map((item, i) => {
                      const merchandiseSearchParams =
                        {} as MerchandiseSearchParams;

                      item.merchandise.selectedOptions.forEach(
                        ({ name, value }) => {
                          if (value !== DEFAULT_OPTION) {
                            merchandiseSearchParams[name.toLowerCase()] = value;
                          }
                        },
                      );

                      const merchandiseUrl = createUrl(
                        `/product/${item.merchandise.product.handle}`,
                        new URLSearchParams(merchandiseSearchParams),
                      );

                      return (
                        <li
                          key={i}
                          className="flex w-full flex-col border-b border-[#bf9d6d]/20"
                        >
                          <div className="relative flex w-full flex-row justify-between px-1 py-4">
                            <div className="absolute z-40 -ml-1 -mt-2">
                              <DeleteItemButton
                                item={item}
                                optimisticUpdate={updateCartItem}
                              />
                            </div>
                            <div className="flex flex-row">
                              <div className="relative h-16 w-16 overflow-hidden rounded-md border border-[#bf9d6d]/20 bg-[#bf9d6d]/10">
                                <Image
                                  className="h-full w-full object-cover"
                                  width={64}
                                  height={64}
                                  alt={
                                    item.merchandise.product.featuredImage
                                      .altText || item.merchandise.product.title
                                  }
                                  src={
                                    item.merchandise.product.featuredImage
                                      .url || "/favicon.ico"
                                  }
                                />
                              </div>
                              <Link
                                href={merchandiseUrl}
                                onClick={closeCart}
                                className="z-30 ml-2 flex flex-row space-x-4"
                              >
                                <div className="flex flex-1 flex-col text-base">
                                  <span className="leading-tight font-cormorant">
                                    {item.merchandise.product.title}
                                  </span>
                                  {item.merchandise.title !== DEFAULT_OPTION ? (
                                    <p className="text-sm text-[#bf9d6d] font-inter">
                                      {item.merchandise.title}
                                    </p>
                                  ) : null}
                                </div>
                              </Link>
                            </div>
                            <div className="flex h-16 flex-col justify-between">
                              <Price
                                className="flex justify-end space-y-2 text-right text-sm"
                                amount={item.cost.totalAmount.amount}
                                currencyCode={
                                  item.cost.totalAmount.currencyCode
                                }
                              />
                              <div className="ml-auto flex h-9 flex-row items-center rounded-full border border-[#bf9d6d]/20 transition-all duration-200 hover:border-[#bf9d6d]/40 hover:shadow-sm">
                                <EditItemQuantityButton
                                  item={item}
                                  type="minus"
                                  optimisticUpdate={updateCartItem}
                                />
                                <p className="w-6 text-center">
                                  <span className="w-full text-sm">
                                    {item.quantity}
                                  </span>
                                </p>
                                <EditItemQuantityButton
                                  item={item}
                                  type="plus"
                                  optimisticUpdate={updateCartItem}
                                />
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                </ul>
                <div className="py-4 text-sm text-[#bf9d6d] font-inter">
                  <div className="mb-3 flex items-center justify-between border-b border-[#bf9d6d]/20 pb-1">
                    <p>Subtotal</p>
                    <Price
                      className="text-right text-base text-[#bf9d6d]"
                      amount={cart.cost.subtotalAmount.amount}
                      currencyCode={cart.cost.subtotalAmount.currencyCode}
                    />
                  </div>
                  <div className="mb-3 flex items-center justify-between border-b border-[#bf9d6d]/20 pb-1 pt-1">
                    <p>OFF (10%)</p>
                    <Price
                      className="text-right text-base text-[#bf9d6d]"
                      amount={(
                        -Number(cart.cost.subtotalAmount.amount) * 0.1
                      ).toFixed(2)}
                      currencyCode={cart.cost.subtotalAmount.currencyCode}
                    />
                  </div>

                  <div className="mb-3 flex items-center justify-between border-b border-[#bf9d6d]/20 pb-1 pt-1">
                    <p>Total</p>
                    <Price
                      className="text-right text-base text-[#bf9d6d]"
                      amount={(
                        Number(cart.cost.subtotalAmount.amount) * 0.9
                      ).toFixed(2)}
                      currencyCode={cart.cost.subtotalAmount.currencyCode}
                    />
                  </div>
                </div>
                <form action={redirectToCheckout}>
                  <CheckoutButton />
                </form>
              </div>
            )}
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

function CloseCart({ className }: { className?: string }) {
  return (
    <div className="relative flex h-11 w-11 items-center justify-center rounded-md border border-[#bf9d6d]/20 text-[#bf9d6d] transition-colors">
      <XMarkIcon
        className={clsx(
          "h-6 transition-all ease-in-out hover:scale-110",
          className,
        )}
      />
    </div>
  );
}

function CheckoutButton() {
  const { pending } = useFormStatus();

  return (
    <button
      className="block w-full rounded-full bg-[#bf9d6d] p-3 text-center text-sm font-medium text-[#f0e3d7] opacity-90 hover:opacity-100 font-inter"
      type="submit"
      disabled={pending}
    >
      {pending ? <LoadingDots className="bg-white" /> : "Proceder al Pago"}
    </button>
  );
}
