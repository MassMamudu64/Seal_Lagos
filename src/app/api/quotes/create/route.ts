import { NextResponse } from "next/server";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { quoteCreateSchema } from "@/lib/schemas";
import { createRestrictedSupabaseClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const limit = rateLimit(`quotes:${getClientIp(req)}`, 12);
  if (!limit.allowed) {
    return NextResponse.json(
      { success: false, error: "Too many quote attempts. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON payload." }, { status: 400 });
  }

  const parsed = quoteCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Invalid quote data.", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    const { error } = await createRestrictedSupabaseClient().from("quotes").insert({
      mode: parsed.data.mode,
      corridor_id: parsed.data.corridorId,
      input_weight: parsed.data.inputWeight ?? null,
      input_unit: parsed.data.inputUnit ?? null,
      billable_weight: parsed.data.billableWeight ?? null,
      freight_total: parsed.data.freightTotal,
      service_fee: parsed.data.serviceFee,
      total: parsed.data.total,
      minimum_applied: parsed.data.minimumApplied,
      status: "new",
    });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Quote service is not configured correctly." },
      { status: 500 },
    );
  }
}
