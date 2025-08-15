"use client";

import { useEffect, useRef, useState } from "react";

interface UseLazyLoadOptions {
  threshold?: number;
  rootMargin?: string;
  root?: Element | null;
}

export function useLazyLoad<T extends HTMLElement = HTMLElement>(
  options: UseLazyLoadOptions = {},
) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<T>(null);

  const { threshold = 0.1, rootMargin = "50px", root = null } = options;

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold,
        rootMargin,
        root,
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [threshold, rootMargin, root]);

  return { elementRef, isVisible };
}

// Hook para lazy loading de imágenes
export function useImageLazyLoad() {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const loadImage = (src: string) => {
    if (loadedImages.has(src)) return;

    const img = new Image();
    img.onload = () => {
      setLoadedImages((prev) => new Set(prev).add(src));
    };
    img.src = src;
  };

  return { loadedImages, loadImage };
}

// Hook para lazy loading de componentes React
export function useComponentLazyLoad<T>(
  importFn: () => Promise<{ default: React.ComponentType<T> }>,
  fallback?: React.ComponentType,
) {
  const [Component, setComponent] = useState<React.ComponentType<T> | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const loadComponent = async () => {
    if (Component || isLoading) return;

    setIsLoading(true);
    setError(null);

    try {
      const importedModule = await importFn();
      setComponent(() => importedModule.default);
    } catch (err) {
      setError(
        err instanceof Error ? err : new Error("Error loading component"),
      );
    } finally {
      setIsLoading(false);
    }
  };

  return {
    Component: Component || fallback,
    isLoading,
    error,
    loadComponent,
  };
}
