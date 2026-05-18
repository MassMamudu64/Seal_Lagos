/**
 * SEAL LOGISTICS — CONTENT & BUSINESS DATA
 * --------------------------------------------------------------------------
 * Single source of truth for everything customer-facing. All figures, rates,
 * addresses and routes are transcribed from the company brief. Pages and
 * components read from here so content stays consistent and editable.
 */

/* ------------------------------- company -------------------------------- */

export const company = {
  name: "Seal Logistics",
  legalName: "SHIPT ET AL LLC",
  fullName: "Seal Logistics and Cargo Services",
  tagline: "Seamless Shipping. Every Time.",
  intro:
    "A professional logistics and cargo company delivering fast, secure and reliable shipping for individuals, businesses and e-commerce sellers across borders.",
  mission:
    "To provide seamless, affordable and dependable logistics solutions that connect people, businesses and communities across borders — delivering every package safely and on time, with the highest standards of transparency and trust.",
  email: "shiptetal.llc@gmail.com",
  primaryPhone: "+1 952 607 0580",
} as const;

/* ------------------------------- services ------------------------------- */

export type Service = {
  slug: string;
  title: string;
  short: string;
  description: string;
  features: string[];
  icon: ServiceIcon;
};

export type ServiceIcon =
  | "plane"
  | "door"
  | "shield"
  | "cart"
  | "boxes"
  | "lock"
  | "radar";

export const services: Service[] = [
  {
    slug: "air-cargo",
    title: "Air Cargo Services",
    short: "Fast weekly air shipments for urgent and important packages.",
    description:
      "Consistent, scheduled weekly air cargo for time-sensitive freight. We move your packages on dependable routes built for speed without compromising safety.",
    features: [
      "Scheduled weekly departures",
      "Priority handling for urgent freight",
      "Transparent transit windows",
      "Trusted cargo channels",
    ],
    icon: "plane",
  },
  {
    slug: "doorstep-delivery",
    title: "Doorstep Delivery & Pickup",
    short: "Convenient pickup and direct delivery to preferred locations.",
    description:
      "Skip the queue. Our team arranges scheduled pickups from homes, offices, stores and warehouses — and delivers straight to your receiver's door.",
    features: [
      "Scheduled home & office pickup",
      "Direct doorstep delivery",
      "Designated pickup points",
      "Flexible coordination",
    ],
    icon: "door",
  },
  {
    slug: "specialized-cargo",
    title: "Specialized Cargo Services",
    short: "Careful handling of fragile, valuable and oversized packages.",
    description:
      "Fragile, high-value, oversized or special-care items receive additional protective handling and documentation at every stage of the journey.",
    features: [
      "Fragile & high-value handling",
      "Oversized cargo support",
      "Protective packaging guidance",
      "Special-care documentation",
    ],
    icon: "shield",
  },
  {
    slug: "ecommerce-logistics",
    title: "E-commerce Logistics",
    short: "Efficient shipping support for online stores and vendors.",
    description:
      "Built for online sellers — we help vendors and business owners move products to customers locally and internationally with reliable, repeatable workflows.",
    features: [
      "Vendor & marketplace support",
      "Bulk shipment coordination",
      "Local & international reach",
      "Repeatable fulfilment flows",
    ],
    icon: "cart",
  },
  {
    slug: "package-handling",
    title: "Package Handling & Consolidation",
    short: "Professional packaging, sorting, labeling and coordination.",
    description:
      "We seal, label and consolidate shipments by destination and priority — and advise on smart packing methods that cut unnecessary weight and cost.",
    features: [
      "Professional packing & sealing",
      "Sorting by destination & priority",
      "Clear labeling & documentation",
      "Weight-saving packing advice",
    ],
    icon: "boxes",
  },
  {
    slug: "secure-cargo",
    title: "Secure Cargo Handling",
    short: "Safe and monitored package processing for peace of mind.",
    description:
      "Every shipment is processed under secure handling procedures with organised documentation and reliable communication from drop-off to delivery.",
    features: [
      "Secure handling procedures",
      "Monitored processing",
      "Organised shipment records",
      "Reliable status communication",
    ],
    icon: "lock",
  },
  {
    slug: "shipment-tracking",
    title: "Real-Time Shipment Tracking",
    short: "Track shipment updates for transparency and convenience.",
    description:
      "Follow your package through every stage — movement, transit progress and delivery status — backed by a support team ready to help when you need it.",
    features: [
      "Stage-by-stage updates",
      "Transit progress visibility",
      "Delivery status alerts",
      "Support-team assistance",
    ],
    icon: "radar",
  },
];

