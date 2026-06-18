export const bookingStatuses = [
  "new",
  "contacted",
  "quoted",
  "confirmed",
  "in_progress",
  "completed",
  "cancelled",
  "archived",
] as const;

export const contactStatuses = [
  "new",
  "open",
  "responded",
  "closed",
  "archived",
] as const;

export const quoteStatuses = [
  "new",
  "contacted",
  "converted",
  "archived",
] as const;

export type BookingStatus = (typeof bookingStatuses)[number];
export type ContactStatus = (typeof contactStatuses)[number];
export type QuoteStatus = (typeof quoteStatuses)[number];

export type AdminEntity = "bookings" | "contact_messages" | "quotes";

export type StaffMember = {
  id: string;
  name: string;
  active: boolean;
  created_at: string;
  updated_at: string;
};

export type AssignedStaff = Pick<StaffMember, "id" | "name" | "active"> | null;

export type Booking = {
  id: string;
  reference: string;
  route_id: string;
  service_slug: string;
  weight: number;
  unit: "lbs" | "kg";
  description: string;
  pickup_requested: boolean;
  sender_name: string;
  sender_email: string;
  sender_phone: string;
  receiver_name: string;
  receiver_phone: string;
  receiver_address: string;
  notes: string | null;
  status: BookingStatus;
  assigned_to: string | null;
  internal_notes: string | null;
  created_at: string;
  updated_at: string;
  staff_members?: AssignedStaff;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  topic: string;
  message: string;
  status: ContactStatus;
  assigned_to: string | null;
  internal_notes: string | null;
  created_at: string;
  updated_at: string;
  staff_members?: AssignedStaff;
};

export type Quote = {
  id: string;
  mode: "weight" | "electronics";
  corridor_id: string | null;
  input_weight: number | null;
  input_unit: "lbs" | "kg" | null;
  billable_weight: number | null;
  freight_total: number;
  service_fee: number;
  total: number;
  minimum_applied: boolean;
  status: QuoteStatus;
  assigned_to: string | null;
  internal_notes: string | null;
  created_at: string;
  updated_at: string;
  staff_members?: AssignedStaff;
};

export const entityConfig = {
  bookings: {
    label: "Bookings",
    path: "/admin/bookings",
    table: "bookings",
    statuses: bookingStatuses,
  },
  contact_messages: {
    label: "Contact Messages",
    path: "/admin/contact",
    table: "contact_messages",
    statuses: contactStatuses,
  },
  quotes: {
    label: "Quotes",
    path: "/admin/quotes",
    table: "quotes",
    statuses: quoteStatuses,
  },
} as const;
