"use client";

import { useEffect, useRef, useState } from "react";

interface FontOptimizerProps {
  href: string;
  family: string;
  display?: "auto" | "block" | "swap" | "fallback" | "optional";
  preload?: boolean;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

export default function FontOptimizer({
  href,
  family,
  display = "swap",
  preload = false,
  onLoad,
  onError,
}: FontOptimizerProps) {
  const linkRef = useRef<HTMLLinkElement | null>(null);

  useEffect(() => {
    const loadFont = () => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;

      // Optimizaciones de fuentes
      link.setAttribute("media", "print");
      link.setAttribute("onload", "this.media='all'");

      if (onLoad) {
        link.onload = onLoad;
      }

      if (onError) {
        link.onerror = () =>
          onError(new Error(`Failed to load font: ${family}`));
      }

      document.head.appendChild(link);
      linkRef.current = link;
    };

    // Precargar fuentes críticas
    if (preload) {
      const preloadLink = document.createElement("link");
      preloadLink.rel = "preload";
      preloadLink.href = href;
      preloadLink.as = "font";
      preloadLink.type = "font/woff2";
      preloadLink.setAttribute("crossorigin", "anonymous");
      document.head.appendChild(preloadLink);
    }

    loadFont();

    // Cleanup
    return () => {
      if (linkRef.current && linkRef.current.parentNode) {
        linkRef.current.parentNode.removeChild(linkRef.current);
      }
    };
  }, [href, family, display, preload, onLoad, onError]);

  return null;
}

// Hook para optimizar la carga de fuentes
export function useFontLoader() {
  const loadedFonts = useRef<Set<string>>(new Set());

  const loadFont = (
    href: string,
    family: string,
    options: {
      display?: "auto" | "block" | "swap" | "fallback" | "optional";
      preload?: boolean;
      onLoad?: () => void;
      onError?: (error: Error) => void;
    } = {},
  ) => {
    if (loadedFonts.current.has(href)) {
      if (options.onLoad) options.onLoad();
      return Promise.resolve();
    }

    return new Promise<void>((resolve, reject) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;

      // Optimizaciones
      link.setAttribute("media", "print");
      link.setAttribute("onload", "this.media='all'");

      link.onload = () => {
        loadedFonts.current.add(href);
        if (options.onLoad) options.onLoad();
        resolve();
      };

      link.onerror = () => {
        const error = new Error(`Failed to load font: ${family}`);
        if (options.onError) options.onError(error);
        reject(error);
      };

      document.head.appendChild(link);
    });
  };

  const preloadFont = (href: string, type = "font/woff2") => {
    const link = document.createElement("link");
    link.rel = "preload";
    link.href = href;
    link.as = "font";
    link.type = type;
    link.setAttribute("crossorigin", "anonymous");
    document.head.appendChild(link);
  };

  const loadFonts = async (fonts: Array<{ href: string; family: string }>) => {
    const promises = fonts.map(({ href, family }) => loadFont(href, family));
    await Promise.all(promises);
  };

  return {
    loadFont,
    preloadFont,
    loadFonts,
    loadedFonts: loadedFonts.current,
  };
}

// Componente para cargar fuentes críticas
export function CriticalFont({
  href,
  family,
}: {
  href: string;
  family: string;
}) {
  return (
    <FontOptimizer href={href} family={family} display="swap" preload={true} />
  );
}

// Componente para cargar fuentes no críticas
export function NonCriticalFont({
  href,
  family,
}: {
  href: string;
  family: string;
}) {
  return (
    <FontOptimizer
      href={href}
      family={family}
      display="optional"
      preload={false}
    />
  );
}

// Hook para detectar si las fuentes están cargadas
export function useFontDetection() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    if ("fonts" in document) {
      document.fonts.ready.then(() => {
        setFontsLoaded(true);
      });
    } else {
      // Fallback para navegadores que no soportan Font Loading API
      setTimeout(() => {
        setFontsLoaded(true);
      }, 3000);
    }
  }, []);

  return fontsLoaded;
}

// Hook para optimizar el renderizado de fuentes
export function useFontRenderOptimization() {
  useEffect(() => {
    // Agregar clase para optimizar el renderizado de fuentes
    document.documentElement.classList.add("font-loading");

    const handleFontsLoaded = () => {
      document.documentElement.classList.remove("font-loading");
      document.documentElement.classList.add("fonts-loaded");
    };

    if ("fonts" in document) {
      document.fonts.ready.then(handleFontsLoaded);
    } else {
      setTimeout(handleFontsLoaded, 3000);
    }
  }, []);
}
