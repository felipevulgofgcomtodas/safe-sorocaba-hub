import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Search, MapPin, Thermometer, Wind, Droplets,
  CloudRain, AlertTriangle, RefreshCw, Navigation, CloudLightning,
  Sun, Cloud, CloudDrizzle, Snowflake, Eye,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

// ── WMO Weather Code helpers ────────────────────────────────────────────────

function wmoIcon(code: number): string {
  if (code === 0)                     return "☀️";
  if (code <= 3)                      return code === 1 ? "🌤️" : code === 2 ? "⛅" : "☁️";
  if (code <= 48)                     return "🌫️";
  if (code <= 55)                     return "🌦️";
  if (code <= 65)                     return "🌧️";
  if (code <= 67)                     return "🌨️";
  if (code <= 77)                     return "❄️";
  if (code <= 82)                     return "🌧️";
  if (code <= 86)                     return "🌨️";
  if (code <= 99)                     return "⛈️";
  return "🌡️";
}

function wmoLabel(code: number): string {
  if (code === 0)        return "Céu limpo";
  if (code === 1)        return "Predomin. limpo";
  if (code === 2)        return "Parcialmente nublado";
  if (code === 3)        return "Nublado";
  if (code <= 48)        return "Névoa/neblina";
  if (code <= 55)        return "Garoa";
  if (code <= 65)        return "Chuva";
  if (code <= 77)        return "Neve";
  if (code <= 82)        return "Pancadas de chuva";
  if (code <= 86)        return "Pancadas de neve";
  if (code <= 99)        return "Tempestade";
  return "Desconhecido";
}

// ── Danger level ─────────────────────────────────────────────────────────────

interface DangerInfo {
  pct: number;
  label: string;
  color: string;
  bg: string;
  border: string;
  barColor: string;
}

