"use client";

import clsx from "clsx";
import { addItem } from "components/cart/actions";
import { useProduct } from "components/product/product-context";
import { useLoadingOverlay } from "components/ui/loading-overlay-context";
import { Product, ProductVariant } from "lib/types";
import { useActionState } from "react";
import { useCart } from "./cart-context";
import { useCartModal } from "./use-cart-modal";

function SubmitButton({
  availableForSale,
  selectedVariantId,
  buttonState,
}: {
  availableForSale: boolean;
  selectedVariantId: string | undefined;
  buttonState: "agotado" | "seleccionar-opcion" | "agregar-al-carrito";
}) {
  const buttonClasses =
    "relative flex w-full items-center justify-center rounded-full bg-[#bf9d6d] p-4 tracking-wide text-[#f0e3d7]";
  const disabledClasses = "cursor-not-allowed opacity-60 hover:opacity-60";

  if (buttonState === "agotado") {
    return (
      <button
        type="button"
        disabled
        className={clsx(buttonClasses, disabledClasses)}
      >
        Agotado
      </button>
    );
  }

  if (buttonState === "seleccionar-opcion") {
    return (
      <button
        type="button"
        aria-label="Selecciona una talla"
        disabled
        className={clsx(buttonClasses, disabledClasses)}
      >
        Selecciona una talla
      </button>
    );
  }

  return (
    <button
      type="submit"
      aria-label="Agregar al carrito"
      className={clsx(buttonClasses, {
        "hover:opacity-90": true,
      })}
    >
      Agregar al Carrito
    </button>
  );
}

export function AddToCart({ product }: { product: Product }) {
  const { variants } = product;
  const { addCartItem } = useCart();
  const { state } = useProduct();
  const [message, formAction] = useActionState(addItem, null);
  const { show, hide } = useLoadingOverlay();
  const { openCart } = useCartModal();

  // Encontrar la variante que coincide con el estado actual
  const variant = variants.find((variant: ProductVariant) =>
    variant.selectedOptions.every(
      (option) => option.value === state[option.name.toLowerCase()],
    ),
  );

  const selectedVariantId = variant?.id;
  const addItemAction = formAction.bind(null, selectedVariantId);
  const finalVariant = variants.find(
    (variant) => variant.id === selectedVariantId,
  );

  // Verificar si hay alguna variante disponible en el producto
  const hasAnyAvailableVariant = variants.some(
    (v) => v.availableForSale && v.inventoryQuantity > 0,
  );

  // Verificar si la variante seleccionada está disponible
  const isSelectedVariantAvailable =
    finalVariant?.availableForSale && finalVariant?.inventoryQuantity > 0;

  // Determinar el estado del botón
  let buttonState: "agotado" | "seleccionar-opcion" | "agregar-al-carrito" =
    "seleccionar-opcion";

  if (!hasAnyAvailableVariant) {
    buttonState = "agotado";
  } else if (!selectedVariantId) {
    buttonState = "seleccionar-opcion";
  } else if (isSelectedVariantAvailable) {
    buttonState = "agregar-al-carrito";
  } else {
    buttonState = "agotado";
  }

  return (
    <form
      action={async () => {
        if (buttonState === "agregar-al-carrito" && finalVariant) {
          try {
            show();
            addCartItem(finalVariant, product);
            await addItemAction();
            // Abrir el carrito después de agregar el producto
            setTimeout(() => {
              openCart();
            }, 500);
          } finally {
            hide();
          }
        }
      }}
    >
      <SubmitButton
        availableForSale={buttonState === "agregar-al-carrito"}
        selectedVariantId={
          buttonState === "agregar-al-carrito" ? selectedVariantId : undefined
        }
        buttonState={buttonState}
      />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
