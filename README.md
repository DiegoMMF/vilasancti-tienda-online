# Vilasancti Tienda Online

Tienda online elegante de pijamas para mujer, construida con Next.js 15, React 19, Tailwind CSS 4 y Drizzle ORM. Almacenamiento de imágenes en Vercel Blob y base de datos PostgreSQL.

## 🚀 Tecnologías

- **Frontend**: Next.js 15.4.6 (App Router, RSC, Server Actions, Turbopack)
- **React**: 19.1.1 con Server Components
- **Styling**: Tailwind CSS 4.1.12 con Container Queries
- **Base de datos**: PostgreSQL con Drizzle ORM 0.44.4
- **Almacenamiento**: Vercel Blob Storage
- **Tipografía**: Cormorant (serif elegante) + Inter (sans-serif)
- **Gestión de estado**: React Context + Server Actions
- **Notificaciones**: Sonner
- **Iconos**: Heroicons 2.2.0

## 🏗️ Arquitectura

### Base de datos (Drizzle ORM)
- **Esquema**: `lib/db/schema.ts` - Productos, variantes, imágenes, colecciones, carrito
- **Relaciones**: `lib/db/relations.ts` - Relaciones entre entidades
- **Cliente**: `lib/db/index.ts` - Conexión PostgreSQL con configuración optimizada
- **API**: `lib/api/*-drizzle.ts` - Acceso a datos con queries optimizadas

### Estructura de datos
```sql
collections (colecciones)
├── products (productos)
│   ├── product_variants (variantes con tallas/precios)
│   ├── product_images (imágenes múltiples por producto)
│   └── product_collections (relación muchos a muchos)
└── carts (carritos)
    └── cart_items (ítems del carrito)
```

### Almacenamiento de imágenes
- **Vercel Blob**: Gestión automática de imágenes con `lib/blob.ts`
- **Funciones**: `uploadImage()`, `deleteImage()`, `listImages()`
- **Optimización**: Formatos AVIF/WebP automáticos con `next/image`

## ⚙️ Variables de entorno

Crea un archivo `.env.local` en la raíz:

```env
# Base de datos PostgreSQL
DATABASE_URL="postgres://usuario:password@host:puerto/db"

# Vercel Blob Storage (requerido para imágenes)
BLOB_READ_WRITE_TOKEN="your_vercel_blob_token_here"

# Configuración de la aplicación
SITE_NAME="Vilasancti"
COMPANY_NAME="Vilasancti"
NEXT_PUBLIC_SITE_URL="https://tu-dominio.vercel.app"

# Opcional: Analytics
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=""
```

## 🛠️ Puesta en marcha

### Requisitos
- Node.js 20+
- pnpm
- PostgreSQL
- Cuenta Vercel (para Blob Storage)

### Instalación
```bash
# Clonar e instalar dependencias
git clone <repo-url>
cd vilasancti-tienda-online
pnpm install

# Configurar base de datos
pnpm db:migrate    # Aplicar migraciones
pnpm db:seed       # Cargar datos de ejemplo

# Iniciar desarrollo
pnpm dev           # http://localhost:3000
```

### Scripts disponibles
```bash
pnpm dev              # Desarrollo con Turbopack
pnpm build            # Build de producción
pnpm start            # Servidor de producción
pnpm lint             # Linting con ESLint
pnpm format           # Formateo con Prettier
pnpm db:migrate       # Aplicar migraciones
pnpm db:seed          # Cargar datos de ejemplo
```

## 📦 Datos de ejemplo

El script `scripts/seed-drizzle.js` crea:

### Colecciones
- `hidden-homepage-featured-items` - Productos destacados
- `hidden-homepage-carousel` - Carrusel de portada
- `lisos` - Pijamas con diseños lisos
- `estampados` - Pijamas con estampados
- `cortos` - Pijamas cortos
- `largos` - Pijamas largos

### Productos (11 pijamas de ejemplo)
1. **Pijama Estampado Algodón** - $48,300 ARS (M)
2. **Pijama Algodón Rosa con detalle** - $72,300 ARS (S)
3. **Pijama Invierno Negro** - $72,300 ARS (sin stock)
4. **Pijama Azul Cuadritos** - $86,500 ARS (M)
5. **Pijama Rosa Satén Largo** - $81,300 ARS (S, M, L)
6. **Pijama Rosa Regalitos** - $86,500 ARS (S, M, L)
7. **Pijama Corto a Rayas Rosadas** - $70,000 ARS (L, XL)
8. **Pijama Satén Plateado Corto** - $70,000 ARS (M)
9. **Pijama Satén Plateado Largo** - $81,300 ARS (sin stock)
10. **Pijama Animal Print Dorado Largo** - $86,500 ARS (S, M)
11. **Pijama Liso Negro Largo Satén** - $81,300 ARS (sin stock)

### Imágenes
- Gestión automática en Vercel Blob
- Múltiples imágenes por producto
- Primera imagen marcada como destacada
- Fallback a Unsplash si no hay imágenes locales

## 🎨 Sistema de diseño

