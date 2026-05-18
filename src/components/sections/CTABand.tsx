"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { LinkButton } from "@/components/ui/Button";
import { viewportOnce, fadeUp } from "@/lib/motion";

/**
 * CTABand — final invitation to book. Uses the second aircraft photo with
 * a vignette overlay, oversized display type, and two clear actions.
 */
export default function CTABand() {
  return (
    <section className="shell py-section">
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={fadeUp}
        className="relative isolate overflow-hidden rounded-3xl border border-white/8 shadow-panel"
      >
        <Image
          src="/images/aircraft-sunrise.webp"
          alt=""
          fill
          sizes="100vw"
          className="-z-10 object-cover object-center brightness-[0.55]"
        />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-br from-ink-950/85 via-ink-900/65 to-brand-900/40" />
        <div aria-hidden className="absolute inset-0 -z-10 bg-noise opacity-40 mix-blend-overlay" />

        <div className="grid gap-10 p-10 md:grid-cols-2 md:items-end md:p-16 lg:p-20">
          <div>
            <span className="kicker">Ready when you are</span>
            <h2 className="mt-5 font-display text-balance text-4xl font-medium leading-[1.02] tracking-tight text-cloud-50 sm:text-5xl md:text-6xl">
              Your next shipment
              <br />
              <span className="italic text-accent-400">deserves the calm of a flight plan.</span>
            </h2>
          </div>

          <div className="flex flex-col items-start gap-4 md:items-end">
            <p className="max-w-md text-pretty text-[15px] leading-relaxed text-cloud-300 md:text-right">
              Tell us where it's going. We'll quote, pick up, pack, fly and deliver — with you informed at every stage.
            </p>
            <div className="flex flex-wrap gap-3">
              <LinkButton href="/booking" size="lg" iconRight={<span aria-hidden>→</span>}>
                Start a Booking
              </LinkButton>
              <LinkButton href="/pricing" size="lg" variant="ghost">
                See Pricing
              </LinkButton>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
