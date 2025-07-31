# 🚀 Migración de Shopify a Vercel Blob + Base de Datos Local

Este documento describe la migración completa del proyecto de Shopify a una solución personalizada usando Vercel Blob para imágenes y una base de datos local con Prisma.

## 📋 Resumen de Cambios

### ✅ Lo que se mantiene (100% reutilizado):
- **UI completa**: Todos los componentes de React
- **Sistema de carrito optimista**: Context y hooks
- **Páginas y rutas**: Estructura de navegación
- **Estilos**: Tailwind CSS y diseño
- **Tipos de datos**: Compatibilidad total

### 🔄 Lo que se reemplaza:
- **Backend**: Shopify GraphQL → Prisma + SQLite
- **Imágenes**: Shopify CDN → Vercel Blob
- **Carrito**: Shopify Cart → Base de datos local
- **Variables de entorno**: Configuración personalizada

## 🛠️ Instalación y Configuración

### 1. Instalar Dependencias
```bash
pnpm install
```

### 2. Configurar Variables de Entorno
Copia `env.example` a `.env.local` y configura:

```env
# Database
DATABASE_URL="file:./dev.db"

# Vercel Blob (obtener desde Vercel Dashboard)
BLOB_READ_WRITE_TOKEN="your_vercel_blob_token_here"

# App Configuration
SITE_NAME="Vilasancti Tienda"
COMPANY_NAME="Vilasancti"
```

### 3. Configurar Base de Datos
```bash
# Generar cliente de Prisma
pnpm db:generate

# Crear y migrar base de datos
pnpm db:push

# Poblar con datos de ejemplo
pnpm db:seed
```

### 4. Configurar Vercel Blob
1. Ve a [Vercel Dashboard](https://vercel.com/dashboard)
2. Crea un nuevo proyecto o usa el existente
3. Ve a Storage → Blob
4. Copia el token de acceso
5. Agrégalo a tus variables de entorno

## 🏗️ Estructura de la Nueva Implementación

```
lib/
├── api/
│   ├── products.ts      # API de productos
│   └── cart.ts         # API del carrito
├── blob.ts             # Integración con Vercel Blob
├── db.ts              # Configuración de Prisma
└── types.ts           # Tipos compatibles con UI existente

prisma/
└── schema.prisma      # Esquema de base de datos

scripts/
└── seed.ts           # Datos de ejemplo
```

## 🔄 Migración de Datos

### Opción 1: Usar Datos de Ejemplo
El script `seed.ts` incluye productos de ejemplo que puedes usar para probar:

```bash
pnpm db:seed
```

### Opción 2: Migrar desde Shopify
Para migrar datos existentes de Shopify:

1. Exporta productos desde Shopify Admin
2. Convierte el formato CSV/JSON al formato de Prisma
3. Ejecuta las consultas de inserción

## 🚀 Despliegue

### Desarrollo Local
```bash
pnpm dev
```

### Producción en Vercel
1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno en Vercel Dashboard
3. Despliega automáticamente

## 📊 Ventajas de la Nueva Implementación

### 💰 Costos Reducidos
- **Sin comisiones de Shopify** (3-5% por transacción)
- **Vercel Blob**: $0.40/GB/mes (muy económico)
- **Base de datos**: Gratis para desarrollo, bajo costo en producción

### 🎯 Control Total
- **Backend personalizado**: Lógica de negocio a medida
- **Datos locales**: Sin dependencia de terceros
- **Escalabilidad**: Control total sobre el rendimiento

### 🔧 Flexibilidad
- **Funcionalidades personalizadas**: Sin limitaciones de Shopify
- **Integraciones**: Cualquier API o servicio
- **Personalización**: UI y UX completamente personalizables

## 🐛 Solución de Problemas

### Error de Base de Datos
```bash
# Regenerar cliente de Prisma
pnpm db:generate

# Resetear base de datos
rm dev.db
pnpm db:push
pnpm db:seed
```

### Error de Vercel Blob
1. Verifica que `BLOB_READ_WRITE_TOKEN` esté configurado
2. Asegúrate de que el token tenga permisos de lectura/escritura
3. Verifica la conectividad de red

### Error de Tipos
```bash
# Regenerar tipos de TypeScript
pnpm build
```

## 📈 Próximos Pasos

### Funcionalidades Adicionales
- [ ] Panel de administración para productos
- [ ] Sistema de usuarios y autenticación
- [ ] Integración con pasarelas de pago
- [ ] Sistema de reseñas y calificaciones
- [ ] Búsqueda avanzada con filtros

### Optimizaciones
- [ ] Cache de imágenes con Next.js Image
- [ ] Optimización de consultas de base de datos
- [ ] CDN personalizado para mejor rendimiento
- [ ] Sistema de caché con Redis

## 🤝 Contribución

Para contribuir al proyecto:

1. Fork el repositorio
2. Crea una rama para tu feature
3. Implementa los cambios
4. Ejecuta las pruebas
5. Envía un pull request

## 📞 Soporte

Si tienes problemas con la migración:

1. Revisa este documento
2. Consulta los logs de error
3. Verifica la configuración de variables de entorno
4. Abre un issue en el repositorio

---

**¡La migración está completa!** 🎉 Tu tienda ahora usa Vercel Blob y una base de datos local, manteniendo toda la UI original pero con control total sobre el backend. 