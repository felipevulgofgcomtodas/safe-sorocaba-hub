import { useState, useMemo, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Shield, Search, MapPin, AlertTriangle, Navigation,
  Users, Filter, Zap, User, LogOut, ChevronUp, Info,
} from "lucide-react";
import {
  MapContainer, TileLayer, Circle, CircleMarker, Marker, Popup, useMap,
} from "react-leaflet";
import L from "leaflet";
import {
  shelters as initialShelters, riskZones, safeZones,
  isInRiskZone, findNearestSafeShelter,
  getStatusLabel, getStatusColor, getTypeLabel, getRiskLevelColor,
  type Shelter,
} from "@/data/shelters";
import ShelterCard from "@/components/ShelterCard";
import DashboardStats from "@/components/DashboardStats";
import NotificationSystem from "@/components/NotificationSystem";
import EmergencyActionModal from "@/components/EmergencyActionModal";
import { useAuth } from "@/contexts/AuthContext";

// Corrige ícones do Leaflet no Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function shelterIcon(status: Shelter["status"]) {
  const color = status === "disponivel" ? "#22c55e" : status === "parcial" ? "#f97316" : "#ef4444";
  const html = `<div style="
    background:${color}; width:14px; height:14px; border-radius:50%;
    border:2px solid white; box-shadow:0 1px 4px rgba(0,0,0,.5);
    transform:translate(-50%,-50%);"></div>`;
  return L.divIcon({ className: "", html, iconSize: [14, 14], iconAnchor: [7, 7] });
}

function userIcon() {
  const html = `<div style="
    background:#3b82f6; width:14px; height:14px; border-radius:50%;
    border:3px solid white; box-shadow:0 0 0 3px rgba(59,130,246,.4);
    transform:translate(-50%,-50%);"></div>`;
  return L.divIcon({ className: "", html, iconSize: [14, 14], iconAnchor: [7, 7] });
}

// Voa suavemente para o ponto quando muda
function FlyTo({ pos }: { pos: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (pos) map.flyTo(pos, 15, { duration: 1.2 });
  }, [pos, map]);
  return null;
}

// ---- Legenda ----
const LegendPanel = () => {
  const [open, setOpen] = useState(false);
  const content = (
    <div className="space-y-1.5">
      <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest mb-1">Zonas de Risco</p>
      <div className="flex items-center gap-2 text-xs text-muted-foreground"><span className="w-3 h-3 rounded-full bg-danger" /> Alto</div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground"><span className="w-3 h-3 rounded-full bg-warning" /> Médio</div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground"><span className="w-3 h-3 rounded-full" style={{ background: "#eab308" }} /> Moderado</div>
      <div className="my-1.5 h-px bg-border" />
      <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest mb-1">Áreas Seguras</p>
      <div className="flex items-center gap-2 text-xs text-muted-foreground"><span className="w-3 h-3 rounded-full bg-safe" /> Zona segura</div>
      <div className="my-1.5 h-px bg-border" />
      <p className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest mb-1">Abrigos</p>
      <div className="flex items-center gap-2 text-xs text-muted-foreground"><span className="w-3 h-3 rounded-full bg-safe" /> Disponível</div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground"><span className="w-3 h-3 rounded-full bg-warning" /> Parcial</div>
      <div className="flex items-center gap-2 text-xs text-muted-foreground"><span className="w-3 h-3 rounded-full bg-danger" /> Lotado</div>
    </div>
  );
  return (
    <div className="absolute top-4 right-4 z-[1000]">
      <div className="hidden md:block bg-card/95 backdrop-blur-sm border border-border rounded-2xl p-3.5 shadow-lg">
        <p className="text-xs font-bold text-foreground mb-2.5 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-primary" /> Legenda
        </p>
        {content}
      </div>
      <div className="md:hidden">
        <button
          onClick={() => setOpen(!open)}
          className="bg-card/95 backdrop-blur-sm border border-border rounded-xl px-3 py-2 shadow-lg flex items-center gap-2"
        >
          <Info className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-bold text-foreground">Legenda</span>
          <ChevronUp className={`w-3.5 h-3.5 text-muted-foreground transition-transform duration-300 ${open ? "" : "rotate-180"}`} />
        </button>
        {open && (
          <div className="mt-2 bg-card/95 backdrop-blur-sm border border-border rounded-2xl p-3.5 shadow-lg animate-in fade-in slide-in-from-top-2 duration-200">
            {content}
          </div>
        )}
      </div>
    </div>
  );
};

