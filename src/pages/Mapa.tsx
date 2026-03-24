import { useEffect, useState, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from "react-leaflet";
import L from "leaflet";
import { ArrowLeft, Shield, Users, Navigation, X, AlertTriangle, CheckCircle } from "lucide-react";
import { shelters, riskZones, getStatusLabel, getStatusColor, getTypeLabel, getRiskLevelLabel, getRiskLevelColor, type Shelter } from "@/data/shelters";
import "leaflet/dist/leaflet.css";

// Fix default marker icons
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const shelterIcon = new L.DivIcon({
  className: '',
  html: `<div style="width:28px;height:28px;border-radius:50%;background:#22c55e;border:3px solid white;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.3)">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
  </div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const shelterFullIcon = new L.DivIcon({
  className: '',
  html: `<div style="width:28px;height:28px;border-radius:50%;background:#ef4444;border:3px solid white;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.3)">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
  </div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

const shelterPartialIcon = new L.DivIcon({
  className: '',
  html: `<div style="width:28px;height:28px;border-radius:50%;background:#eab308;border:3px solid white;display:flex;align-items:center;justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,0.3)">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path></svg>
  </div>`,
  iconSize: [28, 28],
  iconAnchor: [14, 14],
});

function getIcon(status: Shelter['status']) {
  if (status === 'lotado') return shelterFullIcon;
  if (status === 'parcial') return shelterPartialIcon;
  return shelterIcon;
}

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => { map.setView(center, 13); }, [center, map]);
  return null;
}

const Mapa = () => {
  const [searchParams] = useSearchParams();
  const [selectedShelter, setSelectedShelter] = useState<Shelter | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const center: [number, number] = [-23.4955, -47.4555];

  const filteredShelters = useMemo(() => {
    if (filterStatus === "all") return shelters;
    return shelters.filter(s => s.status === filterStatus);
  }, [filterStatus]);

  const nearestShelter = useMemo(() => {
    const available = shelters.filter(s => s.status !== 'lotado');
    if (!available.length) return null;
    return available.reduce((prev, curr) => {
      const prevDist = Math.hypot(prev.lat - center[0], prev.lng - center[1]);
      const currDist = Math.hypot(curr.lat - center[0], curr.lng - center[1]);
      return currDist < prevDist ? curr : prev;
    });
  }, []);

  const addressParam = searchParams.get("address");

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Top bar */}
      <div className="h-14 glass-strong flex items-center justify-between px-4 z-[1000] relative">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Voltar</span>
          </Link>
          <div className="h-5 w-px bg-border" />
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            <span className="font-display font-semibold text-sm text-foreground">Mapa de Risco</span>
          </div>
        </div>
        {addressParam && (
          <span className="text-xs text-muted-foreground truncate max-w-[200px]">
            📍 {addressParam}
          </span>
        )}
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="md:hidden text-foreground text-sm px-3 py-1 rounded-lg bg-muted">
          {sidebarOpen ? "Mapa" : "Lista"}
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden relative">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'flex' : 'hidden'} md:flex flex-col w-full md:w-96 glass-strong z-[999] overflow-y-auto absolute md:relative inset-0 md:inset-auto`}>
          {/* Alert banner */}
          <div className="p-3 bg-danger/10 border-b border-danger/20 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-danger flex-shrink-0" />
            <p className="text-xs text-danger">Alerta: {riskZones.filter(z => z.level === 'alto').length} zonas de alto risco ativas</p>
          </div>

          {/* Nearest shelter */}
          {nearestShelter && (
            <div className="p-4 border-b border-border">
              <p className="text-xs text-muted-foreground mb-2 uppercase tracking-wider font-medium">Abrigo mais próximo</p>
              <button onClick={() => setSelectedShelter(nearestShelter)} className="w-full text-left p-3 rounded-lg bg-safe/10 border border-safe/20 hover:bg-safe/20 transition-colors">
                <div className="flex items-center gap-2 mb-1">
                  <Navigation className="w-3 h-3 text-safe" />
                  <span className="text-sm font-semibold text-foreground">{nearestShelter.name}</span>
                </div>
                <p className="text-xs text-muted-foreground">{nearestShelter.address}</p>
              </button>
            </div>
          )}

          {/* Filters */}
          <div className="p-4 border-b border-border flex gap-2 flex-wrap">
            {[
              { value: "all", label: "Todos" },
              { value: "disponivel", label: "Disponível" },
              { value: "parcial", label: "Parcial" },
              { value: "lotado", label: "Lotado" },
            ].map(f => (
              <button
                key={f.value}
                onClick={() => setFilterStatus(f.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filterStatus === f.value ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:text-foreground'}`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Shelter list */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filteredShelters.map(s => (
              <button
                key={s.id}
                onClick={() => { setSelectedShelter(s); setSidebarOpen(false); }}
                className={`w-full text-left p-3 rounded-lg transition-colors ${selectedShelter?.id === s.id ? 'bg-primary/10 border border-primary/30' : 'hover:bg-muted/50'}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">{s.name}</span>
                  <span className={`w-2 h-2 rounded-full ${getStatusColor(s.status)}`} />
                </div>
                <p className="text-xs text-muted-foreground">{getTypeLabel(s.type)} · {s.address}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-muted-foreground">{s.occupied}/{s.capacity} ocupados</span>
                  <span className={`text-xs font-medium ${s.status === 'disponivel' ? 'text-safe' : s.status === 'parcial' ? 'text-warning' : 'text-danger'}`}>
                    {getStatusLabel(s.status)}
                  </span>
                </div>
                <div className="mt-1.5 h-1 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${s.status === 'disponivel' ? 'bg-safe' : s.status === 'parcial' ? 'bg-warning' : 'bg-danger'}`}
                    style={{ width: `${(s.occupied / s.capacity) * 100}%` }}
                  />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Map */}
        <div className="flex-1 relative">
          <MapContainer center={center} zoom={13} className="h-full w-full" zoomControl={false}>
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>'
            />
            <MapUpdater center={center} />

            {/* Risk zones as circles */}
            {riskZones.map((zone) => {
              const color = getRiskLevelColor(zone.level);
              return (
                <Circle
                  key={zone.name}
                  center={zone.center}
                  radius={zone.radius}
                  pathOptions={{
                    color: color,
                    fillColor: color,
                    fillOpacity: 0.18,
                    weight: 2,
                    opacity: 0.7,
                    dashArray: zone.level === 'moderado' ? '8 4' : undefined,
                  }}
                >
                  <Popup>
                    <div className="text-sm">
                      <strong>{zone.name}</strong><br />
                      Nível: <span style={{ color, fontWeight: 'bold' }}>
                        {getRiskLevelLabel(zone.level).toUpperCase()}
                      </span><br />
                      Raio: {zone.radius}m
                    </div>
                  </Popup>
                </Circle>
              );
            })}

            {/* Shelters */}
            {filteredShelters.map(s => (
              <Marker
                key={s.id}
                position={[s.lat, s.lng]}
                icon={getIcon(s.status)}
                eventHandlers={{ click: () => setSelectedShelter(s) }}
              >
                <Popup>
                  <div className="text-sm min-w-[180px]">
                    <strong>{s.name}</strong><br />
                    <span className="text-gray-500">{getTypeLabel(s.type)}</span><br />
                    {s.address}<br />
                    <strong>Ocupação:</strong> {s.occupied}/{s.capacity}<br />
                    <strong>Status:</strong> {getStatusLabel(s.status)}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Selected shelter panel */}
          {selectedShelter && (
            <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 glass-strong rounded-xl p-4 z-[1000]">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-display font-bold text-foreground">{selectedShelter.name}</h3>
                  <p className="text-xs text-muted-foreground">{getTypeLabel(selectedShelter.type)}</p>
                </div>
                <button onClick={() => setSelectedShelter(null)} className="text-muted-foreground hover:text-foreground p-1">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{selectedShelter.address}</p>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div className="p-2 rounded-lg bg-muted/50 text-center">
                  <Users className="w-4 h-4 mx-auto text-primary mb-1" />
                  <p className="text-lg font-bold text-foreground tabular-nums">{selectedShelter.capacity}</p>
                  <p className="text-xs text-muted-foreground">Capacidade</p>
                </div>
                <div className="p-2 rounded-lg bg-muted/50 text-center">
                  <Users className="w-4 h-4 mx-auto text-warning mb-1" />
                  <p className="text-lg font-bold text-foreground tabular-nums">{selectedShelter.occupied}</p>
                  <p className="text-xs text-muted-foreground">Ocupados</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${getStatusColor(selectedShelter.status)}`} />
                <span className={`text-sm font-medium ${selectedShelter.status === 'disponivel' ? 'text-safe' : selectedShelter.status === 'parcial' ? 'text-warning' : 'text-danger'}`}>
                  {getStatusLabel(selectedShelter.status)}
                </span>
              </div>

              <div className="mt-2 h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full ${selectedShelter.status === 'disponivel' ? 'bg-safe' : selectedShelter.status === 'parcial' ? 'bg-warning' : 'bg-danger'}`}
                  style={{ width: `${(selectedShelter.occupied / selectedShelter.capacity) * 100}%` }}
                />
              </div>

              {selectedShelter.status !== 'lotado' && (
                <div className="mt-3 flex items-center gap-2 text-sm text-safe">
                  <CheckCircle className="w-4 h-4" />
                  <span>Vagas disponíveis: {selectedShelter.capacity - selectedShelter.occupied}</span>
                </div>
              )}
            </div>
          )}

          {/* Legend */}
          <div className="absolute top-4 right-4 glass-strong rounded-xl p-3 z-[1000]">
            <p className="text-xs font-medium text-foreground mb-2">Legenda</p>
            <div className="space-y-1.5">
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-1">Abrigos</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground"><span className="w-3 h-3 rounded-full bg-safe" /> Disponível</div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground"><span className="w-3 h-3 rounded-full bg-warning" /> Parcial</div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground"><span className="w-3 h-3 rounded-full bg-danger" /> Lotado</div>
              <div className="my-1.5 h-px bg-border" />
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-1">Zonas de Risco</p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="w-3 h-3 rounded-full border-2 border-[#ef4444] bg-[#ef4444]/25" /> Alto
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="w-3 h-3 rounded-full border-2 border-[#f97316] bg-[#f97316]/25" /> Médio
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="w-3 h-3 rounded-full border-2 border-dashed border-[#eab308] bg-[#eab308]/25" /> Moderado
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mapa;
