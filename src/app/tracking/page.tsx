"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";
import CTABand from "@/components/sections/CTABand";
import { sampleTrackingIds, type Shipment } from "@/lib/tracking";
import { easeOut, fadeUp, staggerChildren, viewportOnce } from "@/lib/motion";

/**
 * Shipment Tracking — lookup form + animated timeline.
 *
 * Hits /api/track for shipment data (mock store in `lib/tracking.ts`).
 * Renders an editorial vertical timeline with a progress fill, completed
 * stages in accent orange, future stages dimmed.
 */
export default function TrackingPage() {
  const [id, setId] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "found" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [shipment, setShipment] = useState<Shipment | null>(null);

  async function lookup(value: string) {
    if (!value.trim()) return;
    setStatus("loading");
    setError(null);
    setShipment(null);
    try {
      const res = await fetch(`/api/track?id=${encodeURIComponent(value.trim())}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not find that shipment.");
      setShipment(data.shipment);
      setStatus("found");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setStatus("error");
    }
  }

  return (
    <>
      <PageHeader
        kicker="Shipment Tracking"
        title={
          <>
            Where is your
            <br />
            <span className="italic text-accent-400">package right now?</span>
          </>
        }
        lede="Enter the tracking ID we issued you to follow your shipment through every stage — from check-in to doorstep."
      />

      <section className="shell pb-section">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            lookup(id);
          }}
          className="grid gap-3 rounded-2xl border border-white/8 bg-ink-900/60 p-3 shadow-panel sm:grid-cols-[1fr_auto]"
        >
          <label className="relative block">
            <span className="sr-only">Tracking ID</span>
            <input
              type="text"
              value={id}
              onChange={(e) => setId(e.target.value.toUpperCase())}
              placeholder="SL-7G4K2A"
              className="h-14 w-full rounded-xl bg-ink-950/80 px-5 font-mono text-base tracking-wide text-cloud-50 outline-none ring-1 ring-white/10 transition-shadow focus:ring-2 focus:ring-accent-500"
            />
          </label>
          <Button type="submit" size="lg" disabled={status === "loading"}>
            {status === "loading" ? "Searching…" : "Track Shipment"}
          </Button>
        </form>

        {/* Try a sample */}
        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-cloud-400">
          <span className="font-mono uppercase tracking-kicker">Try a sample · </span>
          {sampleTrackingIds.map((sid) => (
            <button
              key={sid}
              type="button"
              onClick={() => {
                setId(sid);
                lookup(sid);
              }}
              className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 font-mono text-[11px] text-cloud-200 transition-colors hover:border-accent-500/50 hover:bg-accent-500/10 hover:text-cloud-50"
            >
              {sid}
            </button>
          ))}
        </div>

        {/* Results */}
        <div className="mt-10">
          <AnimatePresence mode="wait">
            {status === "loading" && (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="rounded-3xl border border-white/8 bg-ink-900/40 p-12 text-center text-cloud-400"
              >
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                  className="mx-auto h-10 w-10 rounded-full border-2 border-accent-500/30 border-t-accent-500"
                />
                <p className="mt-4 font-mono text-xs uppercase tracking-kicker">
                  Looking up shipment…
                </p>
              </motion.div>
            )}
            {status === "error" && (
              <motion.div
                key="error"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="rounded-2xl border border-danger/30 bg-danger/10 px-6 py-5 text-sm text-danger"
              >
                {error}
              </motion.div>
            )}
            {status === "found" && shipment && (
              <motion.div
                key={shipment.id}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: 8 }}
                variants={staggerChildren}
              >
                <ShipmentResult shipment={shipment} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      <CTABand />
    </>
  );
}

/* ============================ result panel ============================== */

function ShipmentResult({ shipment }: { shipment: Shipment }) {
  return (
    <article className="overflow-hidden rounded-3xl border border-white/8 bg-ink-900/60 shadow-panel">
      {/* Top summary band */}
      <div className="grid gap-6 border-b border-white/8 bg-white/[0.02] p-8 md:grid-cols-[1.4fr_1fr_1fr] md:items-end">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-kicker text-accent-500">
            Tracking ID · {shipment.id}
          </p>
          <p className="mt-3 font-display text-2xl font-medium leading-tight text-cloud-50 md:text-3xl">
            {shipment.service}
          </p>
          <p className="mt-2 text-sm text-cloud-300">
            <span className="text-cloud-200">{shipment.origin}</span>
            <span aria-hidden className="mx-2 text-accent-500">→</span>
            <span className="text-cloud-200">{shipment.destination}</span>
          </p>
        </div>
        <div>
          <p className="font-mono text-[11px] uppercase tracking-kicker text-cloud-400">Status</p>
          <p className="mt-2 inline-flex items-center gap-2 font-display text-lg text-cloud-50">
            <span className="inline-block h-2 w-2 animate-pulse-soft rounded-full bg-success" />
            {shipment.status}
          </p>
          <p className="mt-1 text-sm text-cloud-400">{shipment.estimatedDelivery}</p>
        </div>
        <div>
          <p className="font-mono text-[11px] uppercase tracking-kicker text-cloud-400">Weight</p>
          <p className="mt-2 font-display text-lg text-cloud-50">{shipment.weight}</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-8 pt-8">
        <div className="flex items-center justify-between text-xs text-cloud-400">
          <span>Progress</span>
          <span className="font-mono">{shipment.progress}%</span>
        </div>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${shipment.progress}%` }}
            transition={{ duration: 1.1, ease: easeOut, delay: 0.2 }}
            className="h-full rounded-full bg-gradient-to-r from-accent-600 to-accent-400"
          />
        </div>
      </div>

      {/* Timeline */}
      <ol className="relative grid gap-8 p-8 md:p-10">
        <span
          aria-hidden
          className="pointer-events-none absolute left-[27px] top-12 h-[calc(100%-6rem)] w-px bg-white/8 md:left-[31px]"
        />
        {shipment.events.map((event, i) => (
          <motion.li
            key={event.stage}
            variants={fadeUp}
            className="relative grid grid-cols-[auto_1fr] items-start gap-5"
          >
            <span
              aria-hidden
              className={`relative z-10 inline-flex h-12 w-12 items-center justify-center rounded-full border-2 transition-colors ${
                event.done
                  ? "border-accent-500 bg-accent-500 text-ink-950"
                  : "border-white/15 bg-ink-950 text-cloud-500"
              }`}
            >
              {event.done ? "✓" : i + 1}
            </span>
            <div className="pt-2">
              <p
                className={`font-display text-lg tracking-tight ${event.done ? "text-cloud-50" : "text-cloud-400"}`}
              >
                {event.label}
              </p>
              <p className="mt-1 text-sm text-cloud-400">{event.location}</p>
              <p className="mt-1 font-mono text-[11px] uppercase tracking-kicker text-cloud-500">
                {event.timestamp}
              </p>
            </div>
          </motion.li>
        ))}
      </ol>
    </article>
  );
}
