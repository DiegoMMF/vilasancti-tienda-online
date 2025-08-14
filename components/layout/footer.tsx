import { OverlayLink } from "components/ui/overlay-link";

import FooterMenu from "components/layout/footer-menu";
import LogoSquare from "components/logo-square";
import { getMenu } from "lib/api/menu-drizzle";
import { Suspense } from "react";

const { COMPANY_NAME, SITE_NAME } = process.env;

export default async function Footer() {
  const currentYear = new Date().getFullYear();
  const copyrightDate = 2023 + (currentYear > 2023 ? `-${currentYear}` : "");
  const skeleton =
    "w-full h-6 animate-pulse rounded-sm bg-[#bf9d6d]/20";
  const menu = await getMenu("next-js-frontend-footer-menu");
  const copyrightName = COMPANY_NAME || SITE_NAME || "";

  return (
    <footer className="text-sm text-neutral-600 font-inter">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 border-t border-[#bf9d6d]/20 px-6 py-12 text-sm md:flex-row md:gap-12 md:px-4 min-[1320px]:px-0">
        <div>
          <OverlayLink
            className="flex items-center gap-2 text-[#bf9d6d] md:pt-1 font-cormorant"
            href="/"
          >
            <LogoSquare size="sm" />
            <span className="uppercase">{SITE_NAME}</span>
          </OverlayLink>
        </div>
        <Suspense
          fallback={
            <div className="flex h-[188px] w-[200px] flex-col gap-2">
              <div className={skeleton} />
              <div className={skeleton} />
              <div className={skeleton} />
              <div className={skeleton} />
              <div className={skeleton} />
              <div className={skeleton} />
            </div>
          }
        >
          <FooterMenu menu={menu} />
        </Suspense>
      </div>
      <div className="border-t border-[#bf9d6d]/20 py-6 text-sm">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-1 px-4 md:flex-row md:gap-0 md:px-4 min-[1320px]:px-0">
          <p>
            &copy; {copyrightDate} {copyrightName}
            {copyrightName.length && !copyrightName.endsWith(".")
              ? "."
              : ""}{" "}
            All rights reserved.
          </p>
          <hr className="mx-4 hidden h-4 w-[1px] border-l border-[#bf9d6d]/40 md:inline-block" />
          <p className="md:ml-auto">
            <span className="text-[#bf9d6d] font-cormorant">
              Implemented by Diego M. Maldini Freyre
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
