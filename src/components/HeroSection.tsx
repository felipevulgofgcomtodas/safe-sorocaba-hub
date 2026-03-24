import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Navigation, Shield, Users, Bell } from "lucide-react";

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
          className="w-full h-full object-cover pointer-events-none"
          style={{ position: 'absolute', top: '50%', left: '50%', width: '120%', height: '120%', transform: 'translate(-50%, -50%)' }}
          allow="autoplay"
          frameBorder="0"
          title="Rain background"
        />
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-background/80" />
        <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, hsl(220 20% 10% / 0.6), hsl(220 20% 10% / 0.95))' }} />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 pt-32 pb-20 text-center">
        {/* Live badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-safe/10 border border-safe/30 mb-8">
          <span className="w-2 h-2 rounded-full bg-safe pulse-live" />
          <span className="text-sm font-medium text-safe">Monitoramento Ativo</span>
        </div>

        <h1 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-4 text-balance">
          Proteja sua vida em{" "}
          <span className="text-primary">situações de enchente</span>
        </h1>

        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
          Consulte áreas de risco, encontre abrigos e receba alertas em tempo real
        </p>

        {/* Search field */}
        <div className="max-w-xl mx-auto mb-6">
          <div className="glass-strong rounded-xl p-2 flex flex-col sm:flex-row gap-2">
            <div className="flex-1 flex items-center gap-3 px-4 py-3 rounded-lg bg-muted/50">
              <MapPin className="w-5 h-5 text-muted-foreground flex-shrink-0" />
              <input
                type="text"
                placeholder="Digite seu endereço"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
                className="bg-transparent w-full text-foreground placeholder:text-muted-foreground outline-none text-sm"
              />
            </div>
            <button
              onClick={handleVerify}
              className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
            >
              <Shield className="w-4 h-4" />
              Verificar área de risco
            </button>
          </div>
        </div>

        <button
          onClick={handleLocation}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
        >
          <Navigation className="w-4 h-4" />
          Usar minha localização
        </button>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto mt-16">
          {[
            { icon: Shield, label: "Áreas Monitoradas", value: "47", color: "text-primary" },
            { icon: Users, label: "Abrigos Disponíveis", value: "30", color: "text-safe" },
            { icon: Bell, label: "Alertas Ativos", value: "3", color: "text-warning" },
          ].map((stat) => (
            <div key={stat.label} className="glass rounded-xl p-5 text-center">
              <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
              <p className={`text-3xl font-display font-bold ${stat.color} tabular-nums`}>{stat.value}</p>
              <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
