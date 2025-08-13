// Por ahora, no implementamos revalidación automática
// En el futuro, esto podría integrarse con nuestro sistema personalizado
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest): Promise<NextResponse> {
  // Por ahora, retornamos un éxito básico
  // En el futuro, esto podría implementar revalidación personalizada
  return NextResponse.json({ revalidated: true, now: Date.now() });
}
