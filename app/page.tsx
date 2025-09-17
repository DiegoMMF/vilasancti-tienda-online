import { Carousel } from "components/carousel";
import { ThreeItemGrid } from "components/grid/three-items";
import Footer from "components/layout/footer";
import PromotionalBanner from "components/promotional-banner";
import { Metadata } from "next";

const baseUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://vilasancti.vercel.app";

// Revalidate the home page every 10 minutes to avoid hitting the DB on every request
export const revalidate = 600;

const { COMPANY_NAME, SITE_NAME } = process.env;

export const metadata: Metadata = {
  title: "Vilasancti - Pijamas Elegantes | Elegancia que se vive en casa",
  description:
    "Descubre nuestra colección de pijamas elegantes que realzan tu belleza y transmiten distinción. Envío a toda la Argentina. ¡Compra ahora!",
  keywords: [
    "pijamas elegantes",
    "pijamas mujer",
    "sleepwear",
    "moda femenina",
    "tienda online pijamas",
    "Vilasancti",
    "Argentina",
  ],
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    type: "website",
    title: "Vilasancti - Pijamas Elegantes",
    description:
      "Descubre nuestra colección de pijamas elegantes que realzan tu belleza y transmiten distinción. Envío a toda la Argentina.",
    images: [
      {
        url: `${baseUrl}/og-image.webp`,
        width: 1200,
        height: 630,
        alt: "VILASANCTI - Pijamas Elegantes",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vilasancti - Pijamas Elegantes",
    description:
      "Descubre nuestra colección de pijamas elegantes que realzan tu belleza y transmiten distinción. Envío a toda la Argentina.",
    images: [`${baseUrl}/og-image.webp`],
  },
};

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Banner Promocional */}
      <PromotionalBanner />

      {/* Hero Text Section - Diseño elegante y sofisticado */}
      <section className="relative py-16 lg:py-24 overflow-hidden">
        {/* Fondo con gradiente sutil */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#f0e3d7] via-[#f0e3d7]/95 to-[#f0e3d7]/90"></div>

        {/* Elementos decorativos de fondo */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-16 left-8 w-32 h-32 border border-[#bf9d6d]/8 rounded-full"></div>
          <div className="absolute top-32 right-12 w-24 h-24 border border-[#bf9d6d]/6 rounded-full"></div>
          <div className="absolute bottom-20 left-16 w-20 h-20 border border-[#bf9d6d]/10 rounded-full"></div>
          <div className="absolute bottom-32 right-8 w-16 h-16 border border-[#bf9d6d]/8 rounded-full"></div>
        </div>

        <div className="relative mx-auto max-w-4xl px-6">
          {/* Contenedor principal con efecto glassmorphism - 25% más pequeño */}
          <div className="bg-white/30 backdrop-blur-sm rounded-3xl p-6 md:p-12 border border-[#bf9d6d]/10 shadow-2xl">
            <div className="text-center space-y-6">
              {/* Separador decorativo superior */}
              <div className="flex justify-center mb-3">
                <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#bf9d6d]/30 to-transparent"></div>
              </div>

              {/* Título principal con tipografía elegante - 25% más pequeño */}
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-[#bf9d6d] font-cormorant tracking-wider leading-tight">
                Elegancia que se vive
                <br />
                <span className="text-2xl md:text-4xl lg:text-5xl font-light">
                  en casa
                </span>
              </h1>

              {/* Separador central */}
              <div className="flex justify-center items-center space-x-3">
                <div className="w-6 h-px bg-[#bf9d6d]/20"></div>
                <div className="w-1.5 h-1.5 bg-[#bf9d6d]/40 rounded-full"></div>
                <div className="w-6 h-px bg-[#bf9d6d]/20"></div>
              </div>

              {/* Texto descriptivo con mejor jerarquía - 25% más pequeño */}
              <div className="space-y-3 max-w-2xl mx-auto">
                <p className="text-base md:text-lg lg:text-xl text-[#bf9d6d]/85 font-inter font-medium leading-relaxed">
                  Pijamas que realzan tu belleza y transmiten distinción
                </p>
                <p className="text-sm md:text-base text-[#bf9d6d]/70 font-inter leading-relaxed italic">
                  Hermosa y elegante, en todo momento
                </p>
              </div>

              {/* Separador decorativo inferior */}
              <div className="flex justify-center mt-4">
                <div className="w-12 h-px bg-gradient-to-r from-transparent via-[#bf9d6d]/25 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Elementos decorativos flotantes */}
        <div className="absolute top-1/4 left-4 w-3 h-3 bg-[#bf9d6d]/20 rounded-full animate-pulse"></div>
        <div className="absolute top-1/3 right-8 w-2 h-2 bg-[#bf9d6d]/15 rounded-full animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-12 w-2.5 h-2.5 bg-[#bf9d6d]/25 rounded-full animate-pulse delay-500"></div>
      </section>

      {/* Grid de productos */}
      <section className="py-12 lg:py-16 bg-white/10">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-[#bf9d6d] font-cormorant text-center mb-8">
            Nuestras Colecciones
          </h2>
          <ThreeItemGrid />
        </div>
      </section>

      {/* Carrusel de productos destacados */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-[#bf9d6d] font-cormorant text-center mb-8">
            Productos Destacados
          </h2>
          <Carousel />
        </div>
      </section>

      {/* Sección de beneficios */}
      <section className="py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#bf9d6d]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-[#bf9d6d]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#bf9d6d] mb-2">
                Envío Gratis
              </h3>
              <p className="text-[#bf9d6d]/70">En toda Argentina</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#bf9d6d]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-[#bf9d6d]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#bf9d6d] mb-2">
                Calidad Premium
              </h3>
              <p className="text-[#bf9d6d]/70">Materiales de primera</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-[#bf9d6d]/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-[#bf9d6d]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-[#bf9d6d] mb-2">
                Diseño Elegante
              </h3>
              <p className="text-[#bf9d6d]/70">Estilo único y sofisticado</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
