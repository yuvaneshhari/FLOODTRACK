import type { ForecastPoint, LocationScenario } from "@/lib/floodtrack-data";

const OPEN_METEO_ENDPOINT = "https://api.open-meteo.com/v1/forecast";

export type LiveWeather = {
  id: string;
  currentRainfall: number;
  predictedRainfall: number;
  intensity: string;
  forecast: ForecastPoint[];
  observedAt: string;
};

type OpenMeteoResponse = {
  current?: { time?: string; precipitation?: number; rain?: number };
  hourly?: { time?: string[]; precipitation?: number[]; rain?: number[]; precipitation_probability?: number[] };
};

function formatTimeLabel(iso: string, index: number) {
  if (index === 0) return "Now";
  const date = new Date(iso);
  return `+${index}h`;
}

function classifyRainfall(value: number) {
  if (value >= 50) return "Very heavy";
  if (value >= 20) return "Heavy";
  if (value >= 5) return "Moderate";
  return "Light";
}

export async function fetchLiveWeather(scenario: LocationScenario, signal?: AbortSignal): Promise<LiveWeather> {
  const params = new URLSearchParams({
    latitude: scenario.lat.toString(),
    longitude: scenario.lng.toString(),
    current: "precipitation,rain",
    hourly: "precipitation,rain,precipitation_probability",
    forecast_hours: "5",
    timezone: "Asia/Kolkata",
    precipitation_unit: "mm",
  });
  const response = await fetch(`${OPEN_METEO_ENDPOINT}?${params.toString()}`, { signal });
  if (!response.ok) throw new Error(`Weather API returned ${response.status}`);
  const payload = (await response.json()) as OpenMeteoResponse;
  const hourly = payload.hourly?.precipitation ?? [];
  const times = payload.hourly?.time ?? [];
  const current = Number(payload.current?.rain ?? payload.current?.precipitation ?? hourly[0] ?? 0);
  const forecast = times.slice(0, 5).map((time, index) => ({
    time: formatTimeLabel(time, index),
    rainfall: index === 0 ? current : Number(hourly[index] ?? 0),
    predicted: Number(hourly[index] ?? 0),
  }));
  const nextTwoHours = forecast.slice(1, 3).map((point) => point.predicted);
  const predicted = Math.max(current, ...nextTwoHours, 0);
  return {
    id: scenario.id,
    currentRainfall: Math.round(current),
    predictedRainfall: Math.round(predicted),
    intensity: classifyRainfall(predicted),
    forecast,
    observedAt: payload.current?.time ?? new Date().toISOString(),
  };
}

export async function fetchAllLiveWeather(scenarios: LocationScenario[], signal?: AbortSignal) {
  return Promise.all(scenarios.map((scenario) => fetchLiveWeather(scenario, signal)));
}
