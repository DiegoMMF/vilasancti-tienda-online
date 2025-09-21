"use client";

import { useDiscount } from "lib/hooks/use-discount";

export default function DiscountBadge() {
  const { isDiscountActive, discountPercentage } = useDiscount();

  if (!isDiscountActive) return null;

  return (
    <div className="inline-flex items-center rounded-full bg-[#bf9d6d] px-3 py-1 text-xs font-medium text-white shadow-sm font-cormorant">
      <span className="mr-1">💝</span>
      {discountPercentage}% OFF
    </div>
  );
}
