"use client";

import { motion } from "framer-motion";
import { processSteps } from "@/lib/data";
import { fadeUp, staggerChildren, viewportOnce } from "@/lib/motion";
import SectionHeading from "@/components/ui/SectionHeading";

/**
 * ProcessTimeline — vertical, editorial timeline of the seven-step shipping
 * process. The connecting line draws in as the section enters view, and
 * each step fades up sequentially.
 */
export default function ProcessTimeline() {
  return (
    <section className="shell py-section">
      <SectionHeading
        kicker="The Process"
        title={
          <>
            Seven steps, one
            <br />
            <span className="italic text-accent-400">uninterrupted flight.</span>
          </>
        }
        lede="From drop-off to doorstep, every shipment moves through a documented sequence. No black box. No surprises. Just clear stages with people accountable at each one."
      />

      <motion.ol
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerChildren}
        className="relative mt-16 grid gap-10"
      >
        {/* Connecting line */}
        <motion.span
          aria-hidden
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={viewportOnce}
          transition={{ duration: 1.4, ease: "easeOut" }}
          style={{ transformOrigin: "top" }}
          className="pointer-events-none absolute left-[19px] top-2 h-[calc(100%-1rem)] w-px bg-gradient-to-b from-accent-500/60 via-cloud-400/20 to-transparent md:left-[27px]"
        />

        {processSteps.map((step) => (
          <motion.li
            key={step.step}
            variants={fadeUp}
            className="relative grid grid-cols-[auto_1fr] items-start gap-6 md:gap-10"
          >
            <span
              aria-hidden
              className="relative z-10 inline-flex h-10 w-10 items-center justify-center rounded-full border border-accent-500/40 bg-ink-950 font-mono text-xs font-semibold text-accent-400 md:h-14 md:w-14 md:text-sm"
            >
              {String(step.step).padStart(2, "0")}
            </span>
            <div className="pt-1 md:pt-3">
              <h3 className="font-display text-xl font-medium leading-tight text-cloud-50 md:text-2xl">
                {step.title}
              </h3>
              <p className="mt-2 max-w-2xl text-pretty text-[15px] leading-relaxed text-cloud-400">
                {step.body}
              </p>
            </div>
          </motion.li>
        ))}
      </motion.ol>
    </section>
  );
}
