import { Product } from "lib/types";

interface ProductSchemaProps {
  product: Product;
}

export function ProductSchema({ product }: ProductSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: product.images.map((img) => img.url),
    description: product.description,
    sku: product.id,
    brand: {
      "@type": "Brand",
      name: "Vilasancti",
    },
    offers: {
      "@type": "Offer",
      priceCurrency: "ARS",
      price: product.priceRange.minVariantPrice.amount,
      priceValidUntil: new Date(
        Date.now() + 365 * 24 * 60 * 60 * 1000,
      ).toISOString(),
      availability: product.availableForSale
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `https://vilasancti.vercel.app/product/${product.handle}`,
      seller: {
        "@type": "Organization",
        name: "Vilasancti",
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: {
          "@type": "MonetaryAmount",
          value: "0",
          currency: "ARS",
        },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: {
            "@type": "QuantitativeValue",
            minValue: 1,
            maxValue: 2,
            unitCode: "DAY",
          },
        },
      },
    },
    category: "Pijamas",
    additionalProperty: product.options?.map((option) => ({
      "@type": "PropertyValue",
      name: option.name,
      value: option.values.join(", "),
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
