import type { Metadata } from "next";
import PageHeader from "@/components/layout/PageHeader";
import ServicesGrid from "@/components/sections/ServicesGrid";
import ProcessTimeline from "@/components/sections/ProcessTimeline";
import CTABand from "@/components/sections/CTABand";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Air cargo, doorstep delivery, specialised cargo, e-commerce logistics, package handling and real-time tracking.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        kicker="Services"
        title={
          <>
            Cargo handled with the
            <br />
            <span className="italic text-accent-400">care it deserves.</span>
          </>
        }
        lede="Seven services, one operating rhythm — built for the realities of cross-border freight."
      />
      <ServicesGrid withLinks={false} />
      <ProcessTimeline />
      <CTABand />
    </>
  );
}
