"use client";

import { motion } from "framer-motion";
import { fadeUp, staggerChildren, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Props = {
  kicker?: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
};

/**
 * Cinematic section heading. Three layered elements — kicker, headline, lede —
 * each fades up in sequence when the section enters the viewport.
 */
export default function SectionHeading({
  kicker,
  title,
  lede,
  align = "left",
  className,
}: Props) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerChildren}
      className={cn(
        "flex flex-col gap-5",
        align === "center" && "items-center text-center",
        className,
      )}
    >
      {kicker && (
        <motion.span variants={fadeUp} className="kicker">
          {kicker}
        </motion.span>
      )}
      <motion.h2
        variants={fadeUp}
        className="font-display text-balance text-3xl font-medium leading-[1.05] tracking-tight text-cloud-50 sm:text-4xl md:text-5xl"
      >
        {title}
      </motion.h2>
      {lede && (
        <motion.p
          variants={fadeUp}
          className="max-w-prose text-pretty text-base leading-relaxed text-cloud-400 md:text-lg"
        >
          {lede}
        </motion.p>
      )}
    </motion.div>
  );
}
