"use client";

import { XMarkIcon } from "@heroicons/react/24/outline";
import { useDiscount } from "lib/hooks/use-discount";
import { useState } from "react";

export default function PromotionalBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const { isDiscountActive, discountPercentage } = useDiscount();

  if (!isVisible || !isDiscountActive) return null;

  return (
    <div className="relative bg-gradient-to-r from-[#bf9d6d] to-[#a88a5a] text-white">
      <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              <span className="text-lg">💝</span>
            </div>
            <p className="text-sm font-medium font-inter">
              <span className="font-inter">
                Obsequio Lanzamiento &quot;vilasancti.com.ar&quot;
              </span>
              <br className="block md:hidden" />
              <span className="hidden md:inline-block mx-3 text-[#bf9d6d]/60">
                •
              </span>
              <span className="text-lg font-bold font-cormorant">
                {discountPercentage}% OFF en todos los artículos!
              </span>
            </p>
          </div>
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setIsVisible(false)}
              className="flex rounded-md p-1.5 text-white hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white transition-colors"
              aria-label="Cerrar banner promocional"
            >
              <span className="sr-only">Cerrar banner</span>
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
