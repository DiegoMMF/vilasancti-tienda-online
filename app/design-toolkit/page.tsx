import Grid from "components/grid";
import { Carousel } from "components/carousel";
import { ThreeItemGrid } from "components/grid/three-items";
import ProductGridItems from "components/layout/product-grid-items";
import Label from "components/label";
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
    <main className="mx-auto max-w-(--breakpoint-2xl) px-4 py-10 space-y-16">
      {/* Tipografía */}
      <section>
        <h1 className="mb-2 text-4xl font-bold tracking-tight">Tipografía</h1>
        <p className="text-neutral-600 dark:text-neutral-300 mb-6">
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
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Small text
          </p>
        </div>
      </section>

      {/* Paleta de colores */}
      <section>
        <h2 className="mb-2 text-3xl font-semibold tracking-tight">
          Paleta de Colores
        </h2>
        <p className="text-neutral-600 dark:text-neutral-300 mb-6">
          Neutrales y estados. Asegurar contraste AA mínimo.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { name: "Neutral 50", cls: "bg-neutral-50 text-neutral-900" },
            { name: "Neutral 200", cls: "bg-neutral-200 text-neutral-900" },
            { name: "Neutral 800", cls: "bg-neutral-800 text-neutral-100" },
            { name: "Blue 600", cls: "bg-blue-600 text-white" },
            { name: "Red 600", cls: "bg-red-600 text-white" },
            { name: "Green 600", cls: "bg-green-600 text-white" },
          ].map((c) => (
            <div
              key={c.name}
              className={`rounded-lg border border-neutral-200 dark:border-neutral-800 p-4 ${c.cls}`}
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
          <button className="rounded-lg bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-blue-600">
            Primario
          </button>
          <button className="rounded-lg border border-neutral-200 px-4 py-2 text-neutral-800 transition hover:bg-neutral-100 dark:border-neutral-800 dark:text-neutral-200 dark:hover:bg-neutral-900">
            Secundario
          </button>
          <button
            className="rounded-lg bg-neutral-200 px-4 py-2 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200"
            disabled
          >
            Disabled
          </button>
          <input
            placeholder="Input de ejemplo"
            className="rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-blue-600 dark:border-neutral-800 dark:bg-black"
          />
          <select className="rounded-lg border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-blue-600 dark:border-neutral-800 dark:bg-black">
            <option>Opc 1</option>
            <option>Opc 2</option>
          </select>
          <Label title="Etiqueta" amount="199.00" currencyCode="USD" />
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
