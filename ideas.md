# FloodTrack design brief

## Design direction

### Theme Name
Blue-hour emergency operations console

### Introduction
A calm, high-signal command center for city-scale rainfall and inundation monitoring: dark navy surfaces make the map and severity colors immediately legible, while cyan telemetry accents keep the interface technical rather than alarmist.

## Design dimensions

- **Design movement:** Operational clarity over decoration; dense but breathable information hierarchy inspired by aviation and emergency-response consoles.
- **Core principles:** Map-first, decision-first, progressive detail, strong contrast, and explicit confidence/timing language.
- **Color philosophy:** Deep navy and slate establish trust and focus. Cyan identifies live telemetry and data fusion. Green, yellow, orange, and red are reserved for risk severity and alerts.
- **Layout paradigm:** Persistent top command bar, wide map as the primary workspace, right-side risk summary, then modular lower panels for forecast, inundation, alerts, impact, and response.
- **Signature elements:** Thin cyan rule lines, a small live-status beacon, compact uppercase labels, data-source chips, map legend, and a “time to impact” emphasis block.
- **Interaction philosophy:** Every selection updates the map and all dependent cards immediately. Search and location chips are fast, forgiving, and keyboard-friendly. Map click opens a concise detail popover.
- **Animation:** Restrained: subtle pulse on live/radar markers and gentle card transitions only. No distracting loops.
- **Typography system:** Inter/system sans for labels and body; condensed uppercase micro-labels with tracking for telemetry; large numeric values with tabular numerals.
- **Brand essence:** Prepared, precise, civic, and calm under pressure.
- **Brand voice:** Direct, operational, and plain-language: “Heavy rainfall expected”, “45 min to impact”, “Prepare response teams”.
- **Wordmark/logo:** FLOODTRACK wordmark paired with a simple filled wave + shield mark; the symbol reads clearly at favicon size.
- **Signature brand color:** Signal cyan `#18D5E4` on deep navy `#071A2B`.

## Product constraints

- The map is the main visual element and must remain visually dominant on desktop.
- Mock Chennai locations and data should feel realistic but clearly prototype-safe.
- Risk colors must stay consistent: Low green, Moderate yellow, High orange, Critical red.
- Keep the architecture ready for future Satellite/Radar/Station/NWP APIs and Python/FastAPI + XGBoost/Scikit-learn + PostgreSQL/PostGIS integration.
