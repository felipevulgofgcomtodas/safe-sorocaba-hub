import { useState } from "react";
import { Users, MapPin, X, Heart, CheckCircle, Package, ChevronDown, ChevronUp, Navigation, Gift } from "lucide-react";
import { type Shelter, getStatusLabel, getStatusColor, getTypeLabel } from "@/data/shelters";

interface ShelterCardProps {
  shelter: Shelter;
  onClose: () => void;
  isRecommended?: boolean;
  isMostUrgent?: boolean;
  onNavigate?: () => void;
  onDonate?: (shelterId: number, itemIndex: number) => void;
}

const ShelterCard = ({ shelter, onClose, isRecommended, isMostUrgent, onNavigate, onDonate }: ShelterCardProps) => {
  const [showDonations, setShowDonations] = useState(false);
  const [donatingIndex, setDonatingIndex] = useState<number | null>(null);
  const [minimized, setMinimized] = useState(true);
  const occupancyPercent = Math.round((shelter.occupied / shelter.capacity) * 100);
  const allDonationsComplete = shelter.donations.every(d => d.received >= d.needed);

  const handleDonate = (i: number) => {
    setDonatingIndex(i);
    setTimeout(() => {
      onDonate?.(shelter.id, i);
      setDonatingIndex(null);
    }, 600);
  };

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
      {/* Mobile pull handle */}
      <button
        onClick={() => setMinimized(!minimized)}
        className="md:hidden w-full flex flex-col items-center py-2 cursor-grab active:cursor-grabbing"
      >
        <div className="w-10 h-1 rounded-full bg-muted-foreground/40" />
        <ChevronUp className={`w-4 h-4 text-muted-foreground mt-1 transition-transform duration-300 ${minimized ? 'rotate-0' : 'rotate-180'}`} />
      </button>

      {/* Header */}
      <div className={`px-4 py-3 flex items-center justify-between ${
        shelter.status === 'disponivel' ? 'bg-safe/15' : shelter.status === 'parcial' ? 'bg-warning/15' : 'bg-danger/15'
      }`}>
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${getStatusColor(shelter.status)} ${isRecommended ? 'animate-pulse' : ''}`} />
          <span className={`text-xs font-bold uppercase tracking-wider ${
            shelter.status === 'disponivel' ? 'text-safe' : shelter.status === 'parcial' ? 'text-warning' : 'text-danger'
          }`}>
            {getStatusLabel(shelter.status)}
          </span>
          {isRecommended && (
            <span className="ml-2 px-2 py-0.5 rounded-full bg-safe/20 text-safe text-[10px] font-bold uppercase tracking-wider animate-pulse">
              ★ Recomendado
            </span>
          )}
          {isMostUrgent && (
            <span className="ml-2 px-2 py-0.5 rounded-full bg-danger/20 text-danger text-[10px] font-bold uppercase tracking-wider animate-pulse">
              🔥 Mais Urgente
            </span>
          )}
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-muted/50 active:scale-95">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body */}
      <div className="p-4 space-y-4">
        <div>
          <h3 className="font-bold text-lg text-foreground leading-tight">{shelter.name}</h3>
          <p className="text-xs text-muted-foreground mt-0.5">{getTypeLabel(shelter.type)}</p>
          <div className="flex items-start gap-1.5 mt-2">
            <MapPin className="w-3.5 h-3.5 text-muted-foreground mt-0.5 flex-shrink-0" />
            <p className="text-sm text-muted-foreground">{shelter.address}</p>
          </div>
        </div>

        {/* Capacity */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: Users, color: "text-primary", value: shelter.capacity, label: "Capacidade" },
            { icon: Users, color: "text-warning", value: shelter.occupied, label: "Ocupados" },
            { icon: Users, color: "text-safe", value: shelter.capacity - shelter.occupied, label: "Vagas" },
          ].map((s, i) => (
            <div key={i} className="p-2.5 rounded-xl bg-muted/40 text-center hover:bg-muted/60 transition-colors">
              <s.icon className={`w-4 h-4 mx-auto ${s.color} mb-1`} />
              <p className="text-base font-bold text-foreground tabular-nums">{s.value}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Progress */}
        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-muted-foreground">Ocupação</span>
            <span className="font-semibold text-foreground tabular-nums">{occupancyPercent}%</span>
          </div>
          <div className="h-2.5 rounded-full bg-muted overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${
                shelter.status === 'disponivel' ? 'bg-safe' : shelter.status === 'parcial' ? 'bg-warning' : 'bg-danger'
              }`}
              style={{ width: `${occupancyPercent}%` }}
            />
          </div>
        </div>

        {/* Navigate button */}
        {onNavigate && shelter.status !== 'lotado' && (
          <button
            onClick={onNavigate}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-safe text-safe-foreground font-semibold text-sm hover:bg-safe/90 transition-all active:scale-[0.97] shadow-lg shadow-safe/20"
          >
            <Navigation className="w-4 h-4" />
            Ir para abrigo seguro
          </button>
        )}

        {/* Donations toggle */}
        <button
          onClick={() => setShowDonations(!showDonations)}
          className="w-full flex items-center justify-between py-2.5 px-3 rounded-xl bg-muted/40 hover:bg-muted/60 transition-colors text-sm active:scale-[0.99]"
        >
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-primary" />
            <span className="font-medium text-foreground">Necessidades de Doação</span>
            {!allDonationsComplete && (
              <span className="px-1.5 py-0.5 rounded-full bg-danger/20 text-danger text-[9px] font-bold">
                {shelter.donations.filter(d => d.received < d.needed).length} itens
              </span>
            )}
          </div>
          {showDonations ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
        </button>

        {showDonations && (
          <div className="space-y-2 animate-in slide-in-from-top-2 duration-200">
            {allDonationsComplete ? (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-safe/10 border border-safe/20">
                <CheckCircle className="w-5 h-5 text-safe" />
                <span className="text-sm font-medium text-safe">✔️ Suprimento completo</span>
              </div>
            ) : (
              shelter.donations.map((d, i) => {
                const percent = Math.min(100, Math.round((d.received / d.needed) * 100));
                const complete = d.received >= d.needed;
                const isDonating = donatingIndex === i;
                return (
                  <div key={i} className="p-2.5 rounded-lg bg-muted/30 hover:bg-muted/40 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-1.5">
                        <Heart className={`w-3 h-3 ${complete ? 'text-safe' : 'text-danger'}`} />
                        <span className="text-xs font-medium text-foreground">{d.item}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-muted-foreground tabular-nums">
                          {d.received}/{d.needed} {d.unit}
                        </span>
                        {!complete && (
                          <button
                            onClick={() => handleDonate(i)}
                            disabled={isDonating}
                            className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all active:scale-95 ${
                              isDonating
                                ? 'bg-safe/20 text-safe'
                                : 'bg-primary/20 text-primary hover:bg-primary/30'
                            }`}
                          >
                            {isDonating ? (
                              <span className="flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Doado!</span>
                            ) : (
                              <span className="flex items-center gap-1"><Gift className="w-3 h-3" /> Doar</span>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${complete ? 'bg-safe' : percent > 60 ? 'bg-warning' : 'bg-danger'}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ShelterCard;
