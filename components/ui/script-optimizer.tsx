"use client";

import { useEffect, useRef } from "react";

interface ScriptOptimizerProps {
  src?: string;
  code?: string;
  strategy?: "beforeInteractive" | "afterInteractive" | "lazyOnload";
  id?: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
}

export default function ScriptOptimizer({
  src,
  code,
  strategy = "afterInteractive",
  id,
  onLoad,
  onError,
}: ScriptOptimizerProps) {
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    if (!src && !code) return;

    const loadScript = () => {
      const script = document.createElement("script");

      if (src) {
        script.src = src;
      }

      if (code) {
        script.textContent = code;
      }

      if (id) {
        script.id = id;
      }

      // Configurar callbacks
      if (onLoad) {
        script.onload = onLoad;
      }

      if (onError) {
        script.onerror = () =>
          onError(new Error(`Failed to load script: ${src || "inline"}`));
      }

      // Agregar atributos de optimización
      script.async = true;
      script.defer = strategy === "lazyOnload";

      document.head.appendChild(script);
      scriptRef.current = script;
    };

    // Estrategias de carga
    switch (strategy) {
      case "beforeInteractive":
        loadScript();
        break;

      case "afterInteractive":
        if (document.readyState === "loading") {
          document.addEventListener("DOMContentLoaded", loadScript);
        } else {
          loadScript();
        }
        break;

      case "lazyOnload":
        if ("requestIdleCallback" in window) {
          requestIdleCallback(loadScript);
        } else {
          setTimeout(loadScript, 1);
        }
        break;
    }

    // Cleanup
    return () => {
      if (scriptRef.current && scriptRef.current.parentNode) {
        scriptRef.current.parentNode.removeChild(scriptRef.current);
      }
    };
  }, [src, code, strategy, id, onLoad, onError]);

  return null;
}

// Hook para cargar scripts de manera optimizada
export function useScriptLoader() {
  const loadedScripts = useRef<Set<string>>(new Set());

  const loadScript = (
    src: string,
    options: {
      id?: string;
      onLoad?: () => void;
      onError?: (error: Error) => void;
    } = {},
  ) => {
    if (loadedScripts.current.has(src)) {
      if (options.onLoad) options.onLoad();
      return Promise.resolve();
    }

    return new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = true;

      if (options.id) {
        script.id = options.id;
      }

      script.onload = () => {
        loadedScripts.current.add(src);
        if (options.onLoad) options.onLoad();
        resolve();
      };

      script.onerror = () => {
        const error = new Error(`Failed to load script: ${src}`);
        if (options.onError) options.onError(error);
        reject(error);
      };

      document.head.appendChild(script);
    });
  };

  const loadScripts = async (scripts: string[]) => {
    const promises = scripts.map((src) => loadScript(src));
    await Promise.all(promises);
  };

  return { loadScript, loadScripts, loadedScripts: loadedScripts.current };
}

// Componente para cargar scripts de terceros de manera optimizada
export function ThirdPartyScript({
  src,
  id,
  strategy = "lazyOnload",
  onLoad,
  onError,
}: {
  src: string;
  id?: string;
  strategy?: "beforeInteractive" | "afterInteractive" | "lazyOnload";
  onLoad?: () => void;
  onError?: (error: Error) => void;
}) {
  return (
    <ScriptOptimizer
      src={src}
      strategy={strategy}
      id={id}
      onLoad={onLoad}
      onError={onError}
    />
  );
}

// Hook para optimizar la carga de módulos
export function useModuleLoader() {
  const loadedModules = useRef<Set<string>>(new Set());

  const loadModule = async (modulePath: string) => {
    if (loadedModules.current.has(modulePath)) {
      return;
    }

    try {
      await import(/* webpackChunkName: "[request]" */ modulePath);
      loadedModules.current.add(modulePath);
    } catch (error) {
      console.error(`Failed to load module: ${modulePath}`, error);
      throw error;
    }
  };

  return { loadModule, loadedModules: loadedModules.current };
}
