const { PrismaClient } = require("@prisma/client");

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
      description: "Pijamas destacados para la portada",
      seoTitle: "Pijamas Destacados",
      seoDescription: "Descubre nuestros pijamas destacados para mujer",
    },
  });

  const carousel = await prisma.collection.create({
    data: {
      handle: "hidden-homepage-carousel",
      title: "Carrusel Portada",
      description: "Pijamas para el carrusel de portada",
      seoTitle: "Carrusel de Pijamas",
      seoDescription: "Explora nuestros pijamas en el carrusel de portada",
    },
  });

  const womenPajamas = await prisma.collection.create({
    data: {
      handle: "pijamas-mujer",
      title: "Pijamas Mujer",
      description: "Colección de pijamas para mujer",
      seoTitle: "Pijamas de Mujer",
      seoDescription: "Pijamas cómodos y elegantes para mujer",
    },
  });

  console.log("✅ Collections created");

  const imageUrls = [
    "https://images.unsplash.com/flagged/photo-1553802921-f70ef4de0a40?w=1600&h=1200&fit=crop&auto=format&q=80",
    "https://images.unsplash.com/photo-1573258517406-4a3824f3a476?w=1600&h=1200&fit=crop&auto=format&q=80",
    "https://images.unsplash.com/photo-1638464830368-9e8938150ecc?w=1600&h=1200&fit=crop&auto=format&q=80",
    "https://images.unsplash.com/photo-1692111643020-4b4726e0dd8f?w=1600&h=1200&fit=crop&auto=format&q=80",
    "https://images.unsplash.com/flagged/photo-1553802921-43de73360c7f?w=1600&h=1200&fit=crop&auto=format&q=80",
    "https://images.unsplash.com/photo-1681157819947-5faaa3d8388a?w=1600&h=1200&fit=crop&auto=format&q=80",
    "https://images.unsplash.com/flagged/photo-1553802922-28e2f719977d?w=1600&h=1200&fit=crop&auto=format&q=80",
  ];

  const productPayloads = [
    {
      handle: "pijama-saten-rosa",
      title: "Pijama de Satén Rosa",
      description: "Conjunto de satén suave para noches elegantes.",
      price: 49.99,
      imageUrl: imageUrls[0],
    },
    {
      handle: "pijama-algodon-azul",
      title: "Pijama de Algodón Azul",
      description: "Algodón transpirable para máximo confort.",
      price: 34.99,
      imageUrl: imageUrls[1],
    },
    {
      handle: "pijama-invierno-gris",
      title: "Pijama Invierno Gris",
      description: "Tejido cálido ideal para noches frías.",
      price: 39.99,
      imageUrl: imageUrls[2],
    },
    {
      handle: "pijama-seda-champagne",
      title: "Pijama de Seda Champagne",
      description: "Acabado lujoso con caída perfecta.",
      price: 69.99,
      imageUrl: imageUrls[3],
    },
    {
      handle: "pijama-saten-negro",
      title: "Pijama de Satén Negro",
      description: "Clásico y elegante para un descanso premium.",
      price: 54.99,
      imageUrl: imageUrls[4],
    },
    {
      handle: "pijama-algodon-floral",
      title: "Pijama de Algodón Floral",
      description: "Estampado floral y tela ultra suave.",
      price: 36.99,
      imageUrl: imageUrls[5],
    },
    {
      handle: "pijama-rosa-pastel",
      title: "Pijama Rosa Pastel",
      description: "Conjunto cómodo para uso diario.",
      price: 29.99,
      imageUrl: imageUrls[6],
    },
  ];

  await Promise.all(
    productPayloads.map((p) =>
      prisma.product.create({
        data: {
          handle: p.handle,
          title: p.title,
          description: p.description,
          descriptionHtml: `<p>${p.description}</p>`,
          availableForSale: true,
          tags: JSON.stringify(["pijamas", "mujer", "sleepwear"]),
          seoTitle: p.title,
          seoDescription: p.description,
          variants: {
            create: [
              {
                title: "Default",
                price: p.price,
                currencyCode: "USD",
                availableForSale: true,
                selectedOptions: JSON.stringify([{ name: "Talla", value: "M" }]),
              },
            ],
          },
          images: {
            create: [
              {
                url: p.imageUrl,
                altText: p.title,
                width: 1600,
                height: 1200,
                isFeatured: true,
              },
            ],
          },
          collections: {
            create: [
              { collectionId: featured.id },
              { collectionId: carousel.id },
              { collectionId: womenPajamas.id },
            ],
          },
        },
      })
    )
  );

  console.log("✅ 7 women pajamas products created");
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
