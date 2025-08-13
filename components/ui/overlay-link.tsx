"use client";

import Link, { LinkProps } from "next/link";
import { useLoadingOverlay } from "components/ui/loading-overlay-context";
import React from "react";

type OverlayLinkProps = LinkProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & {
    showOnClick?: boolean;
  };

export function OverlayLink({
  showOnClick = true,
  onClick,
  ...props
}: OverlayLinkProps) {
  const { show } = useLoadingOverlay();

  return (
    <Link
      {...props}
      onClick={(e) => {
        if (showOnClick) show();
        onClick?.(e);
      }}
    />
  );
}
