"use client";

import { useEffect } from "react";

interface ResourcePreloaderProps {
  resources: Array<{
    href: string;
    as?: string;
    type?: string;
    crossOrigin?: string;
  }>;
}

export default function ResourcePreloader({
  resources,
}: ResourcePreloaderProps) {
  useEffect(() => {
    // Preload recursos críticos
    resources.forEach(({ href, as, type, crossOrigin }) => {
      const link = document.createElement("link");
      link.rel = "preload";
      link.href = href;

      if (as) link.setAttribute("as", as);
      if (type) link.setAttribute("type", type);
      if (crossOrigin) link.setAttribute("crossorigin", crossOrigin);

      document.head.appendChild(link);
    });

    // Cleanup al desmontar
    return () => {
      resources.forEach(({ href }) => {
        const link = document.querySelector(`link[href="${href}"]`);
        if (link) {
          document.head.removeChild(link);
        }
      });
    };
  }, [resources]);

  return null;
}

// Hook para precargar recursos
export function useResourcePreload() {
  const preloadResource = (href: string, as?: string, type?: string) => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.href = href;

    if (as) link.setAttribute("as", as);
    if (type) link.setAttribute("type", type);

    document.head.appendChild(link);
  };

  const preloadImage = (src: string) => {
    preloadResource(src, "image");
  };

  const preloadFont = (href: string, type = "font/woff2") => {
    preloadResource(href, "font", type);
  };

  const preloadScript = (src: string) => {
    preloadResource(src, "script");
  };

  const preloadStyle = (href: string) => {
    preloadResource(href, "style");
  };

  return {
    preloadResource,
    preloadImage,
    preloadFont,
    preloadScript,
    preloadStyle,
  };
}

// Componente para precargar imágenes críticas
export function CriticalImagePreloader({ images }: { images: string[] }) {
  const { preloadImage } = useResourcePreload();

  useEffect(() => {
    images.forEach((src) => {
      preloadImage(src);
    });
  }, [images, preloadImage]);

  return null;
}

// Componente para precargar fuentes críticas
export function CriticalFontPreloader({
  fonts,
}: {
  fonts: Array<{ href: string; type?: string }>;
}) {
  const { preloadFont } = useResourcePreload();

  useEffect(() => {
    fonts.forEach(({ href, type }) => {
      preloadFont(href, type);
    });
  }, [fonts, preloadFont]);

  return null;
}
