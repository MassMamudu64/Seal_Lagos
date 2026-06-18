"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  ADMIN_SESSION_COOKIE,
  ADMIN_SESSION_MAX_AGE_SECONDS,
  createAdminSessionToken,
  getAdminSessionSecret,
  verifyAdminSessionToken,
} from "@/lib/admin/session";
import { buildEntityCSV } from "@/lib/admin/data";
import { entityConfig, type AdminEntity } from "@/lib/admin/types";
import {
  assignmentSchema,
  bookingAdminSchema,
  contactAdminSchema,
  internalNotesSchema,
  quoteAdminSchema,
  staffCreateSchema,
  staffDeleteSchema,
  staffUpdateSchema,
  statusUpdateSchema,
} from "@/lib/schemas";
import { createServiceSupabaseClient } from "@/lib/supabase/server";

function formObject(formData: FormData): Record<string, FormDataEntryValue> {
  return Object.fromEntries(formData.entries());
}

function entityPath(entity: AdminEntity): string {
  return entityConfig[entity].path;
}

function validEntityStatus(entity: AdminEntity, status: string): boolean {
  return (entityConfig[entity].statuses as readonly string[]).includes(status);
}

async function assertAdmin() {
  const ok = await verifyAdminSessionToken(
    cookies().get(ADMIN_SESSION_COOKIE)?.value,
    getAdminSessionSecret(),
  );
  if (!ok) redirect("/admin/login");
}

function safeNext(value: FormDataEntryValue | null): string {
  if (typeof value !== "string") return "/admin";
  if (!value.startsWith("/admin") || value.startsWith("/admin/login")) return "/admin";
  return value;
}

export async function login(formData: FormData) {
  const configuredPassword = process.env.ADMIN_PASSWORD;
  const submittedPassword = formData.get("password");

  if (!configuredPassword || typeof submittedPassword !== "string" || submittedPassword !== configuredPassword) {
    redirect(`/admin/login?error=1&next=${encodeURIComponent(safeNext(formData.get("next")))}`);
  }

  const secret = getAdminSessionSecret();
  if (!secret) redirect("/admin/login?error=config");

  const token = await createAdminSessionToken(secret);
  cookies().set(ADMIN_SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/admin",
    maxAge: ADMIN_SESSION_MAX_AGE_SECONDS,
  });

  redirect(safeNext(formData.get("next")));
}

export async function logout() {
  cookies().set(ADMIN_SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/admin",
    maxAge: 0,
  });
  redirect("/admin/login");
}

export async function updateBooking(formData: FormData) {
  await assertAdmin();
  const parsed = bookingAdminSchema.parse(formObject(formData));
  const { id, ...updates } = parsed;
  const { error } = await createServiceSupabaseClient().from("bookings").update(updates).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/bookings");
  revalidatePath(`/admin/bookings/${id}`);
}

export async function updateContact(formData: FormData) {
  await assertAdmin();
  const parsed = contactAdminSchema.parse(formObject(formData));
  const { id, ...updates } = parsed;
  const { error } = await createServiceSupabaseClient().from("contact_messages").update(updates).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/contact");
  revalidatePath(`/admin/contact/${id}`);
}

export async function updateQuote(formData: FormData) {
  await assertAdmin();
  const parsed = quoteAdminSchema.parse(formObject(formData));
  const { id, ...updates } = parsed;
  const { error } = await createServiceSupabaseClient().from("quotes").update(updates).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/quotes");
  revalidatePath(`/admin/quotes/${id}`);
}

export async function updateStatus(formData: FormData) {
  await assertAdmin();
  const parsed = statusUpdateSchema.parse(formObject(formData));
  if (!validEntityStatus(parsed.entity, parsed.status)) throw new Error("Invalid status.");

  const { error } = await createServiceSupabaseClient()
    .from(parsed.entity)
    .update({ status: parsed.status })
    .eq("id", parsed.id);

  if (error) throw new Error(error.message);
  revalidatePath(entityPath(parsed.entity));
  revalidatePath(`${entityPath(parsed.entity)}/${parsed.id}`);
}

export async function assignToStaff(formData: FormData) {
  await assertAdmin();
  const parsed = assignmentSchema.parse(formObject(formData));
  const { error } = await createServiceSupabaseClient()
    .from(parsed.entity)
    .update({ assigned_to: parsed.assigned_to })
    .eq("id", parsed.id);

  if (error) throw new Error(error.message);
  revalidatePath(entityPath(parsed.entity));
  revalidatePath(`${entityPath(parsed.entity)}/${parsed.id}`);
}

export async function updateInternalNotes(formData: FormData) {
  await assertAdmin();
  const parsed = internalNotesSchema.parse(formObject(formData));
  const { error } = await createServiceSupabaseClient()
    .from(parsed.entity)
    .update({ internal_notes: parsed.internal_notes })
    .eq("id", parsed.id);

  if (error) throw new Error(error.message);
  revalidatePath(entityPath(parsed.entity));
  revalidatePath(`${entityPath(parsed.entity)}/${parsed.id}`);
}

export async function archiveEntity(formData: FormData) {
  await assertAdmin();
  const entity = formData.get("entity");
  const id = formData.get("id");

  if ((entity !== "bookings" && entity !== "contact_messages" && entity !== "quotes") || typeof id !== "string") {
    throw new Error("Invalid archive request.");
  }

  const { error } = await createServiceSupabaseClient()
    .from(entity)
    .update({ status: "archived" })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath(entityPath(entity));
  revalidatePath(`${entityPath(entity)}/${id}`);
}

export async function exportCSV(entity: AdminEntity, filters?: { status?: string; search?: string }) {
  await assertAdmin();
  return buildEntityCSV(entity, filters);
}

export async function createStaff(formData: FormData) {
  await assertAdmin();
  const parsed = staffCreateSchema.parse(formObject(formData));
  const { error } = await createServiceSupabaseClient().from("staff_members").insert(parsed);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/staff");
}

export async function updateStaff(formData: FormData) {
  await assertAdmin();
  const parsed = staffUpdateSchema.parse(formObject(formData));
  const { id, ...updates } = parsed;
  const { error } = await createServiceSupabaseClient().from("staff_members").update(updates).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/staff");
}

export async function deleteStaff(formData: FormData) {
  await assertAdmin();
  const parsed = staffDeleteSchema.parse(formObject(formData));
  const { error } = await createServiceSupabaseClient().from("staff_members").delete().eq("id", parsed.id);
  if (error) throw new Error(error.message);
  revalidatePath("/admin/staff");
}
