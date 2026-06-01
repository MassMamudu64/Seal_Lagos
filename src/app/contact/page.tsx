"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import PageHeader from "@/components/layout/PageHeader";
import Button from "@/components/ui/Button";
import { company, offices, paymentMethods } from "@/lib/data";
import { fadeUp, staggerChildren, viewportOnce } from "@/lib/motion";

/**
 * Contact — three composed sections:
 *   1. Offices grid (with phones)
 *   2. Contact form + payment methods sidebar
 *   3. SVG world map highlighting our footprint
 */
export default function ContactPage() {
  return (
    <>
      <PageHeader
        kicker="Contact"
        title={
          <>
            We're a message
            <br />
            <span className="italic text-accent-400">or a phone call away.</span>
          </>
        }
        lede="Offices in the USA, Nigeria, Ghana and Liberia — and a support team ready to help with quotes, pickups and shipment questions."
      />

      {/* Offices grid */}
      <section className="shell py-section">
        <motion.ul
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerChildren}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        >
          {offices.map((o) => (
            <motion.li
              key={o.country}
              variants={fadeUp}
              className="group relative overflow-hidden rounded-2xl border border-white/8 bg-ink-900/60 p-6 shadow-panel ring-inset-faint"
            >
              <span className="text-3xl" aria-hidden>{o.flag}</span>
              <p className="mt-4 font-mono text-[11px] uppercase tracking-kicker text-cloud-500">
                {o.city}
              </p>
              <h3 className="mt-1 font-display text-2xl font-medium tracking-tight text-cloud-50">
                {o.country}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-cloud-300">
                {o.address}
              </p>
              <a
                href={`tel:${o.phone.replace(/\s+/g, "")}`}
                className="mt-5 inline-flex items-center gap-2 font-mono text-sm text-accent-400 transition-colors hover:text-accent-300"
              >
                <span aria-hidden>☎</span>
                {o.phone}
              </a>
              <span
                aria-hidden
                className="absolute bottom-0 left-0 h-px w-0 bg-accent-500 transition-all duration-500 group-hover:w-full"
              />
            </motion.li>
          ))}
        </motion.ul>
      </section>

      {/* Form + payments */}
      <section className="shell pb-section">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr]">
          <ContactForm />
          <PaymentSidebar />
        </div>
      </section>

      {/* Footprint map */}
      <section className="shell pb-section">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={fadeUp}
          className="relative overflow-hidden rounded-3xl border border-white/8 bg-ink-900/40 p-2 shadow-panel"
        >
          <div className="rounded-[1.4rem] bg-ink-950 p-8 md:p-12">
            <p className="font-mono text-[11px] uppercase tracking-kicker text-accent-500">
              Footprint · Where we operate
            </p>
            <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-cloud-50">
              Two continents. One operating tempo.
            </h2>
            <div className="mt-8">
              <FootprintMap />
            </div>
          </div>
        </motion.div>
      </section>
    </>
  );
}

/* ============================ contact form ============================== */

function ContactForm() {
  const [state, setState] = useState({
    name: "",
    email: "",
    topic: "Quote",
    message: "",
  });
  const [sent, setSent] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire to a real backend (Resend, Formspree, etc.).
    setSent(true);
  };

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-start gap-4 rounded-3xl border border-success/30 bg-success/[0.08] p-10 shadow-panel"
      >
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-success/15 text-success ring-1 ring-success/40">
          ✓
        </span>
        <h3 className="font-display text-2xl text-cloud-50">Thank you — your message is in.</h3>
        <p className="text-cloud-300">
          We'll respond as soon as possible. For urgent matters call us at{" "}
          <span className="font-mono text-cloud-50">{company.primaryPhone}</span>.
        </p>
        <Button onClick={() => setSent(false)} variant="ghost">
          Send another
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerChildren}
      onSubmit={submit}
      className="overflow-hidden rounded-3xl border border-white/8 bg-ink-900/60 shadow-panel"
    >
      <div className="grid gap-5 p-8 md:grid-cols-2 md:p-10">
        <FormField label="Your name">
          <input
            required
            value={state.name}
            onChange={(e) => setState({ ...state, name: e.target.value })}
            className="form-input"
          />
        </FormField>
        <FormField label="Email">
          <input
            type="email"
            required
            value={state.email}
            onChange={(e) => setState({ ...state, email: e.target.value })}
            className="form-input"
          />
        </FormField>
        <div className="md:col-span-2">
          <FormField label="Topic">
            <div className="flex flex-wrap gap-2">
              {["Quote", "Pickup", "Tracking", "Partnership", "Other"].map((t) => {
                const active = state.topic === t;
                return (
                  <button
                    type="button"
                    key={t}
                    onClick={() => setState({ ...state, topic: t })}
                    className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                      active
                        ? "border-accent-500 bg-accent-500/15 text-cloud-50"
                        : "border-white/10 text-cloud-300 hover:border-white/20"
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
          </FormField>
        </div>
        <div className="md:col-span-2">
          <FormField label="Message">
            <textarea
              required
              rows={5}
              value={state.message}
              onChange={(e) => setState({ ...state, message: e.target.value })}
              className="form-input resize-none"
            />
          </FormField>
        </div>
      </div>
      <div className="flex items-center justify-between border-t border-white/8 bg-white/[0.02] p-6">
        <p className="text-xs text-cloud-400">
          By submitting you agree to be contacted about your enquiry.
        </p>
        <Button type="submit" iconRight={<span aria-hidden>→</span>}>
          Send Message
        </Button>
      </div>

      <style jsx>{`
        :global(.form-input) {
          width: 100%;
          background: rgba(6, 10, 26, 0.7);
          color: rgb(251, 252, 255);
          border-radius: 12px;
          padding: 12px 16px;
          font-size: 15px;
          line-height: 1.5;
          outline: none;
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.08);
          transition: box-shadow 0.18s ease;
        }
        :global(.form-input:focus) {
          box-shadow: inset 0 0 0 2px rgb(245, 130, 31);
        }
      `}</style>
    </motion.form>
  );
}

function FormField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <motion.label variants={fadeUp} className="block">
      <span className="mb-2 block font-mono text-[11px] uppercase tracking-kicker text-cloud-400">
        {label}
      </span>
      {children}
    </motion.label>
  );
}

