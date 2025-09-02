import Footer from "components/layout/footer";
import { WhatsAppLink } from "components/ui/whatsapp-link";
import { Metadata } from "next";

const { COMPANY_NAME, SITE_NAME } = process.env;

export const metadata: Metadata = {
  title: "Envíos y Devoluciones | Vilasancti",
  description:
    "Información sobre envíos y devoluciones de VILASANCTI. Coordinamos todo vía WhatsApp para brindarte el mejor servicio.",
};

export default function EnviosYDevolucionesPage() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-[#f0e3d7] to-[#f0e3d7]/80">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="relative mx-auto max-w-4xl px-6 py-20 lg:py-32">
            {/* Título Principal */}
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-7xl font-bold text-[#bf9d6d] font-cormorant mb-6 tracking-wide">
                Envíos y Devoluciones
              </h1>
              <div className="w-24 h-1 bg-[#bf9d6d]/30 mx-auto rounded-full"></div>
            </div>

            {/* Contenido Principal */}
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-xl border border-[#bf9d6d]/10">
              <div className="max-w-3xl mx-auto space-y-8">
                {/* Primer párrafo */}
                <div className="text-center">
                  <p className="text-lg md:text-xl text-[#bf9d6d]/80 font-inter leading-relaxed">
                    Recién estamos comenzando y está en lista de espera la
                    organización de los envíos de forma automática.
                  </p>
                </div>

                {/* Separador decorativo */}
                <div className="flex justify-center">
                  <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#bf9d6d]/40 to-transparent"></div>
                </div>

                {/* Segundo párrafo */}
                <div className="text-center">
                  <p className="text-lg md:text-xl text-[#bf9d6d]/80 font-inter leading-relaxed">
                    Hasta entonces, los envíos y las devoluciones se coordinarán
                    vía WhatsApp con nosotras.
                  </p>
                </div>

                {/* Separador decorativo */}
                <div className="flex justify-center">
                  <div className="w-12 h-px bg-gradient-to-r from-transparent via-[#bf9d6d]/30 to-transparent"></div>
                </div>

                {/* Tercer párrafo */}
                <div className="text-center">
                  <p className="text-lg md:text-xl text-[#bf9d6d]/80 font-inter leading-relaxed">
                    Las devoluciones por talla correrán por cuenta del cliente.
                  </p>
                </div>

                {/* Separador decorativo */}
                <div className="flex justify-center">
                  <div className="w-12 h-px bg-gradient-to-r from-transparent via-[#bf9d6d]/30 to-transparent"></div>
                </div>

                {/* Sección de contacto */}
                <div className="text-center">
                  <p className="text-lg md:text-xl text-[#bf9d6d]/80 font-inter leading-relaxed mb-6">
                    Consultas a éste y otros respectos:
                  </p>

                  {/* Botón de WhatsApp con estética del modal de Diego */}
                  <div className="flex justify-center">
                    <WhatsAppLink
                      phoneNumber="5493544543637"
                      message="Hola!%0AMe%20han%20redirigido%20desde%20el%20sitio%20VILASANCTI%20porque%20quiero%20hacerte%20la%20siguiente%20consulta:%0A..."
                      className="flex items-center justify-center w-12 h-12 text-[#bf9d6d] hover:text-[#f0e3d7] hover:bg-[#bf9d6d] rounded-md transition-all duration-200"
                    >
                      <svg
                        className="h-7 w-7"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                      </svg>
                    </WhatsAppLink>
                  </div>
                </div>
              </div>
            </div>

            {/* Elementos decorativos */}
            <div className="absolute top-20 left-10 w-20 h-20 border border-[#bf9d6d]/20 rounded-full opacity-30"></div>
            <div className="absolute bottom-20 right-10 w-16 h-16 border border-[#bf9d6d]/20 rounded-full opacity-30"></div>
            <div className="absolute top-1/2 left-5 w-8 h-8 border border-[#bf9d6d]/20 rounded-full opacity-20"></div>
            <div className="absolute top-1/3 right-8 w-12 h-12 border border-[#bf9d6d]/20 rounded-full opacity-25"></div>
          </div>
        </div>
      </div>
      <Footer companyName={COMPANY_NAME} siteName={SITE_NAME} />
    </>
  );
}
