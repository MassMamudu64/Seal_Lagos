import Link from "next/link";
import AdminNav from "@/components/admin/AdminNav";
import StatusBadge from "@/components/admin/StatusBadge";
import { getBookings } from "@/lib/admin/data";
import { bookingStatuses } from "@/lib/admin/types";

type PageProps = {
  searchParams?: { status?: string; search?: string };
};

function exportHref(status: string, search: string): string {
  const params = new URLSearchParams();
  if (status !== "all") params.set("status", status);
  if (search) params.set("search", search);
  return `/admin/bookings/export${params.size ? `?${params.toString()}` : ""}`;
}

export default async function AdminBookingsPage({ searchParams }: PageProps) {
  const status = searchParams?.status ?? "all";
  const search = searchParams?.search ?? "";
  const bookings = await getBookings({ status, search });

  return (
    <>
      <AdminNav />
      <section className="rounded-2xl border border-white/8 bg-ink-900/70 shadow-panel">
        <div className="border-b border-white/8 p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-kicker text-accent-500">
                Admin / Bookings
              </p>
              <h2 className="mt-2 font-display text-3xl text-cloud-50">Bookings</h2>
            </div>
            <form className="flex flex-col gap-3 md:flex-row md:items-center">
              <input
                name="search"
                defaultValue={search}
                placeholder="Search reference, sender, receiver..."
                className="h-10 rounded-xl bg-ink-950/80 px-4 text-sm text-cloud-50 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-accent-500"
              />
              <select
                name="status"
                defaultValue={status}
                className="h-10 rounded-xl bg-ink-950/80 px-4 text-sm text-cloud-50 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-accent-500"
              >
                <option value="all">All statuses</option>
                {bookingStatuses.map((item) => (
                  <option key={item} value={item}>
                    {item.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
              <button className="h-10 rounded-full bg-accent-500 px-5 text-sm font-medium text-ink-950">
                Filter
              </button>
              <Link href={exportHref(status, search)} className="h-10 rounded-full border border-white/10 px-5 py-2 text-sm text-cloud-100">
                Export CSV
              </Link>
            </form>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-left text-sm">
            <thead className="border-b border-white/8 bg-white/[0.03] font-mono text-[11px] uppercase tracking-kicker text-cloud-500">
              <tr>
                <th className="px-5 py-4">Reference</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Sender</th>
                <th className="px-5 py-4">Receiver</th>
                <th className="px-5 py-4">Route</th>
                <th className="px-5 py-4">Assigned</th>
                <th className="px-5 py-4">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {bookings.map((booking) => (
                <tr key={booking.id} className="transition-colors hover:bg-white/[0.02]">
                  <td className="px-5 py-4">
                    <Link href={`/admin/bookings/${booking.id}`} className="font-mono text-accent-400 hover:text-accent-300">
                      {booking.reference}
                    </Link>
                  </td>
                  <td className="px-5 py-4"><StatusBadge status={booking.status} /></td>
                  <td className="px-5 py-4 text-cloud-200">
                    {booking.sender_name}
                    <span className="block text-xs text-cloud-500">{booking.sender_email}</span>
                  </td>
                  <td className="px-5 py-4 text-cloud-300">{booking.receiver_name}</td>
                  <td className="px-5 py-4 font-mono text-xs text-cloud-300">{booking.route_id}</td>
                  <td className="px-5 py-4 text-cloud-300">{booking.staff_members?.name ?? "Unassigned"}</td>
                  <td className="px-5 py-4 text-cloud-400">{new Date(booking.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {bookings.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-cloud-500">
                    No bookings found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