/* ------------------------------- countries ------------------------------ */

export type Country = {
  code: string;
  name: string;
  flag: string;
  role: "hub" | "destination";
  note: string;
};

export const countries: Country[] = [
  { code: "US", name: "United States", flag: "🇺🇸", role: "hub", note: "Origin hub — Minnesota" },
  { code: "NG", name: "Nigeria", flag: "🇳🇬", role: "hub", note: "Regional hub — Lagos & Ogba" },
  { code: "LR", name: "Liberia", flag: "🇱🇷", role: "destination", note: "Monrovia delivery network" },
  { code: "GH", name: "Ghana", flag: "🇬🇭", role: "destination", note: "Accra delivery network" },
  { code: "TG", name: "Togo", flag: "🇹🇬", role: "destination", note: "Lomé corridor" },
  { code: "ZA", name: "South Africa", flag: "🇿🇦", role: "destination", note: "Weekly air corridor" },
  { code: "GN", name: "Guinea Conakry", flag: "🇬🇳", role: "destination", note: "Weekly air corridor" },
  { code: "GM", name: "Gambia", flag: "🇬🇲", role: "destination", note: "Weight-rate corridor" },
];

/* -------------------------------- routes -------------------------------- */

export type Route = {
  id: string;
  from: string;
  fromCode: string;
  to: string;
  toCode: string;
  frequency: string;
  transit: string;
  cutoff: string;
};

export const routes: Route[] = [
  {
    id: "usa-nigeria",
    from: "USA", fromCode: "US",
    to: "Nigeria", toCode: "NG",
    frequency: "Weekly",
    transit: "7–10 days",
    cutoff: "Wednesday 5:00 PM CT",
  },
  {
    id: "usa-south-africa",
    from: "USA", fromCode: "US",
    to: "South Africa", toCode: "ZA",
    frequency: "Weekly",
    transit: "Quote on request",
    cutoff: "Wednesday 5:00 PM CT",
  },
  {
    id: "usa-guinea",
    from: "USA", fromCode: "US",
    to: "Guinea Conakry", toCode: "GN",
    frequency: "Weekly",
    transit: "Quote on request",
    cutoff: "Wednesday 5:00 PM CT",
  },
  {
    id: "nigeria-ghana",
    from: "Nigeria", fromCode: "NG",
    to: "Ghana", toCode: "GH",
    frequency: "Weekly",
    transit: "Quote on request",
    cutoff: "Friday 4:00 PM WAT",
  },
  {
    id: "nigeria-liberia",
    from: "Nigeria", fromCode: "NG",
    to: "Liberia", toCode: "LR",
    frequency: "Weekly",
    transit: "3–5 days",
    cutoff: "Friday 4:00 PM WAT",
  },
  {
    id: "nigeria-togo",
    from: "Nigeria", fromCode: "NG",
    to: "Togo", toCode: "TG",
    frequency: "Weekly",
    transit: "Quote on request",
    cutoff: "Friday 4:00 PM WAT",
  },
];

/* ------------------------------- pricing -------------------------------- */

export type WeightRate = {
  id: string;
  label: string;
  from: string;
  to: string;
  unit: "lbs" | "kg";
  rate: number;
  minimum: number;
  serviceFee: number;
};

/** Per-weight corridors. Service fee is $30 on every invoice except Nigeria. */
export const weightRates: WeightRate[] = [
  { id: "us-ng", label: "USA → Nigeria", from: "USA", to: "Nigeria", unit: "lbs", rate: 6.5, minimum: 10, serviceFee: 0 },
  { id: "us-lr", label: "USA → Liberia", from: "USA", to: "Liberia", unit: "lbs", rate: 11.57, minimum: 10, serviceFee: 30 },
  { id: "us-gh", label: "USA → Ghana", from: "USA", to: "Ghana", unit: "lbs", rate: 11.57, minimum: 10, serviceFee: 30 },
  { id: "us-tg", label: "USA → Togo / Lomé", from: "USA", to: "Togo", unit: "lbs", rate: 8.6, minimum: 10, serviceFee: 30 },
  { id: "us-gn", label: "USA → Guinea Conakry", from: "USA", to: "Guinea Conakry", unit: "lbs", rate: 7.5, minimum: 10, serviceFee: 30 },
  { id: "us-gm", label: "USA → Gambia", from: "USA", to: "Gambia", unit: "lbs", rate: 9.6, minimum: 10, serviceFee: 30 },
  { id: "ng-us", label: "Nigeria → USA", from: "Nigeria", to: "USA", unit: "kg", rate: 12.75, minimum: 10, serviceFee: 30 },
  { id: "ng-lr", label: "Nigeria → Liberia", from: "Nigeria", to: "Liberia", unit: "kg", rate: 10, minimum: 10, serviceFee: 30 },
  { id: "lr-us", label: "Liberia → USA", from: "Liberia", to: "USA", unit: "lbs", rate: 25, minimum: 10, serviceFee: 30 },
];

