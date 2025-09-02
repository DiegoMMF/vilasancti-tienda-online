import { config } from "dotenv";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Cargar variables de entorno
config({ path: ".env" });

// Cliente de PostgreSQL
const client = postgres(process.env.DATABASE_URL!, {
  // Permitir concurrencia razonable en SSR/acciones de servidor
  max: 10,
  ssl: "require",
});

// Instancia de Drizzle
export const db = drizzle(client, { schema });

// Exportar schema y relaciones
export * from "./relations";
export * from "./schema";
