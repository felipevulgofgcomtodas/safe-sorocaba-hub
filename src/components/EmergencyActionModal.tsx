import { useState } from "react";
import { X, AlertTriangle, Shield, Phone, Droplets, Home, ArrowRight, CheckCircle } from "lucide-react";

interface EmergencyActionModalProps {
  open: boolean;
  onClose: () => void;
}

const steps = [
  {
    icon: AlertTriangle,
    title: "Mantenha a calma",
    desc: "Avalie a situação ao seu redor. Se a água estiver subindo, prepare-se para sair imediatamente.",
    color: "text-warning",
    bg: "bg-warning/15",
  },
  {
    icon: Droplets,
    title: "Desligue eletricidade e gás",
    desc: "Antes de sair, desligue a chave geral de energia e o registro de gás para evitar acidentes.",
    color: "text-primary",
    bg: "bg-primary/15",
  },
  {
    icon: Home,
    title: "Vá para um local elevado",
    desc: "Se não conseguir sair, suba para o andar mais alto. Nunca desça para garagens ou porões.",
    color: "text-safe",
    bg: "bg-safe/15",
  },
  {
    icon: Shield,
    title: "Procure um abrigo oficial",
    desc: "Use o mapa desta plataforma para encontrar o abrigo mais próximo e seguro.",
    color: "text-safe",
    bg: "bg-safe/15",
  },
  {
    icon: Phone,
    title: "Ligue para emergência",
    desc: "Defesa Civil: 199 · Bombeiros: 193 · SAMU: 192. Ligue se precisar de resgate.",
    color: "text-danger",
    bg: "bg-danger/15",
  },
];

const EmergencyActionModal = ({ open, onClose }: EmergencyActionModalProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!open) return null;

  const step = steps[currentStep];
  const isLast = currentStep === steps.length - 1;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-lg bg-card border border-border rounded-2xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-danger/20 border-b border-danger/30 px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-danger/20 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-danger animate-pulse" />
            </div>
            <div>
              <h2 className="font-display font-bold text-foreground text-lg">O que fazer agora</h2>
              <p className="text-xs text-muted-foreground">Instruções de emergência em enchente</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-muted/50 transition-colors active:scale-95">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Progress */}
        <div className="px-5 pt-4 flex gap-1.5">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-1 rounded-full flex-1 transition-all duration-500 ${
                i <= currentStep ? 'bg-danger' : 'bg-muted'
              }`}
            />
          ))}
        </div>

        {/* Step content */}
        <div className="p-5 space-y-5">
          <div className="flex items-start gap-4">
            <div className={`w-14 h-14 rounded-2xl ${step.bg} flex items-center justify-center flex-shrink-0`}>
              <step.icon className={`w-7 h-7 ${step.color}`} />
            </div>
            <div className="pt-1">
              <p className="text-xs text-muted-foreground mb-1 tabular-nums">Passo {currentStep + 1} de {steps.length}</p>
              <h3 className="font-display font-bold text-foreground text-xl mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
            </div>
          </div>

          {/* Emergency numbers on last step */}
          {isLast && (
            <div className="grid grid-cols-3 gap-2">
              {[
                { number: "199", label: "Defesa Civil", color: "bg-danger/15 text-danger" },
                { number: "193", label: "Bombeiros", color: "bg-warning/15 text-warning" },
                { number: "192", label: "SAMU", color: "bg-primary/15 text-primary" },
              ].map((n) => (
                <a
                  key={n.number}
                  href={`tel:${n.number}`}
                  className={`${n.color} rounded-xl p-3 text-center hover:opacity-80 transition-opacity active:scale-95`}
                >
                  <p className="text-2xl font-bold tabular-nums">{n.number}</p>
                  <p className="text-[10px] font-medium mt-0.5">{n.label}</p>
                </a>
              ))}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-5 pb-5 flex gap-3">
          {currentStep > 0 && (
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-5 py-3 rounded-xl bg-muted text-foreground text-sm font-medium hover:bg-muted/80 transition-colors active:scale-[0.97]"
            >
              Voltar
            </button>
          )}
          <button
            onClick={() => isLast ? onClose() : setCurrentStep(currentStep + 1)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all active:scale-[0.97] ${
              isLast
                ? 'bg-safe text-safe-foreground hover:bg-safe/90'
                : 'bg-danger text-danger-foreground hover:bg-danger/90'
            }`}
          >
            {isLast ? (
              <><CheckCircle className="w-4 h-4" /> Entendido</>
            ) : (
              <><span>Próximo passo</span><ArrowRight className="w-4 h-4" /></>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EmergencyActionModal;
