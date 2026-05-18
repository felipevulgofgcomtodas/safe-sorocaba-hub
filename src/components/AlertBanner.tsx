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
    <div className="fixed top-16 left-0 right-0 z-40 bg-danger/95 text-danger-foreground py-2.5 overflow-hidden animate-in slide-in-from-top-2 duration-300">
      <div className="container mx-auto px-4 flex items-center gap-3">
        <AlertTriangle className="w-4 h-4 flex-shrink-0 animate-pulse" />
        <span className="text-sm font-semibold flex-1 truncate" key={currentAlert}>
          {alerts[currentAlert]}
        </span>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-[10px] opacity-70 tabular-nums hidden sm:inline">
            {currentAlert + 1}/{alerts.length}
          </span>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 rounded hover:bg-danger-foreground/20 transition-colors active:scale-95"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertBanner;
