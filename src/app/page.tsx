import Hero from "@/components/sections/Hero";
import RouteMarquee from "@/components/sections/RouteMarquee";
import ServicesGrid from "@/components/sections/ServicesGrid";
import ValuePropsBand from "@/components/sections/ValuePropsBand";
import RouteNetwork from "@/components/sections/RouteNetwork";
import ProcessTimeline from "@/components/sections/ProcessTimeline";
import CTABand from "@/components/sections/CTABand";

export default function HomePage() {
  return (
    <>
      <Hero />
      <RouteMarquee />
      <ServicesGrid />
      <ValuePropsBand />
      <RouteNetwork />
      <ProcessTimeline />
      <CTABand />
    </>
  );
}
