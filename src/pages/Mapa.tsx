import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Search, MapPin, AlertTriangle, Navigation, Users, Filter } from "lucide-react";
import { shelters, riskZones, isInRiskZone, findNearestSafeShelter, getStatusLabel, getStatusColor, getTypeLabel, getRiskLevelLabel, type Shelter } from "@/data/shelters";
import ShelterCard from "@/components/ShelterCard";

const GOOGLE_MAP_EMBED = "https://www.google.com/maps/d/embed?mid=1hVMhW-dDHDhydy0KpILvt1I57aRC7CY";

const Mapa = () => {
  const [selectedShelter, setSelectedShelter] = useState<Shelter | null>(null);
  const [address, setAddress] = useState("");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [riskAlert, setRiskAlert] = useState<{ level: string; zone: string } | null>(null);
  const [recommended, setRecommended] = useState<Shelter | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searching, setSearching] = useState(false);

  const filteredShelters = useMemo(() => {
    if (filterStatus === "all") return shelters;
    return shelters.filter(s => s.status === filterStatus);
  }, [filterStatus]);

  const handleSearch = async () => {
    if (!address.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address + ", Sorocaba, SP, Brasil")}&limit=1`);
      const data = await res.json();
      if (data.length > 0) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        setUserLocation({ lat, lng });

        const zone = isInRiskZone(lat, lng);
        if (zone) {
          setRiskAlert({ level: zone.level, zone: zone.name });
        } else {
          setRiskAlert(null);
        }

        const nearest = findNearestSafeShelter(lat, lng);
        setRecommended(nearest);
        if (nearest) setSelectedShelter(nearest);
      }
    } catch {
      // silently fail
    } finally {
      setSearching(false);
    }
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) return;
    setSearching(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setUserLocation({ lat, lng });

        const zone = isInRiskZone(lat, lng);
        if (zone) {
          setRiskAlert({ level: zone.level, zone: zone.name });
        } else {
          setRiskAlert(null);
        }

        const nearest = findNearestSafeShelter(lat, lng);
        setRecommended(nearest);
        if (nearest) setSelectedShelter(nearest);
        setSearching(false);
      },
      () => setSearching(false)
    );
  };

  const handleNavigate = (shelter: Shelter) => {
    if (userLocation) {
      window.open(`https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${shelter.lat},${shelter.lng}`, '_blank');
    } else {
      window.open(`https://www.google.com/maps/dir/?api=1&destination=${shelter.lat},${shelter.lng}`, '_blank');
    }
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top bar */}
      <div className="h-14 bg-card border-b border-border flex items-center justify-between px-4 z-50 relative">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Voltar</span>
          </Link>
          <div className="h-5 w-px bg-border" />
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            <span className="font-semibold text-sm text-foreground">Mapa de Risco — Sorocaba</span>
          </div>
        </div>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden text-foreground text-sm px-3 py-1.5 rounded-lg bg-muted">
          {sidebarOpen ? "Mapa" : "Lista"}
        </button>
      </div>

      {/* Risk alert */}
      {riskAlert && (
        <div className={`px-4 py-3 flex items-center gap-3 z-40 ${
          riskAlert.level === 'alto' ? 'bg-danger/20 border-b border-danger/30' :
          riskAlert.level === 'medio' ? 'bg-warning/20 border-b border-warning/30' :
          'bg-warning/10 border-b border-warning/20'
        }`}>
          <AlertTriangle className={`w-5 h-5 flex-shrink-0 ${
            riskAlert.level === 'alto' ? 'text-danger' : 'text-warning'
          }`} />
          <p className={`text-sm font-semibold ${
            riskAlert.level === 'alto' ? 'text-danger' : 'text-warning'
          }`}>
            {riskAlert.level === 'alto'
              ? '⚠️ ALTO RISCO DE ENCHENTE — PROCURE ABRIGO IMEDIATAMENTE'
              : riskAlert.level === 'medio'
              ? '⚠️ ATENÇÃO: REGIÃO COM RISCO MÉDIO DE ENCHENTE'
              : '⚠️ ATENÇÃO: REGIÃO COM RISCO MODERADO'}
          </p>
          <span className="text-xs text-muted-foreground ml-auto hidden sm:block">{riskAlert.zone}</span>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'flex' : 'hidden'} md:flex flex-col w-full md:w-[400px] bg-card border-r border-border z-40 overflow-hidden absolute md:relative inset-0 md:inset-auto`}>
          {/* Search */}
          <div className="p-4 border-b border-border space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={address}
                onChange={e => setAddress(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                placeholder="Digite seu endereço..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-muted border border-border text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleSearch}
                disabled={searching || !address.trim()}
                className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 active:scale-[0.98]"
              >
                <Search className="w-3.5 h-3.5" />
                {searching ? 'Buscando...' : 'Verificar risco'}
              </button>
              <button
                onClick={handleGeolocation}
                disabled={searching}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-muted border border-border text-sm font-medium text-foreground hover:bg-muted/80 transition-colors disabled:opacity-50 active:scale-[0.98]"
              >
                <MapPin className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Localização</span>
              </button>
            </div>
          </div>

          {/* Recommended shelter */}
          {recommended && userLocation && (
            <div className="p-4 border-b border-border">
              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mb-2">Abrigo recomendado</p>
              <button
                onClick={() => { setSelectedShelter(recommended); setSidebarOpen(false); }}
                className="w-full text-left p-3 rounded-xl bg-safe/10 border border-safe/20 hover:bg-safe/20 transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Navigation className="w-3.5 h-3.5 text-safe" />
                  <span className="text-sm font-bold text-foreground">{recommended.name}</span>
                </div>
                <p className="text-xs text-muted-foreground">{recommended.address}</p>
                <p className="text-xs text-safe mt-1 font-medium">
                  {recommended.capacity - recommended.occupied} vagas disponíveis
                </p>
              </button>
            </div>
          )}

          {/* Filters */}
          <div className="p-3 border-b border-border flex items-center gap-2 overflow-x-auto">
            <Filter className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
            {[
              { value: "all", label: "Todos", count: shelters.length },
              { value: "disponivel", label: "Disponível", count: shelters.filter(s => s.status === 'disponivel').length },
              { value: "parcial", label: "Parcial", count: shelters.filter(s => s.status === 'parcial').length },
              { value: "lotado", label: "Lotado", count: shelters.filter(s => s.status === 'lotado').length },
            ].map(f => (
              <button
                key={f.value}
                onClick={() => setFilterStatus(f.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 active:scale-[0.97] ${
                  filterStatus === f.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                {f.label}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                  filterStatus === f.value ? 'bg-primary-foreground/20' : 'bg-muted-foreground/20'
                }`}>{f.count}</span>
              </button>
            ))}
          </div>

          {/* Shelter list */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredShelters.map(s => {
              const occupancy = Math.round((s.occupied / s.capacity) * 100);
              return (
                <button
                  key={s.id}
                  onClick={() => { setSelectedShelter(s); setSidebarOpen(false); }}
                  className={`w-full text-left p-3 rounded-xl transition-colors active:scale-[0.99] ${
                    selectedShelter?.id === s.id
                      ? 'bg-primary/10 border border-primary/30'
                      : 'hover:bg-muted/50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-foreground">{s.name}</span>
                    <span className={`w-2.5 h-2.5 rounded-full ${getStatusColor(s.status)}`} />
                  </div>
                  <p className="text-xs text-muted-foreground">{getTypeLabel(s.type)} · {s.address}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground tabular-nums">{s.occupied}/{s.capacity}</span>
                    </div>
                    <span className={`text-xs font-semibold ${
                      s.status === 'disponivel' ? 'text-safe' : s.status === 'parcial' ? 'text-warning' : 'text-danger'
                    }`}>
                      {getStatusLabel(s.status)}
                    </span>
                  </div>
                  <div className="mt-1.5 h-1 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        s.status === 'disponivel' ? 'bg-safe' : s.status === 'parcial' ? 'bg-warning' : 'bg-danger'
                      }`}
                      style={{ width: `${occupancy}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Map area */}
        <div className="flex-1 relative">
          <iframe
            src={GOOGLE_MAP_EMBED}
            className="w-full h-full border-0"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Mapa de Risco SafeFlood Sorocaba"
          />

          {/* Selected shelter card overlay */}
          {selectedShelter && (
            <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50">
              <ShelterCard
                shelter={selectedShelter}
                onClose={() => setSelectedShelter(null)}
                isRecommended={recommended?.id === selectedShelter.id}
                onNavigate={() => handleNavigate(selectedShelter)}
              />
            </div>
          )}

          {/* Risk zones legend */}
          <div className="absolute top-4 right-4 bg-card/95 backdrop-blur-sm border border-border rounded-2xl p-3.5 z-50 shadow-lg">
            <p className="text-xs font-bold text-foreground mb-2.5">Legenda</p>
            <div className="space-y-1.5">
              <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest mb-1">Zonas de Risco</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="w-3 h-3 rounded-full bg-[hsl(0,72%,51%)]" /> Alto
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="w-3 h-3 rounded-full bg-[hsl(25,95%,53%)]" /> Médio
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="w-3 h-3 rounded-full bg-[hsl(48,96%,53%)]" /> Moderado
              </div>
              <div className="my-1.5 h-px bg-border" />
              <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest mb-1">Abrigos</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="w-3 h-3 rounded-full bg-safe" /> Disponível
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="w-3 h-3 rounded-full bg-warning" /> Parcial
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="w-3 h-3 rounded-full bg-danger" /> Lotado
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mapa;
