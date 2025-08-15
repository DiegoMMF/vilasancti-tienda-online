"use client";

import clsx from "clsx";
import { useProduct } from "components/product/product-context";
import { useLoadingOverlay } from "components/ui/loading-overlay-context";
import { ProductOption, ProductVariant } from "lib/types";
import { useState } from "react";

// Estilos CSS personalizados para asegurar que se apliquen correctamente
const variantSelectorStyles = `
  .variant-selector-button {
    transition: all 0.3s ease-in-out;
  }
  
  .variant-selector-button.active {
    background-color: #bf9d6d !important;
    color: #f0e3d7 !important;
    border-color: #bf9d6d !important;
    box-shadow: none !important;
  }
  
  .variant-selector-button.active:focus-visible {
    outline: none !important;
    ring: none !important;
    box-shadow: none !important;
  }
`;

export function VariantSelector({
  options,
  variants,
}: {
  options: ProductOption[];
  variants: ProductVariant[];
}) {
  const { state, updateOption } = useProduct();
  const { show, hide } = useLoadingOverlay();
  const [loadingOption, setLoadingOption] = useState<string | null>(null);

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
    const optionKey = `${optionName}-${optionValue}`;

    try {
      show();
      setLoadingOption(optionKey);

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
      setLoadingOption(null);
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: variantSelectorStyles }} />
      {options.map((option) => (
        <div key={option.id}>
          <dl className="mb-8">
            <dt className="mb-4 text-sm uppercase tracking-wide">{option.name}</dt>
            <dd className="flex flex-wrap gap-3">
          {option.values.map((value) => {
            const optionNameLowerCase = option.name.toLowerCase();
            const isAvailable = isOptionAvailable(optionNameLowerCase, value);
            const isActive = isOptionActive(optionNameLowerCase, value);
            const optionKey = `${optionNameLowerCase}-${value}`;
            const isLoading = loadingOption === optionKey;

            return (
              <button
                type="button"
                onClick={() => handleOptionToggle(optionNameLowerCase, value)}
                key={value}
                disabled={!isAvailable}
                title={`${option.name} ${value}${!isAvailable ? " (Agotado)" : ""}`}
                className={clsx(
                  "variant-selector-button flex min-w-[48px] items-center justify-center rounded-full border border-[#bf9d6d]/20 bg-[#f0e3d7] px-2 py-1 text-sm text-[#bf9d6d] font-inter",
                  {
                    "active cursor-default": isActive,
                    "ring-1 ring-transparent hover:ring-[#bf9d6d] hover:bg-[#bf9d6d] hover:text-[#f0e3d7]":
                      !isActive && isAvailable,
                    "relative z-10 cursor-not-allowed overflow-hidden bg-[#f0e3d7]/50 text-[#bf9d6d]/50 ring-1 ring-[#bf9d6d]/20 before:absolute before:inset-x-0 before:-z-10 before:h-px before:-rotate-45 before:bg-[#bf9d6d]/30 before:transition-transform":
                      !isAvailable,
                  },
                )}
              >
                {isLoading ? (
                  <div className="flex space-x-1">
                    <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#f0e3d7] [animation-delay:-0.3s]"></div>
                    <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#f0e3d7] [animation-delay:-0.15s]"></div>
                    <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-[#f0e3d7]"></div>
                  </div>
                ) : (
                  value
                )}
              </button>
            );
          })}
        </dd>
      </dl>
    </div>
      ))}
    </>
  );
}
