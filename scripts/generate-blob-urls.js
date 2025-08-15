import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuración del blob de Vercel
const BLOB_BASE_URL = "https://a1qadrk81otbmmhi.public.blob.vercel-storage.com";

// Generar URLs del blob basándose en el patrón conocido
function generateBlobUrls() {
  const urls = {};

  // Generar URLs para cada carpeta de artículos (01-14)
  for (let i = 1; i <= 14; i++) {
    const folder = i.toString().padStart(2, "0");
    const folderUrls = [];

    // Generar URLs para cada imagen en la carpeta
    // Basándonos en el patrón: articles/folder/timestamp-randomstring.ext
    const timestamp = Date.now();

    // Para cada carpeta, generar las URLs correspondientes
    switch (folder) {
      case "01":
        folderUrls.push(
          `${BLOB_BASE_URL}/articles/01/1755081181758-hdalt1f4wd6.jpeg`,
        );
        folderUrls.push(
          `${BLOB_BASE_URL}/articles/01/1755081183562-y8qd2pd45i.jpeg`,
        );
        folderUrls.push(
          `${BLOB_BASE_URL}/articles/01/1755081184133-yojqkz5r0o.jpeg`,
        );
        folderUrls.push(
          `${BLOB_BASE_URL}/articles/01/1755081185567-081u2fv9y1l.jpeg`,
        );
        folderUrls.push(
          `${BLOB_BASE_URL}/articles/01/1755081186763-fyopi7m6el6.jpeg`,
        );
        break;
      case "02":
        folderUrls.push(
          `${BLOB_BASE_URL}/articles/02/1755081188072-j0tp3qzz6b.jpeg`,
        );
        folderUrls.push(
          `${BLOB_BASE_URL}/articles/02/1755081188755-jok7yyjnbna.jpeg`,
        );
        break;
      case "03":
        folderUrls.push(
          `${BLOB_BASE_URL}/articles/03/1755081189405-0zo6vge8505c.jpeg`,
        );
        break;
      case "04":
        folderUrls.push(
          `${BLOB_BASE_URL}/articles/04/1755081190204-ddqputndzbn.jpeg`,
        );
        folderUrls.push(
          `${BLOB_BASE_URL}/articles/04/1755081191232-rpjzfxfmt5.jpeg`,
        );
        folderUrls.push(
          `${BLOB_BASE_URL}/articles/04/1755081192353-41faj6bjqr.jpeg`,
        );
        break;
      case "05":
        folderUrls.push(
          `${BLOB_BASE_URL}/articles/05/1755081193756-cnpiqj2po2q.jpeg`,
        );
        folderUrls.push(
          `${BLOB_BASE_URL}/articles/05/1755081194508-9e1j24wv6f4.jpeg`,
        );
        break;
      case "06":
        folderUrls.push(
          `${BLOB_BASE_URL}/articles/06/1755081195117-bfwvu5oq9vn.jpeg`,
        );
        break;
      case "07":
        folderUrls.push(
          `${BLOB_BASE_URL}/articles/07/1755081195940-iwrjtose9i9.jpg`,
        );
        break;
      case "08":
        folderUrls.push(
          `${BLOB_BASE_URL}/articles/08/1755081196528-t0qi922q82.jpeg`,
        );
        folderUrls.push(
          `${BLOB_BASE_URL}/articles/08/1755081197306-he89l1n9ctf.jpeg`,
        );
        folderUrls.push(
          `${BLOB_BASE_URL}/articles/08/1755081198312-2kmz07rp5jm.jpeg`,
        );
        folderUrls.push(
          `${BLOB_BASE_URL}/articles/08/1755081199000-ykusm6h3zs.jpeg`,
        );
        break;
      case "09":
        folderUrls.push(
          `${BLOB_BASE_URL}/articles/09/1755081199670-a0r69k6qgwt.jpeg`,
        );
        folderUrls.push(
          `${BLOB_BASE_URL}/articles/09/1755081200445-ocz7u0km4n.jpeg`,
        );
        folderUrls.push(
          `${BLOB_BASE_URL}/articles/09/1755081201985-2idnl5ewa8e.jpeg`,
        );
        break;
      case "10":
        folderUrls.push(
          `${BLOB_BASE_URL}/articles/10/1755081202610-atgxc15w2b4.jpeg`,
        );
        folderUrls.push(
          `${BLOB_BASE_URL}/articles/10/1755081203413-tkoy3eswe8k.jpeg`,
        );
        folderUrls.push(
          `${BLOB_BASE_URL}/articles/10/1755081203979-84t2e2f5ppi.jpeg`,
        );
        break;
      case "11":
        folderUrls.push(
          `${BLOB_BASE_URL}/articles/11/1755081205871-qckvd2kque.jpeg`,
        );
        folderUrls.push(
          `${BLOB_BASE_URL}/articles/11/1755081206587-vkxvfr8lwwt.jpeg`,
        );
        break;
      case "12":
        folderUrls.push(
          `${BLOB_BASE_URL}/articles/12/1755297123877-duy9r7sn5im.jpeg`,
        );
        break;
      case "13":
        folderUrls.push(
          `${BLOB_BASE_URL}/articles/13/1755297124775-y124ff6sbpd.jpeg`,
        );
        folderUrls.push(
          `${BLOB_BASE_URL}/articles/13/1755297125583-zx0e55xfp0n.jpeg`,
        );
        folderUrls.push(
          `${BLOB_BASE_URL}/articles/13/1755297126303-d4q4fjc198w.jpeg`,
        );
        folderUrls.push(
          `${BLOB_BASE_URL}/articles/13/1755297127015-prmh9pyrac.jpeg`,
        );
        folderUrls.push(
          `${BLOB_BASE_URL}/articles/13/1755297127531-xaliag0oper.jpeg`,
        );
        break;
      case "14":
        folderUrls.push(
          `${BLOB_BASE_URL}/articles/14/1755297128247-an5xvrwnf77.jpeg`,
        );
        folderUrls.push(
          `${BLOB_BASE_URL}/articles/14/1755297128985-z909gj06zv.jpeg`,
        );
        break;
    }

    urls[folder] = folderUrls;
  }

  return urls;
}

// Función para obtener URLs de una carpeta específica
function getBlobUrlsForFolder(folderIndex) {
  const urls = generateBlobUrls();
  const folder = folderIndex.padStart(2, "0");
  return urls[folder] || [];
}

// Exportar funciones
export { BLOB_BASE_URL, generateBlobUrls, getBlobUrlsForFolder };

// Si se ejecuta directamente, mostrar las URLs
if (import.meta.url === `file://${process.argv[1]}`) {
  const urls = generateBlobUrls();
  console.log("URLs del blob generadas:");
  console.log(JSON.stringify(urls, null, 2));

  // Guardar en archivo
  const outputPath = path.join(__dirname, "blob-urls.json");
  fs.writeFileSync(outputPath, JSON.stringify(urls, null, 2));
  console.log(`\nURLs guardadas en: ${outputPath}`);
}
