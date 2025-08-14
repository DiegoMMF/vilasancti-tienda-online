import { OverlayLink } from "components/ui/overlay-link";
import { getMenu } from "lib/api/menu-drizzle";

const { COMPANY_NAME, SITE_NAME } = process.env;

export default async function Footer() {
  const currentYear = new Date().getFullYear();
  const copyrightDate = 2025 + (currentYear > 2025 ? `-${currentYear}` : "");
  const skeleton = "w-full h-6 animate-pulse rounded-sm bg-[#bf9d6d]/20";
  const menu = await getMenu("next-js-frontend-footer-menu");
  const copyrightName = COMPANY_NAME || SITE_NAME || "";

  return (
    <footer className="bg-[#f0e3d7]/50 border-t border-[#bf9d6d]/20">
      {/* Sección principal del footer */}
      <div className="mx-auto max-w-7xl px-6 py-20 md:px-4 min-[1320px]:px-0 lg:py-32">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {/* Logo y descripción */}
          <div className="space-y-4">
            <OverlayLink className="inline-block" href="/">
              <div className="text-3xl font-bold uppercase text-[#bf9d6d] tracking-wide font-cormorant">
                VILASANCTI
              </div>
            </OverlayLink>
            <p className="text-sm text-[#bf9d6d]/80 font-inter leading-relaxed">
              Descubre la elegancia y el confort en nuestra colección de
              pijamas. Diseñados con los mejores materiales para brindarte una
              experiencia única de descanso y estilo.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-[#bf9d6d] hover:text-[#f0e3d7] hover:bg-[#bf9d6d] p-2 rounded-md transition-all duration-200"
              >
                <span className="sr-only">Instagram</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-[#bf9d6d] hover:text-[#f0e3d7] hover:bg-[#bf9d6d] p-2 rounded-md transition-all duration-200"
              >
                <span className="sr-only">Facebook</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="#"
                className="text-[#bf9d6d] hover:text-[#f0e3d7] hover:bg-[#bf9d6d] p-2 rounded-md transition-all duration-200"
              >
                <span className="sr-only">WhatsApp</span>
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                </svg>
              </a>
            </div>
          </div>

          {/* Enlaces rápidos */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#bf9d6d] font-cormorant">
              Enlaces Rápidos
            </h3>
            <ul className="space-y-2">
              <li>
                <OverlayLink
                  href="/"
                  className="text-sm text-[#bf9d6d]/80 hover:text-[#f0e3d7] hover:bg-[#bf9d6d] hover:no-underline px-2 py-1 rounded-md transition-all duration-200 font-inter"
                >
                  Inicio
                </OverlayLink>
              </li>
              <li>
                <OverlayLink
                  href="/search"
                  className="text-sm text-[#bf9d6d]/80 hover:text-[#f0e3d7] hover:bg-[#bf9d6d] hover:no-underline px-2 py-1 rounded-md transition-all duration-200 font-inter"
                >
                  Todos los Productos
                </OverlayLink>
              </li>
              <li>
                <OverlayLink
                  href="/search/piyamas"
                  className="text-sm text-[#bf9d6d]/80 hover:text-[#f0e3d7] hover:bg-[#bf9d6d] hover:no-underline px-2 py-1 rounded-md transition-all duration-200 font-inter"
                >
                  Pijamas
                </OverlayLink>
              </li>
              <li>
                <OverlayLink
                  href="/search/novedades"
                  className="text-sm text-[#bf9d6d]/80 hover:text-[#f0e3d7] hover:bg-[#bf9d6d] hover:no-underline px-2 py-1 rounded-md transition-all duration-200 font-inter"
                >
                  Novedades
                </OverlayLink>
              </li>
            </ul>
          </div>

          {/* Información de contacto */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#bf9d6d] font-cormorant">
              Contacto
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <svg
                  className="h-5 w-5 text-[#bf9d6d] mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                <div>
                  <p className="text-sm text-[#bf9d6d]/80 font-inter">
                    Buenos Aires, Argentina
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <svg
                  className="h-5 w-5 text-[#bf9d6d] mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <div>
                  <p className="text-sm text-[#bf9d6d]/80 font-inter">
                    info@vilasancti.com
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <svg
                  className="h-5 w-5 text-[#bf9d6d] mt-0.5 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <div>
                  <p className="text-sm text-[#bf9d6d]/80 font-inter">
                    +54 11 1234-5678
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#bf9d6d] font-cormorant">
              Newsletter
            </h3>
            <p className="text-sm text-[#bf9d6d]/80 font-inter">
              Suscríbete para recibir las últimas novedades y ofertas
              exclusivas.
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Tu email"
                className="w-full px-4 py-2 border border-[#bf9d6d]/20 bg-[#f0e3d7] text-[#bf9d6d] placeholder:text-[#bf9d6d]/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#bf9d6d]/20 font-inter"
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-[#bf9d6d] text-[#f0e3d7] rounded-lg hover:bg-[#bf9d6d]/90 transition-colors font-inter font-medium"
              >
                Suscribirse
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Sección inferior */}
      <div className="border-t border-[#bf9d6d]/20 py-6">
        <div className="mx-auto max-w-7xl px-6 md:px-4 min-[1320px]:px-0">
          <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
            <div className="flex flex-col items-center gap-2 md:flex-row md:gap-6">
              <p className="text-sm text-[#bf9d6d]/80 font-inter">
                &copy; {copyrightDate} {copyrightName}
                {copyrightName.length && !copyrightName.endsWith(".")
                  ? "."
                  : ""}{" "}
                Todos los derechos reservados.
              </p>
              <div className="flex space-x-4 text-sm">
                <a
                  href="#"
                  className="text-[#bf9d6d]/80 hover:text-[#bf9d6d] transition-colors font-inter"
                >
                  Términos y Condiciones
                </a>
                <a
                  href="#"
                  className="text-[#bf9d6d]/80 hover:text-[#bf9d6d] transition-colors font-inter"
                >
                  Política de Privacidad
                </a>
                <a
                  href="#"
                  className="text-[#bf9d6d]/80 hover:text-[#bf9d6d] transition-colors font-inter"
                >
                  Envíos y Devoluciones
                </a>
              </div>
            </div>
            <div className="text-sm text-[#bf9d6d]/60 font-inter">
              <span className="font-cormorant text-[#bf9d6d]">
                Desarrollado por Diego M. Maldini Freyre
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
