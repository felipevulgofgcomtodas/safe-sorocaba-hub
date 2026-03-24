import { AlertTriangle } from "lucide-react";

const AlertBanner = () => {
  return (
    <div className="fixed top-16 left-0 right-0 z-40 bg-danger/90 text-danger-foreground py-2 overflow-hidden">
      <div className="flex items-center gap-2 alert-scroll whitespace-nowrap">
        <AlertTriangle className="w-4 h-4 flex-shrink-0" />
        <span className="text-sm font-medium">
          ALERTA VERMELHO — Risco de enchente em áreas próximas ao Rio Sorocaba. Evite circular pela região.
        </span>
        <AlertTriangle className="w-4 h-4 flex-shrink-0 ml-8" />
        <span className="text-sm font-medium">
          ALERTA VERMELHO — Risco de enchente em áreas próximas ao Rio Sorocaba. Evite circular pela região.
        </span>
      </div>
    </div>
  );
};

export default AlertBanner;
