import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Package, Droplets, ShoppingBasket, Sparkles, Trash2, CheckCircle2 } from "lucide-react";
import Header from "@/components/Header";
import { shelters as initialShelters, type Shelter } from "@/data/shelters";

const ITEM_META = [
  { key: "Cestas Básicas",  icon: ShoppingBasket, color: "text-amber-500",   bg: "bg-amber-500/10"  },
  { key: "Kits de Higiene", icon: Sparkles,        color: "text-blue-400",    bg: "bg-blue-400/10"   },
  { key: "Kits de Limpeza", icon: Trash2,           color: "text-purple-400",  bg: "bg-purple-400/10" },
  { key: "Água",            icon: Droplets,         color: "text-cyan-400",    bg: "bg-cyan-400/10"   },
];

// Status dos kits já produzidos (dados reais do documento)
const KITS_PRODUZIDOS = [
  { tipo: "Kits de Alimentos 72h (individual)", quantidade: 45,  conformidade: "100%" },
  { tipo: "Kits de Alimentos 7 dias (família 4 pessoas)", quantidade: 10, conformidade: "100%" },
  { tipo: "Kits de Higiene", quantidade: 114, conformidade: "100%" },
];

// Totais consolidados (todos os pontos)
const TOTAIS = [
  { label: "Cestas Básicas",  min: 2000, max: 3000,  unit: "un" },
  { label: "Kits de Higiene", min: 2400, max: 3500,  unit: "un" },
  { label: "Kits de Limpeza", min: 1600, max: 2400,  unit: "un" },
  { label: "Água",            min: 7500, max: 11000, unit: "L"  },
];

const Ocupacao = () => {
  const [data, setData] = useState<Shelter[]>(initialShelters);

  // Simulação suave de recebimento de doações
  useEffect(() => {
    const interval = setInterval(() => {
      setData(prev => prev.map(s => {
        const newDonations = s.donations.map(d => {
          const delta = Math.random() < 0.3 ? Math.floor(Math.random() * 3) : 0;
          const received = Math.min(d.needed, d.received + delta);
          return { ...d, received };
        });
        const mainItem = newDonations[0];
        const ratio = mainItem.received / mainItem.needed;
        const status: Shelter["status"] = ratio >= 0.95 ? "lotado" : ratio >= 0.6 ? "parcial" : "disponivel";
        return { ...s, occupied: mainItem.received, donations: newDonations, status };
      }));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const totalRecebido = data.reduce((a, s) => a + s.donations[0].received, 0);
  const totalCapacidade = data.reduce((a, s) => a + s.capacity, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </Link>

          {/* Título */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-warning/15 flex items-center justify-center">
              <Package className="w-5 h-5 text-warning" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">Capacidade dos Pontos de Coleta</h1>
              <p className="text-sm text-muted-foreground">Acompanhe o estoque por tipo de item em tempo real</p>
            </div>
          </div>

          {/* Resumo geral */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {TOTAIS.map(t => (
              <div key={t.label} className="glass rounded-xl p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">{t.label}</p>
                <p className="text-lg font-display font-bold text-foreground tabular-nums">
                  {t.min.toLocaleString("pt-BR")}–{t.max.toLocaleString("pt-BR")}
                </p>
                <p className="text-[10px] text-muted-foreground">{t.unit} (capacidade total)</p>
              </div>
            ))}
          </div>

          {/* Barra geral cestas básicas */}
          <div className="glass rounded-xl p-4 mb-6">
            <div className="flex justify-between text-xs mb-2">
              <span className="text-muted-foreground font-medium">Cestas Básicas recebidas (todos os pontos)</span>
              <span className="font-bold text-foreground tabular-nums">{totalRecebido} / {totalCapacidade}</span>
            </div>
            <div className="h-3 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-700 bg-safe"
                style={{ width: `${Math.min(100, (totalRecebido / totalCapacidade) * 100)}%` }}
              />
            </div>
            <p className="text-[10px] text-muted-foreground mt-1.5">
              Ativação: <strong className="text-foreground">Agosto</strong> · Pico esperado: <strong className="text-foreground">Outubro</strong>
            </p>
          </div>

          {/* Cards dos 3 pontos */}
          <div className="space-y-5 mb-10">
            {data.map(ponto => (
              <div key={ponto.id} className="glass rounded-2xl p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h2 className="font-display font-bold text-foreground text-base">{ponto.name}</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">{ponto.address}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex-shrink-0 ml-3 ${
                    ponto.status === "disponivel" ? "bg-safe/10 text-safe" :
                    ponto.status === "parcial"    ? "bg-warning/10 text-warning" :
                                                    "bg-danger/10 text-danger"
                  }`}>
                    {ponto.status === "disponivel" ? "Disponível" : ponto.status === "parcial" ? "Parcial" : "Lotado"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ponto.donations.map((d, i) => {
                    const meta = ITEM_META.find(m => m.key === d.item) ?? ITEM_META[0];
                    const Icon = meta.icon;
                    const pct = Math.min(100, Math.round((d.received / d.needed) * 100));
                    return (
                      <div key={d.item} className={`rounded-xl p-3 ${meta.bg} border border-border/30`}>
                        <div className="flex items-center gap-2 mb-2">
                          <Icon className={`w-4 h-4 ${meta.color}`} />
                          <span className="text-xs font-semibold text-foreground">{d.item}</span>
                          <span className="ml-auto text-[10px] text-muted-foreground tabular-nums">
                            {d.received.toLocaleString("pt-BR")} / {d.needed.toLocaleString("pt-BR")} {d.unit}
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-black/20 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${
                              pct >= 95 ? "bg-danger" : pct >= 60 ? "bg-warning" : meta.color.replace("text-", "bg-")
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <p className={`text-[10px] mt-1 font-medium ${meta.color}`}>{pct}% da meta</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Kits Produzidos */}
          <div className="glass rounded-2xl p-5">
            <h2 className="font-display font-bold text-foreground mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-safe" />
              Status dos Kits Produzidos
            </h2>
            <div className="space-y-3">
              {KITS_PRODUZIDOS.map(kit => (
                <div key={kit.tipo} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50">
                  <div>
                    <p className="text-sm font-medium text-foreground">{kit.tipo}</p>
                    <p className="text-xs text-muted-foreground">Conformidade de qualidade: <span className="text-safe font-bold">{kit.conformidade}</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-display font-bold text-safe tabular-nums">{kit.quantidade}</p>
                    <p className="text-[10px] text-muted-foreground">unidades</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ocupacao;
