"use client";

import { motion } from "framer-motion";
import { easeOut } from "@/lib/motion";

type Props = {
  kicker: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  align?: "left" | "center";
};

/**
 * PageHeader — consistent hero band for every interior page. Sits below the
 * fixed header, with brand glow and grid texture but no aircraft imagery.
 */
export default function PageHeader({ kicker, title, lede, align = "left" }: Props) {
  return (
    <section className="relative isolate overflow-hidden pb-section pt-40">
      <div aria-hidden className="absolute inset-0 -z-30 bg-gradient-to-b from-ink-900 via-ink-950 to-ink-950" />
      <div aria-hidden className="absolute inset-x-0 top-0 -z-20 h-[70%] bg-radial-brand opacity-70" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-grid-faint opacity-40 [background-size:80px_80px] mask-fade-y" />

      <div className="shell">
        <motion.span
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: easeOut }}
          className={`kicker ${align === "center" ? "justify-center" : ""}`}
        >
          {kicker}
        </motion.span>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: easeOut, delay: 0.1 }}
          className={`mt-6 max-w-4xl font-display text-balance text-4xl font-medium leading-[1.04] tracking-tight text-cloud-50 sm:text-5xl md:text-6xl ${align === "center" ? "mx-auto text-center" : ""}`}
        >
          {title}
        </motion.h1>
        {lede && (
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: easeOut, delay: 0.22 }}
            className={`mt-6 max-w-prose text-pretty text-base leading-relaxed text-cloud-300 md:text-lg ${align === "center" ? "mx-auto text-center" : ""}`}
          >
            {lede}
          </motion.p>
        )}
      </div>
    </section>
  );
}
