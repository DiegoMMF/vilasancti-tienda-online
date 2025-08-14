import { config } from "dotenv";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";

// Cargar variables de entorno
config({ path: ".env.local" });

const client = postgres(process.env.DATABASE_URL, {
  max: 1,
  ssl: "require",
});

const db = drizzle(client);

async function resetDatabase() {
  try {
    console.log("🗑️  Limpiando base de datos...");
    
    // Eliminar tablas en orden correcto (respetando foreign keys)
    await db.execute(sql`DROP TABLE IF EXISTS "cart_items" CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS "carts" CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS "product_collections" CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS "product_images" CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS "product_variants" CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS "products" CASCADE`);
    await db.execute(sql`DROP TABLE IF EXISTS "collections" CASCADE`);
    
    console.log("✅ Base de datos limpiada exitosamente");
  } catch (error) {
    console.error("❌ Error limpiando base de datos:", error);
  } finally {
    await client.end();
  }
}

resetDatabase();
