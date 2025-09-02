import { ReactNode } from "react";

interface NavbarLayoutProps {
  children: ReactNode;
  className?: string;
}

export function NavbarLayout({ children, className = "" }: NavbarLayoutProps) {
  return (
    <header
      className={`sticky top-0 z-50 w-full bg-[#f0e3d7]/95 backdrop-blur-sm border-b border-[#bf9d6d]/10 ${className}`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">{children}</div>
      </div>
    </header>
  );
}
