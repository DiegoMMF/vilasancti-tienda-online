### Objetivo
Plan exhaustivo para optimizar SEO técnico, on-page, contenidos y rendimiento en tu ecommerce (Next.js App Router), con foco en productos, colecciones y navegación facetada (color/talla).

### Fase 1 — Auditoría y baseline
- [ ] Lighthouse/PageSpeed/GSC/GA4/ScreamingFrog baselines
- [ ] Mapa de plantillas y KPIs definidos
- **Herramientas**: Lighthouse, PageSpeed Insights, GSC, GA4, Screaming Frog (render JS), Ahrefs/SEMrush.
- **KPIs**: Core Web Vitals (LCP, INP, CLS), cobertura de indexación, CTR por plantilla, tráfico orgánico, canibalización, duplicidad por filtros, logs de server (rutas y 404/5xx).
- **Mapa de plantillas**: `home`, `search`, `search/[collection]`, `product/[handle]`, páginas informativas (si las hubiera).

### Fase 2 — SEO técnico (indexación, canonicals, facetas, datos estructurados)
- [x] Meta robots dinámico en colecciones con facetas (`noindex,follow`)
- [x] Meta robots dinámico en `/search` con facetas (`noindex,follow`)
- [x] Canonical en colecciones hacia URL base sin parámetros
- [x] Canonical en `/search` hacia URL base sin parámetros
- [x] JSON-LD Organization en `app/layout.tsx`
- [x] JSON-LD Product enriquecido (brand) en `product/[handle]`
- [x] JSON-LD BreadcrumbList en `product/[handle]`
- [ ] JSON-LD ItemList en listados
- [ ] Sitemaps segmentados (productos/colecciones)
- [ ] Reglas de robots.txt validadas
- **Canonicals**:
  - En `app/search/[collection]/page.tsx` y `app/search/page.tsx`: cuando existan parámetros de facetas (`color`, `size`) o `q` (búsqueda), usar `rel=canonical` hacia la URL base (sin parámetros).
- **Meta robots**:
  - `search` y `search/[collection]` con facetas o `q`: `noindex,follow`.
  - Páginas sin facetas ni búsqueda: `index,follow`.
  - Respetar `HIDDEN_PRODUCT_TAG` para no indexar productos ocultos.
- **Facetas (color/talla)**:
  - Mantener indexables solo categorías “limpias” (sin parámetros).
  - Evitar que combinaciones de filtros generen páginas similares indexables.
- **Sitemaps**:
  - `sitemap.xml` segmentado: `sitemap-products.xml`, `sitemap-collections.xml` (máx. 50k URLs/sitemap).
  - Actualización con revalidación cuando haya altas/bajas de productos.
- **Robots.txt**:
  - Permitir crawl general.
  - No bloquear parámetros: confiar en canonical+meta robots. (Opcional: `Disallow: /*?*` si todo paramétrico será “noindex”, pero priorizar canonical).
- **Datos estructurados (JSON-LD)**:
  - Producto: ya presente; añadir `brand`, `sku`, `gtin` (si existen), `aggregateRating` y `offers.availability`/`priceValidUntil` si aplican.
  - BreadcrumbList: en `product/[handle]` y categorías.
  - ItemList para listados (colecciones).
  - Organization/Website en `app/layout.tsx` (Logo, URL, SearchAction opcional).
- **Paginación**:
  - Si hay paginación en listados, URLs limpias (`?page=2`), `rel=canonical` a sí mismas, títulos únicos (“Página 2”).
- **Errores/estado**:
  - 404 personalizadas con enlaces útiles; usar 410 en productos eliminados definitivamente; 301 para migraciones de `handle`.

### Fase 3 — SEO on-page (plantillas y contenidos)
- [ ] Títulos y descripciones únicos por plantilla
- [ ] Jerarquía de encabezados consistente (H1/H2/H3)
- [ ] Contenido en colecciones (100–200 palabras)
- [ ] FAQs (FAQPage) si aplica
- [x] Alt de imágenes consistente
- [ ] Interlinking producto/colección
- **Títulos y descripciones**:
  - Unicidad por plantilla; longitudes: Title ~55–60, Meta Description ~150–160.
  - Usar `seoTitle`/`seoDescription` desde DB (ya contemplado), con fallback coherente.
- **Encabezados**:
  - Un solo `H1` por página (producto: nombre, colección: nombre).
  - Jerarquía H2/H3 para descripciones, features, guía de talles.
- **Contenido**:
  - Fichas con atributos (tejido, cuidados, guía de talles, beneficios).
  - Texto en colecciones (100–200 palabras) con intención de búsqueda.
  - Preguntas frecuentes (FAQPage JSON-LD) si aplica.
- **Medios**:
  - `alt` descriptivo (ya cubierto en `GridTileImage`).
  - `src` con parámetros consistentes; AVIF/WebP ya habilitado.
  - Subtítulos/transcripciones si hay video.
