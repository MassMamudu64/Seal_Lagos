/**
 * Shared utilities. Kept dependency-free (no clsx/tailwind-merge) so the
 * project stays lean — `cn` covers the conditional-class needs of this app.
 */

/** Conditional className joiner. */
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(" ");
}

/** Format a number as USD currency. */
export function formatUSD(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

/** Title-case a slug or kebab string. */
export function titleCase(input: string): string {
  return input
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Clamp a number between min and max. */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Convert kilograms to pounds. */
export function kgToLbs(kg: number): number {
  return kg * 2.2046226218;
}

/** Convert pounds to kilograms. */
export function lbsToKg(lbs: number): number {
  return lbs / 2.2046226218;
}
