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
      className="w-max-[550px] relative w-full lg:w-80 xl:w-full"
      onSubmit={() => {
        show();
      }}
    >
      <input
        key={searchParams?.get("q")}
        type="text"
        name="q"
        placeholder="Buscar piyamas, tallas, colores..."
        autoComplete="off"
        defaultValue={searchParams?.get("q") || ""}
        className="text-md w-full rounded-lg border border-[#bf9d6d]/20 bg-[#f0e3d7] px-4 py-2 text-[#bf9d6d] placeholder:text-[#bf9d6d]/70 md:text-sm font-inter"
      />
      <div className="absolute right-0 top-0 mr-3 flex h-full items-center">
        <MagnifyingGlassIcon className="h-4 text-[#bf9d6d]" />
      </div>
    </Form>
  );
}

export function SearchSkeleton() {
  return (
    <form className="w-max-[550px] relative w-full lg:w-80 xl:w-full">
      <input
        placeholder="Buscar piyamas, tallas, colores..."
        className="w-full rounded-lg border border-[#bf9d6d]/20 bg-[#f0e3d7] px-4 py-2 text-sm text-[#bf9d6d] placeholder:text-[#bf9d6d]/70 font-inter"
      />
      <div className="absolute right-0 top-0 mr-3 flex h-full items-center">
        <MagnifyingGlassIcon className="h-4 text-[#bf9d6d]" />
      </div>
    </form>
  );
}
