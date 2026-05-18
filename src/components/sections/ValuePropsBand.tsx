"use client";

import { motion } from "framer-motion";
import { valueProps } from "@/lib/data";
import { fadeUp, staggerChildren, viewportOnce } from "@/lib/motion";
import SectionHeading from "@/components/ui/SectionHeading";

/**
 * ValuePropsBand — editorial grid of six brand promises. Numbered, dense,
 * with hairline separators between cells for an editorial feel.
 */
export default function ValuePropsBand() {
  return (
    <section className="shell py-section">
      <SectionHeading
        kicker="Why Seal Logistics"
        title={
          <>
            The standards we hold,
            <br />
            <span className="italic text-accent-400">on every flight.</span>
          </>
        }
        lede="Speed without recklessness. Security without delay. A way of working built around the realities of cross-border freight."
      />

      <motion.ul
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerChildren}
        className="mt-12 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/8 bg-white/8 md:grid-cols-2 lg:grid-cols-3"
      >
        {valueProps.map((v, i) => (
          <motion.li
            key={v.title}
            variants={fadeUp}
            className="group relative bg-ink-900/70 p-8 transition-colors hover:bg-ink-900"
          >
            <span className="font-mono text-[11px] uppercase tracking-kicker text-accent-500">
              {String(i + 1).padStart(2, "0")} / {String(valueProps.length).padStart(2, "0")}
            </span>
            <h3 className="mt-4 font-display text-xl font-medium leading-tight text-cloud-50">
              {v.title}
            </h3>
            <p className="mt-3 text-[15px] leading-relaxed text-cloud-400">
              {v.body}
            </p>
            <span
              aria-hidden
              className="absolute bottom-0 left-0 h-px w-0 bg-accent-500 transition-all duration-500 group-hover:w-full"
            />
          </motion.li>
        ))}
      </motion.ul>
    </section>
  );
}
