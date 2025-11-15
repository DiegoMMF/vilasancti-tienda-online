import { cookies } from "next/headers";
import { db } from "lib/db";
import { sessions, users } from "lib/db/schema";
import { eq } from "drizzle-orm";

export type UserRole = "admin" | "dev" | "client";

export async function getSessionRole(): Promise<UserRole | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("vs_session")?.value;
  if (!token) return null;
  const s = await db.select().from(sessions).where(eq(sessions.token, token)).limit(1);
  if (!s.length) return null;
  const session = s[0];
  if (!session) return null;
  const u = await db.select({ role: users.role }).from(users).where(eq(users.id, session.userId)).limit(1);
  return (u[0]?.role as UserRole) ?? null;
}

export async function clearSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get("vs_session")?.value;
  if (token) {
    await db.delete(sessions).where(eq(sessions.token, token));
  }
  cookieStore.set("vs_session", "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 });
}
