import { getSessionRole } from "lib/auth/session";

export default async function PanelDeControlPage() {
  const role = await getSessionRole();
  const allowed = role === "admin" || role === "dev";
  if (!allowed) {
    return (
      <div className="mx-auto max-w-screen-2xl px-4 py-12">
        <div className="rounded-lg border border-[#bf9d6d]/20 bg-[#f0e3d7]/95 p-8">
          <h1 className="text-3xl font-medium text-[#bf9d6d] font-cormorant">Acceso restringido</h1>
          <p className="mt-4 text-[#bf9d6d] font-inter">Inicia sesión con una cuenta autorizada para acceder al Panel de Control.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-screen-2xl px-4 py-12">
      <div className="rounded-lg border border-[#bf9d6d]/20 bg-[#f0e3d7]/95 p-8">
        <h1 className="text-3xl font-medium text-[#bf9d6d] font-cormorant">Panel de Control</h1>
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-md border border-[#bf9d6d]/20 p-6">
            <h2 className="text-xl text-[#bf9d6d] font-cormorant">Usuarios</h2>
            <p className="mt-2 text-sm text-[#bf9d6d] font-inter">Crear, editar y borrar usuarios.</p>
          </div>
          <div className="rounded-md border border-[#bf9d6d]/20 p-6">
            <h2 className="text-xl text-[#bf9d6d] font-cormorant">Artículos</h2>
            <p className="mt-2 text-sm text-[#bf9d6d] font-inter">Gestionar productos, variantes e imágenes.</p>
          </div>
          <div className="rounded-md border border-[#bf9d6d]/20 p-6">
            <h2 className="text-xl text-[#bf9d6d] font-cormorant">Descuentos</h2>
            <p className="mt-2 text-sm text-[#bf9d6d] font-inter">Crear y administrar descuentos y asociaciones.</p>
          </div>
        </div>
        <div className="mt-8 rounded-md border border-[#bf9d6d]/20 p-6">
          <h2 className="text-xl text-[#bf9d6d] font-cormorant">Analytics</h2>
          <p className="mt-2 text-sm text-[#bf9d6d] font-inter">Gráficas de tendencias y eventos.</p>
        </div>
      </div>
    </div>
  );
}