import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Heart, Package, Baby, UtensilsCrossed, ShoppingCart,
  ChevronDown, ChevronUp, MapPin, MessageCircle,
} from "lucide-react";
import Header from "@/components/Header";
import { shelters } from "@/data/shelters";

const WA_NUMBER = "5515992566575";

const KITS = [
  {
    id: "kit_higiene",
    title: "Kit Higiênico Básico",
    subtitle: "1 pessoa / 1 mês",
    icon: Heart,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20",
    itens: ["Sabonete", "Escova de dentes", "Creme dental", "Shampoo", "Papel higiênico", "Toalha", "Desodorante"],
  },
  {
    id: "kit_higiene_bebe",
    title: "Kit Higiene Bebê",
    subtitle: "1 semana",
    icon: Baby,
    color: "text-pink-400",
    bg: "bg-pink-400/10",
    border: "border-pink-400/20",
    itens: ["Fraldas", "Lenços umedecidos", "Pomada para assaduras", "Sabonete infantil", "Toalha"],
  },
  {
    id: "cesta_basica",
    title: "Cesta Básica / Kit Alimentação 72h",
    subtitle: "1 pessoa",
    icon: UtensilsCrossed,
    color: "text-amber-400",
    bg: "bg-amber-400/10",
    border: "border-amber-400/20",
    itens: ["Arroz", "Feijão", "Macarrão", "Farinha de mandioca", "Aveia", "Biscoito seco", "Açúcar", "Sal iodado", "Café", "Leite em pó", "Óleo vegetal"],
  },
  {
    id: "enlatados",
    title: "Enlatados",
    subtitle: "Alta durabilidade",
    icon: ShoppingCart,
    color: "text-green-400",
    bg: "bg-green-400/10",
    border: "border-green-400/20",
    itens: ["Sardinha", "Atum", "Carne enlatada", "Frango em conserva", "Milho", "Ervilha", "Feijão pronto", "Sopas enlatadas"],
  },
  {
    id: "kit_limpeza",
    title: "Kit de Limpeza",
    subtitle: "Doméstico",
    icon: Package,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    border: "border-purple-400/20",
    itens: ["Detergente", "Desinfetante", "Hipoclorito de sódio", "Esponja", "Luva de borracha", "Saco de lixo 100L"],
  },
  {
    id: "agua_litros",
    title: "Água Potável",
    subtitle: "Garrafas ou galões",
    icon: Package,
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
    border: "border-cyan-400/20",
    itens: ["Água mineral 500ml", "Água mineral 1,5L", "Galão 20L", "Caixas 200ml"],
  },
];

const PONTOS = shelters.map(s => s.name);

const KitCard = ({ kit }: { kit: typeof KITS[0] }) => {
  const [open, setOpen] = useState(false);
  const Icon = kit.icon;
  return (
    <div className={`glass rounded-xl border ${kit.border} overflow-hidden`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/20 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${kit.bg} flex items-center justify-center`}>
            <Icon className={`w-5 h-5 ${kit.color}`} />
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm">{kit.title}</p>
            <p className="text-xs text-muted-foreground">{kit.subtitle} · {kit.itens.length} itens</p>
          </div>
        </div>
        {open ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
      </button>
      {open && (
        <div className="px-4 pb-4 animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-2 gap-1.5">
            {kit.itens.map(item => (
              <div key={item} className="flex items-center gap-2 text-xs text-foreground">
                <span className={`w-1.5 h-1.5 rounded-full ${kit.color.replace("text-", "bg-")}`} />
                {item}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Doacoes = () => {
  const [ponto, setPonto] = useState("");
  const [tipo, setTipo] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [nome, setNome] = useState("");

  const tipoLabel = KITS.find(k => k.id === tipo)?.title ?? tipo;

  const handleWhatsApp = () => {
    if (!ponto || !tipo || !quantidade) return;
    const msg = [
      `Olá! Quero registrar uma doação para o SafeFlood Sorocaba:`,
      ``,
      `📦 *Doação:* ${tipoLabel}`,
      `🔢 *Quantidade:* ${quantidade} unidade(s)`,
      `📍 *Ponto de entrega:* ${ponto}`,
      nome ? `👤 *Doador:* ${nome}` : "",
    ].filter(Boolean).join("\n");

    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const canSend = ponto && tipo && quantidade;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </Link>

          {/* Título */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
              <Package className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">Doações Necessárias</h1>
              <p className="text-sm text-muted-foreground">Veja o que precisamos e avise pelo WhatsApp</p>
            </div>
          </div>

          {/* Pontos de coleta */}
          <div className="mb-8">
            <h2 className="font-display font-bold text-foreground mb-3">Pontos de Coleta</h2>
            <div className="grid gap-3">
              {shelters.map(p => (
                <div key={p.id} className="glass rounded-xl p-4 flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{p.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{p.address}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Listas de kits */}
          <div className="mb-8">
            <h2 className="font-display font-bold text-foreground mb-3">O que doar?</h2>
            <div className="space-y-3">
              {KITS.map(kit => <KitCard key={kit.id} kit={kit} />)}
            </div>
          </div>

          {/* Formulário → WhatsApp */}
          <div className="glass rounded-2xl p-6">
            <h2 className="font-display font-bold text-foreground mb-2 flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-green-500" />
              Registrar Doação via WhatsApp
            </h2>
            <p className="text-sm text-muted-foreground mb-5">
              Preencha os campos abaixo e clique no botão — vamos abrir o WhatsApp com a mensagem já pronta.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-foreground mb-1.5 block">Ponto de entrega *</label>
                <select
                  value={ponto}
                  onChange={e => setPonto(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                >
                  <option value="">Selecione o ponto...</option>
                  {PONTOS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground mb-1.5 block">Tipo de doação *</label>
                <select
                  value={tipo}
                  onChange={e => setTipo(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                >
                  <option value="">Selecione o tipo...</option>
                  {KITS.map(k => <option key={k.id} value={k.id}>{k.title}</option>)}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground mb-1.5 block">Quantidade *</label>
                <input
                  type="number" min="1"
                  value={quantidade}
                  onChange={e => setQuantidade(e.target.value)}
                  placeholder="Ex: 10"
                  className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground mb-1.5 block">Seu nome (opcional)</label>
                <input
                  type="text"
                  value={nome}
                  onChange={e => setNome(e.target.value)}
                  placeholder="Nome do doador ou organização"
                  className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                />
              </div>

              {/* Preview da mensagem */}
              {canSend && (
                <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-3 text-xs text-muted-foreground">
                  <p className="font-semibold text-foreground mb-1">Mensagem que será enviada:</p>
                  <p className="whitespace-pre-line leading-relaxed">
                    {`📦 Doação: ${tipoLabel}\n🔢 Quantidade: ${quantidade} unidade(s)\n📍 Ponto: ${ponto}${nome ? `\n👤 Doador: ${nome}` : ""}`}
                  </p>
                </div>
              )}

              <button
                onClick={handleWhatsApp}
                disabled={!canSend}
                className="w-full py-3.5 rounded-xl bg-green-600 text-white font-bold text-sm hover:bg-green-700 transition-all active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-green-600/20"
              >
                <MessageCircle className="w-5 h-5" />
                Enviar pelo WhatsApp
              </button>

              <p className="text-[11px] text-muted-foreground text-center">
                Ao clicar, o WhatsApp abrirá com a mensagem já preenchida para o número da coordenação.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Doacoes;
