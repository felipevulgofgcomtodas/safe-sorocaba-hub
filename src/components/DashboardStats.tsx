import { useEffect, useState } from "react";
import { Droplets, Shield, Users, AlertTriangle } from "lucide-react";

interface StatProps {
  icon: typeof Droplets;
  label: string;
  value: number;
  suffix?: string;
  color: string;
  bgColor: string;
}

const AnimatedNumber = ({ target, suffix = "" }: { target: number; suffix?: string }) => {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.max(1, Math.floor(target / 40));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCurrent(target); clearInterval(timer); }
      else setCurrent(start);
    }, 30);
    return () => clearInterval(timer);
  }, [target]);
  return <>{current.toLocaleString("pt-BR")}{suffix}</>;
};

const StatCard = ({ icon: Icon, label, value, suffix, color, bgColor }: StatProps) => (
  <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-card border border-border hover:border-primary/20 transition-all group">
    <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${bgColor} transition-colors`}>
      <Icon className={`w-4 h-4 ${color}`} />
    </div>
    <div>
      <p className={`text-lg font-bold tabular-nums ${color}`}>
        <AnimatedNumber target={value} suffix={suffix} />
      </p>
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium">{label}</p>
    </div>
  </div>
);

interface DashboardStatsProps {
  simulationMode?: boolean;
}

const DashboardStats = ({ simulationMode }: DashboardStatsProps) => {
  const [rainLevel, setRainLevel] = useState(42);

  useEffect(() => {
    const interval = setInterval(() => {
      setRainLevel(prev => {
        const delta = Math.floor(Math.random() * 8) - 3;
        const base = simulationMode ? 85 : 42;
        return Math.max(10, Math.min(100, prev + delta + (simulationMode ? 2 : 0)));
      });
    }, 5000);
    return () => clearInterval(interval);
  }, [simulationMode]);

  const stats: StatProps[] = [
    { icon: Droplets, label: "Nível de Chuva", value: simulationMode ? 92 : rainLevel, suffix: "mm/h", color: "text-primary", bgColor: "bg-primary/15" },
    { icon: AlertTriangle, label: "Áreas de Risco", value: simulationMode ? 10 : 7, color: "text-danger", bgColor: "bg-danger/15" },
    { icon: Shield, label: "Abrigos Ativos", value: simulationMode ? 28 : 30, color: "text-safe", bgColor: "bg-safe/15" },
    { icon: Users, label: "Pessoas Abrigadas", value: simulationMode ? 4250 : 2873, color: "text-warning", bgColor: "bg-warning/15" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
      {stats.map(s => <StatCard key={s.label} {...s} />)}
    </div>
  );
};

export default DashboardStats;
