import { Carousel } from "components/carousel";
import { ThreeItemGrid } from "components/grid/three-items";
import Footer from "components/layout/footer";

// Revalidate the home page every 10 minutes to avoid hitting the DB on every request
export const revalidate = 600;

const { COMPANY_NAME, SITE_NAME } = process.env;

export const metadata = {
  description:
    "High-performance custom ecommerce store implemented by Diego M. Maldini Freyre.",
  openGraph: {
    type: "website",
  },
};

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
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
              <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-[#bf9d6d] font-cormorant tracking-wider leading-tight">
                Elegancia que se vive
                <br />
                <span className="text-2xl md:text-4xl lg:text-5xl font-light">
                  en casa
                </span>
              </h2>

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
        <div className="absolute bottom-1/3 right-6 w-2 h-2 bg-[#bf9d6d]/15 rounded-full animate-pulse delay-1000"></div>
      </section>

      {/* Product Grid - Debe aparecer después del texto */}
      <div className="flex-shrink-0">
        <ThreeItemGrid />
      </div>

      {/* Carousel - Debe aparecer después del grid */}
      <div className="flex-shrink-0">
        <Carousel />
      </div>

      <Footer companyName={COMPANY_NAME} siteName={SITE_NAME} />
    </div>
  );
}
