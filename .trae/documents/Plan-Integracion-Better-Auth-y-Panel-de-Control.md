# Plan de Integración de Better Auth (Email/Password) y Panel de Control

## Contexto Técnico Actual
- Framework: Next.js 15 (App Router, RSC) y React 19.
- ORM/DB: Drizzle ORM sobre PostgreSQL (`lib/db/index.ts:1`, `lib/db/schema.ts:11`).
- Estilos: Tailwind CSS 4 con tipografía y container queries; paleta principal `#f0e3d7` y `#bf9d6d` (`app/layout.tsx:104`).
- Cabecera global: `components/layout/navbar/index.tsx` incluida en `app/layout.tsx`.
- Páginas de producto (PDP): `app/product/[handle]/page.tsx` y `components/product/product-description.tsx`.
- No hay librería de autenticación instalada actualmente (`package.json:21`).

## Objetivos
- Autenticación por correo y contraseña con Better Auth.
- Roles: `admin`, `dev`, `client`.
- Nueva ruta protegida: “Panel de Control” (`/panel-de-control`) visible solo para `admin` y `dev`.
- Enlace al Panel en el header global cuando haya sesión de `admin` o `dev`.
- Botón “Editar” en la PDP visible solo para `admin` y `dev`.
- Secciones mínimas del Panel: CRUD de usuarios, artículos y descuentos.
- Mantener vistas públicas existentes para sesiones no iniciadas y clientes; solo ocultar controles sensibles.
- Proteger rutas sensibles (panel, CRUD, APIs) con verificación de sesión y roles.
- Mantener estética existente (formas, estilos, paleta, márgenes).

## Dependencias y Configuración
- Añadir `better-auth` y adapter Drizzle.
- Hashing en Edge Runtime con Web Crypto API (sin `bcrypt`):
  - `SubtleCrypto` (`crypto.subtle`) con `PBKDF2` + `SHA-256`, sal aleatoria per-usuario, iteraciones elevadas (p.ej. 250k), longitud de clave 32 bytes.
  - Referencia: MDN Web Crypto API.
- Variables de entorno:
  - `DATABASE_URL`.
  - `BETTER_AUTH_SECRET` (clave aleatoria segura).
  - Opcionales: `EMAIL_FROM`, `SMTP_*` para verificación/recuperación.

## Buenas Prácticas (2025)
- Cookies: `HttpOnly`, `Secure` en producción, `SameSite=Lax`.
- Rate limiting en login/registro.
- Validación con `zod` en inputs de formularios y APIs.
- Headers de seguridad (CSP, HSTS, X-Content-Type-Options) vía `next.config.ts`.
- Minimizar fuga de datos en logs; no loguear secretos.
- Chequeos de rol solo en servidor; nunca confiar en UI.
- Rotación de tokens y expiración corta en sesiones sensibles.
- Política de contraseñas robusta y bloqueo por intentos.

## Modelo de Datos
- Adapter Better Auth (Drizzle) generará/esperará tablas de usuarios/sesiones/tokens.
- `users` extendida con `role` (`admin|dev|client`), `name`.
- `discounts` (nueva): `id`, `code`, `name`, `type (percentage|fixed|bogo)`, `value`, `startsAt`, `endsAt`, `active`.
- Relaciones opcionales: `discount_products` (N:M con `products`) / `discount_collections`.
- `analytics_events` (nueva) para trazabilidad: `id`, `type ('view_product'|'add_to_cart'|'purchase')`, `productId`, `variantId`, `createdAt`, `metadata`.

## Flujo de Autenticación (Email/Password)
- Registro: `email`, `password` (≥8, complejidad), `name`, `role` por defecto `client`.
- Inicio de sesión: crea cookie HttpOnly usando Better Auth.
- Cierre de sesión: invalidar sesión.
- Recuperación de contraseña: token temporal por email.
- Verificación de email: recomendado en producción.
- Hashing: Web Crypto `PBKDF2` con sal aleatoria y parámetros versionados.

