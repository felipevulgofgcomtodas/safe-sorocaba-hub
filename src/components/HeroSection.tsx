import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Navigation, Shield, Users, Bell, AlertTriangle, ArrowDown } from "lucide-react";
import logoPrefeiture from "@/assets/logo-prefeitura.png";
import EmergencyActionModal from "@/components/EmergencyActionModal";

const HeroSection = () => {
  const [address, setAddress] = useState("");
  const [emergencyOpen, setEmergencyOpen] = useState(false);
  const navigate = useNavigate();

  const handleVerify = () => {
    navigate(`/mapa${address ? `?address=${encodeURIComponent(address)}` : ''}`);
  };

  const handleLocation = () => {
    navigate('/mapa?geo=true');
  };

  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <iframe
          src="https://www.youtube.com/embed/y1tmszGa-TA?autoplay=1&mute=1&loop=1&playlist=y1tmszGa-TA&start=15&controls=0&showinfo=0&modestbranding=1&rel=0&disablekb=1&fs=0&iv_load_policy=3&playsinline=1"
          className="pointer-events-none"
          style={{ position: 'absolute', top: '50%', left: '50%', width: '180vw', height: '180vh', transform: 'translate(-50%, -50%)', border: 'none' }}
          allow="autoplay"
          title="Rain background"
        />
        <div className="absolute inset-0 bg-background/60" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, hsl(220 20% 6% / 0.4) 0%, hsl(220 20% 6% / 0.75) 50%, hsl(220 20% 6% / 0.98) 100%)' }} />
        <div className="absolute inset-0 pointer-events-none z-[1]" id="rain-overlay">
          {Array.from({ length: 60 }).map((_, i) => (
            <div
              key={i}
              className="rain-drop"
              style={{
                left: `${Math.random() * 100}%`,
                animationDuration: `${0.6 + Math.random() * 0.4}s`,
                animationDelay: `${Math.random() * 2}s`,
                opacity: 0.12 + Math.random() * 0.2,
              }}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-5 pt-28 pb-20 md:pt-24 md:pb-16 text-center flex flex-col items-center">
        {/* Logo */}
        <div className="mb-6 animate-fade-in">
          <div className="relative">
            <img src={logoPrefeiture} alt="Prefeitura de Sorocaba" className="h-14 md:h-20 w-auto drop-shadow-2xl" />
            <div className="absolute -inset-4 bg-primary/5 rounded-full blur-2xl" />
          </div>
        </div>

        {/* Live badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full glass border-safe/20 mb-6 animate-fade-in" style={{ animationDelay: '150ms' }}>
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-safe opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-safe" />
          </span>
          <span className="text-xs font-semibold text-safe">Sistema Ativo — Monitoramento em Tempo Real</span>
        </div>

        {/* Title */}
        <h1 className="font-display text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-4 text-balance leading-[1.08] animate-fade-in" style={{ animationDelay: '250ms' }}>
          Proteja sua vida em{" "}
          <span className="text-primary relative inline-block">
            situações de enchente
            <svg className="absolute -bottom-1 md:-bottom-2 left-0 w-full h-2 md:h-3 text-primary/30" viewBox="0 0 300 12" preserveAspectRatio="none">
              <path d="M0 6 Q75 0, 150 6 T300 6" stroke="currentColor" strokeWidth="3" fill="none" />
            </svg>
          </span>
        </h1>

        <p className="text-sm sm:text-base md:text-xl text-muted-foreground max-w-2xl mx-auto mb-7 text-pretty leading-relaxed animate-fade-in px-2" style={{ animationDelay: '400ms' }}>
          Consulte áreas de risco, encontre abrigos e receba alertas em tempo real na cidade de Sorocaba
        </p>

        {/* Emergency CTA */}
        <div className="animate-fade-in mb-7" style={{ animationDelay: '500ms' }}>
          <button
            onClick={() => setEmergencyOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-danger text-danger-foreground font-bold text-xs sm:text-sm hover:bg-danger/90 transition-all active:scale-[0.97] shadow-xl shadow-danger/25 group"
          >
            <AlertTriangle className="w-4 h-4 group-hover:animate-pulse" />
            🚨 O QUE FAZER EM EMERGÊNCIA
          </button>
        </div>

        {/* Search field */}
        <div className="w-full max-w-xl animate-fade-in" style={{ animationDelay: '600ms' }}>
          <div className="glass-strong rounded-2xl p-1.5 sm:p-2 shadow-2xl shadow-primary/5 ring-1 ring-primary/10">
            <div className="flex flex-col sm:flex-row gap-1.5 sm:gap-2">
              <div className="flex-1 flex items-center gap-2.5 px-3.5 py-3 rounded-xl bg-muted/50 focus-within:ring-2 focus-within:ring-primary/30 transition-all">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Digite seu endereço em Sorocaba..."
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                  className="bg-transparent w-full text-foreground placeholder:text-muted-foreground outline-none text-sm"
                />
              </div>
              <button
                onClick={handleVerify}
                className="px-5 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/20 flex items-center justify-center gap-2 active:scale-[0.97]"
              >
                <Shield className="w-4 h-4" />
                Verificar risco
              </button>
            </div>
          </div>
        </div>

        <button
          onClick={handleLocation}
          className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-primary transition-colors group mt-3 animate-fade-in"
          style={{ animationDelay: '700ms' }}
        >
          <Navigation className="w-3.5 h-3.5 group-hover:animate-pulse" />
          Usar minha localização
        </button>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full max-w-lg md:max-w-2xl mt-10 md:mt-16 animate-fade-in" style={{ animationDelay: '800ms' }}>
          {[
            { icon: Shield, label: "Zonas de Risco", value: "6", color: "text-primary", glow: "shadow-primary/10" },
            { icon: Users, label: "Pontos de Coleta", value: "3", color: "text-safe", glow: "shadow-safe/10" },
            { icon: Bell, label: "Kits Produzidos", value: "169", color: "text-warning", glow: "shadow-warning/10" },
          ].map((stat) => (
            <div key={stat.label} className={`glass rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 text-center hover:bg-muted/20 transition-all duration-300 shadow-lg ${stat.glow} group hover:-translate-y-0.5`}>
              <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mx-auto mb-1.5 ${stat.color} group-hover:scale-110 transition-transform`} />
              <p className={`text-xl sm:text-2xl md:text-3xl font-display font-bold ${stat.color} tabular-nums`}>{stat.value}</p>
              <p className="text-[9px] sm:text-[10px] md:text-xs text-muted-foreground mt-0.5 leading-tight">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-muted-foreground/40 animate-bounce">
        <ArrowDown className="w-4 h-4" />
      </div>

      <EmergencyActionModal open={emergencyOpen} onClose={() => setEmergencyOpen(false)} />
    </section>
  );
};

export default HeroSection;
