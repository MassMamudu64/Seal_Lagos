"use client";

import { routes } from "@/lib/data";

/**
 * RouteMarquee — infinite looping strip of route names. Used as an ambient
 * divider between sections. The list is duplicated so the translate from
 * 0 to -50% creates a seamless loop.
 */
export default function RouteMarquee() {
  const items = [...routes, ...routes];
  return (
    <section
      aria-label="Active routes"
      className="relative isolate overflow-hidden border-y border-white/5 bg-ink-900/40 py-8"
    >
      <div aria-hidden className="absolute inset-0 -z-10 bg-grid-faint opacity-30 [background-size:48px_48px]" />
      <div className="mask-fade-x">
        <ul className="flex w-max animate-marquee items-center gap-12 px-6 will-change-transform">
          {items.map((r, i) => (
            <li
              key={`${r.id}-${i}`}
              className="flex items-center gap-4 font-display text-lg italic text-cloud-300"
            >
              <span className="font-mono text-[10px] uppercase not-italic tracking-kicker text-accent-500">
                {r.fromCode} → {r.toCode}
              </span>
              <span>
                {r.from} <span className="text-accent-400">→</span> {r.to}
              </span>
              <span aria-hidden className="text-cloud-500">·</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
