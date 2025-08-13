"use client";

import { useRouter, useSearchParams } from "next/navigation";
import React, { createContext, useCallback, useContext, useMemo } from "react";

type ProductState = {
  [key: string]: string;
} & {
  image?: string;
};

type ProductContextType = {
  state: ProductState;
  updateOption: (name: string, value: string) => void;
  updateImage: (index: string) => void;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({
  children,
  product,
}: {
  children: React.ReactNode;
  product?: any;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Estado derivado directamente de searchParams
  const state = useMemo(() => {
    const urlState: ProductState = {};

    if (searchParams) {
      for (const [key, value] of searchParams.entries()) {
        // Incluir todos los parámetros (incluido 'image') en el estado
        urlState[key] = value;
      }
    }

    // Solo preseleccionar si hay UNA sola variante y no hay parámetros en URL
    if (Object.keys(urlState).length === 0 && product?.variants?.length === 1) {
      const variant = product.variants[0];
      variant.selectedOptions.forEach((option: any) => {
        urlState[option.name.toLowerCase()] = option.value;
      });
    }

    return urlState;
  }, [searchParams, product]);

  const updateOption = useCallback(
    (name: string, value: string) => {
      const newParams = new URLSearchParams(window.location.search);

      if (value === "") {
        // Deseleccionar: remover parámetro
        newParams.delete(name);
      } else {
        // Seleccionar: agregar/actualizar parámetro
        newParams.set(name, value);
      }

      // Actualizar URL
      router.push(`?${newParams.toString()}`, { scroll: false });
    },
    [router],
  );

  const updateImage = useCallback(
    (index: string) => {
      const newParams = new URLSearchParams(window.location.search);
      newParams.set("image", index);
      router.push(`?${newParams.toString()}`, { scroll: false });
    },
    [router],
  );

  const value = useMemo(
    () => ({
      state,
      updateOption,
      updateImage,
    }),
    [state, updateOption, updateImage],
  );

  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
}

export function useProduct() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error("useProduct must be used within a ProductProvider");
  }
  return context;
}

export function useUpdateURL() {
  const router = useRouter();

  return (state: ProductState) => {
    const newParams = new URLSearchParams(window.location.search);
    Object.entries(state).forEach(([key, value]) => {
      if (value) {
        newParams.set(key, value);
      } else {
        newParams.delete(key);
      }
    });
    router.push(`?${newParams.toString()}`, { scroll: false });
  };
}
