// Cargar variables de entorno desde .env
import { config } from "dotenv";
config({ path: ".env" });

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
      handle: "pijama-estampado-algodon-largo",
      title: "JARDÍN TROPICAL",
      description:
        "Naturaleza en cada detalle. Conjunto en algodón suave con vibrante estampado floral en tonos burdeos y blancos. Camisa manga larga y pantalón largo con flores tropicales que evocan paraísos lejanos. Ideal para quienes buscan alegría y frescura en sus momentos de descanso.",
      price: 48500,
      folder: "01",
      sizes: [{ size: "M", amount: 1 }],
    },
    {
      handle: "pijama-algodon-rosa-largo",
      title: "CLÁSICO ROSA",
      description:
        "Elegancia minimalista. Conjunto camisero en algodón premium con vivos contrastantes en negro. Diseño atemporal de camisa manga larga y pantalón largo que combina comodidad absoluta con estilo sofisticado. Para quienes valoran los clásicos que nunca pasan de moda.",
      price: 72500,
      folder: "02",
      sizes: [{ size: "S", amount: 1 }],
    },
    {
      handle: "pijama-algodon-negro-largo",
      title: "NEGRO CLÁSICO",
      description:
        "Sofisticación atemporal. Conjunto camisero en algodón negro con delicados vivos blancos. Camisa manga larga y pantalón largo donde la elegancia del negro se encuentra con el confort del algodón premium. Diseño versátil para dormir y relajarse en casa.​​​​​​​​​​​​​​​​",
      price: 72500,
      folder: "03",
      sizes: [{ size: "M", amount: 0 }],
    },
    {
      handle: "pijama-azul-cuadros-largo",
      title: "CUADROS AZUL",
      description:
        "Elegancia en cada detalle. Conjunto camisero en satén premium con hermoso estampado a cuadros en azul y blanco. Camisa manga larga y pantalón largo confeccionados en satén de calidad superior que brinda suavidad excepcional. Para quienes reconocen la belleza en los diseños atemporales.",
      price: 86500,
      folder: "04",
      sizes: [{ size: "M", amount: 1 }],
    },
    {
      handle: "pijama-rosa-saten-largo-liso",
      title: "ROSA ENCANTO",
      description:
        "Pijama satinado en un delicado tono rosa, suave al tacto y con un brillo elegante. Un clásico atemporal que combina comodidad y feminidad para tus noches y mañanas en casa.",
      price: 81500,
      folder: "05",
      sizes: [
        { size: "S", amount: 1 },
        { size: "M", amount: 1 },
        { size: "L", amount: 1 },
      ],
    },
    {
      handle: "pijama-rosa-saten-largo-estampado",
      title: "LAZO ROSÉ",
      description:
        "Dulzura con personalidad. Conjunto en satén sedoso con delicados moños estampados. Camisa con vivos en contraste y pantalón relajado que combina romance y comodidad. Para quienes aprecian los detalles tiernos sin perder la elegancia.",
      price: 86500,
      folder: "06",
      sizes: [
        { size: "S", amount: 1 },
        { size: "M", amount: 1 },
        { size: "L", amount: 1 },
      ],
    },
    {
      handle: "pijama-rosado-rayas-corto",
      title: "RAYAS",
      description:
        "Dulzura con elegancia. Conjunto camisero en satén con estampado a rayas rosa y blanco de acabado sedoso y brillante. Camisa abotonada manga corta y short a juego donde las rayas clásicas se visten de feminidad y sofisticación. Para quienes buscan comodidad premium con un toque femenino.",
      price: 70000,
      folder: "07",
      sizes: [
        { size: "L", amount: 1 },
        { size: "XL", amount: 1 },
      ],
    },
    {
      handle: "pijama-liso-champagne-corto",
      title: "CHAMPAGNE SATINÉ",
      description:
        "Delicado. Atemporal. Inolvidable. Este conjunto corto satinado combina suavidad, frescura y elegancia en cada detalle. Corte camisero y ese brillo delicado que te envuelve en feminidad y comodidad. Perfecto para sentirte hermosa en tu propio ritual de descanso.",
      price: 70000,
      folder: "08",
      sizes: [{ size: "M", amount: 1 }],
    },
    {
      handle: "pijama-liso-champagne-largo",
      title: "CHAMPAGNE",
      description:
        "Diseñado para mujeres que eligen sentirse bien en cada detalle. Este conjunto satinado combina suavidad, elegancia y libertad de movimiento. Su confección delicada, la suavidad de su textura lo convierte en el ideal para noches especiales o momentos de cuidado personal. Liviano, cómodo y con un brillo sutil que acompaña tu feminidad .",
      price: 81500,
      folder: "09",
      sizes: [{ size: "M", amount: 0 }],
    },
    {
      handle: "pijama-animal-print-largo-dorado",
      title: "FELINA ORO",
      description:
        "Descansar bien empieza por sentirte bien. Confeccionado en satén elastizado de textura suave y brillo delicado, este conjunto fue pensado para quienes disfrutan de los pequeños lujos del día a día. Su diseño camisero clásico, con botones frontales, lo convierte en un ícono clásico que nunca falla. Combina elegancia, confort y libertad de movimiento. Ideal para esas noches en casa donde querés sentirte cómoda pero también increíble. Porque tu descanso merece sentirse especial.",
      price: 86500,
      folder: "10",
      sizes: [
        { size: "S", amount: 1 },
        { size: "M", amount: 1 },
      ],
    },
    {
      handle: "pijama-liso-negro-largo-saten",
      title: "NEGRO ES SATÉN",
      description:
        "Este pijama satinado con sutil elasticidad combina elegancia y comodidad. Su textura suave acaricia la piel, mientras su diseño camisero le da un aire clásico y sofisticado. Perfecto para sentirte cómoda, refinada y única, incluso en casa.",
      price: 81500,
      folder: "11",
      sizes: [{ size: "M", amount: 0 }],
    },
    {
      handle: "pijama-encaje-rosa-corto",
      title: "ENCAJE ROSA",
      description:
        "Elegancia en cada detalle. Satén premium con encaje, donde la delicadeza del rosa se encuentra con la sofisticación del negro. Camisola de tirantes finos y short con lazo decorativo para quien busca sentirse hermosa en la intimidad del hogar.",
      price: 55500,
      folder: "12",
      sizes: [{ size: "M", amount: 0 }],
    },
    {
      handle: "pijama-rayas-rosa-corto-encaje",
      title: "RAYAS DE ROSA",
      description:
        "Dulce, femenino y con un toque de sofisticación. Realizado en satén elastizado con delicado brillo, este conjunto de tiras finas y short con encaje combina frescura y sensualidad. Las rayas rosas y blancas aportan un aire romántico, mientras que el encaje negro le da ese detalle inesperado que enamora. Ideal para las noches cálidas en las que querés sentirte tan cómoda como encantadora.",
      price: 55500,
      folder: "13",
      sizes: [{ size: "M", amount: 0 }],
    },
    {
      handle: "pijama-negro-saten-corto",
      title: "NEGRO CLÁSICO CORTO",
      description:
        "Porque lo esencial nunca pasa de moda. Confeccionado en satén elastizado de textura suave y caída fluida, este conjunto camisero corto combina frescura, elegancia y comodidad. Sus detalles en vivo blanco realzan el contraste y le dan un toque atemporal que siempre queda bien. Perfecto para quienes buscan un descanso ligero sin renunciar al estilo. Dormir bien también es vestirse bien.",
      price: 70000,
      folder: "14",
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
        productTitle.includes("negro") ||
        productTitle.includes("champagne") ||
        productTitle.includes("encaje")
      ) {
        collectionsToAssign.push(lisos.id);
      }
      if (
        productTitle.includes("estampado") ||
        productTitle.includes("cuadritos") ||
        productTitle.includes("rayas") ||
        productTitle.includes("animal") ||
        productTitle.includes("regalitos") ||
        productTitle.includes("jardín") ||
        productTitle.includes("tropical") ||
        productTitle.includes("lazo") ||
        productTitle.includes("felina")
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
