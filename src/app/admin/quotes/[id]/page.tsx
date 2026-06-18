import Link from "next/link";
import { notFound } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";
import SubmitButton from "@/components/admin/SubmitButton";
import StatusBadge from "@/components/admin/StatusBadge";
import { archiveEntity, updateQuote } from "@/app/admin/actions";
import { getQuote, getStaffMembers } from "@/lib/admin/data";
import { quoteStatuses } from "@/lib/admin/types";
import { formatUSD } from "@/lib/utils";

type PageProps = {
  params: { id: string };
};

export default async function QuoteDetailPage({ params }: PageProps) {
  const [quote, staff] = await Promise.all([
    getQuote(params.id),
    getStaffMembers(true),
  ]);

  if (!quote) notFound();

  return (
    <>
      <AdminNav />
      <div className="mb-5 flex items-center justify-between gap-4">
        <Link href="/admin/quotes" className="text-sm text-cloud-400 hover:text-cloud-50">
          Back to quotes
        </Link>
        <StatusBadge status={quote.status} />
      </div>

      <form action={updateQuote} className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
        <input type="hidden" name="id" value={quote.id} />
        <input type="hidden" name="entity" value="quotes" />
        <section className="rounded-2xl border border-white/8 bg-ink-900/70 p-6 shadow-panel">
          <p className="font-mono text-[11px] uppercase tracking-kicker text-accent-500">
            Quote / {quote.id.slice(0, 8)}
          </p>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <Select label="Mode" name="mode" defaultValue={quote.mode} options={["weight", "electronics"]} />
            <Select label="Status" name="status" defaultValue={quote.status} options={quoteStatuses} />
            <Field label="Corridor ID" name="corridor_id" defaultValue={quote.corridor_id ?? ""} />
            <StaffSelect staff={staff} defaultValue={quote.assigned_to ?? ""} />
            <Field label="Input Weight" name="input_weight" type="number" step="0.01" defaultValue={quote.input_weight ?? ""} />
            <UnitSelect defaultValue={quote.input_unit ?? ""} />
            <Field label="Billable Weight" name="billable_weight" type="number" step="0.01" defaultValue={quote.billable_weight ?? ""} />
            <Select
              label="Minimum Applied"
              name="minimum_applied"
              defaultValue={quote.minimum_applied ? "true" : "false"}
              options={["false", "true"]}
            />
            <Field label="Freight Total" name="freight_total" type="number" step="0.01" defaultValue={quote.freight_total} />
            <Field label="Service Fee" name="service_fee" type="number" step="0.01" defaultValue={quote.service_fee} />
            <Field label="Total" name="total" type="number" step="0.01" defaultValue={quote.total} />
            <Textarea label="Internal Notes" name="internal_notes" defaultValue={quote.internal_notes ?? ""} className="md:col-span-2" />
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-white/8 bg-ink-900/70 p-6 shadow-panel">
            <p className="font-mono text-[11px] uppercase tracking-kicker text-cloud-500">Estimate Total</p>
            <p className="mt-3 font-display text-4xl text-cloud-50">{formatUSD(quote.total)}</p>
            <dl className="mt-6 space-y-4 text-sm">
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-kicker text-cloud-500">Created</dt>
                <dd className="mt-1 text-cloud-200">{new Date(quote.created_at).toLocaleString()}</dd>
              </div>
              <div>
                <dt className="font-mono text-[11px] uppercase tracking-kicker text-cloud-500">Updated</dt>
                <dd className="mt-1 text-cloud-200">{new Date(quote.updated_at).toLocaleString()}</dd>
              </div>
            </dl>
          </section>

          <section className="rounded-2xl border border-white/8 bg-ink-900/70 p-6 shadow-panel">
            <div className="flex flex-wrap gap-3">
              <SubmitButton>Save Quote</SubmitButton>
              <button
                type="submit"
                formAction={archiveEntity}
                className="inline-flex h-10 items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 text-sm font-medium text-cloud-100 transition-colors hover:bg-white/10"
              >
                Archive
              </button>
            </div>
          </section>
        </aside>
      </form>
    </>
  );
}

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  step,
}: {
  label: string;
  name: string;
  defaultValue: string | number;
  type?: string;
  step?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block font-mono text-[11px] uppercase tracking-kicker text-cloud-400">{label}</span>
      <input
        name={name}
        type={type}
        step={step}
        defaultValue={defaultValue}
        className="h-11 w-full rounded-xl bg-ink-950/80 px-4 text-sm text-cloud-50 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-accent-500"
      />
    </label>
  );
}

function Textarea({
  label,
  name,
  defaultValue,
  className = "",
}: {
  label: string;
  name: string;
  defaultValue: string;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block font-mono text-[11px] uppercase tracking-kicker text-cloud-400">{label}</span>
      <textarea
        name={name}
        rows={5}
        defaultValue={defaultValue}
        className="w-full rounded-xl bg-ink-950/80 p-4 text-sm leading-relaxed text-cloud-50 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-accent-500"
      />
    </label>
  );
}

function Select<T extends string>({
  label,
  name,
  defaultValue,
  options,
}: {
  label: string;
  name: string;
  defaultValue: T | string;
  options: readonly T[];
}) {
  return (
    <label className="block">
      <span className="mb-2 block font-mono text-[11px] uppercase tracking-kicker text-cloud-400">{label}</span>
      <select
        name={name}
        defaultValue={defaultValue}
        className="h-11 w-full rounded-xl bg-ink-950/80 px-4 text-sm capitalize text-cloud-50 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-accent-500"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option.replace(/_/g, " ")}
          </option>
        ))}
      </select>
    </label>
  );
}

function UnitSelect({ defaultValue }: { defaultValue: string }) {
  return (
    <label className="block">
      <span className="mb-2 block font-mono text-[11px] uppercase tracking-kicker text-cloud-400">Input Unit</span>
      <select
        name="input_unit"
        defaultValue={defaultValue}
        className="h-11 w-full rounded-xl bg-ink-950/80 px-4 text-sm text-cloud-50 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-accent-500"
      >
        <option value="">N/A</option>
        <option value="lbs">lbs</option>
        <option value="kg">kg</option>
      </select>
    </label>
  );
}

function StaffSelect({
  staff,
  defaultValue,
}: {
  staff: Array<{ id: string; name: string; active: boolean }>;
  defaultValue: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block font-mono text-[11px] uppercase tracking-kicker text-cloud-400">Assigned To</span>
      <select
        name="assigned_to"
        defaultValue={defaultValue}
        className="h-11 w-full rounded-xl bg-ink-950/80 px-4 text-sm text-cloud-50 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-accent-500"
      >
        <option value="">Unassigned</option>
        {staff.map((member) => (
          <option key={member.id} value={member.id}>
            {member.name}{member.active ? "" : " (inactive)"}
          </option>
        ))}
      </select>
    </label>
  );
}
