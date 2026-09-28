import { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Activity, AlertTriangle, ArrowUpRight, Bell, Building2, CheckCircle2, ChevronDown, CloudRain, Crosshair, Database, Gauge, Hospital, Info, Layers3, MapPin, Radio, Search, ShieldAlert, Siren, School, Satellite, Waves, Wind, Zap } from "lucide-react";
import FloodMap from "@/components/FloodMap";
import { allAlerts, RISK_META, scenarios, type InfrastructureItem, type LocationScenario, type RiskLevel } from "@/lib/floodtrack-data";
import { fetchAllLiveWeather } from "@/lib/weather-api";
import "./index.css";

const sourceIcons: Record<string, typeof Satellite> = { Satellite, Radar: Radio, Stations: Activity, NWP: Waves, "Weather API": CloudRain };
const infraIcons: Record<InfrastructureItem["type"], typeof Building2> = { Road: ArrowUpRight, Hospital, School, Bridge: Waves, Critical: ShieldAlert };

function RiskPill({ level, label = level }: { level: RiskLevel; label?: string }) {
  const meta = RISK_META[level];
  return <span className="risk-pill" style={{ color: meta.color, background: meta.soft, borderColor: `${meta.color}55` }}><span className="risk-dot" style={{ background: meta.color }} />{label}</span>;
}

function SectionHeading({ eyebrow, title, action }: { eyebrow: string; title: string; action?: string }) {
  return <div className="section-heading"><div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div>{action && <button className="text-action">{action}<ArrowUpRight size={14} /></button>}</div>;
}

function Metric({ icon: Icon, label, value, unit, tone = "cyan", detail }: { icon: typeof Activity; label: string; value: string; unit?: string; tone?: string; detail?: string }) {
  return <div className={`metric-card tone-${tone}`}><div className="metric-top"><span className="metric-icon"><Icon size={16} /></span><span className="eyebrow">{label}</span></div><div className="metric-value">{value}{unit && <small>{unit}</small>}</div>{detail && <div className="metric-detail">{detail}</div>}</div>;
}