## Integración en Next.js 15
- Handlers de API Better Auth en `app/api/auth/[...path]/route.ts`.
- Cliente Better Auth para RSC: `getSession()` y acciones.
- Middleware (`middleware.ts`) para `/panel-de-control` y `/api/admin/*`:
  - Redirigir a `/auth/login` si no hay sesión.
  - Permitir solo `admin/dev`.
- Server Actions para CRUD con verificación de rol en servidor.

## Control de Acceso y UI Condicional
- Header (`components/layout/navbar/index.tsx:13`):
  - Añadir enlace “Panel de Control” solo si `role` ∈ {`admin`,`dev`}.
- PDP (`components/product/product-description.tsx:8`):
  - Botón “Editar” condicionado a `admin/dev`; navegación a edición.
- Toasts llamativos (sonner) por bajo stock:
  - Umbral configurable (p.ej. ≤2 unidades) en la variante seleccionada; mostrar advertencia.

## Panel de Control (`/panel-de-control`)
- Layout con la paleta y tipografías existentes.
- Secciones:
  - Usuarios: listar, crear, actualizar (nombre, email, role), borrar.
  - Artículos: CRUD productos/variantes/imágenes.
  - Descuentos: CRUD y asociaciones.
  - Analytics: gráficas de tendencia (líneas/ barras) basadas en `analytics_events`.
- Arquitectura:
  - Server Components + formularios/acciones.
  - APIs bajo `/app/api/admin/*` (solo `admin/dev`).

## Seguridad
- Cookies seguras y cifradas.
- Rate limiting.
- Validación `zod`.
- Headers de seguridad.
- Auditoría opcional de cambios en usuarios/roles/discounts.

## Migraciones (Drizzle)
- Tablas de auth (adapter Better Auth) y `users.role`.
- Crear `discounts`, relaciones y `analytics_events`.
- Seeds:
  - `admin`, `dev`, `client` de prueba.
  - Descuentos de ejemplo.

## Rutas y Estructura Propuesta
- Autenticación:
  - `/auth/login`, `/auth/register`, `/auth/forgot-password`.
- Panel de Control:
  - `/panel-de-control`, `/panel-de-control/usuarios`, `/panel-de-control/articulos`, `/panel-de-control/descuentos`, `/panel-de-control/analytics`.
- APIs:
  - `/app/api/auth/[...path]/route.ts` (Better Auth).
  - `/app/api/admin/users/*`, `/app/api/admin/products/*`, `/app/api/admin/discounts/*`, `/app/api/admin/analytics/*`.

## Métricas de Ecommerce
- Ventas y tendencias por periodo (si no hay órdenes, preparar estructura y usar eventos proxy: `add_to_cart`/`view_product`).
- Stock por variante y alertas de bajo stock.
- Top productos por eventos.

## Estética y UX
- Reutilizar `OverlayLink`, fuentes `Cormorant`/`Inter` y estilos hover del menú.
- Feedback con `sonner` (toasts) y `LoadingOverlayProvider`.
- Gráficas con librería ligera o componentes propios (evitar dependencias pesadas si no son necesarias).

## Consideraciones y Recomendaciones
- Vincular carrito anónimo al usuario al iniciar sesión (opcional), manteniendo compatibilidad.
- Verificación de email en producción.
- Documentar procesos de cambio de rol (solo `admin`).
- Versionar parámetros de hashing (iteraciones/sal) para upgrades futuros.

## Plan de Trabajo (Fases)
1. Instalar Better Auth + adapter; configurar env y Web Crypto hasher.
2. Migraciones Drizzle: auth, `users.role`, `discounts`, `analytics_events`; seeds.
3. Handlers de API y páginas `/auth/*`.
4. Middleware y guards de rol.
5. UI condicional: Navbar y PDP (Editar + toasts de stock).
6. Implementación del Panel y CRUDs + sección Analytics.
7. Pruebas, validación y ajustes visuales.

## Validación
- Usuarios `admin`, `dev`, `client` de prueba.
- Verificar visibilidad del Panel y botón “Editar” según rol.
- Rutas protegidas para `client` y no logueados.
- Toasts de stock funcionando.
- Gráficas muestran tendencias basadas en `analytics_events`.
