"use client";

import { motion } from "framer-motion";
import { routes } from "@/lib/data";
import { fadeUp, staggerChildren, viewportOnce } from "@/lib/motion";
import SectionHeading from "@/components/ui/SectionHeading";

/**
 * RouteNetwork — an abstract diagram of every active corridor. Two hub
 * nodes (USA, Nigeria) anchor each side; destinations spray out from each.
 * Arcs draw in on scroll for a "flight plan unrolling" effect.
 */

type Node = { x: number; y: number; label: string; sub?: string; hub?: boolean };

const usHubs: Node[] = [
  { x: 70, y: 320, label: "USA", sub: "Minnesota Hub", hub: true },
];

const ngHubs: Node[] = [
  { x: 530, y: 320, label: "Nigeria", sub: "Lagos Hub", hub: true },
];

const usDestinations: Node[] = [
  { x: 730, y: 110, label: "Nigeria", sub: "7–10 days" },
  { x: 770, y: 230, label: "Ghana" },
  { x: 770, y: 410, label: "Guinea Conakry" },
  { x: 730, y: 540, label: "South Africa" },
];

const ngDestinations: Node[] = [
  { x: 770, y: 230, label: "Ghana" },
  { x: 770, y: 410, label: "Liberia", sub: "3–5 days" },
  { x: 770, y: 480, label: "Togo / Lomé" },
];

export default function RouteNetwork() {
  return (
    <section className="shell py-section">
      <SectionHeading
        kicker="Network"
        title={
          <>
            A network in motion —
            <br />
            <span className="italic text-accent-400">always.</span>
          </>
        }
        lede="Two hubs in Minnesota and Lagos. A constellation of destinations across West and Southern Africa. Every corridor flies on a weekly cadence."
      />

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={viewportOnce}
        variants={staggerChildren}
        className="relative mt-14 overflow-hidden rounded-3xl border border-white/8 bg-ink-900/50 shadow-panel"
      >
        <div aria-hidden className="absolute inset-0 bg-grid-faint opacity-30 [background-size:32px_32px]" />
        <div aria-hidden className="absolute inset-0 bg-radial-brand opacity-40" />

        <svg
          viewBox="0 0 800 600"
          className="relative h-auto w-full"
          role="img"
          aria-label="Seal Logistics route network diagram"
        >
          <defs>
            <linearGradient id="route-line" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#F5821F" stopOpacity="0.1" />
              <stop offset="50%" stopColor="#F5821F" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#F5821F" stopOpacity="0.1" />
            </linearGradient>
            <radialGradient id="hub-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F5821F" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#F5821F" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background arcs grouped */}
          <g>
            {usDestinations.map((d, i) => (
              <motion.path
                key={`us-${d.label}-${i}`}
                d={curveBetween(usHubs[0], d)}
                fill="none"
                stroke="url(#route-line)"
                strokeWidth="1.2"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={viewportOnce}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 + i * 0.08 }}
              />
            ))}
            {ngDestinations.map((d, i) => (
              <motion.path
                key={`ng-${d.label}-${i}`}
                d={curveBetween(ngHubs[0], d)}
                fill="none"
                stroke="url(#route-line)"
                strokeWidth="1.2"
                strokeDasharray="3 5"
                initial={{ pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={viewportOnce}
                transition={{ duration: 1.2, ease: "easeOut", delay: 0.5 + i * 0.08 }}
              />
            ))}
          </g>

          {/* Hubs */}
          {[...usHubs, ...ngHubs].map((node) => (
            <g key={node.label}>
              <circle cx={node.x} cy={node.y} r="40" fill="url(#hub-glow)" />
              <circle
                cx={node.x}
                cy={node.y}
                r="10"
                fill="#F5821F"
                className="animate-pulse-soft"
              />
              <circle cx={node.x} cy={node.y} r="14" fill="none" stroke="#F5821F" strokeOpacity="0.4" />
              <text
                x={node.x}
                y={node.y - 28}
                textAnchor="middle"
                className="fill-cloud-50 font-display"
                fontSize="20"
                fontWeight="500"
              >
                {node.label}
              </text>
              {node.sub && (
                <text
                  x={node.x}
                  y={node.y + 36}
                  textAnchor="middle"
                  className="fill-cloud-400 font-mono uppercase"
                  fontSize="10"
                  letterSpacing="2"
                >
                  {node.sub}
                </text>
              )}
            </g>
          ))}

          {/* Destinations */}
          {[...usDestinations, ...ngDestinations]
            .filter(
              (n, i, arr) => arr.findIndex((x) => x.label === n.label) === i,
            )
            .map((node, i) => (
              <motion.g
                key={node.label}
                initial={{ opacity: 0, scale: 0.6 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={viewportOnce}
                transition={{ duration: 0.5, delay: 1 + i * 0.06 }}
              >
                <circle cx={node.x} cy={node.y} r="5" fill="#9298E1" />
                <circle cx={node.x} cy={node.y} r="9" fill="none" stroke="#9298E1" strokeOpacity="0.3" />
                <text
                  x={node.x + 14}
                  y={node.y + 4}
                  className="fill-cloud-100"
                  fontSize="13"
                >
                  {node.label}
                </text>
                {node.sub && (
                  <text
                    x={node.x + 14}
                    y={node.y + 20}
                    className="fill-accent-400 font-mono uppercase"
                    fontSize="9"
                    letterSpacing="1"
                  >
                    {node.sub}
                  </text>
                )}
              </motion.g>
            ))}
        </svg>

        {/* Legend */}
        <motion.div
          variants={fadeUp}
          className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/8 px-6 py-4 text-xs text-cloud-400 sm:px-8"
        >
          <span className="inline-flex items-center gap-2">
            <span className="inline-block h-px w-8 bg-accent-500" />
            USA corridors
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="inline-block h-px w-8 border-t border-dashed border-accent-500" />
            Nigeria corridors
          </span>
          <span className="inline-flex items-center gap-2 font-mono uppercase tracking-kicker">
            {routes.length} active routes · weekly
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
}

function curveBetween(a: Node, b: Node): string {
  const midX = (a.x + b.x) / 2;
  const midY = Math.min(a.y, b.y) - 40;
  return `M ${a.x} ${a.y} Q ${midX} ${midY}, ${b.x} ${b.y}`;
}
