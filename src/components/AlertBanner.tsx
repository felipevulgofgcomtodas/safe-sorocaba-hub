import { useState, useEffect } from "react";
import { AlertTriangle, X } from "lucide-react";

const alerts = [
  "ALERTA VERMELHO — Risco de enchente em áreas próximas ao Rio Sorocaba. Evite circular pela região.",
  "ATENÇÃO — Nível do Rio Sorocaba subindo. Abrigos ativados na região central.",
  "AVISO — Chuva intensa prevista para as próximas 3 horas. Procure abrigo preventivamente.",
];

const AlertBanner = () => {
  const [dismissed, setDismissed] = useState(false);
  const [currentAlert, setCurrentAlert] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAlert((prev) => (prev + 1) % alerts.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  if (dismissed) return null;

  return (
    <div className="fixed top-16 left-0 right-0 z-40 px-4 py-2 animate-in slide-in-from-top-4 duration-500 pointer-events-none">
      <div className="container mx-auto max-w-4xl">
        <div className="glass-strong border-danger/30 bg-danger/80 text-white rounded-2xl px-4 py-2.5 flex items-center gap-3 shadow-2xl shadow-danger/20 pointer-events-auto ring-1 ring-danger/40">
          <div className="p-1.5 rounded-lg bg-white/20">
            <AlertTriangle className="w-4 h-4 animate-pulse text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-black uppercase tracking-widest text-white/70 leading-none mb-1">Alerta de Emergência</p>
            <span className="text-sm font-bold truncate block" key={currentAlert}>
              {alerts[currentAlert]}
            </span>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="text-[10px] font-bold tabular-nums opacity-60 hidden sm:inline">
              {currentAlert + 1} de {alerts.length}
            </span>
            <div className="w-px h-6 bg-white/20" />
            <button
              onClick={() => setDismissed(true)}
              className="p-1.5 rounded-xl hover:bg-white/10 transition-colors active:scale-95"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertBanner;
