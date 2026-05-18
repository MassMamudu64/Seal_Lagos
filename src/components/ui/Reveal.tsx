"use client";

import { motion, type Variants } from "framer-motion";
import { fadeUp, viewportOnce } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  variants?: Variants;
  className?: string;
  delay?: number;
  as?: "div" | "section" | "article" | "li";
};

/**
 * Declarative scroll-reveal wrapper. Defaults to fadeUp, but any Framer
 * variant can be supplied. Use this instead of repeating `motion.div` boilerplate.
 */
export default function Reveal({
  children,
  variants = fadeUp,
  className,
  delay = 0,
  as = "div",
}: Props) {
  const MotionTag = motion[as] as typeof motion.div;
  return (
    <MotionTag
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={variants}
      transition={delay ? { delay } : undefined}
      className={cn(className)}
    >
      {children}
    </MotionTag>
  );
}
