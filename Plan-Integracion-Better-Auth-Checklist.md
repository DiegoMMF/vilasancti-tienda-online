# Checklist de Implementación Better Auth y Panel de Control

## Preparación y seguridad
- [x] Crear este checklist y organizar fases y entregables
- [ ] Instalar `better-auth` y adapter Drizzle
- [ ] Configurar variables de entorno (`BETTER_AUTH_SECRET`, `EMAIL_FROM`, `SMTP_*` opcional)
- [x] Implementar util de hashing con Web Crypto API (PBKDF2 + SHA-256)
- [ ] Integrar util de hashing en registro/login de Better Auth
- [ ] Añadir rate limiting a endpoints de login/registro
- [ ] Añadir validaciones `zod` en formularios y APIs
- [ ] Configurar headers de seguridad (CSP, HSTS, X-Content-Type-Options)

## Base de datos (Drizzle)
- [x] Definir tabla `users` con campo `role` (`admin|dev|client`)
- [x] Definir tabla `discounts` con campos y activación por periodo
- [x] Definir tabla `analytics_events` para trazabilidad de vistas, carrito y compras
- [ ] Generar migraciones y ejecutar en la base de datos
- [ ] Crear seeds: usuarios `admin`, `dev`, `client` y descuentos de ejemplo

## Autenticación (Better Auth)
- [ ] Crear handlers en `app/api/auth/[...path]/route.ts`
- [ ] Configurar cliente para obtener sesión en RSC
- [x] Implementar páginas `/auth/login`, `/auth/register`
- [ ] Habilitar verificación de email y recuperación de contraseña

## Control de acceso
- [x] Crear util `getSessionRole` con estructura preparada para integración
- [ ] Implementar `middleware.ts` para proteger `/panel-de-control` y `/api/admin/*`
- [ ] Verificar acceso solo para `admin` y `dev`

## UI condicional
- [x] Mostrar enlace “Panel de Control” en el header solo para `admin`/`dev`
- [x] Mostrar botón “Editar” en PDP solo para `admin`/`dev`
- [x] Mostrar toasts de bajo stock al seleccionar variantes con stock bajo
- [x] Añadir botones de Login/Logout en el header según sesión

## Panel de Control
- [x] Crear ruta `/panel-de-control` con estructura inicial
- [ ] Implementar sección CRUD de usuarios
- [ ] Implementar sección CRUD de artículos (productos/variantes/imágenes)
- [ ] Implementar sección CRUD de descuentos y asociaciones
- [ ] Implementar sección Analytics con gráficas de tendencias

## Validación
- [ ] Crear usuarios de prueba y validar visibilidad del Panel y botón “Editar” por rol
- [ ] Validar protección de rutas y APIs
- [ ] Validar toasts de stock y datos de `analytics_events`

## Notas
- Hashing en Edge con Web Crypto API según MDN.
- Mantener estética: paleta, tipografías y componentes existentes.