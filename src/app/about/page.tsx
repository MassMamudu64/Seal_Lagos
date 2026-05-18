"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import PageHeader from "@/components/layout/PageHeader";
import ProcessTimeline from "@/components/sections/ProcessTimeline";
import ValuePropsBand from "@/components/sections/ValuePropsBand";
import CTABand from "@/components/sections/CTABand";
import { company, faqs } from "@/lib/data";
import { fadeUp, staggerChildren, viewportOnce } from "@/lib/motion";

export default function AboutPage() {
  return (
    <>
      <PageHeader
        kicker="About / Mission"
        title={
          <>
            A logistics partner
            <br />
            <span className="italic text-accent-400">built around trust.</span>
          </>
        }
        lede={company.intro}
      />

      {/* Mission band */}
      <section className="shell py-section">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerChildren}
          className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center"
        >
          <motion.div variants={fadeUp}>
            <span className="kicker">Our Mission</span>
            <h2 className="mt-5 font-display text-4xl font-medium leading-[1.05] tracking-tight text-cloud-50 md:text-5xl">
              Seamless shipping —
              <br />
              <span className="italic text-accent-400">on every flight.</span>
            </h2>
            <p className="mt-6 max-w-prose text-pretty text-base leading-relaxed text-cloud-300 md:text-lg">
              {company.mission}
            </p>
            <p className="mt-6 font-display text-2xl italic text-cloud-100">
              "{company.tagline}"
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="relative aspect-[5/6] overflow-hidden rounded-3xl border border-white/8 shadow-panel"
          >
            <Image
              src="/images/aircraft-cruise.webp"
              alt="Aircraft cruising at altitude above the clouds"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <div aria-hidden className="absolute inset-0 bg-gradient-to-tr from-ink-950/60 via-transparent to-transparent" />
            <div className="absolute inset-x-6 bottom-6 rounded-2xl border border-white/10 bg-ink-950/70 p-5 backdrop-blur-lg">
              <p className="font-mono text-[11px] uppercase tracking-kicker text-accent-500">
                Trusted partner
              </p>
              <p className="mt-2 font-display text-xl leading-snug text-cloud-50">
                Speed, security, reliability — and peace of mind.
              </p>
            </div>
          </motion.div>
        </motion.div>
      </section>

      <ValuePropsBand />
      <ProcessTimeline />

      {/* FAQ */}
      <section className="shell py-section">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerChildren}
          className="grid gap-10 lg:grid-cols-[1fr_1.4fr]"
        >
          <motion.div variants={fadeUp}>
            <span className="kicker">FAQ</span>
            <h2 className="mt-5 font-display text-3xl font-medium leading-tight tracking-tight text-cloud-50 md:text-4xl">
              The questions we hear most.
            </h2>
          </motion.div>
          <motion.div
            variants={fadeUp}
            className="divide-y divide-white/8 overflow-hidden rounded-2xl border border-white/8 bg-ink-900/60"
          >
            {faqs.map((f) => (
              <details key={f.q} className="group">
                <summary className="flex cursor-pointer items-center justify-between gap-4 px-6 py-5 text-[15px] text-cloud-100 transition-colors hover:bg-white/[0.02] [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span
                    aria-hidden
                    className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/10 text-cloud-300 transition-transform group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <p className="px-6 pb-6 pt-0 text-[14px] leading-relaxed text-cloud-400">
                  {f.a}
                </p>
              </details>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <CTABand />
    </>
  );
}
