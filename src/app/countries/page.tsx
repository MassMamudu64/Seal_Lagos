"use client";

import { motion } from "framer-motion";
import PageHeader from "@/components/layout/PageHeader";
import RouteNetwork from "@/components/sections/RouteNetwork";
import CTABand from "@/components/sections/CTABand";
import { countries } from "@/lib/data";
import { fadeUp, staggerChildren, viewportOnce } from "@/lib/motion";

/**
 * Countries We Ship To — a tactile grid of destination cards. Each card has
 * a hover lift, the country flag as visual anchor, and a brief operational
 * note describing its role in the network.
 */
export default function CountriesPage() {
  return (
    <>
      <PageHeader
        kicker="Countries We Ship To"
        title={
          <>
            Eight countries.
            <br />
            <span className="italic text-accent-400">One operating tempo.</span>
          </>
        }
        lede="Our hubs anchor a network connecting North America to West and Southern Africa. Two arteries — Minnesota and Lagos — branch out into reliable destination corridors."
      />

      <section className="shell pb-section">
        <motion.ul
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerChildren}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {countries.map((c) => (
            <motion.li
              key={c.code}
              variants={fadeUp}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 280, damping: 26 }}
              className="group relative overflow-hidden rounded-2xl border border-white/8 bg-ink-900/60 p-6 shadow-panel ring-inset-faint"
            >
              <span
                aria-hidden
                className="pointer-events-none absolute -top-12 right-0 select-none text-[140px] leading-none opacity-50 transition-all duration-500 group-hover:-translate-y-2 group-hover:opacity-90"
              >
                {c.flag}
              </span>

              <div className="relative">
                <span
                  className={`inline-flex h-7 items-center rounded-full px-3 text-[10px] font-medium uppercase tracking-kicker ${
                    c.role === "hub"
                      ? "bg-accent-500/15 text-accent-400 ring-1 ring-accent-500/30"
                      : "bg-white/5 text-cloud-300 ring-1 ring-white/10"
                  }`}
                >
                  {c.role === "hub" ? "Hub" : "Destination"}
                </span>
                <h3 className="mt-6 font-display text-2xl font-medium tracking-tight text-cloud-50">
                  {c.name}
                </h3>
                <p className="mt-2 font-mono text-[11px] uppercase tracking-kicker text-cloud-500">
                  {c.code}
                </p>
                <p className="mt-4 text-sm leading-relaxed text-cloud-300">
                  {c.note}
                </p>
              </div>

              <span
                aria-hidden
                className="absolute bottom-0 left-0 h-px w-0 bg-accent-500 transition-all duration-500 group-hover:w-full"
              />
            </motion.li>
          ))}
        </motion.ul>
      </section>

      <RouteNetwork />
      <CTABand />
    </>
  );
}
