import { readFileSync } from "fs";
import { NextRequest } from "next/server";
import { join } from "path";

export async function GET(request: NextRequest) {
  const faviconPath = join(process.cwd(), "public", "favicon.png");
  const faviconBuffer = readFileSync(faviconPath);

  return new Response(faviconBuffer, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
