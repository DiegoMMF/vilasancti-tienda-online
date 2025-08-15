"use client";

import { useState } from "react";

export function FullscreenLoader({
  open,
  onCloseAction,
}: {
  open: boolean;
  onCloseAction?: () => void;
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-white/70 dark:bg-black/70 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label="Cargando"
      onClick={onCloseAction}
    >
      <div className="pointer-events-none" aria-hidden>
        <GlassSpinner />
      </div>
    </div>
  );
}

/* Glass spinner: círculo con borde y glow sutil */
function GlassSpinner() {
  return (
    <div className="relative grid place-items-center">
      <div className="h-16 w-16 animate-spin rounded-full border-2 border-[#bf9d6d]/30 border-t-[#bf9d6d] sm:h-12 sm:w-12" />
      <div className="absolute inset-0 rounded-full bg-[#f0e3d7]/20 blur-xl" />
    </div>
  );
}

/* Showcase helper for /design-toolkit */
export function LoaderShowcase() {
  const [open, setOpen] = useState(false);

  return (
    <section className="space-y-4">
      <h2 className="mb-2 text-3xl font-semibold tracking-tight">Loader</h2>
      <p className="text-[#bf9d6d]">
        Overlay de pantalla completa con alta transparencia y blur.
      </p>
      <div className="flex flex-wrap gap-3">
        <button
          className="rounded-lg border border-[#bf9d6d]/20 px-4 py-2 text-[#bf9d6d] hover:bg-[#bf9d6d] hover:text-[#f0e3d7] transition-all duration-200"
          onClick={() => setOpen(true)}
        >
          Mostrar Loader
        </button>
      </div>

      <FullscreenLoader open={open} onCloseAction={() => setOpen(false)} />
    </section>
  );
}
