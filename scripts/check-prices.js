import { eq } from "drizzle-orm";
import { db } from "../lib/db/index.js";
import { productVariants, products } from "../lib/db/schema.js";

async function checkPrices() {
  try {
    console.log("Verificando precios en la base de datos...");

    const variants = await db
      .select({
        id: productVariants.id,
        title: productVariants.title,
        price: productVariants.price,
        currencyCode: productVariants.currencyCode,
        productTitle: products.title,
      })
      .from(productVariants)
      .innerJoin(products, eq(productVariants.productId, products.id))
      .limit(5);

    console.log("Variantes encontradas:");
    variants.forEach((variant) => {
      console.log({
        id: variant.id,
        title: variant.title,
        price: variant.price,
        priceType: typeof variant.price,
        currencyCode: variant.currencyCode,
        productTitle: variant.productTitle,
      });
    });
  } catch (error) {
    console.error("Error:", error);
  } finally {
    process.exit(0);
  }
}

checkPrices();
