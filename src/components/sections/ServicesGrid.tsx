"use client";

import { motion } from "framer-motion";
import ServiceCard from "@/components/sections/ServiceCard";
import SectionHeading from "@/components/ui/SectionHeading";
import { services } from "@/lib/data";
import { staggerChildren, viewportOnce } from "@/lib/motion";

/**
 * ServicesGrid — used on the home page and the /services page. A grid of
 * ServiceCards revealed in a tight stagger as it scrolls into view.
 */
export default function ServicesGrid({ withLinks = true }: { withLinks?: boolean }) {
  return (
    <section id="services" className="shell py-section">
      <SectionHeading
        kicker="Services"
        title={
          <>
            Built for cargo that
            <br />
            <span className="italic text-accent-400">cannot wait.</span>
          </>
        }
        lede="Seven specialised services, one operating rhythm. From doorstep pickup to weekly air departures, every step is documented, monitored and on schedule."
      />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerChildren}
        className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
      >
        {services.map((s) => (
          <ServiceCard
            key={s.slug}
            service={s}
            href={withLinks ? "/services" : undefined}
          />
        ))}
      </motion.div>
    </section>
  );
}
