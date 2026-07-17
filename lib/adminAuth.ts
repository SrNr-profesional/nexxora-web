/**
 * Autenticación simple del panel interno, compatible con Edge Runtime (middleware).
 * Usa un token firmado con HMAC-SHA256 (Web Crypto API) en lugar de una librería de sesión
 * completa, ya que el panel es de uso interno y no requiere múltiples usuarios/roles.
 *
 * Para un panel con múltiples usuarios y roles, migrar a Supabase Auth.
 */

export const ADMIN_COOKIE_NAME = "nexxora_admin_session";
const SESSION_DURATION_MS = 12 * 60 * 60 * 1000; // 12 horas

function getSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD;
  if (!secret) {
    throw new Error("Falta configurar ADMIN_PASSWORD (y opcionalmente ADMIN_SESSION_SECRET).");
  }
  return secret;
}

function toBase64Url(buffer: ArrayBuffer) {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  const base64 = typeof btoa !== "undefined" ? btoa(binary) : Buffer.from(binary, "binary").toString("base64");
  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function hmac(message: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(message));
  return toBase64Url(signature);
}

export async function createSessionToken() {
  const expires = Date.now() + SESSION_DURATION_MS;
  const payload = `${expires}`;
  const signature = await hmac(payload);
  return `${payload}.${signature}`;
}

export async function verifySessionToken(token: string | undefined | null) {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const expected = await hmac(payload);
  if (expected !== signature) return false;

  const expires = Number(payload);
  if (Number.isNaN(expires) || Date.now() > expires) return false;

  return true;
}
