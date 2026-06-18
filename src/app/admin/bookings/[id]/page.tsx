import Link from "next/link";
import { notFound } from "next/navigation";
import AdminNav from "@/components/admin/AdminNav";
import SubmitButton from "@/components/admin/SubmitButton";
import StatusBadge from "@/components/admin/StatusBadge";
import { archiveEntity, updateBooking } from "@/app/admin/actions";
import { getBooking, getStaffMembers } from "@/lib/admin/data";
import { bookingStatuses } from "@/lib/admin/types";

type PageProps = {
  params: { id: string };
};

export default async function BookingDetailPage({ params }: PageProps) {
  const [booking, staff] = await Promise.all([
    getBooking(params.id),
    getStaffMembers(true),
  ]);

  if (!booking) notFound();

  return (
    <>
      <AdminNav />
      <div className="mb-5 flex items-center justify-between gap-4">
        <Link href="/admin/bookings" className="text-sm text-cloud-400 hover:text-cloud-50">
          Back to bookings
        </Link>
        <StatusBadge status={booking.status} />
      </div>

      <form action={updateBooking} className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <input type="hidden" name="id" value={booking.id} />
        <input type="hidden" name="entity" value="bookings" />
        <section className="rounded-2xl border border-white/8 bg-ink-900/70 p-6 shadow-panel">
          <p className="font-mono text-[11px] uppercase tracking-kicker text-accent-500">
            Booking / {booking.reference}
          </p>
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <Field label="Reference" name="reference" defaultValue={booking.reference} />
            <Select label="Status" name="status" defaultValue={booking.status} options={bookingStatuses} />
            <Field label="Route ID" name="route_id" defaultValue={booking.route_id} />
            <Field label="Service Slug" name="service_slug" defaultValue={booking.service_slug} />
            <Field label="Weight" name="weight" type="number" step="0.01" defaultValue={booking.weight} />
            <Select label="Unit" name="unit" defaultValue={booking.unit} options={["lbs", "kg"]} />
            <Select
              label="Pickup Requested"
              name="pickup_requested"
              defaultValue={booking.pickup_requested ? "true" : "false"}
              options={["false", "true"]}
            />
            <StaffSelect staff={staff} defaultValue={booking.assigned_to ?? ""} />
            <Textarea label="Description" name="description" defaultValue={booking.description} className="md:col-span-2" />
            <Textarea label="Customer Notes" name="notes" defaultValue={booking.notes ?? ""} className="md:col-span-2" />
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-white/8 bg-ink-900/70 p-6 shadow-panel">
            <h2 className="font-display text-2xl text-cloud-50">Sender</h2>
            <div className="mt-5 grid gap-4">
              <Field label="Name" name="sender_name" defaultValue={booking.sender_name} />
              <Field label="Email" name="sender_email" type="email" defaultValue={booking.sender_email} />
              <Field label="Phone" name="sender_phone" defaultValue={booking.sender_phone} />
            </div>
          </section>

          <section className="rounded-2xl border border-white/8 bg-ink-900/70 p-6 shadow-panel">
            <h2 className="font-display text-2xl text-cloud-50">Receiver</h2>
            <div className="mt-5 grid gap-4">
              <Field label="Name" name="receiver_name" defaultValue={booking.receiver_name} />
              <Field label="Phone" name="receiver_phone" defaultValue={booking.receiver_phone} />
              <Textarea label="Address" name="receiver_address" defaultValue={booking.receiver_address} />
            </div>
          </section>

          <section className="rounded-2xl border border-white/8 bg-ink-900/70 p-6 shadow-panel">
            <Textarea label="Internal Notes" name="internal_notes" defaultValue={booking.internal_notes ?? ""} />
            <div className="mt-5 flex flex-wrap gap-3">
              <SubmitButton>Save Booking</SubmitButton>
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
        rows={4}
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
