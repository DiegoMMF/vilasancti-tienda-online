# Guía de Optimización SEO para Vilasancti

Guía completa de optimización SEO específicamente adaptada para Vilasancti, tienda online de pijamas elegantes construida con Next.js 15, React 19, Drizzle ORM y Vercel Blob.

---

## 1. Fundamentos Técnicos

### 1.1 Robots.txt y Sitemaps

```ts
// app/robots.ts
import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/cart",
          "/checkout",
          "/admin",
          "/api",
          "/search",
          "/*?*utm_*",
        ],
      },
    ],
    sitemap: [
      "https://vilasancti.vercel.app/sitemap.xml",
      "https://vilasancti.vercel.app/sitemap-products/route",
      "https://vilasancti.vercel.app/sitemap-collections/route",
    ],
    host: "https://vilasancti.vercel.app",
  };
}
```

### 1.2 URLs Canónicas

```ts
// app/product/[handle]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const product = await getProduct(params.handle);

  return {
    title: `${product.title} - Pijamas Elegantes | Vilasancti`,
    description: product.description?.slice(0, 155),
    alternates: {
      canonical: `https://vilasancti.vercel.app/product/${product.handle}`,
    },
    robots: {
      index: product.availableForSale,
      follow: true,
    },
  };
}
```

---

## 2. Performance y Core Web Vitals

### 2.1 Objetivos

- **LCP**: < 2.5 segundos
- **INP**: < 200 ms
- **CLS**: < 0.1
- **Prioridad móvil**: 75% usuarios en "Good"

### 2.2 Optimización de Imágenes

```tsx
// Componente optimizado para Vilasancti
function ProductImage({ product, priority = false }) {
  return (
    <Image
      src={product.featuredImage.url}
      alt={`${product.title} - Pijama elegante Vilasancti`}
      width={800}
      height={600}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      priority={priority}
      quality={85}
    />
  );
}
```

### 2.3 ISR (Incremental Static Regeneration)

```ts
// app/product/[handle]/page.tsx
export const revalidate = 600; // 10 minutos

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((product) => ({ handle: product.handle }));
}
```

---

## 3. Datos Estructurados (Schema.org)

### 3.1 Product Schema

```tsx
function ProductSchema({ product }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    image: product.images.map((img) => img.url),
    description: product.description,
    brand: { "@type": "Brand", name: "Vilasancti" },
    offers: {
      "@type": "Offer",
      priceCurrency: "ARS",
      price: product.priceRange.minVariantPrice.amount,
      availability: product.availableForSale
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `https://vilasancti.vercel.app/product/${product.handle}`,
      seller: { "@type": "Organization", name: "Vilasancti" },
    },
    category: "Pijamas",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

### 3.2 Category Schema

```tsx
function CategorySchema({ collection, products }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: collection.title,
    numberOfItems: products.length,
    itemListElement: products.map((product, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: product.title,
        url: `https://vilasancti.vercel.app/product/${product.handle}`,
        image: product.featuredImage.url,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

### 3.3 Organization Schema

```tsx
function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Vilasancti",
    url: "https://vilasancti.vercel.app",
    logo: "https://vilasancti.vercel.app/favicon.png",
    description:
      "Elegancia que se vive en casa. Tienda Online de Pijamas que realzan tu belleza y transmiten distinción.",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
```

---

## 4. Optimización de Contenido

### 4.1 Páginas de Producto

```tsx
function ProductPage({ product }) {
  return (
    <>
      <ProductSchema product={product} />

      <div className="product-layout max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="product-gallery">
            <ProductImages images={product.images} />
          </div>

          <div className="product-info">
            <h1 className="text-3xl md:text-4xl font-bold text-[#bf9d6d] font-cormorant mb-4">
              {product.title}
            </h1>
            <div className="price text-2xl font-semibold text-[#bf9d6d] mb-6">
              ${product.priceRange.minVariantPrice.amount} ARS
            </div>
            <div className="description text-[#bf9d6d]/80 mb-8">
              <p>{product.description}</p>
            </div>
            <ProductActions product={product} />
          </div>
        </div>
      </div>
    </>
  );
}
```

---

## 5. Navegación y Enlazado Interno

### 5.1 Breadcrumbs

```tsx
function Breadcrumbs({ breadcrumbs }) {
  return (
    <>
      <BreadcrumbSchema breadcrumbs={breadcrumbs} />
      <nav aria-label="Breadcrumb" className="breadcrumbs py-4">
        <ol className="flex items-center space-x-2 text-sm text-[#bf9d6d]/70">
          {breadcrumbs.map((crumb, index) => (
            <li key={crumb.url} className="flex items-center">
              {index === breadcrumbs.length - 1 ? (
                <span
                  aria-current="page"
                  className="text-[#bf9d6d] font-medium"
                >
                  {crumb.name}
                </span>
              ) : (
                <>
                  <Link
                    href={crumb.url}
                    className="hover:text-[#bf9d6d] transition-colors"
                  >
                    {crumb.name}
                  </Link>
                  <span className="mx-2 text-[#bf9d6d]/40">/</span>
                </>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
```

### 5.2 Productos Relacionados

```tsx
function RelatedProducts({ currentProduct }) {
  const relatedProducts = useRelatedProducts(currentProduct.id);

  return (
    <section className="related-products py-12 bg-white/10">
      <div className="max-w-7xl mx-auto px-6">
        <h3 className="text-2xl font-bold text-[#bf9d6d] font-cormorant mb-8">
          Productos Relacionados
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

## 6. Analytics y Medición

### 6.1 Google Analytics 4

```tsx
// lib/gtag.ts
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;

export const trackProductView = (product: any) => {
  gtag("event", "view_item", {
    currency: "ARS",
    value: parseFloat(product.priceRange.minVariantPrice.amount),
    items: [
      {
        item_id: product.id,
        item_name: product.title,
        category: "Pijamas",
        quantity: 1,
        price: parseFloat(product.priceRange.minVariantPrice.amount),
      },
    ],
  });
};

export const trackPurchase = (transactionData: any) => {
  gtag("event", "purchase", {
    transaction_id: transactionData.id,
    value: transactionData.total,
    currency: "ARS",
    items: transactionData.items,
  });
};
```

### 6.2 KPIs Clave

**Core Web Vitals:**

- LCP "Good" rate ≥75%
- INP "Good" rate ≥75%
- CLS "Good" rate ≥75%

**SEO Performance:**

- Cobertura indexable ≥95%
- Rich results válidos ≥95%
- CTR orgánico por tipo de página

**Business Metrics:**

- Revenue orgánico mensual
- Conversion rate desde tráfico orgánico
- AOV desde tráfico orgánico

---

## 7. Gestión de Facetas

### 7.1 Estrategia de Facetas

```tsx
// lib/facets-strategy.ts
const INDEXABLE_FACETS = {
  strategic: ["lisos", "estampados", "cortos", "largos"],
  emerging: ["rosa", "negro", "saten"],
  noIndex: ["sort-by", "items-per-page", "view-mode"],
};

export function shouldIndexFacetCombination(params: URLSearchParams) {
  const activeFilters = Array.from(params.keys());

  if (activeFilters.length > 2) return false;

  if (activeFilters.some((filter) => INDEXABLE_FACETS.noIndex.includes(filter)))
    return false;

  const filterCombination = activeFilters.sort().join("-");
  return (
    INDEXABLE_FACETS.strategic.includes(filterCombination) ||
    INDEXABLE_FACETS.emerging.includes(filterCombination)
  );
}
```

---

## 8. Seguridad y Headers

```js
// next.config.ts
const securityHeaders = [
  { key: "X-DNS-Prefetch-Control", value: "on" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-XSS-Protection", value: "1; mode=block" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "origin-when-cross-origin" },
];

export default {
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
};
```

---

## 9. Roadmap de Implementación

### Fase 0: Quick Wins (1-2 semanas)

- [ ] Configurar robots.txt y sitemaps
- [ ] Implementar títulos y meta descriptions únicas
- [ ] Agregar canonical tags
- [ ] Optimizar LCP del home
- [ ] Configurar breadcrumbs con schema
- [ ] Bloquear rutas administrativas

### Fase 1: Fundación Sólida (3-6 semanas)

- [ ] Datos estructurados completos
- [ ] Contenido en categorías principales
- [ ] Sistema ISR + revalidation
- [ ] Auditoría de scripts de terceros
- [ ] Sistema de monitoreo Web Vitals

### Fase 2: Crecimiento Sostenido (continuo)

- [ ] Programa editorial de contenido
- [ ] Sistema de enlazado interno
- [ ] Optimización de facetas
- [ ] A/B testing de metadata
- [ ] Link building

---

## 10. Checklist Pre-Launch

```tsx
const PRE_LAUNCH_CHECKLIST = {
  technical: [
    "URLs canónicas únicas",
    "Sitemaps sin 404s",
    'CWV "Good" ≥75% móvil',
    "HTTPS en todas las URLs",
    "Redirecciones 301 probadas",
  ],
  content: [
    "Titles únicos (50-60 chars)",
    "Meta descriptions (140-160 chars)",
    "H1 únicos por página",
    "Alt text en imágenes",
    "Breadcrumbs visibles",
  ],
  schema: [
    "Product schema válido",
    "ItemList schema en categorías",
    "BreadcrumbList en navegación",
    "Organization schema en layout",
  ],
  performance: [
    "Lighthouse score >90",
    "Images optimizadas",
    "Fonts optimizadas",
    "Scripts minimizados",
  ],
  monitoring: [
    "Google Analytics 4 configurado",
    "Search Console verificado",
    "Web Vitals monitoring",
    "Alertas de errores",
  ],
};
```

---

## 11. Monitoreo Post-Launch

### Semanal

- Errores técnicos (4xx/5xx)
- Core Web Vitals
- Indexación de nuevas páginas
- GSC Issues

### Mensual

- Rankings por keywords
- Tráfico orgánico
- Conversiones desde orgánico
- Cobertura de productos

### Trimestral

- Content audit
- Technical audit
- Competitive analysis
- Performance review

---

Esta guía representa un enfoque holístico para la optimización SEO de Vilasancti, combinando técnicas tradicionales con las capacidades avanzadas del stack tecnológico moderno (Next.js 15, React 19, Drizzle ORM, Vercel Blob).

**Vilasancti** - Elegancia que se vive en casa 💝
