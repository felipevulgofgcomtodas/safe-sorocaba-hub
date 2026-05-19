import { useEffect, useState } from "react";
import { Droplets, Shield, MapPin, Package } from "lucide-react";

interface StatProps {
  icon: typeof Droplets;
  label: string;
  value: string;
  color: string;
  bgColor: string;
}

const StatCard = ({ icon: Icon, label, value, color, bgColor }: StatProps) => (
  <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-card/80 border border-border/50 hover:border-primary/20 transition-all group backdrop-blur-sm">
    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${bgColor} transition-colors flex-shrink-0`}>
      <Icon className={`w-3.5 h-3.5 ${color}`} />
    </div>
    <div className="min-w-0">
      <p className={`text-base font-bold tabular-nums leading-tight ${color}`}>{value}</p>
      <p className="text-[9px] text-muted-foreground uppercase tracking-wider font-medium truncate">{label}</p>
    </div>
  </div>
);

const DashboardStats = () => {
  const [precipitacao, setPrecipitacao] = useState<string>("—");

  useEffect(() => {
    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=-23.5015&longitude=-47.4526&current=precipitation&timezone=America/Sao_Paulo",
      { signal: AbortSignal.timeout(5000) }
    )
      .then(r => r.json())
      .then(j => setPrecipitacao(`${(j?.current?.precipitation ?? 0).toFixed(1)} mm/h`))
      .catch(() => setPrecipitacao("0.0 mm/h"));
  }, []);

  const stats: StatProps[] = [
    { icon: Droplets, label: "Precipitação Atual",   value: precipitacao, color: "text-primary",  bgColor: "bg-primary/15"  },
    { icon: MapPin,   label: "Áreas de Risco",        value: "6 zonas",   color: "text-danger",   bgColor: "bg-danger/15"   },
    { icon: Shield,   label: "Pontos de Coleta",      value: "3 ativos",  color: "text-safe",     bgColor: "bg-safe/15"     },
    { icon: Package,  label: "Kits Produzidos",       value: "169 kits",  color: "text-warning",  bgColor: "bg-warning/15"  },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
      {stats.map(s => <StatCard key={s.label} {...s} />)}
    </div>
  );
};

export default DashboardStats;
