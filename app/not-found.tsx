import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Página no encontrada | Vilasancti",
  description:
    "La página que buscas no existe. Encuentra pijamas elegantes en nuestras colecciones principales.",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <div className="not-found-page min-h-screen flex items-center justify-center bg-[#f0e3d7]">
      <div className="text-center max-w-2xl mx-auto px-6">
        <h1 className="text-4xl md:text-6xl font-bold text-[#bf9d6d] font-cormorant mb-6">
          Página no encontrada
        </h1>
        <p className="text-lg text-[#bf9d6d]/80 mb-12">
          Lo sentimos, la página que buscas no existe o ha sido movida.
        </p>

        {/* Enlaces de rescate SEO */}
        <div className="rescue-links mb-12">
          <h2 className="text-2xl font-bold text-[#bf9d6d] font-cormorant mb-6">
            ¿Tal vez buscabas?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href="/category/lisos"
              className="block p-4 bg-white/30 backdrop-blur-sm rounded-lg border border-[#bf9d6d]/10 hover:bg-white/40 transition-colors"
            >
              <h3 className="text-lg font-semibold text-[#bf9d6d] mb-2">
                Pijamas Lisos
              </h3>
              <p className="text-sm text-[#bf9d6d]/70">
                Diseños elegantes y minimalistas
              </p>
            </Link>
            <Link
              href="/category/estampados"
              className="block p-4 bg-white/30 backdrop-blur-sm rounded-lg border border-[#bf9d6d]/10 hover:bg-white/40 transition-colors"
            >
              <h3 className="text-lg font-semibold text-[#bf9d6d] mb-2">
                Pijamas Estampados
              </h3>
              <p className="text-sm text-[#bf9d6d]/70">
                Diseños únicos y coloridos
              </p>
            </Link>
            <Link
              href="/category/cortos"
              className="block p-4 bg-white/30 backdrop-blur-sm rounded-lg border border-[#bf9d6d]/10 hover:bg-white/40 transition-colors"
            >
              <h3 className="text-lg font-semibold text-[#bf9d6d] mb-2">
                Pijamas Cortos
              </h3>
              <p className="text-sm text-[#bf9d6d]/70">Comodidad y frescura</p>
            </Link>
            <Link
              href="/category/largos"
              className="block p-4 bg-white/30 backdrop-blur-sm rounded-lg border border-[#bf9d6d]/10 hover:bg-white/40 transition-colors"
            >
              <h3 className="text-lg font-semibold text-[#bf9d6d] mb-2">
                Pijamas Largos
              </h3>
              <p className="text-sm text-[#bf9d6d]/70">Elegancia y cobertura</p>
            </Link>
          </div>
        </div>

        {/* Enlaces a páginas principales */}
        <nav className="main-nav">
          <div className="flex flex-wrap justify-center gap-6">
            <Link
              href="/"
              className="text-[#bf9d6d] hover:text-[#bf9d6d]/80 transition-colors font-medium"
            >
              Inicio
            </Link>
            <Link
              href="/nuestra-historia"
              className="text-[#bf9d6d] hover:text-[#bf9d6d]/80 transition-colors font-medium"
            >
              Nuestra Historia
            </Link>
            <Link
              href="/envios-y-devoluciones"
              className="text-[#bf9d6d] hover:text-[#bf9d6d]/80 transition-colors font-medium"
            >
              Envíos y Devoluciones
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}
