import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Bell, AlertTriangle, Info, ShieldAlert, Phone,
  CloudRain, Wind, Thermometer, RefreshCw, ExternalLink,
} from "lucide-react";
import Header from "@/components/Header";

// ── Tipos ────────────────────────────────────────────────────────────────────

type Level = "emergencia" | "atencao" | "informativo";

interface Alert {
  id: string;
  level: Level;
  title: string;
  message: string;
  time: string;
  location: string;
}

const levelConfig = {
  emergencia: { icon: ShieldAlert, color: "text-danger",  bg: "bg-danger/10",  border: "border-danger/30",  label: "Emergência",  dot: "bg-danger"  },
  atencao:    { icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10", border: "border-warning/30", label: "Atenção",     dot: "bg-warning" },
  informativo:{ icon: Info,          color: "text-safe",   bg: "bg-safe/10",    border: "border-safe/30",    label: "Informativo", dot: "bg-safe"    },
};

// ── Gera alertas a partir dos dados meteorológicos reais ─────────────────────

interface WeatherNow {
  precipitation: number;
  rain: number;
  weathercode: number;
  windspeed_10m: number;
  temperature_2m: number;
  relative_humidity_2m: number;
}

function buildAlerts(w: WeatherNow): Alert[] {
  const list: Alert[] = [];
  const now = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });

  // Chuva / precipitação
  if (w.precipitation >= 20 || w.rain >= 20) {
    list.push({
      id: "chuva-critica",
      level: "emergencia",
      title: "Chuva Crítica em Sorocaba",
      message: `Precipitação de ${w.precipitation.toFixed(1)} mm/h registrada. Risco alto de alagamento nas áreas de baixada. Evite circular pelas zonas de risco.`,
      time: `Atualizado às ${now}`,
      location: "Sorocaba — Open-Meteo",
    });
  } else if (w.precipitation >= 10 || w.rain >= 10) {
    list.push({
      id: "chuva-forte",
      level: "atencao",
      title: "Chuva Forte Registrada",
      message: `Precipitação de ${w.precipitation.toFixed(1)} mm/h. Fique atento a pontos de alagamento nas avenidas Dom Aguirre e Ipanema.`,
      time: `Atualizado às ${now}`,
      location: "Sorocaba — Open-Meteo",
    });
  } else if (w.precipitation > 0) {
    list.push({
      id: "chuva-leve",
      level: "informativo",
      title: "Chuva Fraca em Sorocaba",
      message: `Precipitação de ${w.precipitation.toFixed(1)} mm/h no momento. Monitoramento contínuo ativado.`,
      time: `Atualizado às ${now}`,
      location: "Sorocaba — Open-Meteo",
    });
  }

  // Tempestade (WMO codes 95–99)
  if (w.weathercode >= 95) {
    list.push({
      id: "tempestade",
      level: "emergencia",
      title: "Tempestade Ativa",
      message: "Tempestade com raios detectada sobre Sorocaba. Permaneça em local seguro, evite áreas abertas e proximidades de árvores.",
      time: `Atualizado às ${now}`,
      location: "Sorocaba — Open-Meteo",
    });
  }

  // Vento forte
  if (w.windspeed_10m >= 50) {
    list.push({
      id: "vento-forte",
      level: "emergencia",
      title: "Vento Muito Forte",
      message: `Rajadas de ${Math.round(w.windspeed_10m)} km/h. Risco de queda de árvores e estruturas. Evite sair de casa.`,
      time: `Atualizado às ${now}`,
      location: "Sorocaba — Open-Meteo",
    });
  } else if (w.windspeed_10m >= 30) {
    list.push({
      id: "vento-moderado",
      level: "atencao",
      title: "Vento Moderado a Forte",
      message: `Ventos de ${Math.round(w.windspeed_10m)} km/h registrados. Redobre atenção ao dirigir e evite objetos soltos ao ar livre.`,
      time: `Atualizado às ${now}`,
      location: "Sorocaba — Open-Meteo",
    });
  }

  // Umidade alta (>95%) com chuva = risco de deslizamento
  if (w.relative_humidity_2m >= 95 && w.precipitation > 5) {
    list.push({
      id: "deslizamento",
      level: "atencao",
      title: "Risco de Deslizamento",
      message: `Umidade de ${w.relative_humidity_2m}% com chuva ativa. Encostas e taludes podem estar instáveis — evite áreas de risco.`,
      time: `Atualizado às ${now}`,
      location: "Sorocaba — Open-Meteo",
    });
  }

  // Sem eventos — sistema normal
  if (list.length === 0) {
    list.push({
      id: "normal",
      level: "informativo",
      title: "Sistema em Monitoramento Normal",
      message: `Temperatura ${Math.round(w.temperature_2m)}°C · Vento ${Math.round(w.windspeed_10m)} km/h · Sem precipitação no momento. Pontos de coleta operacionais.`,
      time: `Atualizado às ${now}`,
      location: "Sorocaba — Open-Meteo",
    });

    // Lembra dos pontos de coleta
    list.push({
      id: "pontos-ativos",
      level: "informativo",
      title: "Pontos de Coleta Aguardam Doações",
      message: "Comunidade Santa Bárbara, Paróquia Santo Antônio e Paróquia São Carlos Borromeu aceitam doações de cestas, kits de higiene, limpeza e água.",
      time: "Ativação: Agosto 2025",
      location: "3 pontos em Sorocaba",
    });
  }

  return list;
}

