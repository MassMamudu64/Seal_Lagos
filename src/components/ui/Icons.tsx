import type { ServiceIcon } from "@/lib/data";

/**
 * Hand-crafted SVG iconography. Inline strokes so colour is controllable
 * via `currentColor`; sizing handled by Tailwind on the wrapper.
 */

const common = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function Icon({ name, className }: { name: ServiceIcon; className?: string }) {
  switch (name) {
    case "plane":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...common}>
          <path d="M3.5 13.5l5-1.5L13 4l1.6.6-3 8.4L18 11l1.4-1.2L21 10v2l-7.2 3.4L11 22l-1.6-.6 1.2-5.4-5.2 1.4-1.2 2L3 18.6v-1.4z" />
        </svg>
      );
    case "door":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...common}>
          <rect x="6" y="3" width="12" height="18" rx="1" />
          <path d="M9 12h.01M3 21h18" />
          <path d="M14 3v18" opacity="0.5" />
        </svg>
      );
    case "shield":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...common}>
          <path d="M12 3l8 3v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3z" />
          <path d="M9 12l2 2 4-4" />
        </svg>
      );
    case "cart":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...common}>
          <path d="M3 4h2l2 12h12l2-8H6" />
          <circle cx="9" cy="20" r="1.5" />
          <circle cx="18" cy="20" r="1.5" />
        </svg>
      );
    case "boxes":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...common}>
          <rect x="3" y="9" width="8" height="8" rx="1" />
          <rect x="13" y="9" width="8" height="8" rx="1" />
          <rect x="8" y="3" width="8" height="6" rx="1" />
          <path d="M7 13h4M17 13h-4" opacity="0.6" />
        </svg>
      );
    case "lock":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...common}>
          <rect x="4" y="10" width="16" height="11" rx="2" />
          <path d="M8 10V7a4 4 0 1 1 8 0v3" />
          <circle cx="12" cy="15.5" r="1.2" />
        </svg>
      );
    case "radar":
      return (
        <svg viewBox="0 0 24 24" className={className} aria-hidden {...common}>
          <circle cx="12" cy="12" r="9" />
          <circle cx="12" cy="12" r="5" opacity="0.6" />
          <path d="M12 12L19 7" />
          <circle cx="12" cy="12" r="1.6" fill="currentColor" />
        </svg>
      );
  }
}
