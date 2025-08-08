### Migración a Postgres (Render) para Vilasancti Tienda Online

Este documento describe un plan de acción detallado para migrar la base de datos del proyecto desde SQLite (desarrollo) a Postgres gestionado en Render, manteniendo Prisma como ORM. Incluye alternativas (Drizzle), checklist, consideraciones de rendimiento/seguridad, migración de datos y plan de rollback.

## Recomendación ORM

- Prisma 5 (recomendado):
  - Ventajas: ya está integrado en el proyecto, esquema definido, includes/relaciones complejas listas, DX excelente, migraciones declarativas, tooling (`db:push`, `migrate`).
  - Ajustes mínimos: cambiar `provider` a `postgresql`, crear migraciones, actualizar `DATABASE_URL`.
  - Conexión en serverless: usar Connection Pool de Render o Prisma Accelerate.

- Drizzle (alternativa):
  - Ventajas: cliente ligero, SQL-first, buen rendimiento en edge/serverless, migraciones simples y rápidas.
  - Coste de cambio: reescritura de `lib/api/*.ts` (consultas y relaciones), setup de migraciones, validación funcional completa. Recomendable sólo si se busca un modelo SQL-first o un footprint de cliente menor.

Conclusión: mantener Prisma para la migración a Postgres. Evaluar Drizzle en una fase posterior si surgen necesidades específicas (edge intensivo, menor tamaño del cliente, SQL-first).

## Objetivos

1. Aprovisionar Postgres en Render (con Connection Pool y SSL).
2. Actualizar el proyecto para apuntar a Postgres y ejecutar migraciones.
3. Sembrar datos de ejemplo (o migrar datos reales si aplica).
4. Asegurar el correcto funcionamiento (local y en producción), con pooling.
5. Establecer backups, observabilidad y plan de rollback.

## Requisitos previos

- Cuenta en Render con acceso para crear una base de datos Postgres.
- Acceso al repositorio y a las variables de entorno del entorno de despliegue (p. ej., Vercel/Render).
- Node 20+, pnpm.

## Cambios en el proyecto (código y configuración)

1) Actualizar `prisma/schema.prisma` para Postgres

- Cambiar el datasource:
  - De: `provider = "sqlite"`
  - A: `provider = "postgresql"`

- (Opcional recomendado) Precios en Decimal:
  - Actualmente `ProductVariant.price` es `Float`. Para evitar errores de redondeo en Postgres, considerar cambiar a `Decimal` y mapear a `NUMERIC(10,2)`:
    - `price Decimal @db.Decimal(10,2)`
  - Si se cambia, actualizar seeding y cálculos que convierten a string.

- Verificar mapeos y constraints:
  - Claves únicas (`handle`) y compuestas (tabla puente `ProductCollection`) ya están definidas; Postgres las respetará.
  - Índices opcionales (ver sección Rendimiento).

2) Migraciones y cliente Prisma

- Generar cliente y crear migraciones:
  - `pnpm db:generate`
  - `npx prisma migrate dev --name init_postgres` (local apuntando a Postgres o `migrate deploy` en producción)

- En entornos CI/CD/producción: usar `npx prisma migrate deploy`.

3) Variables de entorno

