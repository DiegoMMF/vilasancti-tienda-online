# Vilasancti Tienda Online (Next.js Commerce adaptada)

Tienda online basada en Next.js App Router, con base de datos en Postgres mediante Drizzle ORM y almacenamiento de imágenes en Vercel Blob. Mantiene la UI/UX de Next.js Commerce, eliminando dependencias de Shopify en tiempo de ejecución.

## Tecnologías

- Next.js 15 (App Router, RSC, Server Actions, Turbopack)
- React 19
- Tailwind CSS 4
- Drizzle ORM + Postgres
- Vercel Blob (almacenamiento de imágenes)

## Arquitectura de datos

- Acceso a datos con Drizzle en `lib/api/*-drizzle.ts` (productos, carrito, páginas, menú).
- Esquema y relaciones en `lib/db/schema.ts` y `lib/db/relations.ts`; cliente en `lib/db/index.ts`.
- Imágenes en Vercel Blob gestionadas vía utilidades en `lib/blob.ts`.

Nota: Este repo ya está migrado a Drizzle + Postgres.

## Variables de entorno

Crea un archivo `.env` en la raíz (o configura variables en tu entorno):

```env
# Base de datos (Postgres)
DATABASE_URL="postgres://usuario:password@host:puerto/db"

# Vercel Blob Storage (requerido para subir/listar/borrar imágenes)
BLOB_READ_WRITE_TOKEN="your_vercel_blob_token_here"

# Configuración de la App
SITE_NAME="Vilasancti Tienda"
COMPANY_NAME="Vilasancti"

# Opcional: Analytics
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=""
```

Notas:

- `DATABASE_URL` debe ser una cadena de conexión válida a Postgres.
- Para usar Vercel Blob (subida/listado/borrado de imágenes) necesitas el token `BLOB_READ_WRITE_TOKEN` desde el panel de Vercel (Storage → Blob).

## Puesta en marcha local

Requisitos: Node.js 20+, pnpm.

```bash
pnpm install
pnpm db:migrate    # aplica migraciones de Drizzle (si existen)
pnpm db:seed       # carga datos de ejemplo (7 productos de pijamas mujer)
pnpm dev           # http://localhost:3000
```

Scripts disponibles (`package.json`):

- `dev`: inicia el entorno local con Turbopack
- `build` / `start`: build y arranque en producción
- `lint`: lint con `next lint`
- `prettier` / `prettier:check`: formato de código
- `db:migrate`, `db:seed`

## Datos de ejemplo (seed)

El script `scripts/seed-drizzle.js`:

- Limpia tablas y crea colecciones de sistema: `hidden-homepage-featured-items`, `hidden-homepage-carousel`, `pijamas-mujer`.
- Inserta 7 productos de pijamas para mujer con variantes de color y talla.
- Gestiona imágenes en Vercel Blob bajo los prefijos `articles/01`, `articles/02`, ..., `articles/06` (y `articles/07` para el 7º producto):
  - Si no existen blobs todavía, sube automáticamente los archivos locales desde `articles/<nn>/` (carpeta del repo) con acceso público y sin sufijo aleatorio.
  - Si ya existen, lista y usa las URLs públicas existentes.
- Crea múltiples imágenes por producto y marca la primera como destacada.
- Aplica disponibilidad por producto:
  - p01 (`/articles/01`): tallas [M], colores [Rosa]
  - p02 (`/articles/02`): [S], [Rosa]
  - p03 (`/articles/03`): [], [Negro]
  - p04 (`/articles/04`): [M], [Azul]
  - p05 (`/articles/05`): [S, M, L], [Rosa]
  - p06 (`/articles/06`): [S, M, L], [Rosa]
  - p07 (`/articles/07`): [M], [Rosa] (por defecto)

Puedes adaptar precios, imágenes o colecciones editando `scripts/seed-drizzle.js` y re‑ejecutando `pnpm db:seed`.

## Rutas principales

- `/` Página principal (grid, carrusel, destacados)
- `/category/[handle]` Listado por colección (por ejemplo, `pijamas-mujer`)
- `/product/[handle]` Ficha de producto
- `/search/[collection]?q=` Búsqueda/filtrado
- `/api/revalidate` Stub (no se usan webhooks externos actualmente)

## Almacenamiento de imágenes (Vercel Blob)

Utilidades en `lib/blob.ts` permiten:

- `uploadImage(file, folder)`
- `deleteImage(url)`
- `listImages(prefix)`

Asegúrate de configurar `BLOB_READ_WRITE_TOKEN` para operaciones de escritura. `next.config.ts` permite cargar imágenes remotas desde dominios de Blob público y Unsplash.

## SEO (resumen)

- Canonicals hacia URLs base sin parámetros en listados y búsqueda.
- `noindex,follow` cuando haya facetas (`color`, `size`) o `q` en búsqueda.
- JSON‑LD: `Organization` en `app/layout.tsx`; `Product` (con `brand`/`sku`), `BreadcrumbList` en `product/[handle]`; `ItemList` en listados.
- Sitemaps segmentados: `app/sitemap-products/route.ts` y `app/sitemap-collections/route.ts`; `robots.ts` referencia ambos.
- Imágenes AVIF/WebP habilitadas y tamaños consistentes (ver `next.config.ts`).

## Despliegue

Recomendado: Vercel.

1. Crear proyecto en Vercel y enlazar el repositorio.
2. Definir variables de entorno (al menos `DATABASE_URL`, `SITE_NAME`, `COMPANY_NAME`; y `BLOB_READ_WRITE_TOKEN` si vas a gestionar imágenes).
3. Desplegar. Para bases de datos gestionadas, sustituye `DATABASE_URL` por la conexión correspondiente (por ejemplo, Postgres) y ejecuta migraciones según convenga.

## Notas adicionales

- El sistema de revalidación está desactivado por ahora (`app/api/revalidate/route.ts`).
- Tipificación y utilidades propias en `lib/types.ts`, `lib/utils.ts`, `lib/type-guards.ts`.

## Licencia y créditos

- Licencia: ver `license.md`.
- Basado en la plantilla pública Next.js Commerce de Vercel, adaptada para BD local y Blob. ¡Gracias al equipo de Vercel por el fantástico punto de partida!