// ---- Página principal ----
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
  const [flyTarget, setFlyTarget] = useState<[number, number] | null>(null);

  useEffect(() => {
    if (user?.address && !userLocation) setAddress(user.address);
  }, [user]);

  useEffect(() => {
    if (simulationMode) {
      setShelterData(prev => prev.map(s => {
        const extra = Math.floor(Math.random() * 80) + 30;
        const occ = Math.min(s.capacity, s.occupied + extra);
        const status = occ >= s.capacity ? "lotado" : occ > s.capacity * 0.7 ? "parcial" : "disponivel";
        return { ...s, occupied: occ, status: status as Shelter["status"] };
      }));
      setRiskAlert({ level: "alto", zone: "SIMULAÇÃO — Enchente Extrema em toda Sorocaba" });
    } else {
      setShelterData(initialShelters);
      if (!userLocation) setRiskAlert(null);
    }
  }, [simulationMode]);

  useEffect(() => {
    const id = setInterval(() => {
      setShelterData(prev => prev.map(s => {
        const delta = Math.floor(Math.random() * 5) - 2;
        const occ = Math.max(0, Math.min(s.capacity, s.occupied + delta));
        const status = occ >= s.capacity ? "lotado" : occ > s.capacity * 0.7 ? "parcial" : "disponivel";
        return { ...s, occupied: occ, status: status as Shelter["status"] };
      }));
    }, 10000);
    return () => clearInterval(id);
  }, []);

  const filteredShelters = useMemo(() => {
    if (filterStatus === "all") return shelterData;
    return shelterData.filter(s => s.status === filterStatus);
  }, [filterStatus, shelterData]);

  const mostUrgentShelter = useMemo(() => {
    return shelterData.reduce((worst, s) => {
      const u = s.donations.reduce((sum, d) => sum + (d.needed - d.received), 0);
      const wu = worst ? worst.donations.reduce((sum, d) => sum + (d.needed - d.received), 0) : 0;
      return u > wu ? s : worst;
    }, null as Shelter | null);
  }, [shelterData]);

  const processLocation = useCallback((lat: number, lng: number) => {
    setUserLocation({ lat, lng });
    const zone = isInRiskZone(lat, lng);
    setRiskAlert(zone ? { level: zone.level, zone: zone.name } : simulationMode ? { level: "alto", zone: "SIMULAÇÃO ATIVA" } : null);
    const nearest = findNearestSafeShelter(lat, lng);
    setRecommended(nearest);
    if (nearest) setSelectedShelter(nearest);
    setFlyTarget([lat, lng]);
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
      pos => { processLocation(pos.coords.latitude, pos.coords.longitude); setSearching(false); },
      () => setSearching(false),
    );
  };

  const handleNavigate = (shelter: Shelter) => {
    const base = userLocation
      ? `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${shelter.lat},${shelter.lng}`
      : `https://www.google.com/maps/dir/?api=1&destination=${shelter.lat},${shelter.lng}`;
    window.open(base, "_blank");
  };

  const handleDonate = (shelterId: number, itemIndex: number) => {
    setShelterData(prev => prev.map(s => {
      if (s.id !== shelterId) return s;
      const donations = [...s.donations];
      const d = donations[itemIndex];
      donations[itemIndex] = { ...d, received: Math.min(d.needed, d.received + Math.ceil(d.needed * 0.1)) };
      return { ...s, donations };
    }));
    setSelectedShelter(prev => {
      if (!prev || prev.id !== shelterId) return prev;
      return shelterData.find(s => s.id === shelterId) || prev;
    });
  };

  const haversineKm = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371, dLat = (lat2 - lat1) * Math.PI / 180, dLon = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top bar */}
      <div className="h-14 bg-card border-b border-border flex items-center justify-between px-4 z-50 relative">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" /><span className="hidden sm:inline">Voltar</span>
          </Link>
          <div className="h-5 w-px bg-border" />
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            <span className="font-semibold text-sm text-foreground hidden sm:inline">Mapa de Risco — Sorocaba</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSimulationMode(!simulationMode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-[0.96] ${
              simulationMode ? "bg-danger text-danger-foreground animate-pulse" : "bg-muted border border-border text-muted-foreground hover:text-foreground"
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            {simulationMode ? "SIMULAÇÃO ATIVA" : "Simular Enchente"}
          </button>
          <NotificationSystem />
          <button
            onClick={() => setEmergencyOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-danger/20 border border-danger/30 text-danger hover:bg-danger/30 transition-all active:scale-[0.96]"
          >
            <AlertTriangle className="w-3.5 h-3.5" /><span className="hidden sm:inline">O que fazer</span>
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
          riskAlert.level === "alto" ? "bg-danger/20 border-b border-danger/30" :
          riskAlert.level === "medio" ? "bg-warning/20 border-b border-warning/30" :
          "bg-warning/10 border-b border-warning/20"
        }`}>
          <AlertTriangle className={`w-5 h-5 flex-shrink-0 ${riskAlert.level === "alto" ? "text-danger animate-pulse" : "text-warning"}`} />
          <p className={`text-sm font-semibold ${riskAlert.level === "alto" ? "text-danger" : "text-warning"}`}>
            {riskAlert.level === "alto"
              ? "⚠️ ALTO RISCO DE ENCHENTE — PROCURE ABRIGO IMEDIATAMENTE"
              : riskAlert.level === "medio"
              ? "⚠️ ATENÇÃO: REGIÃO COM RISCO MÉDIO DE ENCHENTE"
              : "⚠️ ATENÇÃO: REGIÃO COM RISCO MODERADO"}
          </p>
          <span className="text-xs text-muted-foreground ml-auto hidden sm:block">{riskAlert.zone}</span>
        </div>
      )}

      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? "flex" : "hidden"} md:flex flex-col w-full md:w-[400px] bg-card border-r border-border z-40 overflow-hidden absolute md:relative inset-0 md:inset-auto`}>
          {/* Search */}
          <div className="p-4 border-b border-border space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                value={address}
                onChange={e => setAddress(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
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
                {searching ? "Buscando..." : "Verificar risco"}
              </button>
              <button
                onClick={handleGeolocation}
                disabled={searching}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-muted border border-border text-sm font-medium text-foreground hover:bg-muted/80 transition-colors disabled:opacity-50 active:scale-[0.98]"
              >
                <MapPin className="w-3.5 h-3.5" /><span className="hidden sm:inline">Localização</span>
              </button>
            </div>
          </div>

          {/* Recommendation */}
          {recommended && userLocation && (
            <div className="p-4 border-b border-border animate-in slide-in-from-top-2 duration-300">
              <span className="text-[10px] text-safe uppercase tracking-widest font-bold">🔥 Recomendado para você</span>
              <button
                onClick={() => { setSelectedShelter(recommended); setSidebarOpen(false); setFlyTarget([recommended.lat, recommended.lng]); }}
                className="mt-2 w-full text-left p-3 rounded-xl bg-safe/10 border border-safe/20 hover:bg-safe/20 transition-all active:scale-[0.99]"
              >
                <div className="flex items-center gap-2 mb-1">
                  <Navigation className="w-3.5 h-3.5 text-safe" />
                  <span className="text-sm font-bold text-foreground">{recommended.name}</span>
                </div>
                <p className="text-xs text-muted-foreground">{recommended.address}</p>
                <div className="flex items-center gap-3 mt-2">
                  <p className="text-xs text-safe font-medium">{recommended.capacity - recommended.occupied} vagas</p>
                  <span className="text-[10px] text-muted-foreground">~{haversineKm(userLocation.lat, userLocation.lng, recommended.lat, recommended.lng).toFixed(1)}km</span>
                  <span className="text-[10px] text-muted-foreground">~{Math.ceil(haversineKm(userLocation.lat, userLocation.lng, recommended.lat, recommended.lng) * 12)}min a pé</span>
                </div>
              </button>
            </div>
          )}

          {/* Filters */}
          <div className="p-3 border-b border-border flex items-center gap-2 overflow-x-auto">
            <Filter className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
            {[
              { value: "all", label: "Todos", count: shelterData.length },
              { value: "disponivel", label: "Disponível", count: shelterData.filter(s => s.status === "disponivel").length },
              { value: "parcial", label: "Parcial", count: shelterData.filter(s => s.status === "parcial").length },
              { value: "lotado", label: "Lotado", count: shelterData.filter(s => s.status === "lotado").length },
            ].map(f => (
              <button
                key={f.value}
                onClick={() => setFilterStatus(f.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap flex items-center gap-1.5 active:scale-[0.97] ${
                  filterStatus === f.value ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {f.label}
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full tabular-nums ${filterStatus === f.value ? "bg-primary-foreground/20" : "bg-muted-foreground/20"}`}>
                  {f.count}
                </span>
              </button>
            ))}
          </div>

          {/* Shelter list */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredShelters.map(s => {
              const pct = Math.round((s.occupied / s.capacity) * 100);
              const isRec = recommended?.id === s.id;
              const isUrgent = mostUrgentShelter?.id === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => { setSelectedShelter(s); setSidebarOpen(false); setFlyTarget([s.lat, s.lng]); }}
                  className={`w-full text-left p-3 rounded-xl transition-all active:scale-[0.99] ${
                    selectedShelter?.id === s.id
                      ? "bg-primary/10 border border-primary/30"
                      : isRec
                      ? "bg-safe/5 border border-safe/20 hover:bg-safe/10"
                      : "hover:bg-muted/50 border border-transparent"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-semibold text-foreground">{s.name}</span>
                      {isRec && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-safe/20 text-safe font-bold">★</span>}
                      {isUrgent && <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-danger/20 text-danger font-bold animate-pulse">🔥</span>}
                    </div>
                    <span className={`w-2.5 h-2.5 rounded-full ${getStatusColor(s.status)}`} />
                  </div>
                  <p className="text-xs text-muted-foreground">{getTypeLabel(s.type)} · {s.address}</p>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground tabular-nums">{s.occupied}/{s.capacity}</span>
                    </div>
                    <span className={`text-xs font-semibold ${s.status === "disponivel" ? "text-safe" : s.status === "parcial" ? "text-warning" : "text-danger"}`}>
                      {getStatusLabel(s.status)}
                    </span>
                  </div>
                  <div className="mt-1.5 h-1 rounded-full bg-muted overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${s.status === "disponivel" ? "bg-safe" : s.status === "parcial" ? "bg-warning" : "bg-danger"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          <MapContainer
            center={[-23.5015, -47.4526]}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
            scrollWheelZoom
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Áreas seguras — verde */}
            {safeZones.map(z => (
              <Circle
                key={z.name}
                center={z.center}
                radius={z.radius}
                pathOptions={{ color: "#22c55e", fillColor: "#22c55e", fillOpacity: 0.12, weight: 1.5 }}
              >
                <Popup>
                  <div className="text-sm font-semibold text-green-700">✅ Área Segura</div>
                  <div className="text-sm font-bold mt-0.5">{z.name}</div>
                  <div className="text-xs text-gray-600 mt-1">{z.description}</div>
                </Popup>
              </Circle>
            ))}

            {/* Zonas de risco */}
            {riskZones.map(z => (
              <Circle
                key={z.name}
                center={z.center}
                radius={z.radius}
                pathOptions={{ color: getRiskLevelColor(z.level), fillColor: getRiskLevelColor(z.level), fillOpacity: 0.18, weight: 1.5 }}
              >
                <Popup>
                  <div className="text-xs font-semibold text-red-600">⚠ Zona de Risco — {z.level.charAt(0).toUpperCase() + z.level.slice(1)}</div>
                  <div className="text-sm font-bold mt-0.5">{z.name}</div>
                </Popup>
              </Circle>
            ))}

            {/* Abrigos */}
            {shelterData.map(s => (
              <Marker
                key={s.id}
                position={[s.lat, s.lng]}
                icon={shelterIcon(s.status)}
                eventHandlers={{ click: () => { setSelectedShelter(s); setSidebarOpen(false); } }}
              >
                <Popup>
                  <div className="min-w-[180px]">
                    <div className="font-bold text-sm">{s.name}</div>
                    <div className="text-xs text-gray-500 mb-1">{getTypeLabel(s.type)}</div>
                    <div className={`text-xs font-semibold ${s.status === "disponivel" ? "text-green-600" : s.status === "parcial" ? "text-orange-500" : "text-red-600"}`}>
                      {getStatusLabel(s.status)} — {s.occupied}/{s.capacity} pessoas
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Localização do usuário */}
            {userLocation && (
              <CircleMarker
                center={[userLocation.lat, userLocation.lng]}
                radius={8}
                pathOptions={{ color: "#3b82f6", fillColor: "#3b82f6", fillOpacity: 1, weight: 2 }}
              >
                <Popup><div className="text-sm font-semibold">📍 Você está aqui</div></Popup>
              </CircleMarker>
            )}

            <FlyTo pos={flyTarget} />
          </MapContainer>

          {/* Card do abrigo selecionado */}
          {selectedShelter && (
            <div className="absolute bottom-0 left-0 right-0 md:bottom-4 md:left-auto md:right-4 md:w-96 z-[1000]">
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

          <LegendPanel />

          {simulationMode && (
            <div className="absolute top-4 left-4 bg-danger/90 backdrop-blur-sm rounded-xl px-4 py-2 z-[1000] flex items-center gap-2 animate-pulse shadow-lg shadow-danger/30">
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
