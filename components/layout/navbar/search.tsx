"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useLoadingOverlay } from "components/ui/loading-overlay-context";
import Form from "next/form";
import { useSearchParams } from "next/navigation";

export default function Search() {
  const searchParams = useSearchParams();
  const { show } = useLoadingOverlay();

  return (
    <Form
      action="/search"
      className="relative w-full max-w-md"
      onSubmit={() => {
        show();
      }}
    >
      <input
        key={searchParams?.get("q")}
        type="text"
        name="q"
        placeholder="Buscar pijamas, tallas, colores..."
        autoComplete="off"
        defaultValue={searchParams?.get("q") || ""}
        className="text-md w-full rounded-lg border border-[#bf9d6d]/20 bg-[#f0e3d7] px-4 pr-12 py-2 text-[#bf9d6d] placeholder:text-[#bf9d6d]/70 md:text-sm font-inter"
      />
      <div className="absolute right-0 top-0 mr-4 flex h-full items-center">
        <MagnifyingGlassIcon className="h-4 text-[#bf9d6d]" />
      </div>
    </Form>
  );
}

export function SearchSkeleton() {
  return (
    <form className="relative w-full max-w-md">
      <input
        placeholder="Buscar pijamas, tallas, colores..."
        className="w-full rounded-lg border border-[#bf9d6d]/20 bg-[#f0e3d7] px-4 pr-12 py-2 text-sm text-[#bf9d6d] placeholder:text-[#bf9d6d]/70 font-inter"
      />
      <div className="absolute right-0 top-0 mr-4 flex h-full items-center">
        <MagnifyingGlassIcon className="h-4 text-[#bf9d6d]" />
      </div>
    </form>
  );
}
