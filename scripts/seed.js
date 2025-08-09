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
    const absoluteDir = path.join(localArticlesDir, folder);
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
      handle: "pijama-saten-rosa",
      title: "Pijama de Satén Rosa",
      description: "Conjunto de satén suave para noches elegantes.",
      price: 49.99,
      folder: "01",
    },
    {
      handle: "pijama-algodon-azul",
      title: "Pijama de Algodón Azul",
      description: "Algodón transpirable para máximo confort.",
      price: 34.99,
      folder: "02",
    },
    {
      handle: "pijama-invierno-gris",
      title: "Pijama Invierno Gris",
      description: "Tejido cálido ideal para noches frías.",
      price: 39.99,
      folder: "03",
    },
    {
      handle: "pijama-seda-champagne",
      title: "Pijama de Seda Champagne",
      description: "Acabado lujoso con caída perfecta.",
      price: 69.99,
      folder: "04",
    },
    {
      handle: "pijama-saten-negro",
      title: "Pijama de Satén Negro",
      description: "Clásico y elegante para un descanso premium.",
      price: 54.99,
      folder: "05",
    },
    {
      handle: "pijama-algodon-floral",
      title: "Pijama de Algodón Floral",
      description: "Estampado floral y tela ultra suave.",
      price: 36.99,
      folder: "06",
    },
    {
      handle: "pijama-rosa-pastel",
      title: "Pijama Rosa Pastel",
      description: "Conjunto cómodo para uso diario.",
      price: 29.99,
      folder: "07",
    },
  ];

  const colors = ["Azul", "Rosa", "Blanco", "Negro"];
  const sizes = ["XS", "S", "M", "L", "XL"];

  // Disponibilidades específicas por producto (p01..p06) mapeadas por índice
  // Colores en castellano para coincidir con el catálogo: Azul, Rosa, Negro
  const perProductAvailability = [
    // p01 → /articles/01
    { sizes: ["M"], colors: ["Rosa"] },
    // p02 → /articles/02
    { sizes: ["S"], colors: ["Rosa"] },
    // p03 → /articles/03
    { sizes: [], colors: ["Negro"] },
    // p04 → /articles/04
    { sizes: ["M"], colors: ["Azul"] },
    // p05 → /articles/05
    { sizes: ["S", "M", "L"], colors: ["Rosa"] },
    // p06 → /articles/06
    { sizes: ["S", "M", "L"], colors: ["Rosa"] },
    // p07 (sin carpeta específica) → por defecto solo M Rosa
    { sizes: ["M"], colors: ["Rosa"] },
  ];

  await Promise.all(
    productPayloads.map(async (p, idx) => {
      const blobImages = await ensureBlobImagesForFolder(p.folder);
      const imagesForDb = blobImages.length ? blobImages : (localImageGroups[idx] || fallbackImage);

      return prisma.product.create({
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
            create: colors.flatMap((color) =>
              sizes.map((size) => {
                const availability = perProductAvailability[idx] || perProductAvailability[perProductAvailability.length - 1];
                const isColorAllowed = availability.colors.includes(color);
                const isSizeAllowed = availability.sizes.includes(size);
                const isAvailable = isColorAllowed && isSizeAllowed;
                return {
                  title: `${color} ${size}`,
                  price: p.price,
                  currencyCode: "USD",
                  availableForSale: isAvailable,
                  selectedOptions: JSON.stringify([
                    { name: "Color", value: color },
                    { name: "Talla", value: size },
                  ]),
                };
              })
            ),
          },
          images: {
            create: imagesForDb.map((imgUrl, imageIdx) => ({
              url: imgUrl,
              altText: p.title,
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
