# Vilasancti Tienda Online (Next.js Commerce adaptada)

Tienda online basada en Next.js App Router, con base de datos en Postgres mediante Prisma y almacenamiento de imágenes en Vercel Blob. Mantiene la UI/UX de Next.js Commerce, pero sin dependencias de Shopify en tiempo de ejecución.

## Tecnologías

- Next.js 15 (App Router, RSC, Server Actions, Turbopack)
- React 19
- Tailwind CSS 4
- Prisma 5 + Postgres
- Vercel Blob (almacenamiento de imágenes)

## Arquitectura de datos

- Los datos se sirven desde la base de datos a través de `lib/api`:
  - `lib/api/products.ts`, `lib/api/cart.ts`, `lib/api/pages.ts`, `lib/api/menu.ts`.
- Se conservan tipos y utilidades en `lib/shopify` únicamente para compatibilidad de tipos y componentes UI, pero no se realizan llamadas a Shopify.
- Esquema Prisma en `prisma/schema.prisma`. Por defecto se usa Postgres.

Consulta `MIGRATION.md` para detalles de la migración de Shopify a BD local + Blob.

## Variables de entorno

Crea un archivo `.env` en la raíz (o configura variables en tu entorno):

```env
# Base de datos (Postgres)
DATABASE_URL="postgres://usuario:password@host:puerto/db"
# Prisma Direct URL (puede ser igual a DATABASE_URL)
DIRECT_URL="postgres://usuario:password@host:puerto/db"

# Vercel Blob Storage (requerido para subir/listar imágenes en seed y en utilidades)
BLOB_READ_WRITE_TOKEN="your_vercel_blob_token_here"

# Configuración de la App
SITE_NAME="Vilasancti Tienda"
COMPANY_NAME="Vilasancti"

# Opcional: Analytics
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=""
```

Notas:
- `DIRECT_URL` es requerido por Prisma en este proyecto; si no dispones de una URL específica, usa el mismo valor que `DATABASE_URL`.
- Para usar Vercel Blob (subida/listado/borrado de imágenes) necesitas el token `BLOB_READ_WRITE_TOKEN` desde el panel de Vercel (Storage → Blob).

## Puesta en marcha local

Requisitos: Node.js 20+, pnpm.

```bash
pnpm install
pnpm db:generate   # genera el cliente de Prisma
pnpm db:push       # aplica el esquema a la BD
pnpm db:seed       # carga datos de ejemplo (7 productos de piyamas mujer)
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
- Limpia tablas y crea colecciones de sistema: `hidden-homepage-featured-items`, `hidden-homepage-carousel`, `piyamas-mujer`.
- Inserta 7 productos de piyamas para mujer con variantes de color y talla.
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

Puedes adaptar precios, imágenes o colecciones editando `scripts/seed.js` y re‑ejecutando `pnpm db:seed`.

## Rutas principales

- `/` Página principal (grid, carrusel, destacados)
- `/category/[handle]` Listado por colección (por ejemplo, `piyamas-mujer`)
- `/product/[handle]` Ficha de producto
- `/search/[collection]?q=` Búsqueda/filtrado
- `/api/revalidate` Stub (no se usan webhooks de Shopify actualmente)

## Almacenamiento de imágenes (Vercel Blob)

Utilidades en `lib/blob.ts` permiten:
- `uploadImage(file, folder)`
- `deleteImage(url)`
- `listImages(prefix)`

Asegúrate de configurar `BLOB_READ_WRITE_TOKEN` para operaciones de escritura. `next.config.ts` permite cargar imágenes remotas desde dominios de Blob público (y otros remotos permitidos).

## Despliegue

Recomendado: Vercel.

1. Crear proyecto en Vercel y enlazar el repositorio.
2. Definir variables de entorno (al menos `DATABASE_URL`, `DIRECT_URL`, `SITE_NAME`, `COMPANY_NAME`; y `BLOB_READ_WRITE_TOKEN` si vas a gestionar imágenes).
3. Desplegar. Para bases de datos gestionadas, sustituye `DATABASE_URL` por la conexión correspondiente (por ejemplo, Postgres) y ejecuta migraciones según convenga.

## Notas adicionales

- El sistema de revalidación está desactivado por ahora (`app/api/revalidate/route.ts`).
- Muchos componentes tipan con `lib/shopify/types` para mantener la compatibilidad de la UI del template original.
- Consulta `docs/SEO_OPTIMIZATION.md` para recomendaciones SEO.

## Licencia y créditos

- Licencia: ver `license.md`.
- Basado en la plantilla pública Next.js Commerce de Vercel, adaptada para BD local y Blob. ¡Gracias al equipo de Vercel por el fantástico punto de partida!
