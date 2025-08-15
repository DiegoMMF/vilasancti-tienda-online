"use client";

import { useLoadingOverlay } from "components/ui/loading-overlay-context";
import Link, { LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type OverlayLinkProps = LinkProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    showOnClick?: boolean;
  };

export function OverlayLink({
  showOnClick = true,
  onClick,
  href,
  ...props
}: OverlayLinkProps) {
  const { show } = useLoadingOverlay();
  const pathname = usePathname();

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Si la ruta actual es la misma a la que se quiere navegar
    if (pathname === href) {
      e.preventDefault();
      // Hacer scroll suave hacia arriba
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
      return;
    }

    // Si es una ruta diferente, mostrar el loader
    if (showOnClick) show();
    onClick?.(e);
  };

  return <Link {...props} href={href} onClick={handleClick} />;
}
