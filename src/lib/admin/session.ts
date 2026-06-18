export const ADMIN_SESSION_COOKIE = "seal_admin_session";
export const ADMIN_SESSION_MAX_AGE_SECONDS = 60 * 60 * 8;

const encoder = new TextEncoder();
const decoder = new TextDecoder();

type AdminSessionPayload = {
  exp: number;
  iat: number;
  nonce: string;
};

function bytesToBase64Url(bytes: Uint8Array): string {
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlToBytes(value: string): Uint8Array {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function textToBase64Url(value: string): string {
  return bytesToBase64Url(encoder.encode(value));
}

function base64UrlToText(value: string): string {
  return decoder.decode(base64UrlToBytes(value));
}

async function hmacSha256(value: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return bytesToBase64Url(new Uint8Array(signature));
}

function randomNonce(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return bytesToBase64Url(bytes);
}

export function getAdminSessionSecret(): string | null {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || null;
}

export async function createAdminSessionToken(secret: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);
  const payload: AdminSessionPayload = {
    iat: now,
    exp: now + ADMIN_SESSION_MAX_AGE_SECONDS,
    nonce: randomNonce(),
  };
  const encodedPayload = textToBase64Url(JSON.stringify(payload));
  const signature = await hmacSha256(encodedPayload, secret);
  return `${encodedPayload}.${signature}`;
}

export async function verifyAdminSessionToken(token: string | undefined, secret: string | null): Promise<boolean> {
  if (!token || !secret) return false;

  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return false;

  const expectedSignature = await hmacSha256(encodedPayload, secret);
  if (signature !== expectedSignature) return false;

  try {
    const payload = JSON.parse(base64UrlToText(encodedPayload)) as Partial<AdminSessionPayload>;
    return typeof payload.exp === "number" && payload.exp > Math.floor(Date.now() / 1000);
  } catch {
    return false;
  }
}
