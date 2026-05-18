"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Button from "@/components/ui/Button";
import { routes, services } from "@/lib/data";
import { easeOut } from "@/lib/motion";
import { cn } from "@/lib/utils";

/**
 * BookingForm — four-step shipment booking flow.
 *
 *   1. Route & Service
 *   2. Package details
 *   3. Sender & receiver
 *   4. Review & submit
 *
 * Each step animates in from the right and out to the left. Per-step
 * validation gates the "Next" button. On submission the form swaps to a
 * confirmation panel (no real backend — see TODO in code).
 */

type Step = 1 | 2 | 3 | 4;

type FormState = {
  routeId: string;
  serviceSlug: string;
  weight: string;
  unit: "lbs" | "kg";
  description: string;
  pickup: boolean;
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  receiverName: string;
  receiverPhone: string;
  receiverAddress: string;
  notes: string;
};

const initial: FormState = {
  routeId: routes[0].id,
  serviceSlug: services[0].slug,
  weight: "",
  unit: "lbs",
  description: "",
  pickup: false,
  senderName: "",
  senderEmail: "",
  senderPhone: "",
  receiverName: "",
  receiverPhone: "",
  receiverAddress: "",
  notes: "",
};

const STEP_LABELS: Record<Step, string> = {
  1: "Route & Service",
  2: "Package",
  3: "Sender & Receiver",
  4: "Review",
};

