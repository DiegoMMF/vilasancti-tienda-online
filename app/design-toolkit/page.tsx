import { Carousel } from "components/carousel";
import Grid from "components/grid";
import { ThreeItemGrid } from "components/grid/three-items";
import Label from "components/label";
import ProductGridItems from "components/layout/product-grid-items";
import { LoaderShowcase } from "components/ui/fullscreen-loaders";
import { getProducts } from "lib/api/products-drizzle";

export const metadata = {
  title: "Design Toolkit",
  description:
    "Muestrario de estilos, tipografías, colores y componentes disponibles.",
  robots: { index: false, follow: false },
  alternates: { canonical: "/design-toolkit" },
};

export const revalidate = 0; // siempre fresco durante desarrollo

export default async function DesignToolkitPage() {
  const products = await getProducts();
  const sampleProducts = products.slice(0, 6);

  return (
    <main className="mx-auto max-w-(--breakpoint-2xl) px-6 py-16 space-y-20 lg:px-12 lg:py-24">
      {/* Tipografía */}
      <section>
        <h1 className="mb-2 text-4xl font-bold tracking-tight">Tipografía</h1>
        <p className="text-[#bf9d6d] mb-6">
          Jerarquía tipográfica base usando Geist Sans.
        </p>
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">Heading 1</h1>
          <h2 className="text-3xl font-semibold tracking-tight">Heading 2</h2>
          <h3 className="text-2xl font-semibold tracking-tight">Heading 3</h3>
          <h4 className="text-xl font-semibold">Heading 4</h4>
          <h5 className="text-lg font-semibold">Heading 5</h5>
          <h6 className="text-base font-semibold">Heading 6</h6>
          <p className="text-base">Body text: tamaño y leading cómodos.</p>
          <p className="text-sm text-[#bf9d6d]">Small text</p>
        </div>
      </section>

      {/* Paleta de colores */}
      <section>
        <h2 className="mb-2 text-3xl font-semibold tracking-tight">
          Paleta de Colores
        </h2>
        <p className="text-[#bf9d6d] mb-6">
          Neutrales y estados. Asegurar contraste AA mínimo.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { name: "Beige Claro", cls: "bg-[#f0e3d7] text-[#bf9d6d]" },
            { name: "Marrón Dorado", cls: "bg-[#bf9d6d] text-[#f0e3d7]" },
            { name: "Beige Transparente", cls: "bg-[#f0e3d7]/50 text-[#bf9d6d]" },
            { name: "Marrón Transparente", cls: "bg-[#bf9d6d]/20 text-[#bf9d6d]" },
            { name: "Borde Sutil", cls: "bg-[#f0e3d7] border-[#bf9d6d]/20 text-[#bf9d6d]" },
            { name: "Hover", cls: "bg-[#bf9d6d] text-[#f0e3d7] hover:opacity-90" },
          ].map((c) => (
            <div
              key={c.name}
              className={`rounded-lg border border-[#bf9d6d]/20 p-4 ${c.cls}`}
            >
              <div className="text-sm font-medium">{c.name}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Botones y controles */}
      <section>
        <h2 className="mb-2 text-3xl font-semibold tracking-tight">
          Controles
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <button className="rounded-lg bg-[#bf9d6d] px-4 py-2 text-[#f0e3d7] transition hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#bf9d6d]">
            Primario
          </button>
          <button className="rounded-lg border border-[#bf9d6d]/20 px-4 py-2 text-[#bf9d6d] transition-all duration-200 hover:text-[#f0e3d7] hover:bg-[#bf9d6d] hover:no-underline">
            Secundario
          </button>
          <button
            className="rounded-lg bg-[#bf9d6d]/30 px-4 py-2 text-[#bf9d6d]/50"
            disabled
          >
            Disabled
          </button>
          <input
            placeholder="Input de ejemplo"
            className="rounded-lg border border-[#bf9d6d]/20 bg-[#f0e3d7] px-3 py-2 text-sm text-[#bf9d6d] outline-none focus:border-[#bf9d6d] placeholder:text-[#bf9d6d]/70"
          />
          <select className="rounded-lg border border-[#bf9d6d]/20 bg-[#f0e3d7] px-3 py-2 text-sm text-[#bf9d6d] outline-none focus:border-[#bf9d6d]">
            <option>Opc 1</option>
            <option>Opc 2</option>
          </select>
          <Label title="Etiqueta" amount="199.00" currencyCode="ARS" />
        </div>
      </section>

      {/* Componentes: Grid de productos */}
      <section>
        <h2 className="mb-2 text-3xl font-semibold tracking-tight">
          Tarjetas de Producto
        </h2>
        <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          <ProductGridItems products={sampleProducts} />
        </Grid>
      </section>

      {/* Componentes: ThreeItemGrid y Carousel */}
      <section className="space-y-10">
        <div>
          <h2 className="mb-2 text-3xl font-semibold tracking-tight">
            Three Item Grid
          </h2>
          <ThreeItemGrid />
        </div>
        <div>
          <h2 className="mb-2 text-3xl font-semibold tracking-tight">
            Carousel
          </h2>
          <Carousel />
        </div>
      </section>

      {/* Loaders de pantalla completa */}
      <LoaderShowcase />
    </main>
  );
}
