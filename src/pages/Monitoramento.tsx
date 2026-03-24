import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Radio, Cloud, Thermometer, Wind, Droplets, Eye, Activity, Wifi, Server, Shield } from "lucide-react";
import Header from "@/components/Header";

const sensors = [
  { name: "Estação Rio Sorocaba", status: "online", temp: 19, humidity: 92, wind: 28, rain: 45 },
  { name: "Estação Av. Dom Aguirre", status: "online", temp: 18, humidity: 95, wind: 32, rain: 62 },
  { name: "Estação Parque das Águas", status: "online", temp: 18, humidity: 94, wind: 25, rain: 51 },
  { name: "Estação Centro", status: "online", temp: 19, humidity: 88, wind: 18, rain: 30 },
  { name: "Estação Éden", status: "online", temp: 20, humidity: 82, wind: 15, rain: 22 },
  { name: "Estação Itavuvu", status: "intermitente", temp: 19, humidity: 85, wind: 20, rain: 35 },
];

const Monitoramento = () => {
  const [data, setData] = useState(sensors);
  const [uptime] = useState("99.7%");
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => prev.map(s => ({
        ...s,
        temp: s.temp + (Math.random() - 0.5) * 0.5,
        humidity: Math.min(100, Math.max(60, s.humidity + (Math.random() - 0.5) * 3)),
        wind: Math.max(0, s.wind + (Math.random() - 0.5) * 4),
        rain: Math.max(0, s.rain + (Math.random() - 0.5) * 8),
      })));
      setLastUpdate(new Date());
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </Link>

          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-safe/15 flex items-center justify-center">
              <Radio className="w-5 h-5 text-safe" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">Monitoramento 24h</h1>
              <p className="text-sm text-muted-foreground">Status do sistema e condições climáticas em tempo real</p>
            </div>
            <span className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full bg-safe/10 border border-safe/30">
              <span className="w-2 h-2 rounded-full bg-safe animate-pulse" />
              <span className="text-xs font-bold text-safe">OPERACIONAL</span>
            </span>
          </div>

          {/* System status cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { icon: Server, label: "Uptime", value: uptime, color: "text-safe" },
              { icon: Wifi, label: "Sensores Online", value: `${data.filter(s => s.status === "online").length}/${data.length}`, color: "text-primary" },
              { icon: Activity, label: "Última Atualização", value: lastUpdate.toLocaleTimeString("pt-BR"), color: "text-warning" },
              { icon: Shield, label: "Nível Geral", value: "Elevado", color: "text-danger" },
            ].map(s => (
              <div key={s.label} className="glass rounded-xl p-4 text-center">
                <s.icon className={`w-5 h-5 mx-auto mb-2 ${s.color}`} />
                <p className={`text-lg font-display font-bold ${s.color} tabular-nums`}>{s.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Sensor grid */}
          <h2 className="font-display font-bold text-foreground mb-4">Estações de Monitoramento</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map(sensor => (
              <div key={sensor.name} className="glass rounded-xl p-5 hover:shadow-lg transition-all">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-foreground text-sm">{sensor.name}</h3>
                  <span className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold ${sensor.status === "online" ? "bg-safe/10 text-safe" : "bg-warning/10 text-warning"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${sensor.status === "online" ? "bg-safe" : "bg-warning"} animate-pulse`} />
                    {sensor.status === "online" ? "Online" : "Intermitente"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: Thermometer, label: "Temp", value: `${sensor.temp.toFixed(1)}°C`, color: "text-warning" },
                    { icon: Droplets, label: "Umidade", value: `${sensor.humidity.toFixed(0)}%`, color: "text-primary" },
                    { icon: Wind, label: "Vento", value: `${sensor.wind.toFixed(0)} km/h`, color: "text-muted-foreground" },
                    { icon: Cloud, label: "Chuva", value: `${sensor.rain.toFixed(0)} mm/h`, color: sensor.rain > 40 ? "text-danger" : "text-safe" },
                  ].map(m => (
                    <div key={m.label} className="flex items-center gap-2">
                      <m.icon className={`w-3.5 h-3.5 ${m.color}`} />
                      <div>
                        <p className={`text-sm font-bold tabular-nums ${m.color}`}>{m.value}</p>
                        <p className="text-[10px] text-muted-foreground">{m.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Monitoramento;
