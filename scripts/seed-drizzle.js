// Cargar variables de entorno desde .env.local
import { config } from "dotenv";
config({ path: ".env.local" });

import { db } from "../lib/db/index.ts";
import {
  collections,
  productCollections,
  productImages,
  products,
  productVariants,
} from "../lib/db/schema.ts";
import { getBlobUrlsForFolder } from "./generate-blob-urls.js";

async function main() {
  console.log("🌱 Reseeding database con Drizzle (women pajamas)...");

  // Wipe existing data (respect FK order)
  await db.delete(productCollections);
  await db.delete(productImages);
  await db.delete(productVariants);
  await db.delete(products);
  await db.delete(collections);

  // Create needed collections
  const now = new Date();
  const [featured] = await db
    .insert(collections)
    .values({
      handle: "hidden-homepage-featured-items",
      title: "Destacados",
      description: "Pijamas destacados para la portada",
      seoTitle: "Pijamas Destacados",
      seoDescription: "Descubre nuestros pijamas destacados para mujer",
      updatedAt: now,
    })
    .returning();

  const [carousel] = await db
    .insert(collections)
    .values({
      handle: "hidden-homepage-carousel",
      title: "Carrusel Portada",
      description: "Pijamas para el carrusel de portada",
      seoTitle: "Carrusel de Pijamas",
      seoDescription: "Explora nuestros pijamas en el carrusel de portada",
      updatedAt: now,
    })
    .returning();

  const [lisos] = await db
    .insert(collections)
    .values({
      handle: "lisos",
      title: "Lisos",
      description: "Pijamas con diseños lisos y elegantes",
      seoTitle: "Pijamas Lisos",
      seoDescription: "Pijamas con diseños lisos y elegantes para mujer",
      updatedAt: now,
    })
    .returning();

  const [estampados] = await db
    .insert(collections)
    .values({
      handle: "estampados",
      title: "Estampados",
      description: "Pijamas con estampados y diseños únicos",
      seoTitle: "Pijamas Estampados",
      seoDescription: "Pijamas con estampados y diseños únicos para mujer",
      updatedAt: now,
    })
    .returning();

  const [cortos] = await db
    .insert(collections)
    .values({
      handle: "cortos",
      title: "Cortos",
      description: "Pijamas cortos para mayor comodidad",
      seoTitle: "Pijamas Cortos",
      seoDescription: "Pijamas cortos para mayor comodidad y frescura",
      updatedAt: now,
    })
    .returning();

  const [largos] = await db
    .insert(collections)
    .values({
      handle: "largos",
      title: "Largos",
      description: "Pijamas largos para mayor cobertura",
      seoTitle: "Pijamas Largos",
      seoDescription: "Pijamas largos para mayor cobertura y elegancia",
      updatedAt: now,
    })
    .returning();

  console.log("✅ Collections created");

  const fallbackImage = [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1600&h=1200&fit=crop&auto=format&q=80",
  ];

  // Función para obtener URLs del blob para una carpeta específica
  function getImagesForFolder(folderIndex) {
    return getBlobUrlsForFolder(folderIndex);
  }

  const productPayloads = [
    {
      handle: "pijama-estampado-algodon",
      title: "Pijama Estampado Algodón",
      description: "Conjunto de de algodón suave para noches placenteras.",
      price: 48500,
      folder: "01",
      sizes: [{ size: "M", amount: 1 }],
    },
    {
      handle: "pijama-algodon-rosa-con-borde",
      title: "Pijama de Algodón Rosa con detalle",
      description: "Algodón deslizante para máximo confort.",
      price: 72500,
      folder: "02",
      sizes: [{ size: "S", amount: 1 }],
    },
    {
      handle: "pijama-algodon-negro",
      title: "Pijama Algodón Negro",
      description: "Tejido cálido ideal para noches frías.",
      price: 72500,
      folder: "03",
      sizes: [{ size: "M", amount: 0 }],
    },
    {
      handle: "pijama-azul-cuadritos",
      title: "Pijama Azul Cuadritos",
      description: "Acabado lujoso con caída perfecta.",
      price: 86500,
      folder: "04",
      sizes: [{ size: "M", amount: 1 }],
    },
    {
      handle: "pijama-rosa-saten-largo",
      title: "Pijama Rosa Satén Largo",
      description: "Clásico y elegante para un descanso premium.",
      price: 81500,
      folder: "05",
      sizes: [
        { size: "S", amount: 1 },
        { size: "M", amount: 1 },
        { size: "L", amount: 1 },
      ],
    },
    {
      handle: "pijama-rosa-regalitos",
      title: "Pijama Rosa Regalitos",
      description: "Tela suave y elegante para un descanso premium.",
      price: 86500,
      folder: "06",
      sizes: [
        { size: "S", amount: 1 },
        { size: "M", amount: 1 },
        { size: "L", amount: 1 },
      ],
    },
    {
      handle: "pijama-rosado-rayas",
      title: "Pijama Corto a Rayas Rosadas",
      description: "Tela suave y elegante para un descanso premium.",
      price: 70000,
      folder: "07",
      sizes: [
        { size: "L", amount: 1 },
        { size: "XL", amount: 1 },
      ],
    },
    {
      handle: "pijama-liso-plateado-corto",
      title: "Pijama Satén Plateado Corto",
      description: "Tela suave y elegante para un descanso premium.",
      price: 70000,
      folder: "08",
      sizes: [{ size: "M", amount: 1 }],
    },
    {
      handle: "pijama-liso-plateado-largo",
      title: "Pijama Satén Plateado Largo",
      description: "Tela suave y elegante para un descanso premium.",
      price: 81500,
      folder: "09",
      sizes: [{ size: "M", amount: 0 }],
    },
    {
      handle: "pijama-animal-print-largo",
      title: "Pijama Animal Print Dorado Largo",
      description: "Tela suave y elegante para un descanso premium.",
      price: 86500,
      folder: "10",
      sizes: [
        { size: "S", amount: 1 },
        { size: "M", amount: 1 },
      ],
    },
    {
      handle: "pijama-liso-negro-largo-saten",
      title: "Pijama Liso Negro Largo Satén",
      description: "Tela suave y elegante para un descanso premium.",
      price: 81500,
      folder: "11",
      sizes: [{ size: "M", amount: 0 }],
    },
  ];

  // Crear un producto por cada carpeta (sin duplicados)
  await Promise.all(
    productPayloads.map(async (product) => {
      // Obtener imágenes para esta carpeta desde el blob
      const imagesForDb = getImagesForFolder(product.folder);
      const finalImages = imagesForDb.length > 0 ? imagesForDb : fallbackImage;

      // Crear el producto
      const [newProduct] = await db
        .insert(products)
        .values({
          handle: product.handle,
          title: product.title,
          description: product.description,
          descriptionHtml: `<p>${product.description}</p>`,
          availableForSale: product.sizes.some((s) => s.amount > 0),
          tags: JSON.stringify(["pijamas", "mujer", "sleepwear"]),
          seoTitle: product.title,
          seoDescription: product.description,
          updatedAt: now,
        })
        .returning();

      // Crear variantes
      const variants = await Promise.all(
        product.sizes.map((sizeInfo) =>
          db
            .insert(productVariants)
            .values({
              productId: newProduct.id,
              title: sizeInfo.size,
              price: product.price,
              currencyCode: "ARS",
              availableForSale: sizeInfo.amount > 0,
              selectedOptions: JSON.stringify([
                { name: "Talla", value: sizeInfo.size },
              ]),
              inventoryQuantity: sizeInfo.amount,
            })
            .returning(),
        ),
      );

      // Crear imágenes
      const images = await Promise.all(
        finalImages.map((imgUrl, imageIdx) =>
          db
            .insert(productImages)
            .values({
              productId: newProduct.id,
              url: imgUrl,
              altText: product.title,
              width: 1600,
              height: 1200,
              isFeatured: imageIdx === 0,
            })
            .returning(),
        ),
      );

      // Determinar a qué colecciones pertenece el producto basado en su título y características
      const productTitle = product.title.toLowerCase();
      const productHandle = product.handle.toLowerCase();

      const collectionsToAssign = [featured.id, carousel.id];

      // Asignar a colecciones por diseño
      if (
        productTitle.includes("liso") ||
        productTitle.includes("plateado") ||
        productTitle.includes("negro")
      ) {
        collectionsToAssign.push(lisos.id);
      }
      if (
        productTitle.includes("estampado") ||
        productTitle.includes("cuadritos") ||
        productTitle.includes("rayas") ||
        productTitle.includes("animal") ||
        productTitle.includes("regalitos")
      ) {
        collectionsToAssign.push(estampados.id);
      }

      // Asignar a colecciones por longitud
      if (productTitle.includes("corto") || productHandle.includes("corto")) {
        collectionsToAssign.push(cortos.id);
      }
      if (productTitle.includes("largo") || productHandle.includes("largo")) {
        collectionsToAssign.push(largos.id);
      }

      // Si no está especificado como corto o largo, asignar por defecto según el handle
      if (
        !productTitle.includes("corto") &&
        !productTitle.includes("largo") &&
        !productHandle.includes("corto") &&
        !productHandle.includes("largo")
      ) {
        // Asignar a largos por defecto si no está especificado
        collectionsToAssign.push(largos.id);
      }

      // Crear relaciones con colecciones
      await Promise.all(
        collectionsToAssign.map((collectionId) =>
          db.insert(productCollections).values({
            productId: newProduct.id,
            collectionId: collectionId,
          }),
        ),
      );

      return newProduct;
    }),
  );

  console.log(`✅ ${productPayloads.length} productos de pijamas creados`);
  console.log("🎉 Database seeded successfully with Drizzle!");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
