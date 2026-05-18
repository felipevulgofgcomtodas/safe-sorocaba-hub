import { useEffect, useState } from "react";
import { CloudRain, AlertTriangle, MapPin, Users, Activity } from "lucide-react";

type SystemLevel = "pre-operacional" | "atencao" | "alerta" | "operacao-ativa";

interface SystemStatus {
  nivel: SystemLevel;
  precipitacao_mm: number;
  areas_risco_ativas: number;
  pessoas_abrigadas: number;
  pontos_ativos: number;
}

const LEVEL_CONFIG: Record<SystemLevel, { label: string; color: string; bg: string; dot: string }> = {
  "pre-operacional": { label: "PRÉ-OPERACIONAL", color: "text-primary", bg: "bg-primary/10 border-primary/20", dot: "bg-primary" },
  "atencao":         { label: "ATENÇÃO",          color: "text-warning", bg: "bg-warning/10 border-warning/20", dot: "bg-warning" },
  "alerta":          { label: "ALERTA",            color: "text-orange-500", bg: "bg-orange-500/10 border-orange-500/20", dot: "bg-orange-500" },
  "operacao-ativa":  { label: "OPERAÇÃO ATIVA",   color: "text-danger",  bg: "bg-danger/10 border-danger/20",  dot: "bg-danger" },
};

async function fetchPrecipitacao(): Promise<number> {
  try {
    const res = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=-23.5015&longitude=-47.4526&current=precipitation,rain,weathercode&timezone=America/Sao_Paulo",
      { signal: AbortSignal.timeout(5000) }
    );
    const json = await res.json();
    return json?.current?.precipitation ?? 0;
  } catch {
    return 0;
  }
}

function inferLevel(mm: number): SystemLevel {
  if (mm >= 20) return "operacao-ativa";
  if (mm >= 10) return "alerta";
  if (mm >= 3)  return "atencao";
  return "pre-operacional";
}

const StatusBar = () => {
  const [status, setStatus] = useState<SystemStatus>({
    nivel: "pre-operacional",
    precipitacao_mm: 0,
    areas_risco_ativas: 0,
    pessoas_abrigadas: 45,
    pontos_ativos: 3,
  });

  useEffect(() => {
    async function update() {
      const mm = await fetchPrecipitacao();
      setStatus(prev => ({
        ...prev,
        precipitacao_mm: mm,
        nivel: inferLevel(mm),
        areas_risco_ativas: mm >= 10 ? 6 : mm >= 3 ? 3 : 0,
      }));
    }
    update();
    const id = setInterval(update, 5 * 60 * 1000);
    return () => clearInterval(id);
  }, []);

  const cfg = LEVEL_CONFIG[status.nivel];

  return (
    <div className={`w-full border-b ${cfg.bg} border px-4 py-1.5 mt-16`}>
      <div className="container mx-auto flex items-center justify-between gap-3 flex-wrap">
        {/* Status badge */}
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${cfg.dot} animate-pulse`} />
          <span className={`text-[10px] font-bold uppercase tracking-widest ${cfg.color}`}>
            {cfg.label}
          </span>
        </div>

        {/* Metrics */}
        <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide">
          <Metric icon={<CloudRain className="w-3 h-3" />} label="Precipitação" value={`${status.precipitacao_mm.toFixed(1)} mm/h`} />
          <Metric icon={<AlertTriangle className="w-3 h-3" />} label="Áreas em risco" value={String(status.areas_risco_ativas)} />
          <Metric icon={<MapPin className="w-3 h-3" />} label="Pontos ativos" value={String(status.pontos_ativos)} />
          <Metric icon={<Users className="w-3 h-3" />} label="Abrigados" value={String(status.pessoas_abrigadas)} />
        </div>

        <div className="hidden sm:flex items-center gap-1 text-[10px] text-muted-foreground">
          <Activity className="w-3 h-3" />
          <span>Open-Meteo · atualiza a cada 5min</span>
        </div>
      </div>
    </div>
  );
};

const Metric = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) => (
  <div className="flex items-center gap-1.5 whitespace-nowrap">
    <span className="text-muted-foreground">{icon}</span>
    <span className="text-[10px] text-muted-foreground hidden sm:inline">{label}:</span>
    <span className="text-[10px] font-semibold text-foreground tabular-nums">{value}</span>
  </div>
);

export default StatusBar;
