"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  weightRates,
  electronicItems,
  SERVICE_FEE,
  type WeightRate,
  type ElectronicItem,
} from "@/lib/data";
import { clamp, formatUSD, kgToLbs, lbsToKg } from "@/lib/utils";
import { LinkButton } from "@/components/ui/Button";
import { easeOut, modalSpring } from "@/lib/motion";

/**
 * QuoteCalculator — two-mode estimator.
 *
 *   ❶ By Weight    — pick a corridor, enter weight in lbs or kg, see total
 *   ❷ Electronics  — add items at flat per-piece rates
 *
 * Quotes are estimates, not invoices. Service fee + minimums applied per the
 * company's published rates.
 */

type Mode = "weight" | "electronics";

export default function QuoteCalculator() {
  const [mode, setMode] = useState<Mode>("weight");

  return (
    <section className="shell pb-section">
      <div className="overflow-hidden rounded-3xl border border-white/8 bg-ink-900/60 shadow-panel ring-inset-faint">
        {/* Mode switcher */}
        <div className="grid grid-cols-2 border-b border-white/8">
          {(["weight", "electronics"] as Mode[]).map((m) => {
            const active = mode === m;
            return (
              <button
                key={m}
                onClick={() => setMode(m)}
                aria-pressed={active}
                className="group relative px-6 py-5 text-left transition-colors hover:bg-white/[0.03]"
              >
                <span className="font-mono text-[11px] uppercase tracking-kicker text-cloud-500">
                  {m === "weight" ? "01 / Mode" : "02 / Mode"}
                </span>
                <span className={`mt-2 block font-display text-xl tracking-tight ${active ? "text-cloud-50" : "text-cloud-400"}`}>
                  {m === "weight" ? "By Weight" : "Electronics"}
                </span>
                {active && (
                  <motion.span
                    layoutId="quote-tab-underline"
                    className="absolute inset-x-0 bottom-0 h-0.5 bg-accent-500"
                    transition={{ type: "spring", stiffness: 320, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="relative">
          <AnimatePresence mode="wait">
            {mode === "weight" ? (
              <motion.div
                key="weight"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: easeOut }}
              >
                <WeightCalculator />
              </motion.div>
            ) : (
              <motion.div
                key="electronics"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease: easeOut }}
              >
                <ElectronicsCalculator />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

/* ============================== weight mode ============================= */

function WeightCalculator() {
  const [corridorId, setCorridorId] = useState<string>(weightRates[0].id);
  const [unit, setUnit] = useState<"lbs" | "kg">("lbs");
  const [amount, setAmount] = useState<string>("10");

  const corridor: WeightRate = weightRates.find((r) => r.id === corridorId) ?? weightRates[0];

  const computed = useMemo(() => {
    const raw = parseFloat(amount) || 0;
    // Convert input to the corridor's native unit
    let inCorridorUnit: number;
    if (corridor.unit === unit) {
      inCorridorUnit = raw;
    } else if (corridor.unit === "lbs") {
      inCorridorUnit = kgToLbs(raw);
    } else {
      inCorridorUnit = lbsToKg(raw);
    }
    const billable = Math.max(inCorridorUnit, corridor.minimum);
    const freight = billable * corridor.rate;
    const total = freight + corridor.serviceFee;
    return {
      billable,
      freight,
      serviceFee: corridor.serviceFee,
      total,
      minimumApplied: inCorridorUnit < corridor.minimum,
    };
  }, [amount, unit, corridor]);

  return (
    <div className="grid gap-10 p-8 lg:grid-cols-[1.4fr_1fr] lg:p-12">
      {/* Inputs */}
      <div className="space-y-7">
        {/* Corridor select */}
        <Field
          label="Corridor"
          hint="Pick the route you're shipping along."
        >
          <select
            value={corridorId}
            onChange={(e) => setCorridorId(e.target.value)}
            className="w-full appearance-none rounded-xl border border-white/10 bg-ink-950/80 px-4 py-3.5 pr-10 text-[15px] text-cloud-50 outline-none transition-colors focus:border-accent-500 focus:bg-ink-950"
          >
            {weightRates.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label} · {formatUSD(r.rate)}/{r.unit}
              </option>
            ))}
          </select>
          <span aria-hidden className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-cloud-400">▾</span>
        </Field>

        {/* Weight input + unit */}
        <div>
          <Field
            label="Weight"
            hint={`Minimum ${corridor.minimum}${corridor.unit} per shipment.`}
          >
            <input
              type="number"
              inputMode="decimal"
              min={0}
              step="0.1"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-ink-950/80 px-4 py-3.5 pr-24 text-[15px] text-cloud-50 outline-none transition-colors focus:border-accent-500 focus:bg-ink-950"
            />
            <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1 rounded-full bg-ink-900 p-1 ring-1 ring-white/10">
              {(["lbs", "kg"] as const).map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setUnit(u)}
                  className={`relative rounded-full px-3 py-1 text-xs font-medium uppercase tracking-kicker ${unit === u ? "text-ink-950" : "text-cloud-300"}`}
                >
                  {unit === u && (
                    <motion.span
                      layoutId="quote-unit-pill"
                      className="absolute inset-0 rounded-full bg-accent-500"
                      transition={{ type: "spring", stiffness: 320, damping: 28 }}
                    />
                  )}
                  <span className="relative">{u}</span>
                </button>
              ))}
            </div>
          </Field>

          {/* Slider */}
          <div className="mt-4">
            <input
              type="range"
              min={0}
              max={150}
              step={1}
              value={clamp(parseFloat(amount) || 0, 0, 150)}
              onChange={(e) => setAmount(e.target.value)}
              aria-label="Weight slider"
              className="seal-range w-full"
            />
            <style jsx>{`
              .seal-range {
                -webkit-appearance: none;
                appearance: none;
                height: 4px;
                background: linear-gradient(to right, rgb(245, 130, 31) 0%, rgb(245, 130, 31) ${Math.min(
                  100,
                  ((parseFloat(amount) || 0) / 150) * 100,
                )}%, rgba(155, 164, 196, 0.18) ${Math.min(
                  100,
                  ((parseFloat(amount) || 0) / 150) * 100,
                )}%, rgba(155, 164, 196, 0.18) 100%);
                border-radius: 999px;
                outline: none;
              }
              .seal-range::-webkit-slider-thumb {
                -webkit-appearance: none;
                appearance: none;
                width: 18px;
                height: 18px;
                background: #fff;
                border: 2px solid rgb(245, 130, 31);
                border-radius: 999px;
                cursor: pointer;
                box-shadow: 0 4px 14px -2px rgba(245, 130, 31, 0.55);
              }
              .seal-range::-moz-range-thumb {
                width: 18px;
                height: 18px;
                background: #fff;
                border: 2px solid rgb(245, 130, 31);
                border-radius: 999px;
                cursor: pointer;
              }
            `}</style>
          </div>
        </div>

        {computed.minimumApplied && (
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl border border-warning/30 bg-warning/10 px-4 py-3 text-sm text-warning"
          >
            Minimum shipment of {corridor.minimum} {corridor.unit} applies on this corridor.
          </motion.p>
        )}
      </div>

      {/* Summary */}
      <SummaryPanel
        rows={[
          {
            label: `Freight (${computed.billable.toFixed(2)} ${corridor.unit} × ${formatUSD(corridor.rate)})`,
            value: formatUSD(computed.freight),
          },
          {
            label: `Service fee ${corridor.serviceFee === 0 ? "(waived for this corridor)" : ""}`,
            value: formatUSD(computed.serviceFee),
          },
        ]}
        total={computed.total}
        note={
          corridor.serviceFee === 0
            ? "A $30 service fee applies to every invoice except Nigeria-origin corridors."
            : `Includes a ${formatUSD(SERVICE_FEE)} service fee per the standard rate sheet.`
        }
      />
    </div>
  );
}

/* =========================== electronics mode =========================== */

function ElectronicsCalculator() {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [serviceFee, setServiceFee] = useState<boolean>(true);

  const items = useMemo(() => {
    return electronicItems.filter((it) => (counts[it.id] ?? 0) > 0);
  }, [counts]);

  const subtotal = items.reduce(
    (sum, it) => sum + it.price * (counts[it.id] ?? 0),
    0,
  );
  const total = subtotal + (serviceFee ? SERVICE_FEE : 0);

  const update = (id: string, delta: number) =>
    setCounts((prev) => {
      const next = Math.max(0, (prev[id] ?? 0) + delta);
      return { ...prev, [id]: next };
    });

  // Group items by category for nicer display.
  const groups = useMemo(() => {
    const map = new Map<ElectronicItem["group"], ElectronicItem[]>();
    for (const it of electronicItems) {
      const arr = map.get(it.group) ?? [];
      arr.push(it);
      map.set(it.group, arr);
    }
    return Array.from(map.entries());
  }, []);

  return (
    <div className="grid gap-10 p-8 lg:grid-cols-[1.4fr_1fr] lg:p-12">
      <div>
        <p className="mb-6 text-sm text-cloud-400">
          Electronics ship at flat per-item rates, not by weight. Pick what
          you're sending and we'll total it.
        </p>

        <div className="space-y-7">
          {groups.map(([group, list]) => (
            <div key={group}>
              <h3 className="mb-3 font-mono text-[11px] uppercase tracking-kicker text-cloud-500">
                {group}
              </h3>
              <ul className="grid gap-2">
                {list.map((it) => (
                  <li
                    key={it.id}
                    className="flex items-center justify-between gap-3 rounded-xl border border-white/8 bg-ink-950/40 px-4 py-3 transition-colors hover:border-white/15"
                  >
                    <div>
                      <p className="text-[15px] text-cloud-100">{it.name}</p>
                      <p className="font-mono text-[11px] uppercase tracking-kicker text-cloud-500">
                        {formatUSD(it.price)} / item
                      </p>
                    </div>
                    <Stepper
                      value={counts[it.id] ?? 0}
                      onIncrement={() => update(it.id, +1)}
                      onDecrement={() => update(it.id, -1)}
                    />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <SummaryPanel
        rows={
          items.length === 0
            ? [{ label: "Items", value: "—", muted: true }]
            : items.map((it) => ({
                label: `${it.name} × ${counts[it.id]}`,
                value: formatUSD(it.price * (counts[it.id] ?? 0)),
              }))
        }
        extra={
          <label className="mt-4 flex items-center gap-3 rounded-xl border border-white/8 bg-white/[0.02] px-4 py-3 text-sm text-cloud-200">
            <input
              type="checkbox"
              checked={serviceFee}
              onChange={(e) => setServiceFee(e.target.checked)}
              className="h-4 w-4 accent-accent-500"
            />
            Include {formatUSD(SERVICE_FEE)} service fee
            <span className="ml-auto font-mono text-[11px] text-cloud-500">Nigeria origin: waive</span>
          </label>
        }
        total={total}
        note="A $30 service fee applies to every invoice except Nigeria-origin corridors."
      />
    </div>
  );
}

/* ============================ shared atoms ============================== */

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block font-mono text-[11px] uppercase tracking-kicker text-cloud-400">
        {label}
      </span>
      <span className="relative block">{children}</span>
      {hint && <span className="mt-2 block text-[12px] text-cloud-500">{hint}</span>}
    </label>
  );
}

function Stepper({
  value,
  onIncrement,
  onDecrement,
}: {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
}) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-ink-900 p-1">
      <button
        type="button"
        aria-label="Decrement"
        onClick={onDecrement}
        disabled={value === 0}
        className="inline-flex h-8 w-8 items-center justify-center rounded-full text-cloud-200 transition-colors hover:bg-white/5 disabled:opacity-40"
      >
        −
      </button>
      <span className="min-w-8 text-center font-mono text-sm text-cloud-50">
        {value}
      </span>
      <button
        type="button"
        aria-label="Increment"
        onClick={onIncrement}
        className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-accent-500/15 text-accent-400 transition-colors hover:bg-accent-500/25"
      >
        +
      </button>
    </div>
  );
}

type SummaryRow = { label: string; value: string; muted?: boolean };

function SummaryPanel({
  rows,
  extra,
  total,
  note,
}: {
  rows: SummaryRow[];
  extra?: React.ReactNode;
  total: number;
  note?: string;
}) {
  return (
    <motion.aside
      variants={modalSpring}
      initial="hidden"
      animate="visible"
      className="relative h-fit overflow-hidden rounded-2xl border border-white/8 bg-ink-950/60 p-6 shadow-lift ring-inset-faint"
    >
      <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-500/60 to-transparent" />
      <p className="font-mono text-[11px] uppercase tracking-kicker text-accent-500">
        Estimate
      </p>
      <p className="mt-1 font-display text-xs text-cloud-400">
        For planning. Not an invoice.
      </p>

      <ul className="mt-6 space-y-3">
        {rows.map((r, i) => (
          <li
            key={`${r.label}-${i}`}
            className={`flex items-baseline justify-between gap-4 text-sm ${r.muted ? "text-cloud-500" : "text-cloud-200"}`}
          >
            <span className="truncate">{r.label}</span>
            <span className="font-mono tabular-nums">{r.value}</span>
          </li>
        ))}
      </ul>

      {extra}

      <div className="mt-6 border-t border-white/8 pt-5">
        <p className="font-mono text-[11px] uppercase tracking-kicker text-cloud-400">
          Estimated total
        </p>
        <p className="mt-2 font-display text-4xl font-medium tracking-tight text-cloud-50">
          {formatUSD(total)}
        </p>
      </div>

      <div className="mt-6 flex flex-col gap-3">
        <LinkButton href="/booking" fullWidth iconRight={<span aria-hidden>→</span>}>
          Confirm with our team
        </LinkButton>
        <LinkButton href="/pricing#rates" fullWidth variant="ghost">
          View rate sheet
        </LinkButton>
      </div>

      {note && <p className="mt-4 text-[12px] text-cloud-500">{note}</p>}
    </motion.aside>
  );
}