- Establecer `DATABASE_URL` con la cadena de Render (si hay Connection Pool habilitado, usar la URL del pool):

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DBNAME?sslmode=require"
```

- Mantener `BLOB_READ_WRITE_TOKEN`, `SITE_NAME`, `COMPANY_NAME`, etc.

- Entornos separados:
  - `.env` para local
  - Variables en el panel del proveedor para producción (no commitear secretos).

4) Pooling de conexiones (imprescindible)

- Render: habilitar Connection Pool (PgBouncer) en la base de datos y usar la URL de Pool.
- Alternativa o complemento: [Prisma Accelerate] (pool HTTP gestionado). Requiere configurar Accelerate y usar el cliente extendido.

5) Seed de datos

- `scripts/seed.js` es compatible con Postgres vía Prisma. No requiere cambios si se mantienen tipos actuales.
- Si se migra `price` a Decimal, revisar conversiones (`toString()`).

## Aprovisionamiento en Render

1) Crear Base de Datos Postgres

- En el panel de Render, crear una nueva base de datos Postgres.
- Obtener credenciales: host, puerto, base, usuario, contraseña.
- Habilitar SSL (Render generalmente requiere `sslmode=require`).

2) Habilitar Connection Pool

- En la base de datos, activar el Pool de conexiones (PgBouncer) y copiar la URL específica del pool.
- Ajustar tamaño del pool según la concurrencia esperada.

3) Backups y retención

- Activar backups automáticos y revisar la política de retención adecuada al negocio.

## Migración de datos

Escenarios:

- Desarrollo (limpio):
  - Crear esquema con migraciones y ejecutar `pnpm db:seed`.

- Datos existentes en SQLite (poca relevancia / sólo demo):
  - Correr seed en Postgres y prescindir de los datos del SQLite.

- Datos existentes relevantes (producción):
  - Opción A (ETL simple con CSV): exportar tablas de SQLite a CSV y `\copy` en Postgres respetando el orden de FK (collections → products → variants → images → cart → cart_items → product_collections). Validar encoding y formatos.
  - Opción B (script Prisma): script Node que lea desde SQLite (nuevo `datasource` temporal) y escriba en Postgres (cliente principal). Útil si se requiere transformación.

Validaciones post-migración:

- Conteos por tabla (antes/después).
- Muestras aleatorias y consultas críticas (páginas de categoría, producto, carrito).

## Despliegue

- Si el frontend sigue en Vercel:
  - Definir `DATABASE_URL` (pool) en Vercel.
  - Ejecutar `prisma migrate deploy` en el proceso de build o en un step previo de deployment.
  - Confirmar que el runtime usa pool (evitar abrir conexiones por request).

- Si se despliega todo en Render:
  - Configurar servicio Web para Next.js (Build: `pnpm install && pnpm build`, Start: `pnpm start`).
  - Añadir variables de entorno (`DATABASE_URL`, etc.).
  - Asegurar que el `PORT` y `HOST` del servicio coincidan con lo que Render espera.

## Rendimiento y observabilidad

- Índices recomendados en Postgres:
  - `products.handle` (ya es `@unique` → índice único).
  - `collections.handle` (ya es `@unique`).
  - `product_collections (productId, collectionId)` (ya es `@@unique`).
  - (Opcional) Búsqueda por texto: si se intensifica la búsqueda por `title`/`description`, considerar `pg_trgm` y un índice `GIN` para `LIKE/ILIKE` o migrar a búsqueda dedicada (Orama/Meilisearch/Typesense).

- Pooling y límites:
  - Ajustar tamaño del pool para evitar saturación.
  - Monitorear errores de demasiadas conexiones.

- Observabilidad:
  - Activar logs de consultas lentas (a través de Prisma middleware o Postgres).
  - Métricas de Render: conexiones activas, CPU, I/O.

## Seguridad

- SSL obligatorio (`sslmode=require`).
- Rotación de contraseñas/credenciales al menos semestralmente.
- Principio de mínimo privilegio: un usuario por entorno.

## Plan de rollback

1. Mantener copia de seguridad (snapshot) previa a la migración.
2. Conservar el entorno SQLite de desarrollo como fallback temporal (no para producción).
3. Si algo falla tras migrar:
   - Revertir `DATABASE_URL` al origen anterior.
   - Ejecutar `migrate deploy` con la versión previa (si fuera necesario).
   - Restaurar backup en Postgres si hubo modificaciones parciales.

## Cronograma sugerido

1. Día 1–2: Aprovisionamiento Postgres Render + Pool + configuración de backups.
2. Día 2: Cambios en `schema.prisma`, migraciones y pruebas locales con Postgres.
3. Día 3: Migración de datos (si aplica) en un entorno staging + validación QA.
4. Día 4: Despliegue a producción, verificación de endpoints críticos, monitorización.

## Checklist operativo

- [ ] Postgres creado en Render con SSL y Connection Pool habilitado.
- [ ] Variables de entorno (`DATABASE_URL`) establecidas en producción.
- [ ] `schema.prisma` actualizado a `postgresql` (y `Decimal` en `price`, si se adopta).
- [ ] Migraciones generadas y aplicadas (`migrate deploy`).
- [ ] Seed ejecutado o datos migrados (con validaciones de conteo).
- [ ] App levantada en el entorno objetivo y rutas clave verificadas.
- [ ] Backups automáticos activos y probada una restauración rápida.
- [ ] Monitorización básica en Render habilitada.

## FAQ

**¿Seguir con Prisma o migrar a Drizzle?**

- Seguir con Prisma para minimizar riesgos y tiempos. Drizzle es excelente pero requiere reescritura. Si se prioriza footprint menor y SQL-first, planificar un cambio posterior.

**¿SQLite sólo para desarrollo?**

- Sí, fue la configuración elegida para facilitar el arranque local. En producción se recomienda Postgres/MySQL u otro motor gestionado. Prisma soporta múltiples proveedores, incluido Postgres.

**¿Pooling necesario en Vercel?**

- Sí. Usar Connection Pool de Render o Prisma Accelerate para evitar límites de conexión y mejorar estabilidad.

**¿Cambio de `Float` a `Decimal`?**

- Recomendado para precios en producción para evitar problemas de precisión.

---

Si necesitas, puedo preparar los cambios concretos en `schema.prisma`, variables de entorno y scripts de migración, y guiar la importación de datos desde SQLite a Postgres.


