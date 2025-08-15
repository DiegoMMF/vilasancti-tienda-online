"use client";

import { usePathname, useSearchParams } from "next/navigation";
import {
  createContext,
  Suspense,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { FullscreenLoader } from "./fullscreen-loaders";

interface LoadingOverlayContextShape {
  show: () => void;
  hide: () => void;
}

const LoadingOverlayContext = createContext<LoadingOverlayContextShape | null>(
  null,
);

export function LoadingOverlayProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const show = useCallback(() => setOpen(true), []);
  const hide = useCallback(() => setOpen(false), []);

  const value = useMemo(() => ({ show, hide }), [show, hide]);

  return (
    <LoadingOverlayContext.Provider value={value}>
      {children}
      <FullscreenLoader open={open} onCloseAction={hide} />
      <Suspense fallback={null}>
        <NavigationAutoHide onNavigated={hide} />
      </Suspense>
    </LoadingOverlayContext.Provider>
  );
}

export function useLoadingOverlay() {
  const ctx = useContext(LoadingOverlayContext);
  if (!ctx)
    throw new Error(
      "useLoadingOverlay must be used within LoadingOverlayProvider",
    );
  return ctx;
}

// Hides the overlay automatically after a route/search change
function NavigationAutoHide({ onNavigated }: { onNavigated: () => void }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    onNavigated();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, searchParams?.toString()]);

  return null;
}
