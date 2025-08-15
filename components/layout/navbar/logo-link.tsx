"use client";

import { useLoadingOverlay } from "components/ui/loading-overlay-context";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function LogoLink() {
  const pathname = usePathname();
  const { show } = useLoadingOverlay();
  
  const isHomePage = pathname === "/";

  return (
    <Link
      href="/"
      prefetch={true}
      className="mr-2 flex w-full items-center justify-center md:w-auto lg:mr-6"
      onClick={(e) => {
        // Solo mostrar loader si NO estamos en la página principal
        if (!isHomePage) {
          show();
        }
      }}
    >
      <div
        className="text-2xl font-bold uppercase text-[#bf9d6d] tracking-wide"
        style={{ fontFamily: "var(--font-cormorant)" }}
      >
        VILASANCTI
      </div>
    </Link>
  );
}
