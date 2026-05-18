"use client";

import { motion } from "framer-motion";
import PageHeader from "@/components/layout/PageHeader";
import RouteMarquee from "@/components/sections/RouteMarquee";
import CTABand from "@/components/sections/CTABand";
import { routes } from "@/lib/data";
import { fadeUp, staggerChildren, viewportOnce } from "@/lib/motion";

/**
 * Weekly Air Cargo Schedule — corridors listed as editorial rows with
 * route arc, transit window and cut-off. Each row reveals as it scrolls in.
 */
export default function SchedulePage() {
  return (
    <>
      <PageHeader
        kicker="Weekly Air Cargo Schedule"
        title={
          <>
            A rhythm you can
            <br />
            <span className="italic text-accent-400">plan your week around.</span>
          </>
        }
        lede="Every active corridor in our network, with departure cadence, transit windows and cut-off times. Submit your shipment before the cut-off for that week's flight."
      />

      <section className="shell pb-section">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerChildren}
          className="overflow-hidden rounded-3xl border border-white/8 bg-ink-900/60 shadow-panel"
        >
          {/* Header row */}
          <div className="hidden border-b border-white/8 bg-white/5 px-8 py-4 md:grid md:grid-cols-[2.5fr_1fr_1fr_1.4fr]">
            <span className="text-[11px] font-semibold uppercase tracking-kicker text-cloud-400">Corridor</span>
            <span className="text-[11px] font-semibold uppercase tracking-kicker text-cloud-400">Frequency</span>
            <span className="text-[11px] font-semibold uppercase tracking-kicker text-cloud-400">Transit</span>
            <span className="text-[11px] font-semibold uppercase tracking-kicker text-cloud-400">Cut-off</span>
          </div>

          <ul>
            {routes.map((r, i) => (
              <motion.li
                key={r.id}
                variants={fadeUp}
                className="group grid grid-cols-1 gap-3 border-b border-white/5 px-8 py-7 transition-colors last:border-b-0 hover:bg-white/[0.02] md:grid-cols-[2.5fr_1fr_1fr_1.4fr] md:items-center md:gap-6"
              >
                {/* Corridor */}
                <div className="flex items-center gap-5">
                  <span className="font-mono text-[11px] uppercase tracking-kicker text-cloud-500">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <div className="flex items-center gap-3 font-display text-xl tracking-tight text-cloud-50">
                      <span>{r.from}</span>
                      <span aria-hidden className="text-accent-500">
                        <motion.span
                          initial={{ x: -4, opacity: 0 }}
                          whileInView={{ x: 0, opacity: 1 }}
                          viewport={viewportOnce}
                          transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
                          className="inline-block"
                        >
                          ───→
                        </motion.span>
                      </span>
                      <span>{r.to}</span>
                    </div>
                    <p className="mt-1 font-mono text-[11px] uppercase tracking-kicker text-cloud-500">
                      {r.fromCode} · {r.toCode}
                    </p>
                  </div>
                </div>

                {/* Frequency */}
                <div>
                  <span className="md:hidden text-[10px] uppercase tracking-kicker text-cloud-500">Frequency · </span>
                  <span className="inline-flex items-center gap-2 text-sm text-cloud-100">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-success" />
                    {r.frequency}
                  </span>
                </div>

                {/* Transit */}
                <div className="text-sm text-cloud-200">
                  <span className="md:hidden text-[10px] uppercase tracking-kicker text-cloud-500">Transit · </span>
                  {r.transit}
                </div>

                {/* Cut-off */}
                <div className="text-sm text-cloud-300">
                  <span className="md:hidden text-[10px] uppercase tracking-kicker text-cloud-500">Cut-off · </span>
                  <span className="font-mono">{r.cutoff}</span>
                </div>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        <p className="mt-6 text-sm text-cloud-400">
          Cut-off times indicate when your package must be checked in for that
          week's flight. Plan ahead — submitting early speeds up processing and
          documentation.
        </p>
      </section>

      <RouteMarquee />
      <CTABand />
    </>
  );
}
