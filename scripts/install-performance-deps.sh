#!/bin/bash

# Script para instalar dependencias de optimización de rendimiento

echo "🚀 Instalando dependencias para optimización de rendimiento..."

# Dependencias de desarrollo para optimización
echo "📦 Instalando dependencias de desarrollo..."

# PostCSS y optimizadores
pnpm add -D cssnano autoprefixer

# Herramientas de análisis de bundles
pnpm add -D @next/bundle-analyzer

# Herramientas de optimización de imágenes
pnpm add -D sharp

# Herramientas de análisis de rendimiento
pnpm add -D lighthouse

echo "✅ Dependencias instaladas correctamente!"

echo ""
echo "📋 Próximos pasos:"
echo "1. Ejecuta 'pnpm build' para construir con las nuevas optimizaciones"
echo "2. Ejecuta 'pnpm start' para probar en producción"
echo "3. Ejecuta Lighthouse para verificar las mejoras"
echo "4. Revisa el archivo PERFORMANCE_OPTIMIZATION.md para más detalles"
echo ""

echo "🎯 Optimizaciones implementadas:"
echo "   ✅ Configuración optimizada de Next.js"
echo "   ✅ Componente de imagen optimizada"
echo "   ✅ Hooks de lazy loading"
echo "   ✅ Precarga de recursos críticos"
echo "   ✅ Optimización de JavaScript"
echo "   ✅ Optimización de CSS"
echo "   ✅ Optimización de fuentes"
echo "   ✅ Configuración de PostCSS"
echo "   ✅ Configuración de Tailwind"
echo ""

echo "📊 Métricas esperadas después de las optimizaciones:"
echo "   • LCP: <2.5s (actual: 3.9s)"
echo "   • TBT: <300ms (actual: 1,010ms)"
echo "   • TTI: <3.5s (actual: 4.0s)"
echo "   • Puntuación general: >0.8 (actual: ~0.4)"
echo ""

echo "🔧 Para aplicar las optimizaciones en componentes existentes:"
echo "   1. Reemplaza las etiquetas <img> con <OptimizedImage>"
echo "   2. Usa los hooks de lazy loading para componentes pesados"
echo "   3. Implementa la precarga de recursos críticos"
echo "   4. Optimiza la carga de JavaScript no crítico"
echo ""

echo "📚 Documentación disponible en:"
echo "   • PERFORMANCE_OPTIMIZATION.md - Guía completa"
echo "   • Componentes en components/ui/"
echo "   • Hooks en lib/hooks/"
echo ""

echo "🎉 ¡Optimizaciones listas para implementar!"
