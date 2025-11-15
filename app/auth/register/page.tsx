import { redirect } from "next/navigation";
import { db } from "lib/db";
import { users } from "lib/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword } from "lib/security/password";
import { z } from "zod";

async function register(formData: FormData) {
  "use server";
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  const schema = z
    .object({
      name: z.string().min(2),
      email: z.string().email(),
      password: z
        .string()
        .min(8)
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/),
      confirm: z.string(),
    })
    .refine((d) => d.password === d.confirm);
  const parsed = schema.safeParse({ name, email, password, confirm });
  if (!parsed.success) return;
  const exists = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (exists.length) return;
  const passwordHash = await hashPassword(password);
  await db.insert(users).values({ email, passwordHash, name, role: "client" });
  redirect("/auth/login");
}

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-lg border border-[#bf9d6d]/20 bg-[#f0e3d7]/95 p-8">
        <h1 className="text-3xl font-medium text-[#bf9d6d] font-cormorant">Crear cuenta</h1>
        <form action={register} className="mt-6 space-y-4">
          <input name="name" type="text" placeholder="Nombre" className="w-full rounded-md border border-[#bf9d6d]/20 bg-[#f0e3d7] px-3 py-2 text-[#bf9d6d] font-inter" required />
          <input name="email" type="email" placeholder="Correo" className="w-full rounded-md border border-[#bf9d6d]/20 bg-[#f0e3d7] px-3 py-2 text-[#bf9d6d] font-inter" required />
          <input name="password" type="password" placeholder="Contraseña" className="w-full rounded-md border border-[#bf9d6d]/20 bg-[#f0e3d7] px-3 py-2 text-[#bf9d6d] font-inter" required />
          <input name="confirm" type="password" placeholder="Confirmar contraseña" className="w-full rounded-md border border-[#bf9d6d]/20 bg-[#f0e3d7] px-3 py-2 text-[#bf9d6d] font-inter" required />
          <button type="submit" className="w-full text-[#bf9d6d] px-4 py-2 rounded-md transition-all duration-200 hover:text-[#f0e3d7] hover:bg-[#bf9d6d] font-inter">Registrarme</button>
        </form>
      </div>
    </div>
  );
}