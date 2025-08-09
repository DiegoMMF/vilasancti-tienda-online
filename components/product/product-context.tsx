'use client';

import { useRouter } from 'next/navigation';
import React, { createContext, useCallback, useContext, useMemo, useOptimistic } from 'react';

type ProductState = {
  [key: string]: string;
} & {
  image?: string;
};

type ProductContextType = {
  state: ProductState;
  updateOption: (name: string, value: string) => ProductState;
  updateImage: (index: string) => ProductState;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({ children, initialState }: { children: React.ReactNode; initialState?: Record<string, string> }) {
  const getInitialState = () => ({ ...(initialState || {}) } as ProductState);

  const [state, setOptimisticState] = useOptimistic(
    getInitialState(),
    (prevState: ProductState, update: ProductState) => ({
      ...prevState,
      ...update
    })
  );

  const updateOption = useCallback(
    (name: string, value: string) => {
      const newState = { [name]: value };
      setOptimisticState(newState);
      return { ...state, ...newState };
    },
    [setOptimisticState, state]
  );

  const updateImage = useCallback(
    (index: string) => {
      const newState = { image: index };
      setOptimisticState(newState);
      return { ...state, ...newState };
    },
    [setOptimisticState, state]
  );

  const value = useMemo(
    () => ({
      state,
      updateOption,
      updateImage
    }),
    [state, updateOption, updateImage]
  );

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}

export function useProduct() {
  const context = useContext(ProductContext);
  if (context === undefined) {
    throw new Error('useProduct must be used within a ProductProvider');
  }
  return context;
}

export function useUpdateURL() {
  const router = useRouter();

  return (state: ProductState) => {
    const newParams = new URLSearchParams(window.location.search);
    Object.entries(state).forEach(([key, value]) => {
      newParams.set(key, value);
    });
    router.push(`?${newParams.toString()}`, { scroll: false });
  };
}
