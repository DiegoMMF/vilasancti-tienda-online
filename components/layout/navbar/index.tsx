import CartModal from "components/cart/modal";
import { OverlayLink } from "components/ui/overlay-link";
import { getMenu } from "lib/api/menu-drizzle";
import { Menu } from "lib/types";
import { Suspense } from "react";
import { NavbarLayout } from "./layout";
import { LogoLink } from "./logo-link";
import MobileMenu from "./mobile-menu";
import Search, { SearchSkeleton } from "./search";

const { SITE_NAME } = process.env;

export async function Navbar() {
  const menu = await getMenu("next-js-frontend-header-menu");

  return (
    <NavbarLayout>
      {/* Mobile menu button - Left side */}
      <div className="flex items-center md:hidden">
        <Suspense fallback={null}>
          <MobileMenu menu={menu} />
        </Suspense>
      </div>

      {/* Logo - Center on mobile, left on desktop */}
      <div className="flex flex-1 items-center justify-center md:justify-start">
        <LogoLink />
      </div>

      {/* Desktop Navigation - Hidden on mobile */}
      <div className="hidden md:flex md:items-center md:space-x-6">
        {menu.length ? (
          <ul className="flex gap-6 text-sm">
            {menu.map((item: Menu) => (
              <li key={item.title}>
                <OverlayLink
                  href={item.path}
                  prefetch={true}
                  className="text-[#bf9d6d] px-3 py-2 rounded-md transition-all duration-200 hover:text-[#f0e3d7] hover:bg-[#bf9d6d] hover:no-underline font-inter"
                >
                  {item.title}
                </OverlayLink>
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      {/* Search Bar - Hidden on mobile, centered on desktop */}
      <div className="hidden md:flex md:flex-1 md:justify-center md:max-w-lg">
        <Suspense fallback={<SearchSkeleton />}>
          <Search />
        </Suspense>
      </div>

      {/* Cart - Right side */}
      <div className="flex items-center justify-end">
        <CartModal />
      </div>
    </NavbarLayout>
  );
}
