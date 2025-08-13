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

  // Build local image groups from public/articles/**
  const publicArticlesDir = path.join(process.cwd(), "public", "articles");
  const localArticlesDir = path.join(process.cwd(), "articles");
  const allowedExt = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
  /**
   * Returns an array of arrays. Each inner array contains web paths like
   *   /articles/01/IMG_....jpeg
   * for every file under each numeric folder in public/articles
   */
  function getLocalImageGroups() {
    if (!fs.existsSync(publicArticlesDir)) return [];
    const subdirs = fs
      .readdirSync(publicArticlesDir, { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .map((d) => d.name)
      // sort folders like 01, 02, ... to keep a stable mapping
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    const groups = [];
    for (const dir of subdirs) {
      const absoluteDir = path.join(publicArticlesDir, dir);
      const files = fs
        .readdirSync(absoluteDir, { withFileTypes: true })
        .filter((f) => f.isFile())
        .map((f) => f.name)
        .filter((name) => allowedExt.has(path.extname(name).toLowerCase()))
        // Put likely hero images first (IMG_*, then others)
        .sort();

      const webPaths = files.map((file) => path.posix.join("/articles", dir, file));
      if (webPaths.length > 0) groups.push(webPaths);
    }
    return groups;
  }

  const localImageGroups = getLocalImageGroups();
  const fallbackImage = [
    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1600&h=1200&fit=crop&auto=format&q=80",
  ];

  // Prepare Blob helpers (lazy import inside Node CJS)
  const { put, list } = await import("@vercel/blob");

  async function listBlobImages(prefix) {
    try {
      const { blobs } = await list({ prefix: `${prefix}/` });
      // Sort by pathname for deterministic order
      return blobs
        .slice()
        .sort((a, b) => a.pathname.localeCompare(b.pathname))
        .map((b) => b.url);
    } catch (err) {
      console.warn(`⚠️  No se pudieron listar blobs en '${prefix}':`, err.message);
      return [];
    }
  }

  async function uploadFolderToBlob(folderIndex) {
    const folder = folderIndex.padStart(2, "0");
    const absoluteDir = path.join(publicArticlesDir, folder);
    if (!fs.existsSync(absoluteDir)) return [];

    const files = fs
      .readdirSync(absoluteDir, { withFileTypes: true })
      .filter((f) => f.isFile())
      .map((f) => f.name)
      .filter((name) => allowedExt.has(path.extname(name).toLowerCase()))
      .sort();

    const uploadedUrls = [];
    for (const file of files) {
      const abs = path.join(absoluteDir, file);
      const blobPath = `articles/${folder}/${file}`;
      const data = fs.readFileSync(abs);
      try {
        const { url } = await put(blobPath, data, {
          access: "public",
          addRandomSuffix: false
        });
        uploadedUrls.push(url);
      } catch (err) {
        console.warn(`⚠️  Error subiendo '${blobPath}', intentando listar existente:`, err.message);
        // Si ya existe, intentamos recuperarlo vía listado
      }
    }
    if (uploadedUrls.length) return uploadedUrls;
    // fallback: si no subió nada porque ya existían, listamos
    return await listBlobImages(`articles/${folder}`);
  }

  async function ensureBlobImagesForFolder(folderIndex) {
    const folder = folderIndex.padStart(2, "0");
    const prefix = `articles/${folder}`;
    let urls = await listBlobImages(prefix);
    if (urls.length === 0) {
      // Intentamos subir desde carpeta local `articles/<folder>` si existe
      urls = await uploadFolderToBlob(folder);
    }
    return urls;
  }

  const productPayloads = [
    {
      handle: "piyama-estampado-algodon",
      title: "Piyama Estampado Algodón",
      description: "Conjunto de de algodón suave para noches placenteras.",
      price: 47999,
      folder: "01",
      amount: 1,
      sizes: ["M"],
    },
    {
      handle: "piyama-algodon-rosa-con-borde",
      title: "Piyama de Algodón Rosa con detalle",
      description: "Algodón deslizante para máximo confort.",
      price: 71999,
      folder: "02",
      amount: 1,
      sizes: ["S"],
    },
    {
      handle: "piyama-invierno-negro",
      title: "Piyama Invierno Negro",
      description: "Tejido cálido ideal para noches frías.",
      price: 79999,
      folder: "03",
      amount: 0,
      sizes: [],
    },
    {
      handle: "piyama-azul-cuadritos",
      title: "Piyama Azul Cuadritos",
      description: "Acabado lujoso con caída perfecta.",
      price: 85999,
      folder: "04",
      amount: 1,
      sizes: ["M"],
    },
    {
      handle: "piyama-rosa-saten-largo",
      title: "Piyama Rosa Satén Largo",
      description: "Clásico y elegante para un descanso premium.",
      price: 79999,
      folder: "05",
      amount: 1,
      sizes: ["M"],
    },
    {
      handle: "piyama-rosa-saten-largo",
      title: "Piyama Rosa Satén Largo",
      description: "Clásico y elegante para un descanso premium.",
      price: 79999,
      folder: "05",
      amount: 1,
      sizes: ["S"],
    },
    {
      handle: "piyama-rosa-saten-largo",
      title: "Piyama Rosa Satén Largo",
      description: "Clásico y elegante para un descanso premium.",
      price: 79999,
      folder: "05",
      amount: 1,
      sizes: ["L"],
    },
    {
      handle: "piyama-rosa-regalitos",
      title: "Piyama Rosa Regalitos",
      description: "Tela suave y elegante para un descanso premium.",
      price: 85999,
      folder: "06",
      amount: 1,
      sizes: ["M"],
    },
    {
      handle: "piyama-rosa-regalitos",
      title: "Piyama Rosa Regalitos",
      description: "Tela suave y elegante para un descanso premium.",
      price: 85999,
      folder: "06",
      amount: 1,
      sizes: ["S"],
    },
    {
      handle: "piyama-rosa-regalitos",
      title: "Piyama Rosa Regalitos",
      description: "Tela suave y elegante para un descanso premium.",
      price: 85999,
      folder: "06",
      amount: 1,
      sizes: ["L"],
    },
    {
      handle: "piyama-rosado-rayas",
      title: "Piyama Corto a Rayas Rosadas",
      description: "Tela suave y elegante para un descanso premium.",
      price: 69999,
      folder: "07",
      amount: 1,
      sizes: ["L"],
    },
    {
      handle: "piyama-rosado-rayas",
      title: "Piyama Corto a Rayas Rosadas",
      description: "Tela suave y elegante para un descanso premium.",
      price: 69999,
      folder: "07",
      amount: 1,
      sizes: ["XL"],
    },
    {
      handle: "piyama-liso-plateado-corto",
      title: "Piyama Satén Plateado Corto",
      description: "Tela suave y elegante para un descanso premium.",
      price: 69999,
      folder: "08",
      amount: 1,
      sizes: ["M"],
    },
    {
      handle: "piyama-liso-plateado-largo",
      title: "Piyama Satén Plateado Largo",
      description: "Tela suave y elegante para un descanso premium.",
      price: 79999,
      folder: "09",
      amount: 0,
      sizes: [],
    },
    {
      handle: "piyama-animal-print-largo",
      title: "Piyama Animal Print Largo",
      description: "Tela suave y elegante para un descanso premium.",
      price: 85999,
      folder: "10",
      amount: 1,
      sizes: ["M"],
    },
    {
      handle: "piyama-animal-print-largo",
      title: "Piyama Animal Print Largo",
      description: "Tela suave y elegante para un descanso premium.",
      price: 85999,
      folder: "10",
      amount: 1,
      sizes: ["S"],
    },
    {
      handle: "piyama-liso-negro-largo-saten",
      title: "Piyama Liso Negro Largo Satén",
      description: "Tela suave y elegante para un descanso premium.",
      price: 79999,
      folder: "11",
      amount: 0,
      sizes: [],
    },
  ];

  // Agrupar productos por carpeta para compartir imágenes
  const productsByFolder = {};
  productPayloads.forEach((product) => {
    if (!productsByFolder[product.folder]) {
      productsByFolder[product.folder] = [];
    }
    productsByFolder[product.folder].push(product);
  });

  // Crear productos agrupados por carpeta
  await Promise.all(
    Object.entries(productsByFolder).map(async ([folder, products]) => {
      // Obtener imágenes para esta carpeta (se comparten entre productos de la misma carpeta)
      const blobImages = await ensureBlobImagesForFolder(folder);
      const folderIndex = parseInt(folder) - 1; // Convertir "01" a 0, "02" a 1, etc.
      const imagesForDb = blobImages.length ? blobImages : (localImageGroups[folderIndex] || fallbackImage);

      // Crear un producto por cada combinación única de handle + tamaño
      return Promise.all(
        products.map(async (product) => {
          return prisma.product.create({
            data: {
              handle: `${product.handle}-${product.sizes.join('-')}`,
              title: product.title,
              description: product.description,
              descriptionHtml: `<p>${product.description}</p>`,
              availableForSale: product.amount > 0,
              tags: JSON.stringify(["piyamas", "mujer", "sleepwear"]),
              seoTitle: product.title,
              seoDescription: product.description,
              variants: {
                create: product.sizes.map((size) => ({
                  title: size,
                  price: product.price,
                  currencyCode: "ARS",
                  availableForSale: product.amount > 0,
                  selectedOptions: JSON.stringify([
                    { name: "Talla", value: size },
                  ]),
                  inventoryQuantity: product.amount,
                })),
              },
              images: {
                create: imagesForDb.map((imgUrl, imageIdx) => ({
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
