# Vilasancti Tienda Online (Next.js Commerce adaptada)

Tienda online basada en Next.js App Router, adaptada para usar base de datos local con Prisma + SQLite y almacenamiento de imágenes con Vercel Blob. Mantiene la UI/UX de Next.js Commerce, pero sin dependencias de Shopify en tiempo de ejecución.

## Tecnologías

- Next.js 15 (App Router, RSC, Server Actions, Turbopack)
- React 19
- Tailwind CSS 4
- Prisma 5 + SQLite (desarrollo)
- Vercel Blob (almacenamiento de imágenes)

## Arquitectura de datos

- Los datos se sirven desde la base de datos local a través de `lib/api`:
  - `lib/api/products.ts`, `lib/api/cart.ts`, `lib/api/pages.ts`, `lib/api/menu.ts`.
- Se conservan tipos y utilidades en `lib/shopify` únicamente para compatibilidad de tipos y componentes UI, pero no se realizan llamadas a Shopify.
- Esquema Prisma en `prisma/schema.prisma`. Por defecto se usa SQLite.

Consulta `MIGRATION.md` para detalles de la migración de Shopify a BD local + Blob.

## Variables de entorno

Crea un archivo `.env` en la raíz tomando como referencia `.env.example`.

Ejemplo recomendado para desarrollo:

```env
# Database (recomendado apuntar al archivo dentro de prisma/)
DATABASE_URL="file:./prisma/dev.db"

# Vercel Blob Storage
BLOB_READ_WRITE_TOKEN="your_vercel_blob_token_here"

# Configuración de la App
SITE_NAME="Vilasancti Tienda"
COMPANY_NAME="Vilasancti"

# Opcional: Analytics
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=""
```

Notas:
- Si usas exactamente el contenido de `.env.example`, creará la BD en `./dev.db`. Recomendamos `file:./prisma/dev.db` para mantener todo bajo `prisma/`.
- Para usar Vercel Blob (subida/listado/borrado de imágenes) necesitas el token `BLOB_READ_WRITE_TOKEN` desde el panel de Vercel (Storage → Blob).

## Puesta en marcha local

Requisitos: Node.js 20+, pnpm.

```bash
pnpm install
pnpm db:generate   # genera el cliente de Prisma
pnpm db:push       # aplica el esquema a la BD
pnpm db:seed       # carga datos de ejemplo (7 productos de pijamas mujer)
pnpm dev           # http://localhost:3000
```

Scripts disponibles (`package.json`):

- `dev`: inicia el entorno local con Turbopack
- `build` / `start`: build y arranque en producción
- `lint`: lint con `next lint`
- `prettier` / `prettier:check`: formato de código
- `db:generate`, `db:push`, `db:studio`, `db:seed`

## Datos de ejemplo (seed)

El script `scripts/seed.js`:
- Limpia tablas y crea colecciones de sistema: `hidden-homepage-featured-items`, `hidden-homepage-carousel`, `pijamas-mujer`.
- Inserta 7 productos de pijamas para mujer con variantes de color y talla, e imágenes de Unsplash.

Puedes adaptar precios, imágenes o colecciones editando ese archivo y re‑ejecutando `pnpm db:seed`.

## Rutas principales

- `/` Página principal (grid, carrusel, destacados)
- `/category/[handle]` Listado por colección (por ejemplo, `pijamas-mujer`)
- `/product/[handle]` Ficha de producto
- `/search/[collection]?q=` Búsqueda/filtrado
- `/api/revalidate` Stub (no se usan webhooks de Shopify actualmente)

## Almacenamiento de imágenes (Vercel Blob)

Utilidades en `lib/blob.ts` permiten:
- `uploadImage(file, folder)`
- `deleteImage(url)`
- `listImages(prefix)`

Asegúrate de configurar `BLOB_READ_WRITE_TOKEN` para operaciones de escritura. `next.config.ts` permite cargar imágenes remotas desde Unsplash y Blob público.

## Despliegue

Recomendado: Vercel.

1. Crear proyecto en Vercel y enlazar el repositorio.
2. Definir variables de entorno (al menos `DATABASE_URL`, `SITE_NAME`, `COMPANY_NAME`; opcional `BLOB_READ_WRITE_TOKEN`, `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID`).
3. Desplegar. Para bases de datos gestionadas, sustituye `DATABASE_URL` por la conexión correspondiente (por ejemplo, Postgres) y ejecuta migraciones según convenga.

## Notas adicionales

- El sistema de revalidación está desactivado por ahora (`app/api/revalidate/route.ts`).
- Muchos componentes tipan con `lib/shopify/types` para mantener la compatibilidad de la UI del template original.
- Consulta `docs/SEO_OPTIMIZATION.md` para recomendaciones SEO.

## Licencia y créditos

- Licencia: ver `license.md`.
- Basado en la plantilla pública Next.js Commerce de Vercel, adaptada para BD local y Blob. ¡Gracias al equipo de Vercel por el fantástico punto de partida!
