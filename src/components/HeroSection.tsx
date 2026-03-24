import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Navigation, Shield, Users, Bell, Droplets } from "lucide-react";
import logoPrefeiture from "@/assets/logo-prefeitura.png";

const HeroSection = () => {
  const [address, setAddress] = useState("");
  const navigate = useNavigate();

  const handleVerify = () => {
    navigate(`/mapa${address ? `?address=${encodeURIComponent(address)}` : ''}`);
  };

  const handleLocation = () => {
    navigate('/mapa?geo=true');
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <iframe
          src="https://www.youtube.com/embed/y1tmszGa-TA?autoplay=1&mute=1&loop=1&playlist=y1tmszGa-TA&start=15&controls=0&showinfo=0&modestbranding=1&rel=0&disablekb=1&fs=0&iv_load_policy=3&playsinline=1"
          className="pointer-events-none"
          style={{ position: 'absolute', top: '50%', left: '50%', width: '180vw', height: '180vh', transform: 'translate(-50%, -50%)', border: 'none' }}
          allow="autoplay"
          title="Rain background"
        />
        {/* Layered dark overlays for readability */}
        <div className="absolute inset-0 bg-background/70" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg, hsl(220 20% 6% / 0.5) 0%, hsl(220 20% 6% / 0.85) 60%, hsl(220 20% 6% / 0.98) 100%)' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-28 pb-20 text-center">
        {/* Logo centered */}
        <div className="flex justify-center mb-6">
          <img src={logoPrefeiture} alt="Prefeitura de Sorocaba" className="h-16 md:h-20 w-auto drop-shadow-lg" />
        </div>

        {/* Live badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-safe/10 border border-safe/30 mb-6">
          <span className="w-2 h-2 rounded-full bg-safe pulse-live" />
          <span className="text-sm font-medium text-safe">Monitoramento Ativo</span>
        </div>

        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-5 text-balance leading-tight">
          Proteja sua vida em{" "}
          <span className="text-primary">situações de enchente</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          Consulte áreas de risco, encontre abrigos e receba alertas em tempo real
        </p>

        {/* Search field */}
        <div className="max-w-xl mx-auto mb-5">
          <div className="glass-strong rounded-2xl p-2 flex flex-col sm:flex-row gap-2 shadow-lg shadow-primary/5">
            <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/50">
              <MapPin className="w-5 h-5 text-primary flex-shrink-0" />
              <input
                type="text"
                placeholder="Digite seu endereço em Sorocaba"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                className="bg-transparent w-full text-foreground placeholder:text-muted-foreground outline-none text-sm"
              />
            </div>
            <button
              onClick={handleVerify}
              className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all hover:shadow-md hover:shadow-primary/20 flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4" />
              Verificar área de risco
            </button>
          </div>
        </div>

        <button
          onClick={handleLocation}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors group"
        >
          <Navigation className="w-4 h-4 group-hover:animate-pulse" />
          Usar minha localização
        </button>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mt-16">
          {[
            { icon: Shield, label: "Áreas Monitoradas", value: "47", color: "text-primary" },
            { icon: Users, label: "Abrigos Disponíveis", value: "30", color: "text-safe" },
            { icon: Bell, label: "Alertas Ativos", value: "3", color: "text-warning" },
          ].map((stat) => (
            <div key={stat.label} className="glass rounded-xl p-5 text-center hover:bg-muted/20 transition-colors">
              <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
              <p className={`text-3xl font-display font-bold ${stat.color} tabular-nums`}>{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-muted-foreground/50">
        <Droplets className="w-4 h-4 animate-bounce" />
      </div>
    </section>
  );
};

export default HeroSection;
