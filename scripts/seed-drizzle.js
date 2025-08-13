// Cargar variables de entorno desde .env.local
import { config } from 'dotenv';
config({ path: '.env.local' });

import { db } from '../lib/db/index.js';
import { collections, productCollections, productImages, products, productVariants } from '../lib/db/schema.js';
import { getBlobUrlsForFolder } from './generate-blob-urls.js';

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
  const [featured] = await db.insert(collections).values({
    handle: "hidden-homepage-featured-items",
    title: "Destacados",
    description: "Piyamas destacados para la portada",
    seoTitle: "Piyamas Destacados",
    seoDescription: "Descubre nuestros piyamas destacados para mujer",
    updatedAt: now,
  }).returning();

  const [carousel] = await db.insert(collections).values({
    handle: "hidden-homepage-carousel",
    title: "Carrusel Portada",
    description: "Piyamas para el carrusel de portada",
    seoTitle: "Carrusel de Piyamas",
    seoDescription: "Explora nuestros piyamas en el carrusel de portada",
    updatedAt: now,
  }).returning();

  const [womenPajamas] = await db.insert(collections).values({
    handle: "piyamas-mujer",
    title: "Piyamas Mujer",
    description: "Colección de piyamas para mujer",
    seoTitle: "Piyamas de Mujer",
    seoDescription: "Piyamas cómodos y elegantes para mujer",
    updatedAt: now,
  }).returning();

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
      handle: "piyama-estampado-algodon",
      title: "Piyama Estampado Algodón",
      description: "Conjunto de de algodón suave para noches placenteras.",
      price: 47999,
      folder: "01",
      sizes: [
        { size: "M", amount: 1 }
      ],
    },
    {
      handle: "piyama-algodon-rosa-con-borde",
      title: "Piyama de Algodón Rosa con detalle",
      description: "Algodón deslizante para máximo confort.",
      price: 71999,
      folder: "02",
      sizes: [
        { size: "S", amount: 1 }
      ],
    },
    {
      handle: "piyama-invierno-negro",
      title: "Piyama Invierno Negro",
      description: "Tejido cálido ideal para noches frías.",
      price: 79999,
      folder: "03",
      sizes: [
        { size: "M", amount: 0 }
      ],
    },
    {
      handle: "piyama-azul-cuadritos",
      title: "Piyama Azul Cuadritos",
      description: "Acabado lujoso con caída perfecta.",
      price: 85999,
      folder: "04",
      sizes: [
        { size: "M", amount: 1 }
      ],
    },
    {
      handle: "piyama-rosa-saten-largo",
      title: "Piyama Rosa Satén Largo",
      description: "Clásico y elegante para un descanso premium.",
      price: 79999,
      folder: "05",
      sizes: [
        { size: "S", amount: 1 },
        { size: "M", amount: 1 },
        { size: "L", amount: 1 }
      ],
    },
    {
      handle: "piyama-rosa-regalitos",
      title: "Piyama Rosa Regalitos",
      description: "Tela suave y elegante para un descanso premium.",
      price: 85999,
      folder: "06",
      sizes: [
        { size: "S", amount: 1 },
        { size: "M", amount: 1 },
        { size: "L", amount: 1 }
      ],
    },
    {
      handle: "piyama-rosado-rayas",
      title: "Piyama Corto a Rayas Rosadas",
      description: "Tela suave y elegante para un descanso premium.",
      price: 69999,
      folder: "07",
      sizes: [
        { size: "L", amount: 1 },
        { size: "XL", amount: 1 }
      ],
    },
    {
      handle: "piyama-liso-plateado-corto",
      title: "Piyama Satén Plateado Corto",
      description: "Tela suave y elegante para un descanso premium.",
      price: 69999,
      folder: "08",
      sizes: [
        { size: "M", amount: 1 }
      ],
    },
    {
      handle: "piyama-liso-plateado-largo",
      title: "Piyama Satén Plateado Largo",
      description: "Tela suave y elegante para un descanso premium.",
      price: 79999,
      folder: "09",
      sizes: [
        { size: "M", amount: 0 }
      ],
    },
    {
      handle: "piyama-animal-print-largo",
      title: "Piyama Animal Print Largo",
      description: "Tela suave y elegante para un descanso premium.",
      price: 85999,
      folder: "10",
      sizes: [
        { size: "S", amount: 1 },
        { size: "M", amount: 1 }
      ],
    },
    {
      handle: "piyama-liso-negro-largo-saten",
      title: "Piyama Liso Negro Largo Satén",
      description: "Tela suave y elegante para un descanso premium.",
      price: 79999,
      folder: "11",
      sizes: [
        { size: "M", amount: 0 }
      ],
    },
  ];

  // Crear un producto por cada carpeta (sin duplicados)
  await Promise.all(
    productPayloads.map(async (product) => {
      // Obtener imágenes para esta carpeta desde el blob
      const imagesForDb = getImagesForFolder(product.folder);
      const finalImages = imagesForDb.length > 0 ? imagesForDb : fallbackImage;

      // Crear el producto
      const [newProduct] = await db.insert(products).values({
        handle: product.handle,
        title: product.title,
        description: product.description,
        descriptionHtml: `<p>${product.description}</p>`,
        availableForSale: product.sizes.some(s => s.amount > 0),
        tags: JSON.stringify(["piyamas", "mujer", "sleepwear"]),
        seoTitle: product.title,
        seoDescription: product.description,
        updatedAt: now,
      }).returning();

      // Crear variantes
      const variants = await Promise.all(
        product.sizes.map((sizeInfo) =>
          db.insert(productVariants).values({
            productId: newProduct.id,
            title: sizeInfo.size,
            price: product.price,
            currencyCode: "ARS",
            availableForSale: sizeInfo.amount > 0,
            selectedOptions: JSON.stringify([
              { name: "Talla", value: sizeInfo.size },
            ]),
            inventoryQuantity: sizeInfo.amount,
          }).returning()
        )
      );

      // Crear imágenes
      const images = await Promise.all(
        finalImages.map((imgUrl, imageIdx) =>
          db.insert(productImages).values({
            productId: newProduct.id,
            url: imgUrl,
            altText: product.title,
            width: 1600,
            height: 1200,
            isFeatured: imageIdx === 0,
          }).returning()
        )
      );

      // Crear relaciones con colecciones
      await Promise.all([
        db.insert(productCollections).values({
          productId: newProduct.id,
          collectionId: featured.id,
        }),
        db.insert(productCollections).values({
          productId: newProduct.id,
          collectionId: carousel.id,
        }),
        db.insert(productCollections).values({
          productId: newProduct.id,
          collectionId: womenPajamas.id,
        }),
      ]);

      return newProduct;
    })
  );

  console.log(`✅ ${productPayloads.length} productos de piyamas creados`);
  console.log("🎉 Database seeded successfully with Drizzle!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
