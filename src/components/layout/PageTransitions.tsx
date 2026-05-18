"use client";

import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { easeOut } from "@/lib/motion";

/**
 * PageTransitions — wraps the route tree so each navigation gets a soft
 * cross-fade with a small vertical lift. Keyed by pathname.
 */
export default function PageTransitions({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.45, ease: easeOut }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