/* ============================ payments side ============================= */

function PaymentSidebar() {
  return (
    <motion.aside
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerChildren}
      className="flex flex-col gap-6"
    >
      <motion.div variants={fadeUp} className="rounded-3xl border border-white/8 bg-ink-900/60 p-8 shadow-panel">
        <p className="font-mono text-[11px] uppercase tracking-kicker text-accent-500">
          Pay with
        </p>
        <ul className="mt-5 space-y-4">
          {paymentMethods.map((p) => (
            <li key={p.label}>
              <p className="text-[15px] text-cloud-50">{p.label}</p>
              <p className="mt-1 font-mono text-xs text-cloud-400">{p.detail}</p>
            </li>
          ))}
        </ul>
      </motion.div>

      <motion.div variants={fadeUp} className="rounded-3xl border border-white/8 bg-gradient-to-br from-brand-900/50 to-ink-900/40 p-8 shadow-panel">
        <p className="font-mono text-[11px] uppercase tracking-kicker text-accent-500">
          Direct support
        </p>
        <p className="mt-4 font-display text-2xl leading-tight text-cloud-50">
          Prefer a call?
        </p>
        <p className="mt-2 text-sm text-cloud-300">
          We answer the phone — for quotes, pickups and tracking.
        </p>
        <a
          href={`tel:${company.primaryPhone.replace(/\s+/g, "")}`}
          className="mt-4 inline-flex items-center gap-2 font-mono text-accent-400 hover:text-accent-300"
        >
          ☎ {company.primaryPhone}
        </a>
        <p className="mt-3 font-mono text-xs text-cloud-400">{company.email}</p>
      </motion.div>
    </motion.aside>
  );
}

/* ============================ map graphic =============================== */

function FootprintMap() {
  // Stylised footprint — not geographically literal. Markers are positioned
  // to evoke North America and West/Southern Africa.
  const points = [
    { x: 180, y: 200, label: "Brooklyn Center, MN" },
    { x: 520, y: 290, label: "Lagos, NG" },
    { x: 500, y: 275, label: "Accra, GH" },
    { x: 480, y: 280, label: "Lomé, TG" },
    { x: 460, y: 290, label: "Monrovia, LR" },
    { x: 450, y: 285, label: "Conakry, GN" },
    { x: 580, y: 410, label: "South Africa" },
  ];
  return (
    <svg viewBox="0 0 800 460" className="h-auto w-full" role="img" aria-label="Footprint map">
      <defs>
        <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F5821F" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#F5821F" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* Continental silhouettes — simplified */}
      <g fill="none" stroke="rgba(155,164,196,0.18)" strokeWidth="1">
        {/* North America blob */}
        <path d="M 80 130 Q 120 90 180 100 Q 240 95 270 140 Q 280 200 230 260 Q 170 280 130 250 Q 70 220 80 130 Z" />
        {/* Africa blob */}
        <path d="M 430 200 Q 490 180 540 210 Q 560 260 555 320 Q 540 380 500 410 Q 460 430 430 410 Q 410 360 410 290 Q 410 230 430 200 Z" />
      </g>

      {/* Routes */}
      <g fill="none" stroke="rgba(245,130,31,0.45)" strokeWidth="1.3" strokeDasharray="4 6">
        <path d="M 180 200 Q 350 100 520 290" />
        <path d="M 180 200 Q 380 360 580 410" />
        <path d="M 520 290 Q 500 320 450 285" />
      </g>

      {/* Markers */}
      {points.map((p) => (
        <g key={p.label}>
          <circle cx={p.x} cy={p.y} r="22" fill="url(#mapGlow)" />
          <circle cx={p.x} cy={p.y} r="5" fill="#F5821F" />
          <text x={p.x + 12} y={p.y - 8} className="fill-cloud-300" fontSize="11">
            {p.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
