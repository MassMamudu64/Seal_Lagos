import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import BookingForm from "@/components/sections/BookingForm";

export const metadata: Metadata = {
  title: "Book a Shipment",
  description:
    "Start a booking — route, package details and contacts. We'll reply with a quote and pickup window.",
};

export default function BookingPage() {
  return (
    <>
      <PageHeader
        kicker="Book / Quote"
        title={
          <>
            Tell us where it's going.
            <br />
            <span className="italic text-accent-400">We'll handle the rest.</span>
          </>
        }
        lede="Four short steps and you're done. Submit a booking request and we'll confirm pricing, pickup and shipment details with you directly."
      />
      <BookingForm />
    </>
  );
}