export default function BookingForm() {
  const [step, setStep] = useState<Step>(1);
  const [form, setForm] = useState<FormState>(initial);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [submitted, setSubmitted] = useState(false);
  const [confirmationId, setConfirmationId] = useState<string>("");

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const stepIsValid = (s: Step): boolean => {
    if (s === 1) return Boolean(form.routeId && form.serviceSlug);
    if (s === 2) return Boolean(form.weight && parseFloat(form.weight) > 0 && form.description.trim());
    if (s === 3)
      return Boolean(
        form.senderName.trim() &&
          form.senderEmail.trim() &&
          form.senderPhone.trim() &&
          form.receiverName.trim() &&
          form.receiverPhone.trim() &&
          form.receiverAddress.trim(),
      );
    return true;
  };

  const next = () => {
    if (!stepIsValid(step)) return;
    setDirection(1);
    setStep((s) => Math.min(4, s + 1) as Step);
  };
  const back = () => {
    setDirection(-1);
    setStep((s) => Math.max(1, s - 1) as Step);
  };

  const submit = () => {
    // TODO: replace with a real backend call (Resend, Formspree, custom API).
    const id =
      "SL-" +
      Array.from({ length: 6 }, () =>
        "ABCDEFGHJKMNPQRSTUVWXYZ23456789"[Math.floor(Math.random() * 30)],
      ).join("");
    setConfirmationId(id);
    setSubmitted(true);
  };

  if (submitted) {
    return <BookingConfirmation id={confirmationId} email={form.senderEmail} reset={() => {
      setForm(initial);
      setStep(1);
      setSubmitted(false);
    }} />;
  }

  return (
    <section className="shell pb-section">
      <div className="overflow-hidden rounded-3xl border border-white/8 bg-ink-900/60 shadow-panel">
        {/* Progress bar */}
        <ol className="relative grid grid-cols-4 border-b border-white/8">
          {([1, 2, 3, 4] as Step[]).map((s) => {
            const active = step === s;
            const done = step > s;
            return (
              <li
                key={s}
                className={cn(
                  "relative flex items-center gap-3 px-5 py-5 text-left transition-colors",
                  active && "bg-white/[0.04]",
                )}
              >
                <span
                  className={cn(
                    "inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-xs transition-colors",
                    done
                      ? "bg-accent-500 text-ink-950"
                      : active
                      ? "border border-accent-500 text-accent-400"
                      : "border border-white/15 text-cloud-500",
                  )}
                >
                  {done ? "✓" : s}
                </span>
                <span className="hidden text-xs uppercase tracking-kicker text-cloud-300 md:inline">
                  {STEP_LABELS[s]}
                </span>
                {active && (
                  <motion.span
                    layoutId="booking-step-underline"
                    className="absolute inset-x-0 bottom-0 h-0.5 bg-accent-500"
                    transition={{ type: "spring", stiffness: 320, damping: 28 }}
                  />
                )}
              </li>
            );
          })}
        </ol>

        {/* Body */}
        <div className="relative min-h-[520px] overflow-hidden">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={step}
              custom={direction}
              initial={{ opacity: 0, x: 36 * direction }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -36 * direction }}
              transition={{ duration: 0.4, ease: easeOut }}
              className="px-6 py-10 md:px-12"
            >
              {step === 1 && <Step1 form={form} update={update} />}
              {step === 2 && <Step2 form={form} update={update} />}
              {step === 3 && <Step3 form={form} update={update} />}
              {step === 4 && <Step4 form={form} />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Footer actions */}
        <div className="flex flex-col-reverse items-stretch justify-between gap-3 border-t border-white/8 bg-white/[0.02] p-6 sm:flex-row sm:items-center">
          <Button variant="ghost" onClick={back} disabled={step === 1}>
            ← Back
          </Button>
          {step < 4 ? (
            <Button onClick={next} disabled={!stepIsValid(step)} iconRight={<span aria-hidden>→</span>}>
              Continue
            </Button>
          ) : (
            <Button onClick={submit} iconRight={<span aria-hidden>✓</span>}>
              Submit Booking
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}

/* ============================ step bodies =============================== */

function Step1({ form, update }: { form: FormState; update: <K extends keyof FormState>(k: K, v: FormState[K]) => void }) {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div>
        <Legend index="01" title="Choose your corridor" subtitle="Pick the route this shipment will travel." />
        <div className="mt-6 grid gap-2">
          {routes.map((r) => {
            const active = form.routeId === r.id;
            return (
              <label
                key={r.id}
                className={cn(
                  "group flex cursor-pointer items-center justify-between gap-4 rounded-xl border bg-ink-950/40 px-4 py-3.5 transition-colors",
                  active ? "border-accent-500/60 bg-accent-500/[0.05]" : "border-white/8 hover:border-white/15",
                )}
              >
                <span className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="route"
                    value={r.id}
                    checked={active}
                    onChange={() => update("routeId", r.id)}
                    className="sr-only"
                  />
                  <span
                    className={cn(
                      "inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                      active ? "border-accent-500" : "border-white/30",
                    )}
                  >
                    {active && <span className="h-1.5 w-1.5 rounded-full bg-accent-500" />}
                  </span>
                  <span>
                    <span className="block text-[15px] text-cloud-50">{r.from} → {r.to}</span>
                    <span className="block font-mono text-[10px] uppercase tracking-kicker text-cloud-500">
                      {r.frequency} · {r.transit}
                    </span>
                  </span>
                </span>
                <span className="font-mono text-[10px] uppercase tracking-kicker text-accent-500">
                  {r.fromCode}→{r.toCode}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <div>
        <Legend index="02" title="Pick a service" subtitle="What kind of handling does this shipment need?" />
        <div className="mt-6 grid gap-2">
          {services.map((s) => {
            const active = form.serviceSlug === s.slug;
            return (
              <button
                key={s.slug}
                type="button"
                onClick={() => update("serviceSlug", s.slug)}
                className={cn(
                  "rounded-xl border bg-ink-950/40 p-4 text-left transition-colors",
                  active
                    ? "border-accent-500/60 bg-accent-500/[0.05]"
                    : "border-white/8 hover:border-white/15",
                )}
              >
                <p className="text-[15px] text-cloud-50">{s.title}</p>
                <p className="mt-1 text-xs text-cloud-400">{s.short}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Step2({ form, update }: { form: FormState; update: <K extends keyof FormState>(k: K, v: FormState[K]) => void }) {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      <div className="md:col-span-2">
        <Legend index="03" title="Package details" subtitle="Tell us what's inside and how much it weighs." />
      </div>

      <Input
        label="Weight"
        type="number"
        value={form.weight}
        onChange={(v) => update("weight", v)}
        suffix={
          <div className="flex items-center gap-1 rounded-full bg-ink-900 p-1 ring-1 ring-white/10">
            {(["lbs", "kg"] as const).map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => update("unit", u)}
                className={cn(
                  "relative rounded-full px-3 py-1 text-xs font-medium uppercase tracking-kicker",
                  form.unit === u ? "text-ink-950" : "text-cloud-300",
                )}
              >
                {form.unit === u && (
                  <motion.span
                    layoutId="booking-unit-pill"
                    className="absolute inset-0 rounded-full bg-accent-500"
                    transition={{ type: "spring", stiffness: 320, damping: 28 }}
                  />
                )}
                <span className="relative">{u}</span>
              </button>
            ))}
          </div>
        }
      />

      <Input
        label="Pickup or drop-off"
        readOnly
        value={form.pickup ? "Scheduled pickup" : "Office drop-off"}
        suffix={
          <button
            type="button"
            onClick={() => update("pickup", !form.pickup)}
            className="inline-flex h-9 items-center rounded-full bg-white/5 px-4 text-xs text-cloud-200 ring-1 ring-white/10 transition-colors hover:bg-white/10"
          >
            Toggle
          </button>
        }
      />

      <div className="md:col-span-2">
        <Textarea
          label="Package description"
          value={form.description}
          onChange={(v) => update("description", v)}
          placeholder="Two pairs of shoes, a sealed phone in box, documents…"
          rows={4}
        />
      </div>
    </div>
  );
}

function Step3({ form, update }: { form: FormState; update: <K extends keyof FormState>(k: K, v: FormState[K]) => void }) {
  return (
    <div className="grid gap-10 md:grid-cols-2">
      <div>
        <Legend index="04" title="Sender" subtitle="Who is sending this shipment?" />
        <div className="mt-6 grid gap-4">
          <Input label="Full name" value={form.senderName} onChange={(v) => update("senderName", v)} />
          <Input label="Email" type="email" value={form.senderEmail} onChange={(v) => update("senderEmail", v)} />
          <Input label="Phone" type="tel" value={form.senderPhone} onChange={(v) => update("senderPhone", v)} />
        </div>
      </div>
      <div>
        <Legend index="05" title="Receiver" subtitle="Who is receiving it?" />
        <div className="mt-6 grid gap-4">
          <Input label="Full name" value={form.receiverName} onChange={(v) => update("receiverName", v)} />
          <Input label="Phone" type="tel" value={form.receiverPhone} onChange={(v) => update("receiverPhone", v)} />
          <Textarea label="Delivery address" value={form.receiverAddress} onChange={(v) => update("receiverAddress", v)} rows={3} />
        </div>
      </div>
      <div className="md:col-span-2">
        <Textarea
          label="Anything else we should know? (Optional)"
          value={form.notes}
          onChange={(v) => update("notes", v)}
          placeholder="Fragile, deliver after 5pm, alternate contact…"
          rows={3}
        />
      </div>
    </div>
  );
}

function Step4({ form }: { form: FormState }) {
  const route = routes.find((r) => r.id === form.routeId);
  const service = services.find((s) => s.slug === form.serviceSlug);

  return (
    <div>
      <Legend index="06" title="Review your booking" subtitle="Confirm the details and submit. We'll follow up with a quote and pickup window." />
      <dl className="mt-8 grid gap-4 md:grid-cols-2">
        <ReviewRow label="Corridor" value={route ? `${route.from} → ${route.to}` : "—"} sub={route ? `${route.frequency} · ${route.transit}` : ""} />
        <ReviewRow label="Service" value={service?.title ?? "—"} />
        <ReviewRow label="Package" value={`${form.weight || 0} ${form.unit}`} sub={form.description} />
        <ReviewRow label="Handover" value={form.pickup ? "Pickup scheduled" : "Drop-off at office"} />
        <ReviewRow label="Sender" value={form.senderName} sub={`${form.senderEmail} · ${form.senderPhone}`} />
        <ReviewRow label="Receiver" value={form.receiverName} sub={`${form.receiverPhone} · ${form.receiverAddress}`} />
        {form.notes && <ReviewRow label="Notes" value={form.notes} />}
      </dl>
    </div>
  );
}

/* ============================ confirmation ============================== */

function BookingConfirmation({ id, email, reset }: { id: string; email: string; reset: () => void }) {
  return (
    <section className="shell pb-section">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: easeOut }}
        className="relative overflow-hidden rounded-3xl border border-white/8 bg-ink-900/60 p-10 text-center shadow-panel md:p-16"
      >
        <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-success/60 to-transparent" />
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.15 }}
          className="mx-auto inline-flex h-16 w-16 items-center justify-center rounded-full bg-success/15 text-2xl text-success ring-1 ring-success/40"
        >
          ✓
        </motion.div>
        <h2 className="mt-6 font-display text-3xl tracking-tight text-cloud-50 md:text-4xl">
          Booking received.
        </h2>
        <p className="mx-auto mt-3 max-w-md text-cloud-300">
          We'll be in touch at <span className="text-cloud-50">{email || "the email you provided"}</span> with confirmation, pickup details and a final quote.
        </p>
        <div className="mx-auto mt-8 inline-flex flex-col items-center rounded-2xl border border-white/8 bg-ink-950/60 px-6 py-4">
          <span className="font-mono text-[11px] uppercase tracking-kicker text-cloud-400">
            Reference
          </span>
          <span className="mt-1 font-mono text-2xl tracking-wide text-accent-400">{id}</span>
        </div>
        <div className="mt-8">
          <button
            type="button"
            onClick={reset}
            className="text-sm text-cloud-400 underline-offset-4 hover:text-cloud-50 hover:underline"
          >
            Submit another booking
          </button>
        </div>
      </motion.div>
    </section>
  );
}

/* =============================== atoms ================================== */

function Legend({ index, title, subtitle }: { index: string; title: string; subtitle: string }) {
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-kicker text-accent-500">{index} / {title}</p>
      <p className="mt-2 max-w-md text-pretty text-sm text-cloud-400">{subtitle}</p>
    </div>
  );
}

function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  suffix,
  readOnly,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  type?: string;
  placeholder?: string;
  suffix?: React.ReactNode;
  readOnly?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-2 block font-mono text-[11px] uppercase tracking-kicker text-cloud-400">
        {label}
      </span>
      <span className="relative block">
        <input
          type={type}
          value={value}
          onChange={onChange ? (e) => onChange(e.target.value) : undefined}
          readOnly={readOnly}
          placeholder={placeholder}
          className="h-12 w-full rounded-xl bg-ink-950/80 px-4 pr-32 text-[15px] text-cloud-50 outline-none ring-1 ring-white/10 transition-shadow focus:ring-2 focus:ring-accent-500"
        />
        {suffix && (
          <span className="absolute right-2 top-1/2 -translate-y-1/2">{suffix}</span>
        )}
      </span>
    </label>
  );
}

function Textarea({
  label,
  value,
  onChange,
  placeholder,
  rows = 3,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="mb-2 block font-mono text-[11px] uppercase tracking-kicker text-cloud-400">
        {label}
      </span>
      <textarea
        rows={rows}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full resize-none rounded-xl bg-ink-950/80 p-4 text-[15px] leading-relaxed text-cloud-50 outline-none ring-1 ring-white/10 transition-shadow focus:ring-2 focus:ring-accent-500"
      />
    </label>
  );
}

function ReviewRow({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-xl border border-white/8 bg-ink-950/40 px-5 py-4">
      <dt className="font-mono text-[11px] uppercase tracking-kicker text-cloud-500">{label}</dt>
      <dd className="mt-1 text-[15px] text-cloud-50">{value || "—"}</dd>
      {sub && <p className="mt-1 text-xs text-cloud-400">{sub}</p>}
    </div>
  );
}