function getDanger(precipMm: number, precipProbPct: number, wmoCode: number): DangerInfo {
  // Weight: precipitation amount (60%) + probability (25%) + storm code (15%)
  const stormBonus = wmoCode >= 95 ? 30 : wmoCode >= 80 ? 15 : wmoCode >= 61 ? 5 : 0;
  const precipScore = Math.min(100, (precipMm / 50) * 100);
  const raw = precipScore * 0.6 + precipProbPct * 0.25 + stormBonus;
  const pct = Math.min(100, Math.round(raw));

  if (pct >= 75) return { pct, label: "Crítico",   color: "text-danger",     bg: "bg-danger/10",     border: "border-danger/30",     barColor: "#ef4444" };
  if (pct >= 50) return { pct, label: "Alto",      color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/30", barColor: "#f97316" };
  if (pct >= 25) return { pct, label: "Moderado",  color: "text-warning",    bg: "bg-warning/10",    border: "border-warning/30",    barColor: "#eab308" };
  if (pct >= 10) return { pct, label: "Baixo",     color: "text-blue-400",   bg: "bg-blue-400/10",   border: "border-blue-400/30",   barColor: "#60a5fa" };
  return            { pct, label: "Normal",    color: "text-safe",       bg: "bg-safe/10",       border: "border-safe/30",       barColor: "#22c55e" };
}

// ── Types ─────────────────────────────────────────────────────────────────────

interface CurrentWeather {
  temperature_2m: number;
  apparent_temperature: number;
  precipitation: number;
  weathercode: number;
  windspeed_10m: number;
  relative_humidity_2m: number;
}

interface DailyForecast {
  date: string;
  weathercode: number;
  temp_max: number;
  temp_min: number;
  precip_sum: number;
  precip_prob: number;
}

interface HourlyPoint {
  hour: string;
  precip: number;
  temp: number;
  prob: number;
}

interface GeoResult {
  id: number;
  name: string;
  country: string;
  admin1?: string;
  latitude: number;
  longitude: number;
}

// ── API fetchers ──────────────────────────────────────────────────────────────

async function geocode(query: string): Promise<GeoResult[]> {
  const res = await fetch(
    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=pt&format=json`,
    { signal: AbortSignal.timeout(6000) }
  );
  const json = await res.json();
  return json.results ?? [];
}

interface WeatherData {
  current: CurrentWeather;
  daily: DailyForecast[];
  hourly: HourlyPoint[];
}

async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  const url = [
    "https://api.open-meteo.com/v1/forecast",
    `?latitude=${lat}&longitude=${lon}`,
    "&current=temperature_2m,apparent_temperature,precipitation,weathercode,windspeed_10m,relative_humidity_2m",
    "&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max",
    "&hourly=temperature_2m,precipitation_probability,precipitation",
    "&timezone=America/Sao_Paulo&forecast_days=7",
  ].join("");

  const res = await fetch(url, { signal: AbortSignal.timeout(8000) });
  const json = await res.json();

  const daily: DailyForecast[] = json.daily.time.map((d: string, i: number) => ({
    date: d,
    weathercode: json.daily.weathercode[i],
    temp_max: Math.round(json.daily.temperature_2m_max[i]),
    temp_min: Math.round(json.daily.temperature_2m_min[i]),
    precip_sum: json.daily.precipitation_sum[i] ?? 0,
    precip_prob: json.daily.precipitation_probability_max[i] ?? 0,
  }));

  // Next 24 hourly points
  const now = new Date();
  const hourly: HourlyPoint[] = [];
  for (let i = 0; i < json.hourly.time.length && hourly.length < 24; i++) {
    const t = new Date(json.hourly.time[i]);
    if (t >= now) {
      hourly.push({
        hour: t.getHours().toString().padStart(2, "0") + "h",
        precip: json.hourly.precipitation[i] ?? 0,
        temp: Math.round(json.hourly.temperature_2m[i]),
        prob: json.hourly.precipitation_probability[i] ?? 0,
      });
    }
  }

  return { current: json.current, daily, hourly: hourly.slice(0, 24) };
}

// ── Component ─────────────────────────────────────────────────────────────────

const SOROCABA = { lat: -23.5015, lon: -47.4526, name: "Sorocaba, SP — Brasil" };

const Clima = () => {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<GeoResult[]>([]);
  const [location, setLocation] = useState<{ lat: number; lon: number; name: string }>(SOROCABA);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [geoLoading, setGeoLoading] = useState(false);

  const load = useCallback(async (lat: number, lon: number, name: string) => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchWeather(lat, lon);
      setWeather(data);
      setLocation({ lat, lon, name });
      setLastUpdated(new Date());
    } catch {
      setError("Não foi possível carregar a previsão. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load for Sorocaba
  useEffect(() => {
    load(SOROCABA.lat, SOROCABA.lon, SOROCABA.name);
  }, [load]);

  // Autocomplete
  useEffect(() => {
    if (query.length < 2) { setSuggestions([]); return; }
    const t = setTimeout(async () => {
      try {
        const results = await geocode(query);
        setSuggestions(results);
      } catch { /* ignore */ }
    }, 400);
    return () => clearTimeout(t);
  }, [query]);

  const selectSuggestion = (r: GeoResult) => {
    setSuggestions([]);
    setQuery("");
    load(r.latitude, r.longitude, `${r.name}${r.admin1 ? `, ${r.admin1}` : ""} — ${r.country}`);
  };

  const useMyLocation = () => {
    if (!navigator.geolocation) return;
    setGeoLoading(true);
    navigator.geolocation.getCurrentPosition(
      pos => {
        setGeoLoading(false);
        load(pos.coords.latitude, pos.coords.longitude, "Minha localização");
      },
      () => { setGeoLoading(false); setError("Permissão de localização negada."); }
    );
  };

  const danger = weather
    ? getDanger(
        weather.daily[0]?.precip_sum ?? 0,
        weather.daily[0]?.precip_prob ?? 0,
        weather.current.weathercode
      )
    : null;

  const formatDate = (iso: string) => {
    const d = new Date(iso + "T12:00:00");
    return d.toLocaleDateString("pt-BR", { weekday: "short", day: "2-digit", month: "2-digit" });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 pb-16">
        {/* Hero */}
        <section className="bg-gradient-to-br from-blue-500/10 via-background to-primary/5 py-10 md:py-14 border-b border-border">
          <div className="container mx-auto px-5">
            <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-5 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Voltar
            </Link>

            <div className="flex items-start gap-4 mb-7">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                <CloudRain className="w-7 h-7 text-blue-400" />
              </div>
              <div>
                <h1 className="font-display text-2xl md:text-4xl font-bold text-foreground mb-1">
                  Previsão do Tempo
                </h1>
                <p className="text-muted-foreground text-sm">
                  7 dias com nível de risco de enchente por dia — dados Open-Meteo
                </p>
              </div>
            </div>

            {/* Search bar */}
            <div className="relative max-w-lg">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Digite sua cidade..."
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                  />
                </div>
                <button
                  onClick={useMyLocation}
                  disabled={geoLoading}
                  title="Usar minha localização"
                  className="px-3 py-3 rounded-xl bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-colors disabled:opacity-50"
                >
                  {geoLoading
                    ? <RefreshCw className="w-4 h-4 animate-spin" />
                    : <Navigation className="w-4 h-4" />}
                </button>
              </div>

              {/* Suggestions dropdown */}
              {suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-card border border-border rounded-xl shadow-xl z-20 overflow-hidden animate-in slide-in-from-top-2 duration-150">
                  {suggestions.map(r => (
                    <button
                      key={r.id}
                      onClick={() => selectSuggestion(r)}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-foreground hover:bg-muted/50 transition-colors text-left"
                    >
                      <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                      <span>{r.name}{r.admin1 ? `, ${r.admin1}` : ""} — {r.country}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Current location pill */}
            <div className="flex items-center gap-2 mt-3">
              <MapPin className="w-3.5 h-3.5 text-primary" />
              <span className="text-sm text-muted-foreground">{location.name}</span>
              {lastUpdated && (
                <span className="text-[10px] text-muted-foreground ml-auto">
                  Atualizado: {lastUpdated.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                  <button onClick={() => load(location.lat, location.lon, location.name)} className="ml-1.5 hover:text-primary transition-colors">
                    <RefreshCw className="w-3 h-3 inline" />
                  </button>
                </span>
              )}
            </div>
          </div>
        </section>

        <section className="container mx-auto px-5 py-8 space-y-6">
          {error && (
            <div className="bg-danger/10 border border-danger/20 rounded-xl p-4 text-sm text-danger flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-3 text-muted-foreground">
                <RefreshCw className="w-8 h-8 animate-spin text-primary" />
                <p className="text-sm">Carregando previsão...</p>
              </div>
            </div>
          )}

          {!loading && weather && (
            <>
              {/* Current weather + danger */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Current weather card */}
                <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Agora</p>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="text-5xl font-bold text-foreground tabular-nums">
                        {Math.round(weather.current.temperature_2m)}°C
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {wmoLabel(weather.current.weathercode)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Sensação {Math.round(weather.current.apparent_temperature)}°C
                      </p>
                    </div>
                    <span className="text-6xl">{wmoIcon(weather.current.weathercode)}</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { icon: Droplets,     label: "Umidade",    value: `${weather.current.relative_humidity_2m}%` },
                      { icon: Wind,         label: "Vento",      value: `${Math.round(weather.current.windspeed_10m)} km/h` },
                      { icon: CloudRain,    label: "Precip.",    value: `${weather.current.precipitation.toFixed(1)} mm` },
                    ].map(({ icon: Icon, label, value }) => (
                      <div key={label} className="bg-muted/30 rounded-xl p-2.5 text-center">
                        <Icon className="w-4 h-4 text-muted-foreground mx-auto mb-1" />
                        <p className="text-sm font-semibold text-foreground tabular-nums">{value}</p>
                        <p className="text-[10px] text-muted-foreground">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Danger card */}
                {danger && (
                  <div className={`rounded-2xl p-5 border ${danger.bg} ${danger.border} shadow-sm`}>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5" /> Nível de Perigo — Hoje
                    </p>
                    <div className="flex items-end gap-3 mb-4">
                      <span className={`text-5xl font-bold tabular-nums ${danger.color}`}>
                        {danger.pct}%
                      </span>
                      <span className={`text-lg font-bold mb-1 ${danger.color}`}>{danger.label}</span>
                    </div>
                    <div className="h-3 rounded-full bg-muted overflow-hidden mb-3">
                      <div
                        className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${danger.pct}%`, backgroundColor: danger.barColor }}
                      />
                    </div>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <p>• Precipitação prevista: <span className="font-semibold text-foreground">{weather.daily[0]?.precip_sum.toFixed(1)} mm</span></p>
                      <p>• Probabilidade de chuva: <span className="font-semibold text-foreground">{weather.daily[0]?.precip_prob}%</span></p>
                      {danger.pct >= 50 && (
                        <p className={`mt-2 font-semibold ${danger.color}`}>
                          ⚠️ Risco elevado — evite áreas de baixada e margens de rios.
                        </p>
                      )}
                      {danger.pct >= 75 && (
                        <p className={`font-semibold ${danger.color}`}>
                          🚨 Ligue para a Defesa Civil: <a href="tel:199" className="underline">199</a>
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* 7-day forecast */}
              <div>
                <h2 className="text-base font-bold text-foreground mb-3 flex items-center gap-2">
                  <Cloud className="w-4 h-4 text-primary" /> Previsão 7 Dias + Risco de Enchente
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
                  {weather.daily.map((day, idx) => {
                    const d = getDanger(day.precip_sum, day.precip_prob, day.weathercode);
                    const isToday = idx === 0;
                    return (
                      <div
                        key={day.date}
                        className={`rounded-xl p-3 border transition-all ${d.bg} ${d.border} ${isToday ? "ring-2 ring-primary/30" : ""}`}
                      >
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wide mb-1">
                          {isToday ? "Hoje" : formatDate(day.date)}
                        </p>
                        <div className="text-2xl mb-1">{wmoIcon(day.weathercode)}</div>
                        <p className="text-xs text-muted-foreground mb-2 leading-tight">{wmoLabel(day.weathercode)}</p>
                        <div className="flex justify-between text-xs font-semibold text-foreground mb-2">
                          <span className="text-danger">{day.temp_max}°</span>
                          <span className="text-muted-foreground">{day.temp_min}°</span>
                        </div>
                        <div className="mb-1.5">
                          <div className="flex justify-between text-[10px] text-muted-foreground mb-0.5">
                            <span>Perigo</span>
                            <span className={`font-bold ${d.color}`}>{d.pct}%</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-muted/60 overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{ width: `${d.pct}%`, backgroundColor: d.barColor }}
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <CloudRain className="w-3 h-3" />
                          <span className="tabular-nums">{day.precip_sum.toFixed(1)}mm</span>
                          <span className="ml-auto tabular-nums">{day.precip_prob}%</span>
                        </div>
                        <p className={`text-[10px] font-bold mt-1 ${d.color}`}>{d.label}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Hourly precipitation chart */}
              {weather.hourly.length > 0 && (
                <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
                  <h2 className="text-base font-bold text-foreground mb-4 flex items-center gap-2">
                    <CloudDrizzle className="w-4 h-4 text-blue-400" /> Precipitação — Próximas 24h
                  </h2>
                  <ResponsiveContainer width="100%" height={180}>
                    <AreaChart data={weather.hourly} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                      <defs>
                        <linearGradient id="precipGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.4} />
                          <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.05} />
                        </linearGradient>
                        <linearGradient id="probGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#a78bfa" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#a78bfa" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="hour" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} interval={3} />
                      <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                      <Tooltip
                        contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }}
                        formatter={(v: number, name: string) => [
                          name === "precip" ? `${v.toFixed(1)} mm` : `${v}%`,
                          name === "precip" ? "Precipitação" : "Prob. chuva",
                        ]}
                      />
                      <Area type="monotone" dataKey="precip" stroke="#60a5fa" fill="url(#precipGrad)" strokeWidth={2} />
                      <Area type="monotone" dataKey="prob" stroke="#a78bfa" fill="url(#probGrad)" strokeWidth={1.5} strokeDasharray="4 2" />
                    </AreaChart>
                  </ResponsiveContainer>
                  <div className="flex items-center gap-5 mt-2 justify-end">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="w-3 h-0.5 bg-blue-400 rounded" /> Precipitação (mm)
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="w-3 h-0.5 bg-violet-400 rounded" style={{ borderTop: "2px dashed" }} /> Prob. chuva (%)
                    </div>
                  </div>
                </div>
              )}

              {/* Legend */}
              <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
                <h3 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
                  <Eye className="w-4 h-4 text-muted-foreground" /> Legenda dos Níveis de Risco
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
                  {[
                    { label: "Normal",   pct: "0–9%",   color: "text-safe",       bg: "bg-safe/10",       border: "border-safe/20" },
                    { label: "Baixo",    pct: "10–24%", color: "text-blue-400",   bg: "bg-blue-400/10",   border: "border-blue-400/20" },
                    { label: "Moderado", pct: "25–49%", color: "text-warning",    bg: "bg-warning/10",    border: "border-warning/20" },
                    { label: "Alto",     pct: "50–74%", color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20" },
                    { label: "Crítico",  pct: "75–100%",color: "text-danger",     bg: "bg-danger/10",     border: "border-danger/20" },
                  ].map(l => (
                    <div key={l.label} className={`rounded-xl p-3 border ${l.bg} ${l.border} text-center`}>
                      <p className={`text-sm font-bold ${l.color}`}>{l.label}</p>
                      <p className="text-[10px] text-muted-foreground">{l.pct}</p>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-muted-foreground mt-3">
                  O índice considera precipitação acumulada (60%), probabilidade de chuva (25%) e código de tempestade WMO (15%).
                  Dados fornecidos por <a href="https://open-meteo.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Open-Meteo</a> — gratuito e sem chave de API.
                </p>
              </div>
            </>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Clima;
