import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Heart, Package, Baby, UtensilsCrossed, ShoppingCart, CheckCircle, ChevronDown, ChevronUp, Send, MapPin } from "lucide-react";
import Header from "@/components/Header";
import { supabase } from "@/integrations/supabase/client";
import { shelters } from "@/data/shelters";

const KITS = [
  {
    id: "higiene_basico",
    title: "Kit Higiênico Básico",
    subtitle: "1 pessoa / 1 mês",
    icon: Heart,
    color: "text-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400/20",
    itens: ["Sabonete", "Escova de dentes", "Creme dental", "Shampoo", "Papel higiênico", "Toalha", "Desodorante"],
  },
  {
    id: "higiene_bebe",
    title: "Kit Higiene Bebê",
    subtitle: "1 semana",
    icon: Baby,
    color: "text-pink-400",
    bg: "bg-pink-400/10",
    border: "border-pink-400/20",
    itens: ["Fraldas", "Lenços umedecidos", "Pomada para assaduras", "Sabonete infantil", "Toalha"],
  },
  {
    id: "alimentacao_72h",
    title: "Kit Alimentação 72h",
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
];

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
        {open
          ? <ChevronUp className="w-4 h-4 text-muted-foreground" />
          : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
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

const TIPO_KIT_OPTIONS = [
  { value: "cesta_basica",  label: "Cesta Básica" },
  { value: "kit_higiene",   label: "Kit de Higiene" },
  { value: "kit_limpeza",   label: "Kit de Limpeza" },
  { value: "agua_litros",   label: "Água (litros)" },
  { value: "enlatados",     label: "Enlatados" },
];

const Doacoes = () => {
  const [form, setForm] = useState({ ponto_coleta_id: "", tipo_kit: "", quantidade: "", responsavel: "" });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.ponto_coleta_id || !form.tipo_kit || !form.quantidade) return;
    setSaving(true);
    setError("");
    try {
      const { error: err } = await supabase.from("doacoes" as any).insert({
        ponto_coleta_id: parseInt(form.ponto_coleta_id),
        tipo_kit: form.tipo_kit,
        quantidade: parseInt(form.quantidade),
        responsavel: form.responsavel || null,
        data: new Date().toISOString(),
      });
      if (err) throw err;
      setSuccess(true);
      setForm({ ponto_coleta_id: "", tipo_kit: "", quantidade: "", responsavel: "" });
      setTimeout(() => setSuccess(false), 5000);
    } catch {
      setError("Não foi possível salvar. Tente novamente.");
    } finally {
      setSaving(false);
    }
  };

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
              <p className="text-sm text-muted-foreground">Veja o que precisa ser doado e registre sua contribuição</p>
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

          {/* Formulário de registro */}
          <div className="glass rounded-2xl p-6">
            <h2 className="font-display font-bold text-foreground mb-5 flex items-center gap-2">
              <Send className="w-5 h-5 text-primary" />
              Registrar Doação
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-foreground mb-1.5 block">Ponto de entrega *</label>
                <select
                  value={form.ponto_coleta_id}
                  onChange={e => setForm(f => ({ ...f, ponto_coleta_id: e.target.value }))}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                >
                  <option value="">Selecione o ponto...</option>
                  {shelters.map(p => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground mb-1.5 block">Tipo de doação *</label>
                <select
                  value={form.tipo_kit}
                  onChange={e => setForm(f => ({ ...f, tipo_kit: e.target.value }))}
                  required
                  className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                >
                  <option value="">Selecione o tipo...</option>
                  {TIPO_KIT_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground mb-1.5 block">Quantidade *</label>
                <input
                  type="number" min="1"
                  value={form.quantidade}
                  onChange={e => setForm(f => ({ ...f, quantidade: e.target.value }))}
                  placeholder="Ex: 10"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-foreground mb-1.5 block">Seu nome (opcional)</label>
                <input
                  type="text"
                  value={form.responsavel}
                  onChange={e => setForm(f => ({ ...f, responsavel: e.target.value }))}
                  placeholder="Nome do doador ou organização"
                  className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-sm text-foreground outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                />
              </div>

              {error && (
                <p className="text-sm text-danger bg-danger/10 border border-danger/20 rounded-xl px-4 py-3">{error}</p>
              )}

              {success && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-safe/10 border border-safe/20 text-safe animate-in fade-in duration-300">
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Doação registrada!</p>
                    <p className="text-xs opacity-80">Obrigado pela sua contribuição 💙</p>
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all active:scale-[0.97] disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {saving ? (
                  <><div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> Salvando...</>
                ) : (
                  <><Send className="w-4 h-4" /> Registrar Doação</>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Doacoes;
