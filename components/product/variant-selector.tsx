'use client';

import clsx from 'clsx';
import { useProduct } from 'components/product/product-context';
import { ProductOption, ProductVariant } from 'lib/shopify/types';

export function VariantSelector({
  options,
  variants
}: {
  options: ProductOption[];
  variants: ProductVariant[];
}) {
  const { state, updateOption } = useProduct();
  const hasNoOptionsOrJustOneOption =
    !options.length || (options.length === 1 && options[0]?.values.length === 1);

  if (hasNoOptionsOrJustOneOption) {
    return null;
  }

  // Función para verificar si una opción está activa
  const isOptionActive = (optionName: string, optionValue: string) => {
    return state[optionName] === optionValue;
  };

  // Función para verificar si una opción está disponible
  const isOptionAvailable = (optionName: string, optionValue: string) => {
    // Verificar si existe alguna variante con esta opción
    return variants.some((variant) => {
      return variant.selectedOptions.some((option) => 
        option.name.toLowerCase() === optionName && option.value === optionValue
      );
    });
  };

  // Función para manejar el toggle de opciones
  const handleOptionToggle = (optionName: string, optionValue: string) => {
    const isCurrentlyActive = isOptionActive(optionName, optionValue);
    
    if (isCurrentlyActive) {
      // Si está activa, deseleccionar
      updateOption(optionName, '');
    } else {
      // Si no está activa, seleccionar
      updateOption(optionName, optionValue);
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
                title={`${option.name} ${value}${!isAvailable ? ' (Out of Stock)' : ''}`}
                className={clsx(
                  'flex min-w-[48px] items-center justify-center rounded-full border bg-neutral-100 px-2 py-1 text-sm dark:border-neutral-800 dark:bg-neutral-900',
                  {
                    'cursor-default ring-2 ring-blue-600': isActive,
                    'ring-1 ring-transparent transition duration-300 ease-in-out hover:ring-blue-600':
                      !isActive && isAvailable,
                    'relative z-10 cursor-not-allowed overflow-hidden bg-neutral-100 text-neutral-500 ring-1 ring-neutral-300 before:absolute before:inset-x-0 before:-z-10 before:h-px before:-rotate-45 before:bg-neutral-300 before:transition-transform dark:bg-neutral-900 dark:text-neutral-400 dark:ring-neutral-700 dark:before:bg-neutral-700':
                      !isAvailable
                  }
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
