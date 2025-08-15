"use client";

import { useEffect, useRef } from "react";

interface CSSOptimizerProps {
  href?: string;
  content?: string;
  critical?: boolean;
  media?: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

export default function CSSOptimizer({
  href,
  content,
  critical = false,
  media = "all",
  onLoad,
  onError,
}: CSSOptimizerProps) {
  const linkRef = useRef<HTMLLinkElement | null>(null);
  const styleRef = useRef<HTMLStyleElement | null>(null);

  useEffect(() => {
    if (!href && !content) return;

    const loadCSS = () => {
      if (href) {
        // Cargar CSS externo
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = href;
        link.media = critical ? "all" : media;

        if (onLoad) {
          link.onload = onLoad;
        }

        if (onError) {
          link.onerror = () =>
            onError(new Error(`Failed to load CSS: ${href}`));
        }

        document.head.appendChild(link);
        linkRef.current = link;
      } else if (content) {
        // CSS inline
        const style = document.createElement("style");
        style.textContent = content;
        style.media = media;

        document.head.appendChild(style);
        styleRef.current = style;

        if (onLoad) {
          onLoad();
        }
      }
    };

    // Estrategia de carga basada en si es crítico o no
    if (critical) {
      loadCSS();
    } else {
      // Cargar CSS no crítico de manera asíncrona
      if ("requestIdleCallback" in window) {
        requestIdleCallback(loadCSS);
      } else {
        setTimeout(loadCSS, 1);
      }
    }

    // Cleanup
    return () => {
      if (linkRef.current && linkRef.current.parentNode) {
        linkRef.current.parentNode.removeChild(linkRef.current);
      }
      if (styleRef.current && styleRef.current.parentNode) {
        styleRef.current.parentNode.removeChild(styleRef.current);
      }
    };
  }, [href, content, critical, media, onLoad, onError]);

  return null;
}

// Hook para optimizar la carga de CSS
export function useCSSLoader() {
  const loadedCSS = useRef<Set<string>>(new Set());

  const loadCSS = (
    href: string,
    options: {
      critical?: boolean;
      media?: string;
      onLoad?: () => void;
      onError?: (error: Error) => void;
    } = {},
  ) => {
    if (loadedCSS.current.has(href)) {
      if (options.onLoad) options.onLoad();
      return Promise.resolve();
    }

    return new Promise<void>((resolve, reject) => {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      link.media = options.media || "all";

      link.onload = () => {
        loadedCSS.current.add(href);
        if (options.onLoad) options.onLoad();
        resolve();
      };

      link.onerror = () => {
        const error = new Error(`Failed to load CSS: ${href}`);
        if (options.onError) options.onError(error);
        reject(error);
      };

      document.head.appendChild(link);
    });
  };

  const loadCriticalCSS = (content: string) => {
    const style = document.createElement("style");
    style.textContent = content;
    document.head.appendChild(style);
  };

  const loadNonCriticalCSS = (href: string, media = "print") => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    link.media = media;

    // Cambiar a 'all' cuando la página esté lista
    const switchMedia = () => {
      link.media = "all";
    };

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", switchMedia);
    } else {
      switchMedia();
    }

    document.head.appendChild(link);
  };

  return {
    loadCSS,
    loadCriticalCSS,
    loadNonCriticalCSS,
    loadedCSS: loadedCSS.current,
  };
}

// Componente para cargar CSS crítico inline
export function CriticalCSS({ content }: { content: string }) {
  return <CSSOptimizer content={content} critical={true} />;
}

// Componente para cargar CSS no crítico de manera optimizada
export function NonCriticalCSS({
  href,
  media = "print",
}: {
  href: string;
  media?: string;
}) {
  return <CSSOptimizer href={href} critical={false} media={media} />;
}

// Hook para purgar CSS no utilizado
export function useCSSPurger() {
  const purgeCSS = (content: string, selectors: string[]) => {
    // Implementación básica de purga de CSS
    // En producción, usar herramientas como PurgeCSS
    let purgedContent = content;

    selectors.forEach((selector) => {
      const regex = new RegExp(`[^}]*${selector}[^}]*{[^}]*}`, "g");
      purgedContent = purgedContent.replace(regex, "");
    });

    return purgedContent;
  };

  return { purgeCSS };
}
