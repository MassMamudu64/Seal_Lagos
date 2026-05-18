import { NextResponse } from "next/server";
import { findShipment } from "@/lib/tracking";

/**
 * GET /api/track?id=SL-XXXXXX
 *
 * Mock tracking endpoint. In production this would query a real shipment
 * database; for the marketing site it reads from `lib/tracking.ts`.
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json(
      { error: "Missing tracking ID. Pass ?id=SL-XXXXXX" },
      { status: 400 },
    );
  }

  // Simulate a small network delay so the loading state is visible.
  await new Promise((r) => setTimeout(r, 350));

  const shipment = findShipment(id);
  if (!shipment) {
    return NextResponse.json(
      { error: `No shipment found for "${id}". Check the ID and try again.` },
      { status: 404 },
    );
  }
  return NextResponse.json({ shipment });
}
