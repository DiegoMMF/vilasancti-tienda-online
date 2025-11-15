const subtle = globalThis.crypto?.subtle;

function toUint8Array(s: string) {
  return new TextEncoder().encode(s);
}

function toBase64(bytes: ArrayBuffer) {
  // Prefer Node Buffer if disponible; fallback a btoa
  if (typeof Buffer !== "undefined") {
    return Buffer.from(bytes).toString("base64");
  }
  const arr = new Uint8Array(bytes);
  let binary = "";
  for (let i = 0; i < arr.length; i++) binary += String.fromCharCode(arr[i]!);
  return btoa(binary);
}

function fromBase64(b64: string) {
  // Prefer Node Buffer si está disponible
  if (typeof Buffer !== "undefined") {
    return Buffer.from(b64, "base64").buffer;
  }
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

function randomSalt(bytes = 16) {
  const buf = new Uint8Array(bytes);
  globalThis.crypto.getRandomValues(buf);
  return toBase64(buf.buffer);
}

export async function hashPassword(password: string, opts?: { salt?: string; iterations?: number }) {
  if (!subtle) throw new Error("Web Crypto API no disponible");
  const iterations = opts?.iterations ?? 250000;
  const saltB64 = opts?.salt ?? randomSalt(16);
  const keyMaterial = await subtle.importKey("raw", toUint8Array(password), { name: "PBKDF2" }, false, ["deriveBits", "deriveKey"]);
  const params: Pbkdf2Params = { name: "PBKDF2", hash: "SHA-256", iterations, salt: fromBase64(saltB64) } as unknown as Pbkdf2Params;
  const derived = await subtle.deriveBits(params, keyMaterial, 32 * 8);
  const hashB64 = toBase64(derived);
  return `pbkdf2_sha256$${iterations}$${saltB64}$${hashB64}`;
}

export async function verifyPassword(password: string, encoded: string) {
  const [scheme, iterStr, saltB64] = encoded.split("$");
  if (scheme !== "pbkdf2_sha256") return false;
  if (!iterStr || !saltB64) return false;
  const iterations = parseInt(iterStr, 10);
  const recalculated = await hashPassword(password, { salt: saltB64, iterations });
  return recalculated === encoded;
}