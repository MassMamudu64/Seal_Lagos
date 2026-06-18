import "server-only";

import { unstable_noStore as noStore } from "next/cache";
import { createServiceSupabaseClient } from "@/lib/supabase/server";
import {
  type AdminEntity,
  type Booking,
  type ContactMessage,
  type Quote,
  type StaffMember,
} from "@/lib/admin/types";

export type ListFilters = {
  status?: string;
  search?: string;
};

type DashboardCounts = {
  bookings: number;
  contactMessages: number;
  quotes: number;
  activeStaff: number;
};

function cleanSearch(value: string | undefined): string {
  return (value ?? "").trim().replace(/[,%()]/g, " ").slice(0, 120);
}

function ilike(value: string): string {
  return `%${value}%`;
}

function normalizeNumberFields<T extends Record<string, unknown>>(row: T): T {
  const normalized: Record<string, unknown> = { ...row };
  for (const key of ["weight", "input_weight", "billable_weight", "freight_total", "service_fee", "total"]) {
    if (typeof normalized[key] === "string") {
      normalized[key] = Number(normalized[key]);
    }
  }
  return normalized as T;
}

export async function getDashboardCounts(): Promise<DashboardCounts> {
  noStore();
  const supabase = createServiceSupabaseClient();
  const [bookings, contactMessages, quotes, activeStaff] = await Promise.all([
    supabase.from("bookings").select("id", { count: "exact", head: true }),
    supabase.from("contact_messages").select("id", { count: "exact", head: true }),
    supabase.from("quotes").select("id", { count: "exact", head: true }),
    supabase.from("staff_members").select("id", { count: "exact", head: true }).eq("active", true),
  ]);

  return {
    bookings: bookings.count ?? 0,
    contactMessages: contactMessages.count ?? 0,
    quotes: quotes.count ?? 0,
    activeStaff: activeStaff.count ?? 0,
  };
}

export async function getStaffMembers(includeInactive = true): Promise<StaffMember[]> {
  noStore();
  let query = createServiceSupabaseClient()
    .from("staff_members")
    .select("*")
    .order("active", { ascending: false })
    .order("name", { ascending: true });

  if (!includeInactive) query = query.eq("active", true);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as StaffMember[];
}

export async function getBookings(filters: ListFilters = {}): Promise<Booking[]> {
  noStore();
  let query = createServiceSupabaseClient()
    .from("bookings")
    .select("*, staff_members(id,name,active)")
    .order("created_at", { ascending: false })
    .limit(300);

  if (filters.status && filters.status !== "all") query = query.eq("status", filters.status);

  const search = cleanSearch(filters.search);
  if (search) {
    const term = ilike(search);
    query = query.or(
      `reference.ilike.${term},sender_name.ilike.${term},sender_email.ilike.${term},sender_phone.ilike.${term},receiver_name.ilike.${term},receiver_phone.ilike.${term},route_id.ilike.${term}`,
    );
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return ((data ?? []) as Booking[]).map(normalizeNumberFields);
}

export async function getBooking(id: string): Promise<Booking | null> {
  noStore();
  const { data, error } = await createServiceSupabaseClient()
    .from("bookings")
    .select("*, staff_members(id,name,active)")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? normalizeNumberFields(data as Booking) : null;
}

export async function getContactMessages(filters: ListFilters = {}): Promise<ContactMessage[]> {
  noStore();
  let query = createServiceSupabaseClient()
    .from("contact_messages")
    .select("*, staff_members(id,name,active)")
    .order("created_at", { ascending: false })
    .limit(300);

  if (filters.status && filters.status !== "all") query = query.eq("status", filters.status);

  const search = cleanSearch(filters.search);
  if (search) {
    const term = ilike(search);
    query = query.or(`name.ilike.${term},email.ilike.${term},topic.ilike.${term},message.ilike.${term}`);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as ContactMessage[];
}

export async function getContactMessage(id: string): Promise<ContactMessage | null> {
  noStore();
  const { data, error } = await createServiceSupabaseClient()
    .from("contact_messages")
    .select("*, staff_members(id,name,active)")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return (data ?? null) as ContactMessage | null;
}

export async function getQuotes(filters: ListFilters = {}): Promise<Quote[]> {
  noStore();
  let query = createServiceSupabaseClient()
    .from("quotes")
    .select("*, staff_members(id,name,active)")
    .order("created_at", { ascending: false })
    .limit(300);

  if (filters.status && filters.status !== "all") query = query.eq("status", filters.status);

  const search = cleanSearch(filters.search);
  if (search) {
    const term = ilike(search);
    query = query.or(`mode.ilike.${term},corridor_id.ilike.${term},status.ilike.${term}`);
  }

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return ((data ?? []) as Quote[]).map(normalizeNumberFields);
}

export async function getQuote(id: string): Promise<Quote | null> {
  noStore();
  const { data, error } = await createServiceSupabaseClient()
    .from("quotes")
    .select("*, staff_members(id,name,active)")
    .eq("id", id)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data ? normalizeNumberFields(data as Quote) : null;
}

function csvCell(value: unknown): string {
  if (value === null || value === undefined) return "";
  const text = String(value).replace(/\r?\n/g, " ");
  return `"${text.replace(/"/g, '""')}"`;
}

export function toCSV(rows: Array<Record<string, unknown>>, columns: string[]): string {
  return [
    columns.map(csvCell).join(","),
    ...rows.map((row) => columns.map((column) => csvCell(row[column])).join(",")),
  ].join("\n");
}

export async function buildEntityCSV(entity: AdminEntity, filters: ListFilters = {}): Promise<string> {
  if (entity === "bookings") {
    const rows = await getBookings(filters);
    return toCSV(rows as unknown as Array<Record<string, unknown>>, [
      "reference",
      "status",
      "route_id",
      "service_slug",
      "weight",
      "unit",
      "sender_name",
      "sender_email",
      "sender_phone",
      "receiver_name",
      "receiver_phone",
      "receiver_address",
      "assigned_to",
      "created_at",
      "updated_at",
    ]);
  }

  if (entity === "contact_messages") {
    const rows = await getContactMessages(filters);
    return toCSV(rows as unknown as Array<Record<string, unknown>>, [
      "name",
      "email",
      "topic",
      "message",
      "status",
      "assigned_to",
      "created_at",
      "updated_at",
    ]);
  }

  const rows = await getQuotes(filters);
  return toCSV(rows as unknown as Array<Record<string, unknown>>, [
    "mode",
    "status",
    "corridor_id",
    "input_weight",
    "input_unit",
    "billable_weight",
    "freight_total",
    "service_fee",
    "total",
    "minimum_applied",
    "assigned_to",
    "created_at",
    "updated_at",
  ]);
}