// ── Componente ────────────────────────────────────────────────────────────────

const Alertas = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [weather, setWeather] = useState<WeatherNow | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [filter, setFilter] = useState("todos");

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=-23.5015&longitude=-47.4526&current=temperature_2m,precipitation,rain,weathercode,windspeed_10m,relative_humidity_2m&timezone=America/Sao_Paulo",
        { signal: AbortSignal.timeout(8000) }
      );
      const json = await res.json();
      const w: WeatherNow = json.current;
      setWeather(w);
      setAlerts(buildAlerts(w));
      setLastUpdate(new Date());
    } catch {
      setAlerts([{
        id: "offline",
        level: "informativo",
        title: "Sistema de Alertas Offline",
        message: "Não foi possível conectar à API meteorológica. Verifique sua conexão e tente novamente.",
        time: "Agora",
        location: "Sorocaba",
      }]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    const id = setInterval(fetchAlerts, 5 * 60 * 1000); // Atualiza a cada 5 min
    return () => clearInterval(id);
  }, []);

  const filtered = filter === "todos" ? alerts : alerts.filter(a => a.level === filter);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </Link>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Alerts list */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-danger/15 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-danger" />
                </div>
                <div>
                  <h1 className="font-display text-2xl font-bold text-foreground">Alertas em Tempo Real</h1>
                  <p className="text-sm text-muted-foreground">
                    Gerados automaticamente via Open-Meteo · Sorocaba SP
                  </p>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  {loading
                    ? <RefreshCw className="w-4 h-4 text-primary animate-spin" />
                    : <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-danger/10 border border-danger/30">
                        <span className="w-2 h-2 rounded-full bg-danger animate-pulse" />
                        <span className="text-xs font-bold text-danger">AO VIVO</span>
                      </span>
                  }
                </div>
              </div>

              {/* Clima atual resumido */}
              {weather && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-5">
                  {[
                    { icon: Thermometer, label: "Temperatura", value: `${Math.round(weather.temperature_2m)}°C` },
                    { icon: CloudRain,   label: "Precipitação", value: `${weather.precipitation.toFixed(1)} mm/h` },
                    { icon: Wind,        label: "Vento",        value: `${Math.round(weather.windspeed_10m)} km/h` },
                    { icon: CloudRain,   label: "Umidade",      value: `${weather.relative_humidity_2m}%` },
                  ].map(({ icon: Icon, label, value }) => (
                    <div key={label} className="bg-card border border-border rounded-xl p-3 flex items-center gap-2">
                      <Icon className="w-4 h-4 text-muted-foreground shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-foreground tabular-nums">{value}</p>
                        <p className="text-[10px] text-muted-foreground">{label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {lastUpdate && (
                <p className="text-[11px] text-muted-foreground mb-4 flex items-center gap-1.5">
                  <RefreshCw className="w-3 h-3" />
                  Última atualização: {lastUpdate.toLocaleTimeString("pt-BR")} · atualiza automaticamente a cada 5 min
                  <button onClick={fetchAlerts} className="ml-1 text-primary hover:underline">Atualizar agora</button>
                </p>
              )}

              {/* Filters */}
              <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
                {[
                  { key: "todos",       label: "Todos",       count: alerts.length },
                  { key: "emergencia",  label: "Emergência",  count: alerts.filter(a => a.level === "emergencia").length },
                  { key: "atencao",     label: "Atenção",     count: alerts.filter(a => a.level === "atencao").length },
                  { key: "informativo", label: "Informativo", count: alerts.filter(a => a.level === "informativo").length },
                ].map(f => (
                  <button
                    key={f.key}
                    onClick={() => setFilter(f.key)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                      filter === f.key
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "bg-muted/50 text-muted-foreground border border-border hover:bg-muted"
                    }`}
                  >
                    {f.label}
                    <span className="opacity-70">{f.count}</span>
                  </button>
                ))}
              </div>

              {/* Alert cards */}
              <div className="space-y-3">
                {loading && (
                  <div className="flex items-center justify-center py-12 text-muted-foreground gap-2">
                    <RefreshCw className="w-5 h-5 animate-spin text-primary" />
                    <span className="text-sm">Consultando dados meteorológicos...</span>
                  </div>
                )}
                {!loading && filtered.map(alert => {
                  const cfg = levelConfig[alert.level];
                  const Icon = cfg.icon;
                  return (
                    <div key={alert.id} className={`rounded-xl border p-4 ${cfg.bg} ${cfg.border} animate-in fade-in duration-300`}>
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${cfg.bg}`}>
                          <Icon className={`w-4 h-4 ${cfg.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${cfg.bg} ${cfg.color} border ${cfg.border}`}>
                              {cfg.label}
                            </span>
                            <span className="text-[10px] text-muted-foreground">{alert.time}</span>
                          </div>
                          <h3 className={`font-bold text-sm ${cfg.color} mb-1`}>{alert.title}</h3>
                          <p className="text-sm text-foreground/80 leading-relaxed">{alert.message}</p>
                          <p className="text-[10px] text-muted-foreground mt-1.5 flex items-center gap-1">
                            <span>📍</span> {alert.location}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Link para previsão completa */}
              <div className="mt-6 p-4 bg-card border border-border rounded-xl flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">Ver previsão completa de 7 dias</p>
                  <p className="text-xs text-muted-foreground">Com nível de perigo de enchente por dia</p>
                </div>
                <Link
                  to="/clima"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shrink-0"
                >
                  Abrir <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:w-72 space-y-4">
              {/* Emergência */}
              <div className="bg-danger/10 border border-danger/30 rounded-xl p-4">
                <h2 className="font-bold text-danger text-sm mb-3 flex items-center gap-2">
                  <Phone className="w-4 h-4" /> Emergências
                </h2>
                <div className="space-y-2">
                  {[
                    { label: "Defesa Civil", number: "199" },
                    { label: "Bombeiros",    number: "193" },
                    { label: "SAMU",         number: "192" },
                    { label: "Polícia",      number: "190" },
                  ].map(({ label, number }) => (
                    <a key={number} href={`tel:${number}`}
                      className="flex items-center justify-between p-2.5 rounded-lg bg-background/50 hover:bg-background transition-colors">
                      <span className="text-sm text-foreground font-medium">{label}</span>
                      <span className="text-sm font-bold text-danger tabular-nums">{number}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Pontos de coleta */}
              <div className="bg-safe/10 border border-safe/30 rounded-xl p-4">
                <h2 className="font-bold text-safe text-sm mb-3">📦 Pontos de Coleta Ativos</h2>
                <div className="space-y-2 text-xs text-muted-foreground">
                  <p>🏘️ <span className="font-medium text-foreground">Comunidade Santa Bárbara</span><br />Jardim das Estrelas</p>
                  <p>⛪ <span className="font-medium text-foreground">Paróquia Santo Antônio</span><br />Vila Haro</p>
                  <p>⛪ <span className="font-medium text-foreground">Paróquia São Carlos Borromeu</span><br />Centro</p>
                </div>
                <Link to="/ocupacao" className="mt-3 flex items-center gap-1 text-xs text-safe font-semibold hover:underline">
                  Ver capacidade <ExternalLink className="w-3 h-3" />
                </Link>
              </div>

              {/* Dados */}
              <div className="bg-muted/30 border border-border rounded-xl p-4 text-xs text-muted-foreground">
                <p className="font-semibold text-foreground mb-1">Sobre os alertas</p>
                <p>Gerados automaticamente com base nos dados em tempo real da API <strong>Open-Meteo</strong> para Sorocaba (lat -23.50, lon -47.45). Atualizam a cada 5 minutos.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Alertas;
