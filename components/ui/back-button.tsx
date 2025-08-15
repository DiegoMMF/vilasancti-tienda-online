"use client";

import { ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function BackButton() {
  return (
    <div className="fixed top-20 left-4 z-50">
      <button
        onClick={() => window.history.back()}
        className="flex h-12 w-12 items-center justify-center rounded-full border border-[#bf9d6d]/20 bg-[#f0e3d7]/90 backdrop-blur-sm text-[#bf9d6d] transition-all duration-200 hover:bg-[#f0e3d7] hover:scale-110 hover:shadow-lg"
        aria-label="Volver atrás"
      >
        <ArrowLeftIcon className="h-5 w-5" />
      </button>
    </div>
  );
}
