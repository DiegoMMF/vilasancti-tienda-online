"use client";

import clsx from "clsx";
import { OverlayLink } from "components/ui/overlay-link";
import { Menu } from "lib/types";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function FooterMenuItem({ item }: { item: Menu }) {
  const pathname = usePathname();
  const [active, setActive] = useState(pathname === item.path);

  useEffect(() => {
    setActive(pathname === item.path);
  }, [pathname, item.path]);

  return (
    <li>
      <OverlayLink
        href={item.path}
        className={clsx(
          "block p-2 px-3 rounded-md text-lg text-[#bf9d6d] transition-all duration-200 hover:text-[#f0e3d7] hover:bg-[#bf9d6d] md:inline-block md:text-sm",
          {
            "text-[#bf9d6d]": active,
          },
        )}
      >
        {item.title}
      </OverlayLink>
    </li>
  );
}

export default function FooterMenu({ menu }: { menu: Menu[] }) {
  if (!menu.length) return null;

  return (
    <nav>
      <ul>
        {menu.map((item: Menu) => {
          return <FooterMenuItem key={item.title} item={item} />;
        })}
      </ul>
    </nav>
  );
}
