"use client";

import clsx from "clsx";
import { useProduct } from "components/product/product-context";
import { useLoadingOverlay } from "components/ui/loading-overlay-context";
import { ProductOption, ProductVariant } from "lib/types";

export function VariantSelector({
  options,
  variants,
}: {
  options: ProductOption[];
  variants: ProductVariant[];
}) {
  const { state, updateOption } = useProduct();
  const { show, hide } = useLoadingOverlay();

  // Solo ocultar si no hay opciones en absoluto
  if (!options.length) {
    return null;
  }

  // Función para verificar si una opción está activa
  const isOptionActive = (optionName: string, optionValue: string) => {
    return state[optionName] === optionValue;
  };

  // Función para verificar si una opción está disponible
  const isOptionAvailable = (optionName: string, optionValue: string) => {
    // Verificar si existe alguna variante con esta opción y que tenga inventario
    return variants.some((variant) => {
      const hasMatchingOption = variant.selectedOptions.some(
        (option) =>
          option.name.toLowerCase() === optionName &&
          option.value === optionValue,
      );
      return (
        hasMatchingOption &&
        variant.availableForSale &&
        variant.inventoryQuantity > 0
      );
    });
  };

  // Función para manejar el toggle de opciones
  const handleOptionToggle = async (
    optionName: string,
    optionValue: string,
  ) => {
    const isCurrentlyActive = isOptionActive(optionName, optionValue);

    try {
      show();

      if (isCurrentlyActive) {
        // Si está activa, deseleccionar
        updateOption(optionName, "");
      } else {
        // Si no está activa, seleccionar
        updateOption(optionName, optionValue);
      }

      // Pequeño delay para que el loader sea visible
      await new Promise((resolve) => setTimeout(resolve, 300));
    } finally {
      hide();
    }
  };

  return options.map((option) => (
    <div key={option.id}>
      <dl className="mb-8">
        <dt className="mb-4 text-sm uppercase tracking-wide">{option.name}</dt>
        <dd className="flex flex-wrap gap-3">
          {option.values.map((value) => {
            const optionNameLowerCase = option.name.toLowerCase();
            const isAvailable = isOptionAvailable(optionNameLowerCase, value);
            const isActive = isOptionActive(optionNameLowerCase, value);

            return (
              <button
                type="button"
                onClick={() => handleOptionToggle(optionNameLowerCase, value)}
                key={value}
                disabled={!isAvailable}
                title={`${option.name} ${value}${!isAvailable ? " (Agotado)" : ""}`}
                className={clsx(
                  "flex min-w-[48px] items-center justify-center rounded-full border bg-neutral-100 px-2 py-1 text-sm dark:border-neutral-800 dark:bg-neutral-900",
                  {
                    "cursor-default ring-2 ring-blue-600": isActive,
                    "ring-1 ring-transparent transition duration-300 ease-in-out hover:ring-blue-600":
                      !isActive && isAvailable,
                    "relative z-10 cursor-not-allowed overflow-hidden bg-neutral-100 text-neutral-500 ring-1 ring-neutral-300 before:absolute before:inset-x-0 before:-z-10 before:h-px before:-rotate-45 before:bg-neutral-300 before:transition-transform dark:bg-neutral-900 dark:text-neutral-400 dark:ring-neutral-700 dark:before:bg-neutral-700":
                      !isAvailable,
                  },
                )}
              >
                {value}
              </button>
            );
          })}
        </dd>
      </dl>
    </div>
  ));
}