### Paleta de colores
- **Fondo principal**: `#f0e3d7` (antiquewhite)
- **Color de marca**: `#bf9d6d` (darkkhaki)
- **Textos**: Neutral scale para contraste

### Tipografía
- **Títulos**: Cormorant (serif elegante)
- **Body**: Inter (sans-serif legible)

### Componentes principales
- **Grid responsivo**: 1 col → 2 cols → 3 cols
- **Carousel**: Carrusel de productos destacados
- **Cart Modal**: Carrito deslizable
- **Product Gallery**: Galería de imágenes con zoom
- **Search & Filters**: Búsqueda con filtros por colección

## 🛍️ Funcionalidades

### Catálogo
- ✅ Listado de productos con grid responsivo
- ✅ Filtrado por colecciones
- ✅ Búsqueda semántica
- ✅ Ordenamiento (relevancia, precio, fecha)
- ✅ Paginación automática

### Productos
- ✅ Fichas detalladas con galería
- ✅ Variantes por talla
- ✅ Precios en ARS
- ✅ Gestión de stock
- ✅ SEO optimizado

### Carrito
- ✅ Añadir/eliminar productos
- ✅ Modificar cantidades
- ✅ Persistencia en sesión
- ✅ Modal deslizable

### UX/UI
- ✅ Diseño mobile-first
- ✅ Animaciones suaves
- ✅ Estados de carga
- ✅ Notificaciones toast
- ✅ Navegación accesible

## 🔍 SEO y Performance

### Optimizaciones
- **ISR**: Revalidación cada 10 minutos en listados
- **Imágenes**: AVIF/WebP automático, lazy loading
- **Fonts**: Optimización con `next/font`
- **Bundle**: Tree shaking automático

### SEO técnico
- **Metadata**: Generación dinámica por página
- **JSON-LD**: Product, BreadcrumbList, Organization
- **Sitemaps**: Segmentados por productos y colecciones
- **Canonicals**: URLs limpias sin parámetros

### Datos estructurados
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Pijama Estampado Algodón",
  "price": "48300",
  "priceCurrency": "ARS",
  "brand": "Vilasancti"
}
```

## 🚀 Despliegue

### Vercel (Recomendado)
1. Conectar repositorio en Vercel
2. Configurar variables de entorno
3. Desplegar automáticamente

### Variables de entorno en producción
```env
DATABASE_URL="postgres://..."
BLOB_READ_WRITE_TOKEN="..."
SITE_NAME="Vilasancti"
COMPANY_NAME="Vilasancti"
NEXT_PUBLIC_SITE_URL="https://tu-dominio.vercel.app"
```

### Base de datos
- **Desarrollo**: PostgreSQL local o Supabase
- **Producción**: Vercel Postgres, Supabase, o cualquier PostgreSQL

## 📁 Estructura del proyecto

```
vilasancti-tienda-online/
├── app/                    # App Router (Next.js 15)
│   ├── [page]/            # Páginas dinámicas
│   ├── api/               # API routes
│   ├── category/          # Listado por colección
│   ├── product/           # Fichas de producto
│   └── search/            # Búsqueda y filtros
├── components/            # Componentes React
│   ├── cart/             # Carrito de compras
│   ├── grid/             # Grid de productos
│   ├── layout/           # Layout y navegación
│   ├── product/          # Componentes de producto
│   └── ui/               # Componentes base
├── lib/                  # Utilidades y configuración
│   ├── api/              # Acceso a datos (Drizzle)
│   ├── db/               # Esquema y conexión DB
│   ├── blob.ts           # Gestión de imágenes
│   └── utils.ts          # Utilidades generales
├── scripts/              # Scripts de utilidad
│   ├── seed-drizzle.js   # Datos de ejemplo
│   └── generate-blob-urls.js
└── public/               # Assets estáticos
```

## 🧪 Testing y calidad

### Linting y formateo
```bash
pnpm lint              # ESLint
pnpm format            # Prettier
pnpm format:check      # Verificar formato
```

### Performance
- **Lighthouse**: LCP < 2.5s, INP < 200ms
- **Core Web Vitals**: Optimizado para móviles
- **Bundle size**: < 500KB inicial

## 📚 Documentación adicional

- **STYLE_GUIDE.md**: Manual de estilo y UX
- **license.md**: Licencia del proyecto
- **drizzle.config.ts**: Configuración de Drizzle
- **next.config.ts**: Configuración de Next.js

## 🤝 Contribución

1. Fork el repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -am 'Añadir nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

### Estándares de código
- TypeScript estricto
- ESLint + Prettier
- Componentes funcionales con hooks
- Server Components por defecto
- Tailwind CSS para estilos

## 📄 Licencia

Ver `license.md` para detalles de la licencia.

## 🙏 Créditos

Basado en la plantilla [Next.js Commerce](https://github.com/vercel/commerce) de Vercel, adaptada para una tienda de pijamas elegante con arquitectura moderna y optimizada para performance.

---

**Vilasancti** - Elegancia que se vive en casa ✨
