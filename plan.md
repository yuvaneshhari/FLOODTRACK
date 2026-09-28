
## Live weather integration

The dashboard now uses the public Open-Meteo Forecast API from the browser for the four monitored Chennai coordinates. It requests current precipitation/rain plus the next five hourly precipitation values in `Asia/Kolkata`, refreshes every five minutes, updates current rainfall, predicted rainfall, intensity, and the forecast chart, and shows the last successful refresh in the command header and source-health panel. If the feed is unavailable, the typed prototype scenarios remain visible and the UI explicitly reports `Fallback`; no API key is required for this public non-commercial integration.
