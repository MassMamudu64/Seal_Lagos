/**
 * SEAL LOGISTICS — MOCK TRACKING STORE
 * --------------------------------------------------------------------------
 * Stand-in for a real tracking backend. The /api/track route and the
 * tracking UI both read from here. Swap `findShipment` for a database/API
 * call in production — the shape stays the same.
 */

export type ShipmentStage =
  | "received"
  | "inspected"
  | "packed"
  | "sorted"
  | "in-transit"
  | "arrived"
  | "out-for-delivery"
  | "delivered";

export type TrackingEvent = {
  stage: ShipmentStage;
  label: string;
  location: string;
  timestamp: string;
  done: boolean;
};

export type Shipment = {
  id: string;
  status: string;
  service: string;
  origin: string;
  destination: string;
  weight: string;
  estimatedDelivery: string;
  progress: number; // 0–100
  events: TrackingEvent[];
};

const STAGE_LABELS: Record<ShipmentStage, string> = {
  received: "Package received",
  inspected: "Inspected & verified",
  packed: "Packaged & labeled",
  sorted: "Sorted for dispatch",
  "in-transit": "In transit — air cargo",
  arrived: "Arrived at destination",
  "out-for-delivery": "Out for delivery",
  delivered: "Delivered",
};

const ALL_STAGES: ShipmentStage[] = [
  "received",
  "inspected",
  "packed",
  "sorted",
  "in-transit",
  "arrived",
  "out-for-delivery",
  "delivered",
];

type Seed = {
  id: string;
  service: string;
  origin: string;
  destination: string;
  weight: string;
  estimatedDelivery: string;
  reached: ShipmentStage;
  locations: Partial<Record<ShipmentStage, string>>;
  times: Partial<Record<ShipmentStage, string>>;
};

const SEEDS: Seed[] = [
  {
    id: "SL-7G4K2A",
    service: "Air Cargo · USA → Nigeria",
    origin: "Brooklyn Center, MN, USA",
    destination: "Lagos, Nigeria",
    weight: "14 lbs",
    estimatedDelivery: "Est. delivery in 2–3 days",
    reached: "in-transit",
    locations: {
      received: "Brooklyn Center, MN",
      inspected: "Brooklyn Center, MN",
      packed: "Brooklyn Center, MN",
      sorted: "MSP Cargo Terminal",
      "in-transit": "In air corridor — MSP → LOS",
    },
    times: {
      received: "Mon, 09:12 AM CT",
      inspected: "Mon, 11:40 AM CT",
      packed: "Mon, 03:05 PM CT",
      sorted: "Wed, 10:20 AM CT",
      "in-transit": "Wed, 06:45 PM CT",
    },
  },
  {
    id: "SL-3M9P1X",
    service: "Air Cargo · Nigeria → Liberia",
    origin: "Ogba, Lagos, Nigeria",
    destination: "Congo Town, Monrovia, Liberia",
    weight: "22 kg",
    estimatedDelivery: "Delivered",
    reached: "delivered",
    locations: {
      received: "Ogba, Lagos",
      inspected: "Ogba, Lagos",
      packed: "Ogba, Lagos",
      sorted: "Lagos Cargo Hub",
      "in-transit": "Air corridor — LOS → ROB",
      arrived: "Monrovia, Liberia",
      "out-for-delivery": "Congo Town, Monrovia",
      delivered: "Congo Town, Monrovia",
    },
    times: {
      received: "Fri, 08:30 AM WAT",
      inspected: "Fri, 10:15 AM WAT",
      packed: "Fri, 01:00 PM WAT",
      sorted: "Fri, 03:30 PM WAT",
      "in-transit": "Sat, 09:00 AM WAT",
      arrived: "Mon, 02:10 PM GMT",
      "out-for-delivery": "Tue, 09:40 AM GMT",
      delivered: "Tue, 01:25 PM GMT",
    },
  },
  {
    id: "SL-8B5Q7D",
    service: "Air Cargo · USA → Guinea Conakry",
    origin: "Brooklyn Center, MN, USA",
    destination: "Conakry, Guinea",
    weight: "31 lbs",
    estimatedDelivery: "Est. delivery in 5–7 days",
    reached: "sorted",
    locations: {
      received: "Brooklyn Center, MN",
      inspected: "Brooklyn Center, MN",
      packed: "Brooklyn Center, MN",
      sorted: "MSP Cargo Terminal",
    },
    times: {
      received: "Tue, 02:15 PM CT",
      inspected: "Tue, 04:50 PM CT",
      packed: "Wed, 10:05 AM CT",
      sorted: "Wed, 04:30 PM CT",
    },
  },
];

function buildShipment(seed: Seed): Shipment {
  const reachedIndex = ALL_STAGES.indexOf(seed.reached);
  const events: TrackingEvent[] = ALL_STAGES.map((stage, i) => ({
    stage,
    label: STAGE_LABELS[stage],
    location: seed.locations[stage] ?? seed.destination,
    timestamp: seed.times[stage] ?? "—",
    done: i <= reachedIndex,
  }));
  const progress = Math.round(((reachedIndex + 1) / ALL_STAGES.length) * 100);
  return {
    id: seed.id,
    status: STAGE_LABELS[seed.reached],
    service: seed.service,
    origin: seed.origin,
    destination: seed.destination,
    weight: seed.weight,
    estimatedDelivery: seed.estimatedDelivery,
    progress,
    events,
  };
}

const SHIPMENTS: Record<string, Shipment> = Object.fromEntries(
  SEEDS.map((s) => [s.id, buildShipment(s)]),
);

/** Sample IDs surfaced in the UI so visitors can try the tracker. */
export const sampleTrackingIds = SEEDS.map((s) => s.id);

/** Look up a shipment by ID. Case-insensitive, tolerates surrounding space. */
export function findShipment(rawId: string): Shipment | null {
  const id = rawId.trim().toUpperCase();
  return SHIPMENTS[id] ?? null;
}
