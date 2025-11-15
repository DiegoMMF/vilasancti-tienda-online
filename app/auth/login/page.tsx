import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "lib/db";
import { users, sessions } from "lib/db/schema";
import { eq } from "drizzle-orm";
import { verifyPassword } from "lib/security/password";
import { z } from "zod";

async function login(formData: FormData) {
  "use server";
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const schema = z.object({ email: z.string().email(), password: z.string().min(8) });
  const parsed = schema.safeParse({ email, password });
  if (!parsed.success) return;
  const u = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (!u.length) return;
  const ok = await verifyPassword(password, u[0].passwordHash);
  if (!ok) return;
  const tokenBytes = new Uint8Array(32);
  crypto.getRandomValues(tokenBytes);
  const token = Buffer.from(tokenBytes).toString("base64url");
  await db.insert(sessions).values({ token, userId: u[0].id });
  cookies().set("vs_session", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/" });
  redirect("/");
}

export default function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-12">
      <div className="rounded-lg border border-[#bf9d6d]/20 bg-[#f0e3d7]/95 p-8">
        <h1 className="text-3xl font-medium text-[#bf9d6d] font-cormorant">Iniciar sesión</h1>
        <form action={login} className="mt-6 space-y-4">
          <input name="email" type="email" placeholder="Correo" className="w-full rounded-md border border-[#bf9d6d]/20 bg-[#f0e3d7] px-3 py-2 text-[#bf9d6d] font-inter" required />
          <input name="password" type="password" placeholder="Contraseña" className="w-full rounded-md border border-[#bf9d6d]/20 bg-[#f0e3d7] px-3 py-2 text-[#bf9d6d] font-inter" required />
          <button type="submit" className="w-full text-[#bf9d6d] px-4 py-2 rounded-md transition-all duration-200 hover:text-[#f0e3d7] hover:bg-[#bf9d6d] font-inter">Entrar</button>
        </form>
      </div>
    </div>
  );
}