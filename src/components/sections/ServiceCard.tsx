"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import type { Service } from "@/lib/data";
import { Icon } from "@/components/ui/Icons";
import { fadeUp } from "@/lib/motion";

/**
 * ServiceCard — feature card with icon, headline, lede and "Learn more" cue.
 * Hover state engages a corner sheen that sweeps across.
 */
export default function ServiceCard({ service, href }: { service: Service; href?: string }) {
  const inner = (
    <motion.article
      variants={fadeUp}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 280, damping: 26 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/8 bg-ink-900/60 p-6 shadow-panel ring-inset-faint backdrop-blur-md"
    >
      {/* Top gradient hairline */}
      <span aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-500/50 to-transparent opacity-70 transition-opacity group-hover:opacity-100" />

      {/* Hover sheen */}
      <span
        aria-hidden
        className="pointer-events-none absolute -inset-x-10 -top-10 h-32 -translate-x-full bg-gradient-to-r from-transparent via-cloud-50/8 to-transparent transition-transform duration-700 group-hover:translate-x-[120%]"
      />

      <div className="flex items-center justify-between">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-accent-500/12 text-accent-400 ring-1 ring-accent-500/30 transition-colors group-hover:bg-accent-500/20">
          <Icon name={service.icon} className="h-6 w-6" />
        </span>
        <span aria-hidden className="font-mono text-[11px] uppercase tracking-kicker text-cloud-500">
          / {String(service.slug.length).padStart(2, "0")}
        </span>
      </div>

      <h3 className="mt-6 font-display text-2xl font-medium leading-tight tracking-tight text-cloud-50">
        {service.title}
      </h3>
      <p className="mt-3 text-[15px] leading-relaxed text-cloud-400">
        {service.short}
      </p>

      <ul className="mt-6 flex flex-col gap-2 text-sm text-cloud-300">
        {service.features.map((f) => (
          <li key={f} className="flex items-start gap-3">
            <span aria-hidden className="mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full bg-accent-500" />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      {href && (
        <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-cloud-50">
          <span>Learn more</span>
          <span
            aria-hidden
            className="transition-transform duration-300 group-hover:translate-x-1"
          >
            →
          </span>
        </div>
      )}
    </motion.article>
  );

  if (!href) return inner;
  return (
    <Link href={href} aria-label={service.title}>
      {inner}
    </Link>
  );
}
