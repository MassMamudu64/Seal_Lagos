import Link from "next/link";
import AdminNav from "@/components/admin/AdminNav";
import StatusBadge from "@/components/admin/StatusBadge";
import { getContactMessages } from "@/lib/admin/data";
import { contactStatuses } from "@/lib/admin/types";

type PageProps = {
  searchParams?: { status?: string; search?: string };
};

function exportHref(status: string, search: string): string {
  const params = new URLSearchParams();
  if (status !== "all") params.set("status", status);
  if (search) params.set("search", search);
  return `/admin/contact/export${params.size ? `?${params.toString()}` : ""}`;
}

export default async function AdminContactPage({ searchParams }: PageProps) {
  const status = searchParams?.status ?? "all";
  const search = searchParams?.search ?? "";
  const messages = await getContactMessages({ status, search });

  return (
    <>
      <AdminNav />
      <section className="rounded-2xl border border-white/8 bg-ink-900/70 shadow-panel">
        <div className="border-b border-white/8 p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-kicker text-accent-500">
                Admin / Contact
              </p>
              <h2 className="mt-2 font-display text-3xl text-cloud-50">Contact Messages</h2>
            </div>
            <form className="flex flex-col gap-3 md:flex-row md:items-center">
              <input
                name="search"
                defaultValue={search}
                placeholder="Search name, email, topic..."
                className="h-10 rounded-xl bg-ink-950/80 px-4 text-sm text-cloud-50 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-accent-500"
              />
              <select
                name="status"
                defaultValue={status}
                className="h-10 rounded-xl bg-ink-950/80 px-4 text-sm text-cloud-50 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-accent-500"
              >
                <option value="all">All statuses</option>
                {contactStatuses.map((item) => (
                  <option key={item} value={item}>
                    {item}
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
          <table className="w-full min-w-[880px] text-left text-sm">
            <thead className="border-b border-white/8 bg-white/[0.03] font-mono text-[11px] uppercase tracking-kicker text-cloud-500">
              <tr>
                <th className="px-5 py-4">Name</th>
                <th className="px-5 py-4">Status</th>
                <th className="px-5 py-4">Topic</th>
                <th className="px-5 py-4">Message</th>
                <th className="px-5 py-4">Assigned</th>
                <th className="px-5 py-4">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {messages.map((message) => (
                <tr key={message.id} className="transition-colors hover:bg-white/[0.02]">
                  <td className="px-5 py-4">
                    <Link href={`/admin/contact/${message.id}`} className="text-accent-400 hover:text-accent-300">
                      {message.name}
                    </Link>
                    <span className="block text-xs text-cloud-500">{message.email}</span>
                  </td>
                  <td className="px-5 py-4"><StatusBadge status={message.status} /></td>
                  <td className="px-5 py-4 text-cloud-300">{message.topic}</td>
                  <td className="max-w-md truncate px-5 py-4 text-cloud-400">{message.message}</td>
                  <td className="px-5 py-4 text-cloud-300">{message.staff_members?.name ?? "Unassigned"}</td>
                  <td className="px-5 py-4 text-cloud-400">{new Date(message.created_at).toLocaleDateString()}</td>
                </tr>
              ))}
              {messages.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-cloud-500">
                    No contact messages found.
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
