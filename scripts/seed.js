// Cargar variables de entorno desde .env.local
require('dotenv').config({ path: '.env.local' });

if (!process.env.DIRECT_URL && process.env.DATABASE_URL) {
  process.env.DIRECT_URL = process.env.DATABASE_URL;
}
const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Reseeding database (women pajamas)...");

  // Wipe existing data (respect FK order)
  await prisma.productCollection.deleteMany({});
  await prisma.productImage.deleteMany({});
  await prisma.productVariant.deleteMany({});
  await prisma.product.deleteMany({});
  await prisma.collection.deleteMany({});

  // Create needed collections
  const featured = await prisma.collection.create({
    data: {
      handle: "hidden-homepage-featured-items",
      title: "Destacados",
      description: "Piyamas destacados para la portada",
      seoTitle: "Piyamas Destacados",
      seoDescription: "Descubre nuestros piyamas destacados para mujer",
    },
  });

  const carousel = await prisma.collection.create({
    data: {
      handle: "hidden-homepage-carousel",
      title: "Carrusel Portada",
      description: "Piyamas para el carrusel de portada",
      seoTitle: "Carrusel de Piyamas",
      seoDescription: "Explora nuestros piyamas en el carrusel de portada",
    },
  });

  const womenPajamas = await prisma.collection.create({
    data: {
      handle: "piyamas-mujer",
      title: "Piyamas Mujer",
      description: "Colección de piyamas para mujer",
      seoTitle: "Piyamas de Mujer",
      seoDescription: "Piyamas cómodos y elegantes para mujer",
    },
  });

  console.log("✅ Collections created");

  // Importar URLs del blob
  const { getBlobUrlsForFolder } = await import('./generate-blob-urls.js');
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

      // Crear un solo producto con múltiples variantes de talla
      return prisma.product.create({
        data: {
          handle: product.handle,
          title: product.title,
          description: product.description,
          descriptionHtml: `<p>${product.description}</p>`,
          availableForSale: product.sizes.some(s => s.amount > 0),
          tags: JSON.stringify(["piyamas", "mujer", "sleepwear"]),
          seoTitle: product.title,
          seoDescription: product.description,
          variants: {
            create: product.sizes.map((sizeInfo) => ({
              title: sizeInfo.size,
              price: product.price,
              currencyCode: "ARS",
              availableForSale: sizeInfo.amount > 0,
              selectedOptions: JSON.stringify([
                { name: "Talla", value: sizeInfo.size },
              ]),
              inventoryQuantity: sizeInfo.amount,
            })),
          },
          images: {
            create: finalImages.map((imgUrl, imageIdx) => ({
              url: imgUrl,
              altText: product.title,
              width: 1600,
              height: 1200,
              isFeatured: imageIdx === 0,
            })),
          },
          collections: {
            create: [
              { collectionId: featured.id },
              { collectionId: carousel.id },
              { collectionId: womenPajamas.id },
            ],
          },
        },
      });
    })
  );

  console.log(`✅ ${productPayloads.length} productos de piyamas creados`);
  console.log("🎉 Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
