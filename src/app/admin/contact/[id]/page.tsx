import Link from "next/link";
import { notFound } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";
import SubmitButton from "@/components/admin/SubmitButton";
import StatusBadge from "@/components/admin/StatusBadge";
import { archiveEntity, updateContact } from "@/app/admin/actions";
import { getContactMessage, getStaffMembers } from "@/lib/admin/data";
import { contactStatuses } from "@/lib/admin/types";

type PageProps = {
  params: { id: string };
};

export default async function ContactDetailPage({ params }: PageProps) {
  const [message, staff] = await Promise.all([
    getContactMessage(params.id),
    getStaffMembers(true),
  ]);

  if (!message) notFound();

  return (
    <>
      <AdminNav />
      <div className="mb-5 flex items-center justify-between gap-4">
        <Link href="/admin/contact" className="text-sm text-cloud-400 hover:text-cloud-50">
          Back to messages
        </Link>
        <StatusBadge status={message.status} />
      </div>

      <form action={updateContact} className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <input type="hidden" name="id" value={message.id} />
        <input type="hidden" name="entity" value="contact_messages" />
        <section className="rounded-2xl border border-white/8 bg-ink-900/70 p-6 shadow-panel">
          <p className="font-mono text-[11px] uppercase tracking-kicker text-accent-500">
            Contact Message
          </p>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <Field label="Name" name="name" defaultValue={message.name} />
            <Field label="Email" name="email" type="email" defaultValue={message.email} />
            <Field label="Topic" name="topic" defaultValue={message.topic} />
            <Select label="Status" name="status" defaultValue={message.status} options={contactStatuses} />
            <StaffSelect staff={staff} defaultValue={message.assigned_to ?? ""} />
            <Textarea label="Message" name="message" defaultValue={message.message} className="md:col-span-2" />
          </div>
        </section>

        <aside className="rounded-2xl border border-white/8 bg-ink-900/70 p-6 shadow-panel">
          <h2 className="font-display text-2xl text-cloud-50">Internal Handling</h2>
          <Textarea label="Internal Notes" name="internal_notes" defaultValue={message.internal_notes ?? ""} className="mt-5" />
          <div className="mt-5 flex flex-wrap gap-3">
            <SubmitButton>Save Message</SubmitButton>
            <button
              type="submit"
              formAction={archiveEntity}
              className="inline-flex h-10 items-center justify-center rounded-full border border-white/10 bg-white/5 px-5 text-sm font-medium text-cloud-100 transition-colors hover:bg-white/10"
            >
              Archive
            </button>
          </div>
          <dl className="mt-8 space-y-4 text-sm">
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-kicker text-cloud-500">Created</dt>
              <dd className="mt-1 text-cloud-200">{new Date(message.created_at).toLocaleString()}</dd>
            </div>
            <div>
              <dt className="font-mono text-[11px] uppercase tracking-kicker text-cloud-500">Updated</dt>
              <dd className="mt-1 text-cloud-200">{new Date(message.updated_at).toLocaleString()}</dd>
            </div>
          </dl>
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
}: {
  label: string;
  name: string;
  defaultValue: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="mb-2 block font-mono text-[11px] uppercase tracking-kicker text-cloud-400">{label}</span>
      <input
        name={name}
        type={type}
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
        rows={6}
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
