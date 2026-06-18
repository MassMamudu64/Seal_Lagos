const REFERENCE_CHARS = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export function createBookingReference(): string {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  const suffix = Array.from(bytes, (byte) => REFERENCE_CHARS[byte % REFERENCE_CHARS.length]).join("");
  return `SL-${suffix}`;
}
