import { NextResponse } from "next/server";
import { createBookingReference } from "@/lib/reference";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { bookingCreateSchema } from "@/lib/schemas";
import { createRestrictedSupabaseClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const limit = rateLimit(`bookings:${getClientIp(req)}`, 8);
  if (!limit.allowed) {
    return NextResponse.json(
      { success: false, error: "Too many booking attempts. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON payload." }, { status: 400 });
  }

  const parsed = bookingCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Invalid booking data.", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    const supabase = createRestrictedSupabaseClient();
    let lastError: string | null = null;

    for (let attempt = 0; attempt < 3; attempt += 1) {
      const reference = createBookingReference();
      const { error } = await supabase.from("bookings").insert({
        reference,
        route_id: parsed.data.routeId,
        service_slug: parsed.data.serviceSlug,
        weight: parsed.data.weight,
        unit: parsed.data.unit,
        description: parsed.data.description,
        pickup_requested: parsed.data.pickup,
        sender_name: parsed.data.senderName,
        sender_email: parsed.data.senderEmail,
        sender_phone: parsed.data.senderPhone,
        receiver_name: parsed.data.receiverName,
        receiver_phone: parsed.data.receiverPhone,
        receiver_address: parsed.data.receiverAddress,
        notes: parsed.data.notes,
        status: "new",
      });

      if (!error) {
        return NextResponse.json({ success: true, reference }, { status: 201 });
      }

      lastError = error.message;
      if (error.code !== "23505") break;
    }

    return NextResponse.json(
      { success: false, error: lastError ?? "Unable to create booking." },
      { status: 500 },
    );
  } catch {
    return NextResponse.json(
      { success: false, error: "Booking service is not configured correctly." },
      { status: 500 },
    );
  }
}