export type ElectronicItem = {
  id: string;
  name: string;
  group: "Phones" | "Tablets" | "Laptops" | "Wearables & Audio";
  price: number;
};

/** Electronics ship at a flat per-item rate, not by weight. */
export const electronicItems: ElectronicItem[] = [
  { id: "iphone-new", name: "iPhone — New", group: "Phones", price: 85 },
  { id: "iphone-used", name: "iPhone — Used", group: "Phones", price: 55 },
  { id: "phone-new", name: "Other Phone — New", group: "Phones", price: 75 },
  { id: "phone-used", name: "Other Phone — Used", group: "Phones", price: 50 },
  { id: "ipad-new", name: "iPad — New", group: "Tablets", price: 85 },
  { id: "ipad-used", name: "iPad — Used", group: "Tablets", price: 50 },
  { id: "tablet-new", name: "Tablet — New", group: "Tablets", price: 75 },
  { id: "tablet-used", name: "Tablet — Used", group: "Tablets", price: 45 },
  { id: "mac-new", name: "Mac Laptop — New", group: "Laptops", price: 105 },
  { id: "mac-used", name: "Mac Laptop — Used", group: "Laptops", price: 85 },
  { id: "laptop-new", name: "Other Laptop — New", group: "Laptops", price: 85 },
  { id: "laptop-used", name: "Other Laptop — Used", group: "Laptops", price: 70 },
  { id: "watch-new", name: "Apple Watch — New", group: "Wearables & Audio", price: 50 },
  { id: "watch-used", name: "Apple Watch — Used", group: "Wearables & Audio", price: 35 },
  { id: "airpods-new", name: "Apple AirPods — New", group: "Wearables & Audio", price: 50 },
  { id: "airpods-used", name: "Apple AirPods — Used", group: "Wearables & Audio", price: 35 },
];

export const SERVICE_FEE = 30;

/* -------------------------------- offices ------------------------------- */

export type Office = {
  country: string;
  flag: string;
  city: string;
  address: string;
  phone: string;
};

export const offices: Office[] = [
  {
    country: "United States",
    flag: "🇺🇸",
    city: "Brooklyn Center, MN",
    address: "3300 County Rd 10, Ste 206, Brooklyn Center, MN 55429",
    phone: "+1 952 607 0580",
  },
  {
    country: "Nigeria",
    flag: "🇳🇬",
    city: "Lagos",
    address:
      "Shop i005, Ogba Multipurpose Shopping Complex, Off Wemco Road, Beside Sunday Market",
    phone: "+234 803 716 0560",
  },
  {
    country: "Ghana",
    flag: "🇬🇭",
    city: "Accra",
    address: "GM 1116544, Panteng West, Accra",
    phone: "+233 535 083 305",
  },
  {
    country: "Liberia",
    flag: "🇱🇷",
    city: "Monrovia",
    address:
      "Behind Duncan Gas Station, Catholic Junction, Congo Town, Monrovia",
    phone: "+231 886 578 583",
  },
];

/* ------------------------------- payments ------------------------------- */

export const paymentMethods = [
  { label: "Zenith Bank (Nigeria)", detail: "SEAL Logistics · 1310883156" },
  { label: "GTB (Liberia)", detail: "SEAL Logistics · 007001328463201022" },
  { label: "Cash App", detail: "952-607-0580" },
  { label: "Zelle", detail: "shiptetal.llc@gmail.com" },
];

/* ----------------------------- process steps ---------------------------- */

export type ProcessStep = {
  step: number;
  title: string;
  body: string;
};

