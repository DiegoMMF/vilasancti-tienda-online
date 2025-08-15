import { Collection, Product } from "lib/types";

interface CategorySchemaProps {
  collection: Collection;
  products: Product[];
}

export function CategorySchema({ collection, products }: CategorySchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: collection.title,
    description: collection.description,
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: product.title,
        url: `https://vilasancti.vercel.app/product/${product.handle}`,
        image: product.featuredImage.url,
        offers: {
          "@type": "Offer",
          price: product.priceRange.minVariantPrice.amount,
          priceCurrency: "ARS",
        },
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
