"use client";

import { OverlayLink } from "components/ui/overlay-link";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { Menu } from "lib/types";
import Search from "./search";

export default function MobileMenu({ menu }: { menu: Menu[] }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const openMobileMenu = () => setIsOpen(true);
  const closeMobileMenu = () => setIsOpen(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname, searchParams]);

  return (
    <>
      <button
        onClick={openMobileMenu}
        aria-label="Open mobile menu"
        className="flex h-11 w-11 items-center justify-center rounded-md border border-[#bf9d6d]/20 text-[#bf9d6d] transition-colors md:hidden"
      >
        <Bars3Icon className="h-4" />
      </button>
      
      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/30 transition-opacity duration-300"
            onClick={closeMobileMenu}
            aria-hidden="true"
          />
          
          {/* Menu Panel */}
          <div className="fixed bottom-0 left-0 right-0 top-0 flex h-full w-full flex-col bg-[#f0e3d7] pb-6 transition-transform duration-300">
            <div className="p-4">
              <button
                className="mb-4 flex h-11 w-11 items-center justify-center rounded-md border border-[#bf9d6d]/20 text-[#bf9d6d] transition-colors"
                onClick={closeMobileMenu}
                aria-label="Close mobile menu"
              >
                <XMarkIcon className="h-6" />
              </button>

              <div className="mb-4 w-full">
                <Search />
              </div>
              
              {menu.length ? (
                <ul className="flex w-full flex-col">
                  {menu.map((item: Menu) => (
                    <li
                      className="py-2 px-3 rounded-md text-xl text-[#bf9d6d] transition-all duration-200 hover:text-[#f0e3d7] hover:bg-[#bf9d6d] hover:no-underline font-cormorant"
                      key={item.title}
                    >
                      <OverlayLink
                        href={item.path}
                        prefetch={true}
                        onClick={closeMobileMenu}
                      >
                        {item.title}
                      </OverlayLink>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
