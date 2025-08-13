'use client';

import clsx from 'clsx';
import { addItem } from 'components/cart/actions';
import { useProduct } from 'components/product/product-context';
import { Product, ProductVariant } from 'lib/types';
import { useActionState } from 'react';
import { useCart } from './cart-context';

function SubmitButton({
  availableForSale,
  selectedVariantId,
  buttonState
}: {
  availableForSale: boolean;
  selectedVariantId: string | undefined;
  buttonState: 'agotado' | 'seleccionar-opcion' | 'agregar-al-carrito';
}) {
  const buttonClasses =
    'relative flex w-full items-center justify-center rounded-full bg-blue-600 p-4 tracking-wide text-white';
  const disabledClasses = 'cursor-not-allowed opacity-60 hover:opacity-60';

  if (buttonState === 'agotado') {
    return (
      <button disabled className={clsx(buttonClasses, disabledClasses)}>
        Agotado
      </button>
    );
  }

  if (buttonState === 'seleccionar-opcion') {
    return (
      <button
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
      aria-label="Agregar al carrito"
      className={clsx(buttonClasses, {
        'hover:opacity-90': true
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

  // Encontrar la variante que coincide con el estado actual
  const variant = variants.find((variant: ProductVariant) =>
    variant.selectedOptions.every(
      (option) => option.value === state[option.name.toLowerCase()]
    )
  );

  const selectedVariantId = variant?.id;
  const addItemAction = formAction.bind(null, selectedVariantId);
  const finalVariant = variants.find(
    (variant) => variant.id === selectedVariantId
  );

  // Verificar si hay alguna variante disponible en el producto
  const hasAnyAvailableVariant = variants.some(v => v.availableForSale && v.inventoryQuantity > 0);
  
  // Verificar si la variante seleccionada está disponible
  const isSelectedVariantAvailable = finalVariant?.availableForSale && finalVariant?.inventoryQuantity > 0;

  // Determinar el estado del botón
  let buttonState: 'agotado' | 'seleccionar-opcion' | 'agregar-al-carrito' = 'seleccionar-opcion';
  
  if (!hasAnyAvailableVariant) {
    buttonState = 'agotado';
  } else if (!selectedVariantId) {
    buttonState = 'seleccionar-opcion';
  } else if (isSelectedVariantAvailable) {
    buttonState = 'agregar-al-carrito';
  } else {
    buttonState = 'agotado';
  }

  return (
    <form
      action={async () => {
        if (buttonState === 'agregar-al-carrito' && finalVariant) {
          addCartItem(finalVariant, product);
          addItemAction();
        }
      }}
    >
      <SubmitButton
        availableForSale={buttonState === 'agregar-al-carrito'}
        selectedVariantId={buttonState === 'agregar-al-carrito' ? selectedVariantId : undefined}
        buttonState={buttonState}
      />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
