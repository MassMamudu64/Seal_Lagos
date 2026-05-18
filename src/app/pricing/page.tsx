"use client";

import { motion } from "framer-motion";
import PageHeader from "@/components/layout/PageHeader";
import QuoteCalculator from "@/components/sections/QuoteCalculator";
import CTABand from "@/components/sections/CTABand";
import { weightRates, electronicItems, SERVICE_FEE } from "@/lib/data";
import { formatUSD } from "@/lib/utils";
import { fadeUp, staggerChildren, viewportOnce } from "@/lib/motion";

export default function PricingPage() {
  return (
    <>
      <PageHeader
        kicker="Pricing"
        title={
          <>
            Transparent rates,
            <br />
            <span className="italic text-accent-400">corridor by corridor.</span>
          </>
        }
        lede="Estimate a shipment in seconds. Most cargo is charged by weight; phones, tablets, laptops and wearables ship at flat per-item rates."
      />

      <QuoteCalculator />

      {/* Rate sheets */}
      <section id="rates" className="shell py-section">
        <div className="grid gap-10 lg:grid-cols-2">
          {/* Weight rates */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerChildren}
          >
            <motion.h2
              variants={fadeUp}
              className="font-display text-3xl tracking-tight text-cloud-50"
            >
              By-weight rates
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-2 text-sm text-cloud-400">
              Minimum {weightRates[0].minimum} {weightRates[0].unit} per shipment per corridor.
            </motion.p>
            <motion.div
              variants={fadeUp}
              className="mt-6 overflow-hidden rounded-2xl border border-white/8 bg-ink-900/60"
            >
              <ul>
                {weightRates.map((r) => (
                  <li
                    key={r.id}
                    className="flex items-center justify-between gap-4 border-b border-white/5 px-5 py-4 last:border-b-0"
                  >
                    <div>
                      <p className="text-[15px] text-cloud-100">{r.label}</p>
                      <p className="font-mono text-[11px] uppercase tracking-kicker text-cloud-500">
                        min {r.minimum} {r.unit}
                        {r.serviceFee === 0 ? " · service fee waived" : ` · +${formatUSD(SERVICE_FEE)} service fee`}
                      </p>
                    </div>
                    <p className="font-mono text-lg tabular-nums text-accent-400">
                      {formatUSD(r.rate)}
                      <span className="ml-1 text-xs text-cloud-400">/{r.unit}</span>
                    </p>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>

          {/* Electronics */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            variants={staggerChildren}
          >
            <motion.h2
              variants={fadeUp}
              className="font-display text-3xl tracking-tight text-cloud-50"
            >
              Electronics — per item
            </motion.h2>
            <motion.p variants={fadeUp} className="mt-2 text-sm text-cloud-400">
              Phones, tablets, laptops, watches and AirPods ship at a flat
              per-piece rate instead of by weight.
            </motion.p>
            <motion.div
              variants={fadeUp}
              className="mt-6 overflow-hidden rounded-2xl border border-white/8 bg-ink-900/60"
            >
              <ul>
                {electronicItems.map((it) => (
                  <li
                    key={it.id}
                    className="flex items-center justify-between gap-4 border-b border-white/5 px-5 py-3.5 last:border-b-0"
                  >
                    <span className="text-[14px] text-cloud-100">
                      {it.name}
                    </span>
                    <span className="font-mono text-base tabular-nums text-accent-400">
                      {formatUSD(it.price)}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>

        <motion.p
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          className="mt-10 rounded-2xl border border-white/8 bg-ink-900/50 p-6 text-sm text-cloud-300"
        >
          <strong className="text-cloud-50">A note on the service fee.</strong>{" "}
          A {formatUSD(SERVICE_FEE)} service fee is included on every invoice
          generated <em>except</em> for shipments originating in Nigeria.
          Final invoices are confirmed once your shipment is checked in and weighed.
        </motion.p>
      </section>

      <CTABand />
    </>
  );
}
