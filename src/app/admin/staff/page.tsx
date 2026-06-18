import AdminNav from "@/components/admin/AdminNav";
import SubmitButton from "@/components/admin/SubmitButton";
import { createStaff, deleteStaff, updateStaff } from "@/app/admin/actions";
import { getStaffMembers } from "@/lib/admin/data";

export default async function StaffPage() {
  const staff = await getStaffMembers(true);

  return (
    <>
      <AdminNav />
      <section className="grid gap-6 lg:grid-cols-[0.85fr_1.4fr]">
        <form action={createStaff} className="h-fit rounded-2xl border border-white/8 bg-ink-900/70 p-6 shadow-panel">
          <p className="font-mono text-[11px] uppercase tracking-kicker text-accent-500">
            Staff Management
          </p>
          <h2 className="mt-2 font-display text-3xl text-cloud-50">Add Staff</h2>
          <label className="mt-6 block">
            <span className="mb-2 block font-mono text-[11px] uppercase tracking-kicker text-cloud-400">
              Name
            </span>
            <input
              name="name"
              required
              className="h-11 w-full rounded-xl bg-ink-950/80 px-4 text-sm text-cloud-50 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-accent-500"
            />
          </label>
          <div className="mt-5">
            <SubmitButton>Create Staff Member</SubmitButton>
          </div>
        </form>

        <section className="rounded-2xl border border-white/8 bg-ink-900/70 shadow-panel">
          <div className="border-b border-white/8 p-6">
            <h2 className="font-display text-3xl text-cloud-50">Staff Members</h2>
            <p className="mt-2 text-sm text-cloud-400">
              Staff are assignment targets only. They do not have admin login accounts yet.
            </p>
          </div>
          <div className="divide-y divide-white/5">
            {staff.map((member) => (
              <div key={member.id} className="grid gap-4 p-5 xl:grid-cols-[1fr_auto] xl:items-center">
                <form action={updateStaff} className="grid gap-3 md:grid-cols-[1fr_auto_auto] md:items-center">
                  <input type="hidden" name="id" value={member.id} />
                  <label>
                    <span className="sr-only">Staff name</span>
                    <input
                      name="name"
                      defaultValue={member.name}
                      className="h-10 w-full rounded-xl bg-ink-950/80 px-4 text-sm text-cloud-50 outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-accent-500"
                    />
                  </label>
                  <label className="flex h-10 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] px-4 text-sm text-cloud-200">
                    <input type="hidden" name="active" value="false" />
                    <input
                      type="checkbox"
                      name="active"
                      value="true"
                      defaultChecked={member.active}
                      className="h-4 w-4 accent-accent-500"
                    />
                    Active
                  </label>
                  <SubmitButton variant="muted">Save</SubmitButton>
                </form>
                <form action={deleteStaff}>
                  <input type="hidden" name="id" value={member.id} />
                  <SubmitButton variant="danger" pendingLabel="Removing...">Remove</SubmitButton>
                </form>
              </div>
            ))}
            {staff.length === 0 && (
              <div className="p-10 text-center text-cloud-500">
                No staff members yet.
              </div>
            )}
          </div>
        </section>
      </section>
    </>
  );
}
