"use client";

import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";
import clsx from "clsx";
import { updateItemQuantity } from "components/cart/actions";
import type { CartItem } from "lib/types";
import { useActionState } from "react";

function SubmitButton({
  type,
  disabled,
}: {
  type: "plus" | "minus";
  disabled?: boolean;
}) {
  return (
    <button
      type="submit"
      disabled={disabled}
      aria-label={type === "plus" ? "Aumentar cantidad" : "Reducir cantidad"}
      className={clsx(
        "ease flex h-full min-w-[36px] max-w-[36px] flex-none items-center justify-center rounded-full p-2 transition-all duration-200 ease-in-out",
        {
          "ml-auto": type === "minus",
          "hover:border-[#bf9d6d] hover:opacity-80 hover:scale-105 active:scale-95 active:bg-[#bf9d6d]/10":
            !disabled,
          "cursor-not-allowed opacity-50": disabled,
        },
      )}
    >
      {type === "plus" ? (
        <PlusIcon className="h-4 w-4 text-[#bf9d6d] transition-transform duration-150" />
      ) : (
        <MinusIcon className="h-4 w-4 text-[#bf9d6d] transition-transform duration-150" />
      )}
    </button>
  );
}

export function EditItemQuantityButton({
  item,
  type,
  optimisticUpdate,
}: {
  item: CartItem;
  type: "plus" | "minus";
  optimisticUpdate: any;
}) {
  const [message, formAction] = useActionState(updateItemQuantity, null);

  // Validar límites de inventario
  const newQuantity = type === "plus" ? item.quantity + 1 : item.quantity - 1;
  const isDisabled =
    type === "plus"
      ? newQuantity > item.merchandise.inventoryQuantity
      : newQuantity <= 0;

  const payload = {
    merchandiseId: item.merchandise.id,
    quantity: newQuantity,
  };
  const updateItemQuantityAction = formAction.bind(null, payload);

  return (
    <form
      action={async () => {
        if (!isDisabled) {
          // Actualizar el estado local inmediatamente
          optimisticUpdate(payload.merchandiseId, type);
          // Ejecutar la acción del servidor en segundo plano
          updateItemQuantityAction();
        }
      }}
    >
      <SubmitButton type={type} disabled={isDisabled} />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
