import { useState, useMemo, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Search, MapPin, AlertTriangle, Navigation, Users, Filter, Zap, User, LogOut } from "lucide-react";
import { shelters as initialShelters, riskZones, isInRiskZone, findNearestSafeShelter, getStatusLabel, getStatusColor, getTypeLabel, type Shelter } from "@/data/shelters";
import ShelterCard from "@/components/ShelterCard";
import DashboardStats from "@/components/DashboardStats";
import NotificationSystem from "@/components/NotificationSystem";
import EmergencyActionModal from "@/components/EmergencyActionModal";
import { useAuth } from "@/contexts/AuthContext";

const GOOGLE_MAP_EMBED = "https://www.google.com/maps/d/embed?mid=1hVMhW-dDHDhydy0KpILvt1I57aRC7CY";

const Mapa = () => {
  const { user, logout } = useAuth();
  const [shelterData, setShelterData] = useState<Shelter[]>(initialShelters);
  const [selectedShelter, setSelectedShelter] = useState<Shelter | null>(null);
  const [address, setAddress] = useState("");
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [riskAlert, setRiskAlert] = useState<{ level: string; zone: string } | null>(null);
  const [recommended, setRecommended] = useState<Shelter | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [searching, setSearching] = useState(false);
  const [simulationMode, setSimulationMode] = useState(false);
  const [emergencyOpen, setEmergencyOpen] = useState(false);

  // Auto-search user address on login
  useEffect(() => {
    if (user?.address && !userLocation) {
      setAddress(user.address);
    }
  }, [user]);

  // Simulation mode effects
  useEffect(() => {
    if (simulationMode) {
      setShelterData(prev => prev.map(s => {
        const extraOccupied = Math.floor(Math.random() * 80) + 30;
        const newOccupied = Math.min(s.capacity, s.occupied + extraOccupied);
        const newStatus = newOccupied >= s.capacity ? 'lotado' : newOccupied > s.capacity * 0.7 ? 'parcial' : 'disponivel';
        return { ...s, occupied: newOccupied, status: newStatus as Shelter['status'] };
      }));
      setRiskAlert({ level: 'alto', zone: 'SIMULAÇÃO — Enchente Extrema em toda Sorocaba' });
    } else {
      setShelterData(initialShelters);
      if (!userLocation) setRiskAlert(null);
    }
  }, [simulationMode]);

  // Real-time simulation updates
  useEffect(() => {
    const interval = setInterval(() => {
      setShelterData(prev => prev.map(s => {
        const delta = Math.floor(Math.random() * 5) - 2;
        const newOccupied = Math.max(0, Math.min(s.capacity, s.occupied + delta));
        const newStatus = newOccupied >= s.capacity ? 'lotado' : newOccupied > s.capacity * 0.7 ? 'parcial' : 'disponivel';
        return { ...s, occupied: newOccupied, status: newStatus as Shelter['status'] };
      }));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  const filteredShelters = useMemo(() => {
    if (filterStatus === "all") return shelterData;
    return shelterData.filter(s => s.status === filterStatus);
  }, [filterStatus, shelterData]);

  const mostUrgentShelter = useMemo(() => {
    return shelterData.reduce((worst, s) => {
      const urgency = s.donations.reduce((sum, d) => sum + (d.needed - d.received), 0);
      const worstUrgency = worst ? worst.donations.reduce((sum, d) => sum + (d.needed - d.received), 0) : 0;
      return urgency > worstUrgency ? s : worst;
    }, null as Shelter | null);
  }, [shelterData]);

  const processLocation = useCallback((lat: number, lng: number) => {
    setUserLocation({ lat, lng });
    const zone = isInRiskZone(lat, lng);
    setRiskAlert(zone ? { level: zone.level, zone: zone.name } : (simulationMode ? { level: 'alto', zone: 'SIMULAÇÃO ATIVA' } : null));
    const nearest = findNearestSafeShelter(lat, lng);
    setRecommended(nearest);
    if (nearest) setSelectedShelter(nearest);
  }, [simulationMode]);

  const handleSearch = async () => {
    if (!address.trim()) return;
    setSearching(true);
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address + ", Sorocaba, SP, Brasil")}&limit=1`);
      const data = await res.json();
      if (data.length > 0) processLocation(parseFloat(data[0].lat), parseFloat(data[0].lon));
    } catch {} finally { setSearching(false); }
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) return;
    setSearching(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => { processLocation(pos.coords.latitude, pos.coords.longitude); setSearching(false); },
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

  const handleDonate = (shelterId: number, itemIndex: number) => {
    setShelterData(prev => prev.map(s => {
      if (s.id !== shelterId) return s;
      const newDonations = [...s.donations];
      const d = newDonations[itemIndex];
      const amount = Math.ceil(d.needed * 0.1);
      newDonations[itemIndex] = { ...d, received: Math.min(d.needed, d.received + amount) };
      return { ...s, donations: newDonations };
    }));
    // Update selected shelter view
    setSelectedShelter(prev => {
      if (!prev || prev.id !== shelterId) return prev;
      const updated = shelterData.find(s => s.id === shelterId);
      return updated || prev;
    });
  };

  const haversineKm = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
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
            <span className="font-semibold text-sm text-foreground hidden sm:inline">Mapa de Risco — Sorocaba</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Simulation toggle */}
          <button
            onClick={() => setSimulationMode(!simulationMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-[0.96] ${
              simulationMode
                ? 'bg-danger text-danger-foreground animate-pulse'
                : 'bg-muted border border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            {simulationMode ? 'SIMULAÇÃO ATIVA' : 'Simular Enchente'}
          </button>
          <NotificationSystem />
          <button
            onClick={() => setEmergencyOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-danger/20 border border-danger/30 text-danger hover:bg-danger/30 transition-all active:scale-[0.96]"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">O que fazer</span>
          </button>
          {user && (
            <div className="hidden md:flex items-center gap-2 px-2 py-1 rounded-lg bg-muted/50 border border-border">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="w-3 h-3 text-primary" />
              </div>
              <span className="text-xs font-medium text-foreground max-w-20 truncate">{user.name}</span>
              <button onClick={logout} className="p-1 hover:bg-muted rounded transition-colors">
                <LogOut className="w-3 h-3 text-muted-foreground" />
              </button>
            </div>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden text-foreground text-sm px-3 py-1.5 rounded-lg bg-muted active:scale-[0.97]">
            {sidebarOpen ? "Mapa" : "Lista"}
          </button>
        </div>
      </div>

      {/* Dashboard stats */}
      <div className="px-4 py-2 bg-card/80 border-b border-border">
        <DashboardStats simulationMode={simulationMode} />
      </div>

      {/* Risk alert */}
      {riskAlert && (
        <div className={`px-4 py-3 flex items-center gap-3 z-40 animate-in fade-in duration-300 ${
          riskAlert.level === 'alto' ? 'bg-danger/20 border-b border-danger/30' :
          riskAlert.level === 'medio' ? 'bg-warning/20 border-b border-warning/30' :
          'bg-warning/10 border-b border-warning/20'
        }`}>
          <AlertTriangle className={`w-5 h-5 flex-shrink-0 ${riskAlert.level === 'alto' ? 'text-danger animate-pulse' : 'text-warning'}`} />
          <p className={`text-sm font-semibold ${riskAlert.level === 'alto' ? 'text-danger' : 'text-warning'}`}>
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

          {/* Smart recommendation */}
          {recommended && userLocation && (
            <div className="p-4 border-b border-border animate-in slide-in-from-top-2 duration-300">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] text-safe uppercase tracking-widest font-bold">🔥 Recomendado para você</span>
              </div>
              <button
                onClick={() => { setSelectedShelter(recommended); setSidebarOpen(false); }}
                className="w-full text-left p-3 rounded-xl bg-safe/10 border border-safe/20 hover:bg-safe/20 transition-all hover:shadow-lg hover:shadow-safe/5 active:scale-[0.99]"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Navigation className="w-3.5 h-3.5 text-safe" />
                  <span className="text-sm font-bold text-foreground">{recommended.name}</span>
                </div>
                <p className="text-xs text-muted-foreground">{recommended.address}</p>
                <div className="flex items-center gap-3 mt-2">
                  <p className="text-xs text-safe font-medium">
                    {recommended.capacity - recommended.occupied} vagas
                  </p>
                  <span className="text-[10px] text-muted-foreground">
                    ~{haversineKm(userLocation.lat, userLocation.lng, recommended.lat, recommended.lng).toFixed(1)}km
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    ~{Math.ceil(haversineKm(userLocation.lat, userLocation.lng, recommended.lat, recommended.lng) * 12)}min a pé
                  </span>
                </div>
              </button>
            </div>
          )}

          {/* Filters */}
          <div className="p-3 border-b border-border flex items-center gap-2 overflow-x-auto">
            <Filter className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
            {[
              { value: "all", label: "Todos", count: shelterData.length },
              { value: "disponivel", label: "Disponível", count: shelterData.filter(s => s.status === 'disponivel').length },
              { value: "parcial", label: "Parcial", count: shelterData.filter(s => s.status === 'parcial').length },
              { value: "lotado", label: "Lotado", count: shelterData.filter(s => s.status === 'lotado').length },
            ].map(f => (
              <button
                key={f.value}
                onClick={() => setFilterStatus(f.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 active:scale-[0.97] ${
                  filterStatus === f.value
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground hover:text-foreground'
                }`}
              >
                {f.label}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full tabular-nums ${
                  filterStatus === f.value ? 'bg-primary-foreground/20' : 'bg-muted-foreground/20'
                }`}>{f.count}</span>
              </button>
            ))}
          </div>

          {/* Shelter list */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredShelters.map(s => {
              const occupancy = Math.round((s.occupied / s.capacity) * 100);
              const isRec = recommended?.id === s.id;
              const isUrgent = mostUrgentShelter?.id === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => { setSelectedShelter(s); setSidebarOpen(false); }}
                  className={`w-full text-left p-3 rounded-xl transition-all active:scale-[0.99] ${
                    selectedShelter?.id === s.id
                      ? 'bg-primary/10 border border-primary/30'
                      : isRec
                      ? 'bg-safe/5 border border-safe/20 hover:bg-safe/10'
                      : 'hover:bg-muted/50 border border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">{s.name}</span>
                      {isRec && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-safe/20 text-safe font-bold">★</span>}
                    </div>
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
                      className={`h-full rounded-full transition-all duration-500 ${
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
                isMostUrgent={mostUrgentShelter?.id === selectedShelter.id}
                onNavigate={() => handleNavigate(selectedShelter)}
                onDonate={handleDonate}
              />
            </div>
          )}

          {/* Legend */}
          <div className="absolute top-4 right-4 bg-card/95 backdrop-blur-sm border border-border rounded-2xl p-3.5 z-50 shadow-lg">
            <p className="text-xs font-bold text-foreground mb-2.5">Legenda</p>
            <div className="space-y-1.5">
              <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest mb-1">Zonas de Risco</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="w-3 h-3 rounded-full bg-danger" /> Alto
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="w-3 h-3 rounded-full bg-warning" /> Médio
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="w-3 h-3 rounded-full" style={{ background: 'hsl(48 96% 53%)' }} /> Moderado
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

          {/* Simulation overlay */}
          {simulationMode && (
            <div className="absolute top-4 left-4 bg-danger/90 backdrop-blur-sm rounded-xl px-4 py-2 z-50 flex items-center gap-2 animate-pulse shadow-lg shadow-danger/30">
              <Zap className="w-4 h-4 text-danger-foreground" />
              <span className="text-xs font-bold text-danger-foreground uppercase tracking-wider">Modo Simulação Ativo</span>
            </div>
          )}
        </div>
      </div>
      <EmergencyActionModal open={emergencyOpen} onClose={() => setEmergencyOpen(false)} />
    </div>
  );
};

export default Mapa;
