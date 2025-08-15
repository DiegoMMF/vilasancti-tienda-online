import Footer from "components/layout/footer";

const { COMPANY_NAME, SITE_NAME } = process.env;

export const metadata = {
  title: "Nuestra Historia | Vilasancti",
  description:
    "Descubre la historia detrás de VILASANCTI, un proyecto de madre e hija inspirado en el amor por la elegancia y la feminidad.",
};

export default function NuestraHistoriaPage() {
  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-[#f0e3d7] to-[#f0e3d7]/80">
        {/* Hero Section */}
        <div className="relative overflow-hidden">
          <div className="relative mx-auto max-w-4xl px-6 py-20 lg:py-32">
            {/* Título Principal */}
            <div className="text-center mb-16">
              <h1 className="text-5xl md:text-7xl font-bold text-[#bf9d6d] font-cormorant mb-6 tracking-wide">
                Nuestra Historia
              </h1>
              <div className="w-24 h-1 bg-[#bf9d6d]/30 mx-auto rounded-full"></div>
            </div>

            {/* Contenido Principal */}
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-8 md:p-12 shadow-xl border border-[#bf9d6d]/10">
              <div className="max-w-3xl mx-auto space-y-8">
                {/* Primer párrafo */}
                <div className="text-center">
                  <p className="text-xl md:text-2xl text-[#bf9d6d]/90 font-inter leading-relaxed font-medium">
                    <span className="text-3xl md:text-4xl font-bold text-[#bf9d6d] font-cormorant">
                      VILASANCTI
                    </span>{" "}
                    es un proyecto de madre e hija inspirado en el amor por la
                    elegancia y la feminidad.
                  </p>
                </div>

                {/* Separador decorativo */}
                <div className="flex justify-center">
                  <div className="w-16 h-px bg-gradient-to-r from-transparent via-[#bf9d6d]/40 to-transparent"></div>
                </div>

                {/* Segundo párrafo */}
                <div className="text-center">
                  <p className="text-lg md:text-xl text-[#bf9d6d]/80 font-inter leading-relaxed">
                    Seleccionamos cuidadosamente cada prenda, priorizando
                    calidad, diseño y confort, para que en tu hogar y en tus
                    momentos de descanso te sientas tan hermosa y segura como en
                    cualquier ocasión especial.
                  </p>
                </div>

                {/* Separador decorativo */}
                <div className="flex justify-center">
                  <div className="w-12 h-px bg-gradient-to-r from-transparent via-[#bf9d6d]/30 to-transparent"></div>
                </div>

                {/* Tercer párrafo */}
                <div className="text-center">
                  <p className="text-lg md:text-xl text-[#bf9d6d]/80 font-inter leading-relaxed">
                    Aquí encontrarás pijamas que realzan tu belleza y transmiten
                    distinción, porque creemos que la elegancia también se vive
                    en casa.
                  </p>
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