function App() {
  const [selectedId, setSelectedId] = useState("velachery");
  const [query, setQuery] = useState("");
  const [liveScenarios, setLiveScenarios] = useState(scenarios);
  const [weatherState, setWeatherState] = useState<"live" | "fallback" | "refreshing">("refreshing");
  const [lastWeatherUpdate, setLastWeatherUpdate] = useState<string | null>(null);
  const selected = liveScenarios.find((scenario) => scenario.id === selectedId) ?? liveScenarios[0];
  const meta = RISK_META[selected.risk];
  const filtered = useMemo(() => liveScenarios.filter((scenario) => scenario.name.toLowerCase().includes(query.toLowerCase())), [liveScenarios, query]);
  const visibleAlerts = useMemo(() => [{ location: selected.name, level: selected.risk, time: `${selected.impactMinutes} min to impact`, text: selected.warning }, ...allAlerts.filter((alert) => alert.location !== selected.name)].slice(0, 3), [selected]);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    const refreshWeather = async () => {
      if (active) setWeatherState("refreshing");
      try {
        const updates = await fetchAllLiveWeather(scenarios, controller.signal);
        if (!active) return;
        const byId = new Map(updates.map((update) => [update.id, update]));
        setLiveScenarios(scenarios.map((scenario) => {
          const update = byId.get(scenario.id);
          if (!update) return scenario;
          return { ...scenario, currentRainfall: update.currentRainfall, predictedRainfall: update.predictedRainfall, intensity: update.intensity, forecast: update.forecast, sourceStatus: { ...scenario.sourceStatus, "Weather API": "Live" } };
        }));
        setLastWeatherUpdate(new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }));
        setWeatherState("live");
      } catch (error) {
        if (!active || (error instanceof DOMException && error.name === "AbortError")) return;
        setWeatherState("fallback");
        setLiveScenarios(scenarios);
      }
    };
    refreshWeather();
    const interval = window.setInterval(refreshWeather, 5 * 60 * 1000);
    return () => { active = false; controller.abort(); window.clearInterval(interval); };
  }, []);

  const selectLocation = (scenario: LocationScenario) => { setSelectedId(scenario.id); setQuery(""); };

  return <div className="app-shell">
    <header className="topbar">
      <div className="brand-lockup"><div className="brand-mark"><Waves size={19} strokeWidth={2.6} /><span /></div><div><div className="wordmark">FLOOD<span>TRACK</span></div><div className="brand-subtitle">Rainfall &amp; Inundation Monitoring</div></div></div>
      <div className="topbar-center"><div className="search-wrap"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search Chennai location..." /><kbd>⌘ K</kbd>{query && filtered.length > 0 && <div className="search-results">{filtered.map((scenario) => <button key={scenario.id} onClick={() => selectLocation(scenario)}><MapPin size={15} /><span>{scenario.name}<small>{scenario.district}</small></span><RiskPill level={scenario.risk} /></button>)}</div>}</div></div>
      <div className="topbar-status"><span className={`live-badge ${weatherState === "fallback" ? "fallback-badge" : ""}`}><span className="pulse-dot" />{weatherState === "live" ? "LIVE" : weatherState === "refreshing" ? "SYNC" : "FALLBACK"}</span><span className="status-copy">Weather API {weatherState === "live" ? "connected" : weatherState === "refreshing" ? "refreshing" : "offline"}<strong>{lastWeatherUpdate ? `${lastWeatherUpdate} IST` : "Awaiting feed"}</strong></span><button className="icon-button" aria-label="Notifications"><Bell size={18} /><i>3</i></button><div className="avatar">DM</div></div>
    </header>

    <main className="dashboard">
      <div className="page-intro"><div><span className="eyebrow">CITY COMMAND CENTER / 28 SEPT 2026</span><h1>Rainfall &amp; inundation overview</h1><p>Multi-source intelligence for early warning and coordinated response across Chennai.</p></div><div className="data-pipeline"><span className="eyebrow">FUSION PIPELINE</span><div>{["Satellite", "Radar", "Stations", "NWP"].map((source, index) => <span key={source}><i>{index + 1}</i>{source}{index < 3 && <b>→</b>}</span>)}</div></div></div>
      <div className="location-tabs">{liveScenarios.map((scenario) => <button key={scenario.id} className={scenario.id === selected.id ? "active" : ""} onClick={() => selectLocation(scenario)}><span className="tab-marker" style={{ background: RISK_META[scenario.risk].color }} />{scenario.name}<small>{scenario.currentRainfall} mm/hr</small></button>)}</div>

      <div className="workspace-grid">
        <section className="map-panel panel"><FloodMap selected={selected} onSelect={selectLocation} /></section>
        <aside className="risk-panel panel"><div className="panel-head"><div><span className="eyebrow">SELECTED LOCATION</span><h2>{selected.name}<small>{selected.district}</small></h2></div><button className="more-button"><span /> <span /> <span /></button></div><div className="risk-hero" style={{ borderColor: `${meta.color}66`, background: `linear-gradient(135deg, ${meta.soft}, transparent 65%)` }}><div className="risk-hero-top"><div><span className="eyebrow">CURRENT RISK</span><strong style={{ color: meta.color }}>{selected.risk.toUpperCase()} RISK</strong></div><div className="risk-score"><span>{selected.probability}%</span><small>inundation probability</small></div></div><div className="risk-meter"><span style={{ width: `${selected.probability}%`, background: meta.color }} /></div><div className="impact-row"><span><ClockIcon />{selected.impactMinutes} min</span><span><Waves size={14} />{selected.depth}</span><span><Gauge size={14} />{selected.confidence}% conf.</span></div></div><div className="risk-details"><div><span className="eyebrow">WARNING</span><p>{selected.warning}</p></div><div><span className="eyebrow">RECOMMENDED ACTION</span><p>{selected.action}</p></div></div><button className="warning-button"><Siren size={17} />Issue location warning <ArrowUpRight size={15} /></button></aside>
      </div>

      <section className="metric-grid"><Metric icon={CloudRain} label="Current rainfall" value={`${selected.currentRainfall}`} unit="mm/hr" detail="Station composite" /><Metric icon={Wind} label="Predicted rainfall" value={`${selected.predictedRainfall}`} unit="mm/hr" detail={selected.forecastDuration} tone="blue" /><Metric icon={Gauge} label="Rainfall intensity" value={selected.intensity} detail="Model classification" tone="orange" /><Metric icon={Waves} label="Expected water depth" value={selected.depth} detail="Inundation model" tone="purple" /><Metric icon={Bell} label="Active warnings" value="03" detail="Across monitored zones" tone="red" /></section>

      <div className="content-grid">
        <section className="panel forecast-panel"><SectionHeading eyebrow="AI / ML PREDICTION" title="Heavy rainfall forecast" action="Model details" /><div className="forecast-summary"><div className="forecast-callout"><div className="callout-icon"><CloudRain size={20} /></div><div><strong>Heavy rainfall expected</strong><span>Next {selected.forecastDuration.replace("Next ", "")}</span></div></div><div className="confidence"><span className="eyebrow">MODEL CONFIDENCE</span><strong>{selected.confidence}%</strong><div className="confidence-bar"><span style={{ width: `${selected.confidence}%` }} /></div></div></div><div className="chart-wrap"><ResponsiveContainer width="100%" height={218}><AreaChart data={selected.forecast} margin={{ top: 10, right: 6, left: -20, bottom: 0 }}><defs><linearGradient id="actualFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#18D5E4" stopOpacity={0.32} /><stop offset="100%" stopColor="#18D5E4" stopOpacity={0} /></linearGradient><linearGradient id="predFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#9B8AFB" stopOpacity={0.24} /><stop offset="100%" stopColor="#9B8AFB" stopOpacity={0} /></linearGradient></defs><CartesianGrid stroke="#17344A" vertical={false} /><XAxis dataKey="time" stroke="#547287" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} /><YAxis stroke="#547287" tickLine={false} axisLine={false} tick={{ fontSize: 11 }} unit=" mm" /><Tooltip contentStyle={{ background: "#0B2338", border: "1px solid #244A61", borderRadius: 10, color: "#EAF7FB" }} /><Area type="monotone" dataKey="predicted" name="Predicted" stroke="#9B8AFB" fill="url(#predFill)" strokeWidth={2} strokeDasharray="5 4" /><Area type="monotone" dataKey="rainfall" name="Observed" stroke="#18D5E4" fill="url(#actualFill)" strokeWidth={2.5} /></AreaChart></ResponsiveContainer></div><div className="chart-legend"><span><i className="legend-line cyan" />Observed rainfall</span><span><i className="legend-line violet" />Predicted rainfall</span><span className="chart-note"><Database size={13} />Fused from 4 sources</span></div></section>
        <section className="panel source-panel"><SectionHeading eyebrow="DATA PROCESSING & FUSION" title="Source health" /><div className="source-list">{Object.entries({ ...selected.sourceStatus, "Weather API": weatherState === "live" ? "Live" : weatherState === "refreshing" ? "Refreshing" : "Fallback" }).map(([source, status]) => { const Icon = sourceIcons[source] ?? Activity; return <div className="source-row" key={source}><div className="source-icon"><Icon size={16} /></div><div className="source-name"><strong>{source}</strong><span>{source === "Satellite" ? "Cloud cover & surface" : source === "Radar" ? "Doppler precipitation" : source === "Stations" ? "Ground observations" : source === "Weather API" ? "Open-Meteo live rainfall" : "Numerical weather prediction"}</span></div><span className={`source-status ${status === "Fallback" ? "source-fallback" : ""}`}><CheckCircle2 size={14} />{status}</span></div> })}</div><div className="fusion-note"><Zap size={15} /><span><strong>{weatherState === "live" ? "Live weather connected" : weatherState === "fallback" ? "Using prototype fallback" : "Connecting to live weather"}</strong> {lastWeatherUpdate ? `Last refreshed ${lastWeatherUpdate} IST · auto-refreshes every 5 minutes.` : "Open-Meteo current and hourly rainfall is being requested for all monitored zones."}</span></div></section>
      </div>

      <div className="content-grid lower-grid"><section className="panel inundation-panel"><SectionHeading eyebrow="INUNDATION PREDICTION" title="Severity analysis" action="View layers" /><div className="inundation-main"><div className="depth-orb" style={{ borderColor: meta.color, boxShadow: `0 0 0 10px ${meta.soft}` }}><Waves size={25} /><strong>{selected.depth}</strong><span>expected depth</span></div><div className="severity-copy"><RiskPill level={selected.risk} /><h3>{selected.affectedArea}</h3><p>Runoff and drainage capacity indicate {selected.risk.toLowerCase()} likelihood across the highlighted areas.</p><div className="mini-stat-row"><span><strong>{selected.probability}%</strong><small>Probability</small></span><span><strong>{selected.impactMinutes}m</strong><small>Time-to-impact</small></span><span><strong>{selected.confidence}%</strong><small>Confidence</small></span></div></div></div></section><section className="panel alerts-panel"><SectionHeading eyebrow="EARLY WARNING" title="Active alerts" action="View all 03" />{visibleAlerts.map((alert) => <div className="alert-row" key={alert.location}><div className="alert-severity" style={{ background: RISK_META[alert.level].color }} /><div className="alert-body"><div><strong>{alert.location}</strong><RiskPill level={alert.level} /></div><p>{alert.text}</p><span><ClockIcon />{alert.time}</span></div><ArrowUpRight size={15} className="muted-icon" /></div>)}</section></div>

      <div className="content-grid lower-grid"><section className="panel infra-panel"><SectionHeading eyebrow="IMPACT INFORMATION" title="Potentially affected infrastructure" action="Open impact map" /><div className="infra-list">{selected.infrastructure.map((item) => { const Icon = infraIcons[item.type]; return <div className="infra-row" key={item.name}><div className="infra-icon"><Icon size={16} /></div><div className="infra-name"><strong>{item.name}</strong><span>{item.type} · {item.distance}</span></div><span className={`infra-status ${item.status.includes("risk") || item.status.includes("possible") || item.status.includes("Inspect") ? "attention" : ""}`}>{item.status}</span></div> })}</div></section><section className="panel action-panel"><div className="action-icon"><ShieldAlert size={21} /></div><div><span className="eyebrow">RECOMMENDED RESPONSE</span><h2>{selected.risk === "Critical" ? "Issue warning & prepare emergency response" : selected.risk === "High" ? "Monitor area & prepare response teams" : "Maintain routine observation"}</h2><p>{selected.action}</p></div><button className="icon-button action-arrow"><ArrowUpRight size={18} /></button></section></div>
    </main>
    <footer className="footer"><span><span className="pulse-dot" />FloodTrack prototype · Chennai City Operations</span><span>Model refresh in 04:32 · v0.9.4</span></footer>
  </div>;
}

function ClockIcon() { return <span className="clock-icon">◷</span>; }

export default App;