- **Interlinking**:
  - En producto: enlaces a variantes, colecciones y productos relacionados.
  - En colecciones: enlaces a subcolecciones/colecciones hermanas.

### Fase 4 — Rendimiento (Core Web Vitals)
- [ ] Preload imagen LCP en producto
- [ ] `font-display: swap` y preload de fuentes críticas
- [ ] Reducir JS cliente (quitar `use client` innecesario)
- [x] Tamaños de imágenes consistentes (WebP/AVIF permitido)
- **LCP**:
  - Preload imagen destacada del producto en `product/[handle]`.
  - Evitar fuentes bloqueantes (preload/`font-display: swap`).
- **INP**:
  - Reducir JS en cliente (componentes `use client` solo cuando sea necesario).
  - Priorizar ‘critical’ UI; diferir listeners no críticos.
- **CLS**:
  - Reservar espacios (ya se establecen `width/height` de `Image`).
  - Evitar inyección tardía de fuentes/estilos.
- **Caching**:
  - Revalidación eficiente (`/app/api/revalidate`) ya presente.
  - Long caching para imágenes estáticas; CDNs.
- **Minimización**:
  - Poda de dependencias no usadas, divide componentes pesados.

### Fase 5 — Estrategia de URLs y migraciones
- [ ] Validar estructura final de URLs
- [ ] Plan de redirecciones 301 si cambian rutas/handles
- **Estructura**:
  - Producto: `/product/[handle]` OK.
  - Categoría: `/categoria/[handle]` (antes `/search/[collection]`).
- **Filtros**:
  - `?color=Azul,Rosa&size=S,M` solo para UX; no index; canonical a base.
- **Redirecciones**:
  - [x] 301 de `/search/:collection` a `/categoria/:handle` en `next.config.ts`.

### Fase 6 — Señales externas y confiabilidad
- [ ] Páginas corporativas (sobre/envíos/devoluciones/contacto)
- [ ] Reviews + AggregateRating
- [ ] Plan de backlinks/PR
- **E-E-A-T**:
  - Página “Sobre nosotros”, políticas, envíos, devoluciones, contacto visible.
  - Datos de empresa (Organization JSON-LD), NAP (si aplica).
- **Reseñas**:
  - Sistema de reviews con `aggregateRating` (moderado).
- **Backlinks**:
  - Directrices para link-building y PR de marca.

### Fase 7 — Internacionalización (opcional)
- [ ] i18n + hreflang (si aplica)
- **i18n/hreflang**: si sumas idiomas/mercados, `hreflang` y segmentación de sitemaps por locale.

### Fase 8 — Analítica y monitorización
- [ ] GA4 e-commerce events
- [ ] GSC: sitemaps y parámetros
- [ ] Alerting 404/500 y variaciones de cobertura
- **GA4**: tracking de comercio electrónico (view_item, add_to_cart, begin_checkout, purchase).
- **GSC**: sitemap submit, inspección de URLs, parámetros.
- **Alerting**: monitores de 404/500, cambios drásticos en cobertura o CV.
- **Experimentos**: A/B en títulos/meta/hero (con cuidado de no romper indexación).

### Implementación sugerida en el código
- **Canonicals/robots en listados**:
  - `app/search/page.tsx` y `app/search/[collection]/page.tsx`: si detectas `color`, `size` o `q`, setear metadata con `robots: noindex,follow` y `alternates.canonical` sin params.
- **JSON-LD**:
  - `product/[handle]/page.tsx`: añadir BreadcrumbList y `brand`/`sku`.
  - `app/layout.tsx`: Organization/Website.
  - `search/[collection]`: ItemList con productos listados.
- **Sitemaps**:
  - `app/sitemap.ts`: exportar nodos hacia sitemaps específicos de productos y colecciones (o rutas dedicadas).
- **Open Graph/Twitter**:
  - Asegurar `og:image` derivado del `featuredImage`, `twitter:card` summary_large_image.
- **404/410**:
  - `app/not-found.tsx`; endpoint admin para marcar producto 410 si discontinuado (y excluir de sitemap).

### Roadmap (semanas)
- **Semana 1**: Auditoría + quick wins (canonicals/robots en facetas, OG/Twitter, alt/headers, preload LCP, JSON-LD Organization).
- **Semana 2**: Breadcrumb + ItemList + Product enriquecido; sitemaps segmentados; 404/410; redirects.
- **Semana 3**: Contenidos de colección/producto; FAQs; interlinking; guía de talles.
- **Semana 4**: Perf (INP/CLS), poda de JS, monitorización, GSC tuning y primeros experiments.

### Entregables
- Checklist de verificación (por plantilla).
- Informe de cobertura GSC pre/post.
- Tablero de KPIs (CWV, indexación, CTR, revenue orgánico).

- Impacto esperado: mejor rastreo y cobertura, reducción de thin/duplicados por facetas, CTR más alto por metadatos y OG, mejores CWV y, en consecuencia, mayor visibilidad y conversión orgánica.