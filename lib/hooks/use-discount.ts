"use client";

import { useMemo } from "react";

export function useDiscount() {
  const discountPercentage = useMemo(() => {
    // Obtener el valor de la variable de entorno DISCOUNT
    const discount = process.env.NEXT_PUBLIC_DISCOUNT || "15";

    // Convertir a número y validar
    const discountValue = discount ? parseInt(discount, 10) : 0;

    // Retornar 0 si no es un número válido o es menor a 0
    return isNaN(discountValue) || discountValue < 0 ? 0 : discountValue;
  }, []);

  const isDiscountActive = discountPercentage > 0;

  return {
    discountPercentage,
    isDiscountActive,
  };
}
