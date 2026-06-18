import { NextResponse } from "next/server";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { contactCreateSchema } from "@/lib/schemas";
import { createRestrictedSupabaseClient } from "@/lib/supabase/server";

export async function POST(req: Request) {
  const limit = rateLimit(`contact:${getClientIp(req)}`, 8);
  if (!limit.allowed) {
    return NextResponse.json(
      { success: false, error: "Too many contact attempts. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(limit.retryAfter) } },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, error: "Invalid JSON payload." }, { status: 400 });
  }

  const parsed = contactCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: "Invalid contact message.", details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    );
  }

  try {
    const { error } = await createRestrictedSupabaseClient().from("contact_messages").insert({
      name: parsed.data.name,
      email: parsed.data.email,
      topic: parsed.data.topic,
      message: parsed.data.message,
      status: "new",
    });

    if (error) {
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: "Contact service is not configured correctly." },
      { status: 500 },
    );
  }
}
