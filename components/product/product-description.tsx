import { AddToCart } from "components/cart/add-to-cart";
import Price from "components/price";
import Prose from "components/prose";
import { Product } from "lib/types";
import { VariantSelector } from "./variant-selector";

export function ProductDescription({ product }: { product: Product }) {
  return (
    <>
      <div className="mb-6 flex flex-col border-b border-[#bf9d6d]/20 pb-6">
        <h1 className="mb-2 text-5xl font-medium text-[#bf9d6d] font-cormorant">{product.title}</h1>
        {product.descriptionHtml ? (
          <Prose
            className="mb-4 text-sm leading-tight text-[#bf9d6d] font-inter"
            html={product.descriptionHtml}
          />
        ) : null}
        <div className="flex items-center gap-3">
          <div className="mr-auto w-auto rounded-full bg-[#bf9d6d] p-2 text-sm text-[#f0e3d7] font-inter">
            <Price
              amount={product.priceRange.maxVariantPrice.amount}
              currencyCode={product.priceRange.maxVariantPrice.currencyCode}
            />
          </div>
        </div>
      </div>
      <VariantSelector options={product.options} variants={product.variants} />
      <AddToCart product={product} />
      {/* Espacio adicional para separar del botón de las imágenes en mobile */}
      <div className="mb-8 lg:mb-0" />
    </>
  );
}
