import CartModal from "components/cart/modal";
import { OverlayLink } from "components/ui/overlay-link";
import { getMenu } from "lib/api/menu-drizzle";
import { Menu } from "lib/types";
import { Suspense } from "react";
import { LogoLink } from "./logo-link";
import MobileMenu from "./mobile-menu";
import Search, { SearchSkeleton } from "./search";

const { SITE_NAME } = process.env;

export async function Navbar() {
  const menu = await getMenu("next-js-frontend-header-menu");

  return (
    <nav className="relative flex items-center justify-between px-4 py-6 lg:px-12 lg:py-8 max-w-[90vw] mx-auto">
      <div className="block flex-none md:hidden -ml-8">
        <Suspense fallback={null}>
          <MobileMenu menu={menu} />
        </Suspense>
      </div>
      <div className="flex w-full items-center">
        <div className="flex w-full md:w-1/3">
          <LogoLink />
          {menu.length ? (
            <ul className="hidden gap-6 text-sm md:flex md:items-center">
              {menu.map((item: Menu) => (
                <li key={item.title}>
                  <OverlayLink
                    href={item.path}
                    prefetch={true}
                    className="text-[#bf9d6d] px-3 py-1 rounded-md transition-all duration-200 hover:text-[#f0e3d7] hover:bg-[#bf9d6d] hover:no-underline font-inter"
                  >
                    {item.title}
                  </OverlayLink>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
        <div className="hidden justify-center md:flex md:w-1/3">
          <Suspense fallback={<SearchSkeleton />}>
            <Search />
          </Suspense>
        </div>
        <div className="flex justify-end md:w-1/3 -mr-8">
          <CartModal />
        </div>
      </div>
    </nav>
  );
}
