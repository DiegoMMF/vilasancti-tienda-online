import type { Page } from "../types";

export async function getPage(handle: string): Promise<Page | undefined> {
  // Por ahora, retornamos undefined para que se muestre la página 404
  // En el futuro, esto podría venir de la base de datos
  return undefined;
}
