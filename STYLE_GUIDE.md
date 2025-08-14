# Manual de Estilo de UI/UX y Código

Este documento unifica criterios visuales y de interacción para el proyecto `vilasancti-tienda-online`, basado en Next.js Commerce con App Router (React Server Components), Tailwind CSS 4, React 19, Drizzle ORM y Vercel Blob.

Úsalo como referencia en nuevas funcionalidades, refactors y revisiones de PR.

---

## Principios de diseño

- **Consistencia primero**
  - Reutiliza patrones y componentes existentes (grid, cards, navbar, modals, formularios).
  - Mantén tokens (colores, tipografías, espaciados) coherentes con la paleta de marca.
- **Contenido y legibilidad**
  - Jerarquía tipográfica clara (H1–H6, subtítulos, body).
  - Contraste AA mínimo (WCAG 2.1) en texto y elementos interactivos sobre fondo antiquewhite.
- **Identidad de marca**
  - Usa `darkkhaki` (#bf9d6d) para elementos de marca, títulos principales y acentos.
  - Mantén el fondo `antiquewhite` (#f0e3d7) como base para crear una experiencia visual cálida y elegante.
- **Accesibilidad por defecto**
  - Navegación por teclado, focus visible, ARIA donde aplique.
  - Labels asociados, textos alternativos descriptivos en imágenes.
- **Performance orientada al usuario**
  - Prioriza LCP/INP: carga diferida, `priority` solo en LCP, ISR para listas.
  - Minimiza JS en cliente: RSC por defecto; client components sólo cuando sea necesario.
- **Mobile-first**
  - Diseña primero para pantallas pequeñas; escala progresiva con breakpoints.

---

## Sistema de diseño (tokens)

- **Colores**
  - Base principal: `antiquewhite` (#f0e3d7) para fondos y `darkkhaki` (#bf9d6d) para textos de marca.
  - Paleta complementaria: usa `neutral` para textos secundarios, `blue` para estados interactivos, `red/green` para errores/éxitos.
  - Estados: `hover`, `focus`, `active`, `disabled` deben mantener contraste AA con el fondo antiquewhite.
- **Tipografía**
  - Fuente: Geist Sans (ya integrada en `app/layout.tsx`).
  - Escalas sugeridas:
    - H1: text-3xl/4xl text-[#bf9d6d] (color de marca)
    - H2: text-2xl/3xl text-[#bf9d6d] (color de marca)
    - H3: text-xl/2xl text-[#bf9d6d] (color de marca)
    - Body: text-base text-neutral-800 (contraste con antiquewhite)
    - Small: text-sm text-neutral-600
  - Line-height cómoda (leading-6/7) y `tracking-tight` en títulos.
- **Espaciado**
  - Usa escala de Tailwind (2, 4, 6, 8, 12, 16, 24, 32…)
  - Márgenes/espaciados verticales consistentes entre secciones (p.ej. `py-8`, `py-12`).
- **Bordes y radios**
  - Radio base en tarjetas e inputs: `rounded-lg`.
  - Borde sutil por defecto: `border-[#bf9d6d]/20` para mantener coherencia con la paleta de marca.
- **Sombra**
  - Elevaciones discretas: `shadow-sm` en hover, `shadow` en modals/dropdowns.
  - Considera sombras con tinte cálido (`shadow-[#bf9d6d]/10`) para elementos de marca.

---

## Componentes y patrones

- **Imágenes (`next/image`)**
  - Define `sizes` realistas. Usa `fill` con contenedor posicionado.
  - LCP: sólo un `priority` por vista. En listados, prioriza el primer ítem (implementado en `components/layout/product-grid-items.tsx`). En PDP, la imagen principal ya usa `priority` en `components/product/gallery.tsx`.
  - `alt` descriptivo, evita repetir el título.
- **Tarjetas de producto**
  - Usa `GridTileImage` con `label` que muestre `title` y `price`.
  - Mantén relación de aspecto consistente (cuadrado) y `object-cover`.
  - Prefetch en enlaces a PDP activado (`prefetch={true}`) por defecto.
- **Grids**
  - Responsive: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` como base.
  - Animaciones discretas (`animate-fadeIn`) evitando bloquear interacciones.
- **Navbar y navegación**
  - RSC para datos; Suspense para partes no críticas (menú móvil, buscador).
  - Estados de foco visibles y tamaños táctiles suficientes (mín. 44x44px).
- **Modals (Cart)**
  - Usa `Dialog`/`Transition` (headlessui) con `aria` y `role` adecuados.
  - Cierre por `Esc` y click en overlay, foco atrapado dentro del modal.
- **Formularios**
  - Inputs con `label` vinculado o `aria-label` claro.
  - Mensajes de validación cerca del campo; colores accesibles.
  - Botones con estados `disabled` y `loading` (cursor y opacidad diferenciados).

---

## Accesibilidad (A11y)

- **Focus**: `focus-visible:outline` o estilo equivalente en todos los controles.
- **Contraste**: Asegura contraste AA mínimo con el fondo antiquewhite (#f0e3d7) para todos los textos.
- **Semántica**: Usa `section`, `nav`, `main`, `footer`, `h1–h6` correctamente.
- **ARIA**: Solo cuando sea necesario; no dupliques semántica nativa.
- **Teclado**: Navegación completa sin mouse; orden de tabulación lógico.
- **Texto alternativo**: `alt` significativo; en imágenes decorativas usa `alt=""`.

---

## SEO técnico

- **Metadata**
  - Usa `generateMetadata` para PDP y categorías, con `robots` según facetas.
  - `alternates.canonical` en listados para evitar duplicados.
- **Datos estructurados**
  - Incluye JSON-LD de `ItemList` en listados y `Product`/`BreadcrumbList` en PDP (ya aplicado en `app/category/[handle]/page.tsx`, `app/search/*`, y PDP).
- **URLs**
  - Slugs en minúscula, sin espacios, acentos ni caracteres especiales.
- **Contenido**
  - Títulos únicos y descripciones de 50–160 caracteres.

---

## Performance y carga

- **RSC por defecto**
  - Usa Server Components siempre que sea posible.
  - Client Components para interactividad real (cart, search input, gallery).
- **Data fetching**
  - Evita N+1: usa consultas batch (implementado en `lib/api/products-drizzle.ts`).
  - Revalida (ISR) en páginas de listado: home, categoría y búsqueda (`export const revalidate = 600`).
- **Imágenes**
  - Usa `sizes` correctos; `priority` solo para el LCP.
  - Carga diferida (`loading="lazy"`) por defecto en imágenes no críticas.
- **Fuentes**
  - Carga con `next/font` (GeistSans con CSS inline ya activo). Evita FOUT forzado.
- **JS en cliente**
  - Mantén bundles pequeños: no agregues dependencias pesadas sin evaluar.

---

## Estándares de código (Next.js + TS + Tailwind)

- **Estructura de carpetas**
  - App Router en `app/` con rutas por directorio.
  - Componentes en `components/` (subcarpetas por dominio: `cart/`, `layout/`, `product/`, `grid/`).
  - Capa de datos en `lib/api/*-drizzle.ts`; schema y relaciones en `lib/db/`.
- **Convenciones**
  - Nombres de archivos: kebab-case (`product-grid-items.tsx`).
  - Componentes: PascalCase para exportaciones nombradas.
  - Hooks: `useXxx` en camelCase.
  - Rutas dinámicas: `[param]` según App Router.
- **TypeScript**
  - Tipos derivados de Drizzle (`$inferSelect`) donde aplique.
  - Evita `any`; crea tipos en `lib/types` si faltan.
- **Estilo**
  - ESLint/Prettier por defecto del proyecto (ejecutar `pnpm lint`).
  - Importaciones ordenadas: librerías externas, alias internos, estilos.
- **Tailwind**
  - Clases ordenadas por categorías (layout > spacing > typography > color > effects > states).
  - Extrae patrones repetidos a componentes o a class utilities si corresponde.

---

## Estados y datos

- **Cart**
  - Estado en Client Component aislado (`components/cart/cart-context.tsx`).
  - Optimizaciones optimistas permitido con revert en error.
- **Búsqueda**
  - Input cliente minimal; resultados vía RSC.
- **Recomendaciones**
  - Dedupe antes de renderizar para claves únicas (aplicado en PDP).

---

## Interacción y microdetalles

- **Hover/Active**
  - Transiciones de 150–300ms; nunca bloquees scroll o input.
- **Focus**
  - Estilo visible y consistente (`ring-2 ring-[#bf9d6d] ring-offset-2`) para mantener coherencia con la paleta de marca.
- **Gestos y scroll**
  - Áreas táctiles adecuadas; `snap` sólo si mejora la UX.
- **Feedback**
  - Toasters para confirmaciones/errores no bloqueantes; modals para acciones críticas.

---

## Pruebas y QA visual

- **Revisión manual**
  - Lighthouse/PageSpeed: revisa LCP/TTFB/INP en home, categoría, PDP.
  - Chequea estados de vacío, cargas y errores.
- **Snapshots/Visual**
  - Usa Storybook si se integra en el futuro para testear componentes aislados.

---

## Checklist de PR

- [ ] Cumple tokens (color, tipografía, spacing) y accesibilidad AA.
- [ ] Usa RSC por defecto y Client Components sólo cuando sea necesario.
- [ ] Sin N+1; usa batch en `lib/api/*-drizzle.ts`.
- [ ] ISR aplicado en listados si corresponde.
- [ ] LCP optimizado (imagen prioritaria y `sizes` correctos).
- [ ] Sin warnings en consola (claves únicas, hydration, etc.).
- [ ] `pnpm lint` sin errores.

---

## Ejemplos rápidos

- **Imagen prioritaria en listado**

```tsx
<GridTileImage
  src={product.featuredImage?.url}
  alt={product.title}
  fill
  priority={index === 0}
  loading={index === 0 ? "eager" : "lazy"}
  fetchPriority={index === 0 ? "high" : undefined}
  sizes="(min-width: 768px) 33vw, (min-width: 640px) 50vw, 100vw"
/>
```

- **Revalidación en páginas de listado**

```ts
export const revalidate = 600; // 10 minutos
```

- **Batch queries (Drizzle)**

```ts
const [variants, images] = await Promise.all([
  db
    .select()
    .from(productVariants)
    .where(inArray(productVariants.productId, ids)),
  db.select().from(productImages).where(inArray(productImages.productId, ids)),
]);
```

---

## Gobernanza

- Cambios a este manual requieren PR con revisión de diseño/UX.
- Mantenlo breve, accionable y actualizado con la evolución del proyecto.
