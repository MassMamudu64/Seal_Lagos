"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";
import { smoothHover } from "@/lib/motion";

type Props = Omit<HTMLMotionProps<"div">, "children"> & {
  glow?: boolean;
  interactive?: boolean;
  children?: React.ReactNode;
};

/**
 * Card — the dominant surface primitive on the site. Layered shadows + an
 * inset luminous border create depth on the dark canvas. `glow` adds an
 * orange aura, `interactive` enables the lift-on-hover motion.
 */
export default function Card({
  children,
  className,
  glow,
  interactive,
  ...rest
}: Props) {
  return (
    <motion.div
      {...(interactive ? smoothHover : {})}
      className={cn(
        "relative overflow-hidden rounded-2xl bg-ink-900/70 p-6 ring-inset-faint backdrop-blur-md",
        glow && "shadow-glow",
        interactive && "cursor-pointer transition-shadow hover:shadow-lift",
        className,
      )}
      {...rest}
    >
      {/* Subtle top sheen */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cloud-300/30 to-transparent"
      />
      {children}
    </motion.div>
  );
}
