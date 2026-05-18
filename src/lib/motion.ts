/**
 * SEAL LOGISTICS — MOTION SYSTEM
 * --------------------------------------------------------------------------
 * Every animated element in the app pulls its variants/transitions from this
 * file. Centralising motion guarantees a consistent rhythm: the same easing
 * curves, the same durations, the same stagger cadence everywhere.
 *
 * Motion tokens
 *   easeOut   — cinematic deceleration for entrances
 *   easeSoft  — symmetric ease for hovers / toggles
 *   spring    — physical spring for modals & interactive lifts
 */
import type { Variants, Transition } from "framer-motion";

/* ----------------------------- timing tokens ---------------------------- */

/** Cubic bezier tuples — pass to Framer's `ease` field in transitions. */
export const easeOut = [0.16, 1, 0.3, 1] as [number, number, number, number];
export const easeSoft = [0.65, 0, 0.35, 1] as [number, number, number, number];

export const duration = {
  fast: 0.35,
  base: 0.6,
  slow: 0.9,
} as const;

export const spring: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 26,
  mass: 0.9,
};

/* ------------------------------- variants ------------------------------- */

/** Fade in while rising from below — the workhorse entrance. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.base, ease: easeOut },
  },
};

/** Pure opacity fade. */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: duration.slow, ease: easeOut },
  },
};

/** Larger vertical travel — used for hero lines and headline reveals. */
export const slideUp: Variants = {
  hidden: { opacity: 0, y: 64 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.slow, ease: easeOut },
  },
};

/** Horizontal entrance from the left. */
export const slideLeft: Variants = {
  hidden: { opacity: 0, x: -56 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: duration.base, ease: easeOut },
  },
};

/** Horizontal entrance from the right. */
export const slideRight: Variants = {
  hidden: { opacity: 0, x: 56 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: duration.base, ease: easeOut },
  },
};

/** Parent container that releases children in sequence. */
export const staggerChildren: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1, delayChildren: 0.08 },
  },
};

/** Tighter cadence for dense grids. */
export const staggerFast: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.06 },
  },
};

/** Scale-in for cards and media tiles. */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: duration.base, ease: easeOut },
  },
};

/* ------------------------- interaction helpers -------------------------- */

/**
 * parallaxLayer — returns motion props for a depth layer. `depth` of 0 is
 * locked to the page; higher values drift further as the user scrolls.
 * Pair with a `useScroll`/`useTransform` chain at the call site, or use the
 * preset offsets below for simple cases.
 */
export const parallaxLayer = (depth: number) => ({
  initial: { y: 0 },
  style: { willChange: "transform" },
  // consumed by useTransform: maps scroll progress 0→1 to 0→offset
  offset: depth * -120,
});

/** Subtle lift + scale on hover, used by cards and media. */
export const smoothHover = {
  whileHover: { y: -6, transition: { duration: duration.fast, ease: easeSoft } },
  whileTap: { y: -2, scale: 0.995 },
};

/** Spring entrance/exit for modals, drawers and step transitions. */
export const modalSpring: Variants = {
  hidden: { opacity: 0, y: 24, scale: 0.97 },
  visible: { opacity: 1, y: 0, scale: 1, transition: spring },
  exit: {
    opacity: 0,
    y: 16,
    scale: 0.98,
    transition: { duration: duration.fast, ease: easeSoft },
  },
};

/** Standard viewport config for scroll-triggered reveals. */
export const viewportOnce = { once: true, margin: "-80px" } as const;
