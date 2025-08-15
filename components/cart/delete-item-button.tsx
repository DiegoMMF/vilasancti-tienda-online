"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { removeItem } from "components/cart/actions";
import type { CartItem } from "lib/types";
import { useActionState } from "react";

export function DeleteItemButton({
  item,
  optimisticUpdate,
}: {
  item: CartItem;
  optimisticUpdate: any;
}) {
  const [message, formAction] = useActionState(removeItem, null);
  const merchandiseId = item.merchandise.id;
  const removeItemAction = formAction.bind(null, merchandiseId);

  return (
    <form
      action={async () => {
        // Actualizar el estado local inmediatamente
        optimisticUpdate(merchandiseId, "delete");
        // Ejecutar la acción del servidor en segundo plano
        removeItemAction();
      }}
    >
      <button
        type="submit"
        aria-label="Eliminar artículo del carrito"
        className="flex h-[24px] w-[24px] items-center justify-center rounded-full bg-[#bf9d6d] hover:bg-[#a08a5a] transition-colors"
      >
        <XMarkIcon className="mx-[1px] h-4 w-4 text-white" />
      </button>
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