export const processSteps: ProcessStep[] = [
  {
    step: 1,
    title: "Package Drop-Off or Pickup",
    body: "Drop your package at our office or schedule a pickup from your home, office, store or warehouse. We verify sender, receiver, destination, description and weight.",
  },
  {
    step: 2,
    title: "Inspection & Verification",
    body: "Every package is inspected — contents confirmed, packaging condition checked, shipping details verified and fragile or special-care items identified.",
  },
  {
    step: 3,
    title: "Professional Packaging & Labeling",
    body: "We seal, label and secure your shipment. Fragile items get extra protective handling, and we advise on packing methods that reduce weight and cost.",
  },
  {
    step: 4,
    title: "Cargo Sorting & Processing",
    body: "Shipments are sorted by destination, category and priority, then prepared for weekly air cargo movement under monitored handling procedures.",
  },
  {
    step: 5,
    title: "Shipment Dispatch",
    body: "Packages are dispatched on trusted cargo channels across our route network, built for speed, reliability and secure delivery.",
  },
  {
    step: 6,
    title: "Real-Time Tracking",
    body: "Follow shipment movement, transit progress and delivery status — with our support team available for assistance whenever you need it.",
  },
  {
    step: 7,
    title: "Secure Delivery",
    body: "On arrival, packages go through final handling and are delivered to the doorstep or made ready for pickup — carefully, and in good condition.",
  },
];

/* ------------------------------ value props ----------------------------- */

export const valueProps = [
  {
    title: "Fast & Reliable",
    body: "Speed and efficiency prioritised, so packages arrive on schedule without compromising safety.",
  },
  {
    title: "Secure Handling",
    body: "Every shipment is carefully packed, handled and monitored to reduce damage and build confidence.",
  },
  {
    title: "Weekly Air Cargo",
    body: "Consistent weekly air departures keep international delivery moving on a dependable rhythm.",
  },
  {
    title: "International Network",
    body: "A cross-border network connecting the USA, Nigeria, Liberia, Ghana, Togo and beyond.",
  },
  {
    title: "Doorstep Convenience",
    body: "Pickup and delivery designed around customers — from your door to your receiver's.",
  },
  {
    title: "Customer-Focused",
    body: "Professionalism, communication and satisfaction at every stage of the journey.",
  },
];

/* -------------------------------- stats --------------------------------- */

export const stats = [
  { value: "7", suffix: "+", label: "Countries connected" },
  { value: "7", suffix: "–10", label: "Day USA → Nigeria transit" },
  { value: "52", suffix: "/yr", label: "Weekly air departures" },
  { value: "100", suffix: "%", label: "Monitored, documented handling" },
];

/* --------------------------------- faqs --------------------------------- */

export const faqs = [
  {
    q: "How long does shipping take?",
    a: "USA (Minnesota) to Lagos, Nigeria takes 7–10 days. Lagos, Nigeria to Monrovia, Liberia takes 3–5 days. Other corridors vary by destination and shipment type — request a quote for an exact window.",
  },
  {
    q: "How is pricing calculated?",
    a: "Most cargo is charged by weight at a per-corridor rate, with a 10 lbs / 10 kg minimum. Electronics — phones, tablets, laptops, watches and AirPods — are charged at a flat per-item rate instead of by weight. A $30 service fee applies to every invoice except Nigeria.",
  },
  {
    q: "Do you pick packages up?",
    a: "Yes. You can drop off at any of our offices, or schedule a pickup from your home, office, store or warehouse. We also deliver straight to your receiver's doorstep.",
  },
  {
    q: "Can I track my shipment?",
    a: "Yes. Use the tracking page with your shipment ID to follow movement, transit progress and delivery status. Our support team is also available to help.",
  },
  {
    q: "What is the cut-off for weekly shipments?",
    a: "USA departures cut off Wednesday 5:00 PM CT; Nigeria departures cut off Friday 4:00 PM WAT. Submit packages before the deadline for faster processing on that week's flight.",
  },
  {
    q: "How can I pay?",
    a: "We accept Zenith Bank (Nigeria), GTB (Liberia), Cash App and Zelle. Payment details are confirmed on every invoice.",
  },
];

/* ------------------------------ navigation ------------------------------ */

export const navLinks = [
  { href: "/services", label: "Services" },
  { href: "/schedule", label: "Schedule" },
  { href: "/countries", label: "Network" },
  { href: "/pricing", label: "Pricing" },
  { href: "/tracking", label: "Track" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];
