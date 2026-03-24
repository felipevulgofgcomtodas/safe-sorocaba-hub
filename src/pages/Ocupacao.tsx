import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Users, Search } from "lucide-react";
import Header from "@/components/Header";
import { shelters as initialShelters, getStatusLabel, getStatusColor, type Shelter } from "@/data/shelters";

const Ocupacao = () => {
  const [data, setData] = useState<Shelter[]>(initialShelters);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => prev.map(s => {
        const delta = Math.floor((Math.random() - 0.4) * 8);
        const newOccupied = Math.max(0, Math.min(s.capacity, s.occupied + delta));
        const ratio = newOccupied / s.capacity;
        const newStatus: Shelter['status'] = ratio >= 0.95 ? 'lotado' : ratio >= 0.7 ? 'parcial' : 'disponivel';
        return { ...s, occupied: newOccupied, status: newStatus };
      }));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const filtered = data.filter(s => s.name.toLowerCase().includes(search.toLowerCase()));
  const totalCapacity = data.reduce((a, s) => a + s.capacity, 0);
  const totalOccupied = data.reduce((a, s) => a + s.occupied, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-warning/15 flex items-center justify-center">
              <Users className="w-5 h-5 text-warning" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">Ocupação dos Abrigos</h1>
              <p className="text-sm text-muted-foreground">Acompanhe a lotação em tempo real</p>
            </div>
          </div>

          {/* Summary */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="glass rounded-xl p-4 text-center">
              <p className="text-2xl font-display font-bold text-safe tabular-nums">{data.filter(s => s.status === 'disponivel').length}</p>
              <p className="text-xs text-muted-foreground">Disponíveis</p>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <p className="text-2xl font-display font-bold text-warning tabular-nums">{data.filter(s => s.status === 'parcial').length}</p>
              <p className="text-xs text-muted-foreground">Parciais</p>
            </div>
            <div className="glass rounded-xl p-4 text-center">
              <p className="text-2xl font-display font-bold text-danger tabular-nums">{data.filter(s => s.status === 'lotado').length}</p>
              <p className="text-xs text-muted-foreground">Lotados</p>
            </div>
          </div>

          {/* Global bar */}
          <div className="glass rounded-xl p-4 mb-6">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-muted-foreground">Ocupação Total</span>
              <span className="font-bold text-foreground tabular-nums">{totalOccupied} / {totalCapacity}</span>
            </div>
            <div className="h-3 rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${(totalOccupied / totalCapacity) > 0.85 ? 'bg-danger' : (totalOccupied / totalCapacity) > 0.6 ? 'bg-warning' : 'bg-safe'}`}
                style={{ width: `${(totalOccupied / totalCapacity) * 100}%` }}
              />
            </div>
          </div>

          {/* Search */}
          <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-muted/50 border border-border mb-6">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Buscar abrigo..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent w-full text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />
          </div>

          {/* Shelter list */}
          <div className="space-y-3">
            {filtered.map(s => {
              const ratio = s.occupied / s.capacity;
              const statusColor = getStatusColor(s.status);
              return (
                <div key={s.id} className="glass rounded-xl p-4 hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-foreground text-sm">{s.name}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${statusColor}`}>
                      {getStatusLabel(s.status)}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-3">{s.address}</p>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${ratio > 0.85 ? 'bg-danger' : ratio > 0.6 ? 'bg-warning' : 'bg-safe'}`}
                        style={{ width: `${ratio * 100}%` }}
                      />
                    </div>
                    <span className="text-xs font-bold text-foreground tabular-nums w-20 text-right">{s.occupied}/{s.capacity}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ocupacao;
