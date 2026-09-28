export type RiskLevel = "Low" | "Moderate" | "High" | "Critical";

export type ForecastPoint = {
  time: string;
  rainfall: number;
  predicted: number;
};

export type InfrastructureItem = {
  type: "Road" | "Hospital" | "School" | "Bridge" | "Critical";
  name: string;
  status: string;
  distance: string;
};

export type LocationScenario = {
  id: string;
  name: string;
  district: string;
  lat: number;
  lng: number;
  currentRainfall: number;
  predictedRainfall: number;
  intensity: string;
  probability: number;
  depth: string;
  risk: RiskLevel;
  impactMinutes: number;
  confidence: number;
  forecastDuration: string;
  affectedArea: string;
  warning: string;
  action: string;
  sourceStatus: Record<string, string>;
  forecast: ForecastPoint[];
  infrastructure: InfrastructureItem[];
};

export const RISK_META: Record<RiskLevel, { color: string; soft: string; label: string }> = {
  Low: { color: "#2EE6A6", soft: "rgba(46,230,166,.13)", label: "LOW" },
  Moderate: { color: "#F6C85F", soft: "rgba(246,200,95,.13)", label: "MODERATE" },
  High: { color: "#FF9F43", soft: "rgba(255,159,67,.14)", label: "HIGH" },
  Critical: { color: "#FF5D73", soft: "rgba(255,93,115,.14)", label: "CRITICAL" },
};

export const scenarios: LocationScenario[] = [
  {
    id: "velachery",
    name: "Velachery",
    district: "South Chennai",
    lat: 12.9816,
    lng: 80.2182,
    currentRainfall: 72,
    predictedRainfall: 118,
    intensity: "Very heavy",
    probability: 82,
    depth: "30–50 cm",
    risk: "High",
    impactMinutes: 45,
    confidence: 87,
    forecastDuration: "Next 2 hours",
    affectedArea: "Velachery Main Road · Taramani Link Road",
    warning: "Heavy rainfall may cause inundation within 45 minutes.",
    action: "Monitor area and prepare response teams.",
    sourceStatus: { Satellite: "Synced", Radar: "Live", Stations: "4 / 4", NWP: "Updated" },
    forecast: [
      { time: "Now", rainfall: 72, predicted: 72 },
      { time: "+30m", rainfall: 78, predicted: 94 },
      { time: "+60m", rainfall: 91, predicted: 108 },
      { time: "+90m", rainfall: 81, predicted: 118 },
      { time: "+2h", rainfall: 58, predicted: 96 },
    ],
    infrastructure: [
      { type: "Road", name: "Velachery Main Road", status: "Waterlogging risk", distance: "0.8 km" },
      { type: "Hospital", name: "Sri Ramachandra Clinic", status: "Access watch", distance: "1.4 km" },
      { type: "School", name: "DAV Public School", status: "Prepared", distance: "1.7 km" },
      { type: "Bridge", name: "Velachery MRTS Underpass", status: "Closures possible", distance: "2.1 km" },
    ],
  },
  {
    id: "adyar",
    name: "Adyar",
    district: "Central Chennai",
    lat: 13.0068,
    lng: 80.2575,
    currentRainfall: 48,
    predictedRainfall: 82,
    intensity: "Heavy",
    probability: 64,
    depth: "15–30 cm",
    risk: "Moderate",
    impactMinutes: 75,
    confidence: 84,
    forecastDuration: "Next 3 hours",
    affectedArea: "LB Road · Kasturba Nagar",
    warning: "Heavy rainfall is expected; monitor low-lying streets near the Adyar river.",
    action: "Monitor water levels and stage local response resources.",
    sourceStatus: { Satellite: "Synced", Radar: "Live", Stations: "3 / 4", NWP: "Updated" },
    forecast: [
      { time: "Now", rainfall: 48, predicted: 48 },
      { time: "+30m", rainfall: 52, predicted: 63 },
      { time: "+60m", rainfall: 66, predicted: 76 },
      { time: "+90m", rainfall: 61, predicted: 82 },
      { time: "+2h", rainfall: 44, predicted: 70 },
    ],
    infrastructure: [
      { type: "Road", name: "LB Road junction", status: "Slow traffic likely", distance: "0.6 km" },
      { type: "Hospital", name: "Fortis Malar", status: "Access clear", distance: "1.2 km" },
      { type: "Bridge", name: "Adyar Bridge", status: "Water level watch", distance: "1.8 km" },
    ],
  },
  {
    id: "tambaram",
    name: "Tambaram",
    district: "West Chennai",
    lat: 12.9249,
    lng: 80.1000,
    currentRainfall: 24,
    predictedRainfall: 42,
    intensity: "Moderate",
    probability: 35,
    depth: "5–15 cm",
    risk: "Low",
    impactMinutes: 140,
    confidence: 78,
    forecastDuration: "Next 4 hours",
    affectedArea: "GST Road service lanes",
    warning: "No immediate inundation signal. Continue routine monitoring.",
    action: "Maintain routine observation and verify station updates.",
    sourceStatus: { Satellite: "Synced", Radar: "Live", Stations: "4 / 4", NWP: "Updated" },
    forecast: [
      { time: "Now", rainfall: 24, predicted: 24 },
      { time: "+30m", rainfall: 28, predicted: 32 },
      { time: "+60m", rainfall: 33, predicted: 38 },
      { time: "+90m", rainfall: 29, predicted: 42 },
      { time: "+2h", rainfall: 20, predicted: 36 },
    ],
    infrastructure: [
      { type: "Road", name: "GST Road service lane", status: "Passable", distance: "1.1 km" },
      { type: "School", name: "Campion School", status: "Routine status", distance: "1.8 km" },
    ],
  },
  {
    id: "porur",
    name: "Porur",
    district: "West Chennai",
    lat: 13.0358,
    lng: 80.1568,
    currentRainfall: 62,
    predictedRainfall: 96,
    intensity: "Very heavy",
    probability: 76,
    depth: "20–40 cm",
    risk: "High",
    impactMinutes: 55,
    confidence: 86,
    forecastDuration: "Next 2 hours",
    affectedArea: "Mount Poonamallee Road · Porur Lake edge",
    warning: "Rapid runoff may affect underpasses and lake-adjacent roads within 55 minutes.",
    action: "Prepare response teams and inspect known low points.",
    sourceStatus: { Satellite: "Synced", Radar: "Live", Stations: "4 / 4", NWP: "Updated" },
    forecast: [
      { time: "Now", rainfall: 62, predicted: 62 },
      { time: "+30m", rainfall: 66, predicted: 79 },
      { time: "+60m", rainfall: 78, predicted: 91 },
      { time: "+90m", rainfall: 71, predicted: 96 },
      { time: "+2h", rainfall: 49, predicted: 82 },
    ],
    infrastructure: [
      { type: "Road", name: "Mount Poonamallee Road", status: "Flooding watch", distance: "0.9 km" },
      { type: "Bridge", name: "Porur flyover ramp", status: "Surface runoff", distance: "1.3 km" },
      { type: "Critical", name: "Porur Lake sluice", status: "Inspect now", distance: "1.6 km" },
    ],
  },
];

export const allAlerts = [
  { location: "Velachery", level: "High" as RiskLevel, time: "45 min to impact", text: "Heavy rainfall may cause inundation." },
  { location: "Porur", level: "High" as RiskLevel, time: "55 min to impact", text: "Rapid runoff near lake-adjacent roads." },
  { location: "Adyar", level: "Moderate" as RiskLevel, time: "75 min to impact", text: "Monitor low-lying streets near the river." },
];
