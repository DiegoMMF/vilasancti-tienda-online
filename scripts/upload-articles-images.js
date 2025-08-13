const fs = require('fs');
const path = require('path');
const { put } = require('@vercel/blob');

// Cargar variables de entorno desde .env.local
require('dotenv').config({ path: '.env.local' });

// Configuración
const ARTICLES_DIR = path.join(__dirname, '../public/articles');
const BLOB_PREFIX = 'articles';

async function uploadImageToBlob(filePath, folderName, fileName) {
  try {
    const fileBuffer = fs.readFileSync(filePath);
    
    // Crear nombre único para el blob
    const timestamp = Date.now();
    const extension = path.extname(fileName);
    const blobName = `${BLOB_PREFIX}/${folderName}/${timestamp}-${Math.random().toString(36).substring(2)}${extension}`;

    console.log(`Subiendo: ${filePath} -> ${blobName}`);

    // Para Node.js, pasamos directamente el buffer y el nombre del archivo
    const { url } = await put(blobName, fileBuffer, {
      access: 'public',
      addRandomSuffix: false,
    });

    return {
      originalPath: filePath,
      blobUrl: url,
      blobName,
      success: true,
    };
  } catch (error) {
    console.error(`Error subiendo ${filePath}:`, error);
    return {
      originalPath: filePath,
      success: false,
      error: error.message,
    };
  }
}

async function uploadAllArticlesImages() {
  const results = [];
  
  try {
    // Leer todas las carpetas de artículos
    const folders = fs.readdirSync(ARTICLES_DIR, { withFileTypes: true })
      .filter(dirent => dirent.isDirectory())
      .map(dirent => dirent.name)
      .sort();

    console.log(`Encontradas ${folders.length} carpetas de artículos`);

    for (const folder of folders) {
      const folderPath = path.join(ARTICLES_DIR, folder);
      const files = fs.readdirSync(folderPath)
        .filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file));

      console.log(`\nProcesando carpeta ${folder} con ${files.length} imágenes`);

      for (const file of files) {
        const filePath = path.join(folderPath, file);
        const result = await uploadImageToBlob(filePath, folder, file);
        results.push(result);

        // Pequeña pausa para no sobrecargar la API
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    // Guardar resultados en un archivo
    const resultsPath = path.join(__dirname, 'upload-results.json');
    fs.writeFileSync(resultsPath, JSON.stringify(results, null, 2));

    // Mostrar resumen
    const successful = results.filter(r => r.success);
    const failed = results.filter(r => !r.success);

    console.log('\n=== RESUMEN ===');
    console.log(`Total de imágenes: ${results.length}`);
    console.log(`Subidas exitosamente: ${successful.length}`);
    console.log(`Fallidas: ${failed.length}`);

    if (failed.length > 0) {
      console.log('\nImágenes que fallaron:');
      failed.forEach(f => console.log(`- ${f.originalPath}: ${f.error}`));
    }

    console.log(`\nResultados guardados en: ${resultsPath}`);

    return results;

  } catch (error) {
    console.error('Error general:', error);
    throw error;
  }
}

// Ejecutar el script
if (require.main === module) {
  uploadAllArticlesImages()
    .then(() => {
      console.log('\nProceso completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Error en el proceso:', error);
      process.exit(1);
    });
}

module.exports = { uploadAllArticlesImages };
