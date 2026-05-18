"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
} from "framer-motion";
import { LinkButton } from "@/components/ui/Button";
import { stats } from "@/lib/data";
import { easeOut } from "@/lib/motion";

/**
 * Hero — the cinematic anchor of the home page.
 *
 * Layers, back-to-front:
 *   1. Deep navy canvas + radial brand glow
 *   2. Subtle grid texture
 *   3. Animated flight-path SVG arcs (dash animation)
 *   4. Aircraft image with scroll-driven parallax + drift
 *   5. Editorial typography stack with staggered reveal
 *   6. Stats strip & CTAs
 */
export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Parallax depths — back layers drift less, front layer more dramatically.
  const skyY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const planeY = useTransform(scrollYProgress, [0, 1], ["0%", "-12%"]);
  const planeScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "-22%"]);

  return (
    <section
      ref={ref}
      aria-labelledby="hero-headline"
      className="relative isolate min-h-[100svh] overflow-hidden pt-24"
    >
      {/* ----- Layer 1: brand radial + base canvas ----- */}
      <motion.div
        aria-hidden
        style={reduced ? undefined : { y: skyY }}
        className="absolute inset-0 -z-30"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-ink-900 via-ink-950 to-ink-950" />
        <div className="absolute inset-x-0 top-0 h-[80%] bg-radial-brand opacity-90" />
      </motion.div>

      {/* ----- Layer 2: faint grid ----- */}
      <div aria-hidden className="absolute inset-0 -z-20 bg-grid-faint opacity-50 [background-size:80px_80px] mask-fade-y" />

      {/* ----- Layer 3: orbital flight paths ----- */}
      <FlightArcs />

      {/* ----- Layer 4: aircraft image ----- */}
      <motion.div
        aria-hidden
        style={reduced ? undefined : { y: planeY, scale: planeScale }}
        className="absolute inset-x-0 top-[18%] -z-10 mx-auto flex max-w-[1600px] justify-center"
      >
        <div className="relative aspect-[2/1] w-full max-w-[1300px] opacity-[0.55] mix-blend-screen">
          <Image
            src="/images/hero-aircraft.webp"
            alt=""
            fill
            priority
            sizes="(max-width: 1280px) 100vw, 1300px"
            className="object-cover object-center [mask-image:radial-gradient(ellipse_at_center,black_55%,transparent_80%)]"
          />
        </div>
      </motion.div>

      {/* Lower glow */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-0 h-72 bg-gradient-to-t from-ink-950 via-ink-950/80 to-transparent" />

      {/* ----- Layer 5: content ----- */}
      <motion.div
        style={reduced ? undefined : { y: textY }}
        className="shell relative flex min-h-[100svh] flex-col justify-center pb-24 pt-12"
      >
        <motion.span
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: easeOut }}
          className="kicker"
        >
          Air Cargo · Weekly Departures
        </motion.span>

        <h1
          id="hero-headline"
          className="mt-6 max-w-5xl font-display text-[clamp(2.75rem,7vw,5.75rem)] font-medium leading-[0.98] tracking-tight text-cloud-50"
        >
          <HeroLine delay={0.1}>Cargo that</HeroLine>
          <HeroLine delay={0.22}>
            <span className="italic text-accent-400">arrives.</span>
            <span className="text-cloud-50"> Connections that</span>
          </HeroLine>
          <HeroLine delay={0.34}>
            <span className="italic text-accent-400">hold.</span>
          </HeroLine>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: easeOut, delay: 0.5 }}
          className="mt-8 max-w-xl text-base leading-relaxed text-cloud-300 sm:text-lg"
        >
          Weekly air freight from the USA to West Africa — moving packages,
          businesses and families across borders with the calm precision of
          a flight plan that never misses its window.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: easeOut, delay: 0.62 }}
          className="mt-10 flex flex-wrap items-center gap-3"
        >
          <LinkButton href="/booking" size="lg" variant="primary" iconRight={<span aria-hidden>→</span>}>
            Book a Shipment
          </LinkButton>
          <LinkButton href="/tracking" size="lg" variant="ghost">
            Track a Package
          </LinkButton>
        </motion.div>

        {/* Stats strip */}
        <motion.dl
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.09, delayChildren: 0.85 } },
          }}
          className="mt-20 grid max-w-3xl grid-cols-2 gap-x-8 gap-y-6 border-t border-white/10 pt-8 sm:grid-cols-4"
        >
          {stats.map((s) => (
            <motion.div
              key={s.label}
              variants={{ hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0 } }}
              className="flex flex-col"
            >
              <dt className="font-display text-3xl font-medium tracking-tight text-cloud-50 sm:text-4xl">
                {s.value}
                <span className="text-accent-400">{s.suffix}</span>
              </dt>
              <dd className="mt-1 text-xs uppercase tracking-kicker text-cloud-400">
                {s.label}
              </dd>
            </motion.div>
          ))}
        </motion.dl>

        {/* Scroll cue */}
        <div className="pointer-events-none absolute inset-x-0 bottom-8 flex justify-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ duration: 0.6, delay: 1.4 }}
            className="flex flex-col items-center gap-2 text-[10px] uppercase tracking-kicker text-cloud-400"
          >
            <span>Scroll</span>
            <span aria-hidden className="block h-8 w-px overflow-hidden">
              <motion.span
                className="block h-3 w-px bg-accent-400"
                animate={{ y: [-12, 32] }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              />
            </span>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}

/* ----------------------------- sub-components ---------------------------- */

function HeroLine({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <span className="block overflow-hidden pb-2">
      <motion.span
        initial={{ y: "110%" }}
        animate={{ y: "0%" }}
        transition={{ duration: 0.95, ease: easeOut, delay }}
        className="block"
      >
        {children}
      </motion.span>
    </span>
  );
}

function FlightArcs() {
  return (
    <svg
      aria-hidden
      className="pointer-events-none absolute inset-x-0 top-[14%] -z-10 mx-auto h-[80%] w-full max-w-[1600px] opacity-50"
      viewBox="0 0 1600 800"
      fill="none"
    >
      <defs>
        <linearGradient id="arc1" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#F5821F" stopOpacity="0" />
          <stop offset="50%" stopColor="#F5821F" stopOpacity="0.65" />
          <stop offset="100%" stopColor="#F5821F" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="arc2" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#6B71CF" stopOpacity="0" />
          <stop offset="50%" stopColor="#6B71CF" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#6B71CF" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d="M -50 600 Q 400 200 800 380 T 1700 240"
        stroke="url(#arc1)"
        strokeWidth="1.5"
        strokeDasharray="6 10"
        className="animate-dash"
      />
      <path
        d="M -50 720 Q 500 480 900 560 T 1700 480"
        stroke="url(#arc2)"
        strokeWidth="1"
        strokeDasharray="4 8"
        className="animate-dash"
        style={{ animationDuration: "30s" }}
      />
      <circle cx="800" cy="380" r="3" fill="#F5821F" className="animate-pulse-soft" />
      <circle cx="900" cy="560" r="2" fill="#6B71CF" className="animate-pulse-soft" />
    </svg>
  );
}
