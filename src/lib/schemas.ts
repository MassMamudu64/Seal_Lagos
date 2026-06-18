import { z } from "zod";
import { bookingStatuses, contactStatuses, quoteStatuses } from "@/lib/admin/types";

const trimmedText = (max = 500) => z.string().trim().min(1).max(max);
const optionalText = (max = 2000) =>
  z.preprocess(
    (value) => (typeof value === "string" && value.trim() === "" ? null : value),
    z.string().trim().max(max).nullable(),
  );
const nullableUuid = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? null : value),
  z.string().uuid().nullable(),
);
const nullableUnit = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? null : value),
  z.enum(["lbs", "kg"]).nullable(),
);
const money = z.coerce.number().min(0).max(1_000_000);
const formBoolean = z.preprocess(
  (value) => value === true || value === "true" || value === "on" || value === "1",
  z.boolean(),
);
const nullablePositiveNumber = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? null : value),
  z.coerce.number().positive().max(100_000).nullable(),
);
const nullableNonNegativeNumber = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? null : value),
  z.coerce.number().min(0).max(100_000).nullable(),
);

export const bookingCreateSchema = z.object({
  routeId: trimmedText(120),
  serviceSlug: trimmedText(120),
  weight: z.coerce.number().positive().max(100_000),
  unit: z.enum(["lbs", "kg"]),
  description: trimmedText(2000),
  pickup: z.boolean().default(false),
  senderName: trimmedText(160),
  senderEmail: z.string().trim().email().max(255),
  senderPhone: trimmedText(80),
  receiverName: trimmedText(160),
  receiverPhone: trimmedText(80),
  receiverAddress: trimmedText(1000),
  notes: optionalText(2000).default(null),
});

export const contactCreateSchema = z.object({
  name: trimmedText(160),
  email: z.string().trim().email().max(255),
  topic: trimmedText(80),
  message: trimmedText(4000),
});

export const quoteCreateSchema = z
  .object({
    mode: z.enum(["weight", "electronics"]),
    corridorId: optionalText(120).default(null),
    inputWeight: nullablePositiveNumber.optional(),
    inputUnit: z.enum(["lbs", "kg"]).nullable().optional(),
    billableWeight: nullableNonNegativeNumber.optional(),
    freightTotal: money,
    serviceFee: money,
    total: money,
    minimumApplied: z.boolean().default(false),
  })
  .refine((data) => (data.mode === "weight" ? data.corridorId && data.inputWeight && data.inputUnit : true), {
    message: "Weight quotes require corridor, weight, and unit.",
    path: ["mode"],
  });

export const bookingAdminSchema = z.object({
  id: z.string().uuid(),
  reference: trimmedText(80),
  route_id: trimmedText(120),
  service_slug: trimmedText(120),
  weight: z.coerce.number().positive().max(100_000),
  unit: z.enum(["lbs", "kg"]),
  description: trimmedText(2000),
  pickup_requested: formBoolean.default(false),
  sender_name: trimmedText(160),
  sender_email: z.string().trim().email().max(255),
  sender_phone: trimmedText(80),
  receiver_name: trimmedText(160),
  receiver_phone: trimmedText(80),
  receiver_address: trimmedText(1000),
  notes: optionalText(2000),
  status: z.enum(bookingStatuses),
  assigned_to: nullableUuid,
  internal_notes: optionalText(4000),
});

export const contactAdminSchema = z.object({
  id: z.string().uuid(),
  name: trimmedText(160),
  email: z.string().trim().email().max(255),
  topic: trimmedText(80),
  message: trimmedText(4000),
  status: z.enum(contactStatuses),
  assigned_to: nullableUuid,
  internal_notes: optionalText(4000),
});

export const quoteAdminSchema = z.object({
  id: z.string().uuid(),
  mode: z.enum(["weight", "electronics"]),
  corridor_id: optionalText(120),
  input_weight: nullablePositiveNumber,
  input_unit: nullableUnit,
  billable_weight: nullableNonNegativeNumber,
  freight_total: money,
  service_fee: money,
  total: money,
  minimum_applied: formBoolean.default(false),
  status: z.enum(quoteStatuses),
  assigned_to: nullableUuid,
  internal_notes: optionalText(4000),
});

export const statusUpdateSchema = z.object({
  entity: z.enum(["bookings", "contact_messages", "quotes"]),
  id: z.string().uuid(),
  status: z.string().trim().min(1).max(80),
});

export const assignmentSchema = z.object({
  entity: z.enum(["bookings", "contact_messages", "quotes"]),
  id: z.string().uuid(),
  assigned_to: nullableUuid,
});

export const internalNotesSchema = z.object({
  entity: z.enum(["bookings", "contact_messages", "quotes"]),
  id: z.string().uuid(),
  internal_notes: optionalText(4000),
});

export const staffCreateSchema = z.object({
  name: trimmedText(160),
});

export const staffUpdateSchema = z.object({
  id: z.string().uuid(),
  name: trimmedText(160),
  active: formBoolean.default(false),
});

export const staffDeleteSchema = z.object({
  id: z.string().uuid(),
});
