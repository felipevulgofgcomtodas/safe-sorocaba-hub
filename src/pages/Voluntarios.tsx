import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, UserCheck, Heart, MessageCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { HABILIDADES_VOLUNTARIO } from "@/data/constants";

const WA_NUMBER = "5515992566575";

const DISPONIBILIDADES = [
  { value: "qualquer",        label: "Qualquer horário" },
  { value: "semana",          label: "Dias de semana" },
  { value: "fins-de-semana",  label: "Fins de semana" },
  { value: "plantao",         label: "Plantão (24h)" },
];

const Voluntarios = () => {
  const [nome, setNome] = useState("");
  const [bairro, setBairro] = useState("");
  const [disponibilidade, setDisponibilidade] = useState("fins-de-semana");
  const [habilidades, setHabilidades] = useState<string[]>([]);
  const [error, setError] = useState("");

  const toggleHabilidade = (h: string) =>
    setHabilidades(prev => prev.includes(h) ? prev.filter(x => x !== h) : [...prev, h]);

  const handleWhatsApp = () => {
    if (!nome.trim()) { setError("Informe seu nome."); return; }
    if (habilidades.length === 0) { setError("Selecione pelo menos uma habilidade."); return; }
    setError("");

    const dispLabel = DISPONIBILIDADES.find(d => d.value === disponibilidade)?.label ?? disponibilidade;

    const msg = [
      `Olá! Quero me cadastrar como voluntário no SafeFlood Sorocaba:`,
      ``,
      `👤 *Nome:* ${nome.trim()}`,
      bairro ? `📍 *Bairro:* ${bairro.trim()}` : "",
      `⏰ *Disponibilidade:* ${dispLabel}`,
      `🛠️ *Habilidades:* ${habilidades.join(", ")}`,
    ].filter(Boolean).join("\n");

    window.open(`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 pb-16">
        {/* Hero */}
        <section className="bg-gradient-to-br from-safe/10 via-background to-primary/5 py-12 md:py-16 border-b border-border">
          <div className="container mx-auto px-5">
            <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Voltar
            </Link>
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-safe/10 border border-safe/20 flex items-center justify-center shrink-0">
                <UserCheck className="w-7 h-7 text-safe" />
              </div>
              <div>
                <h1 className="font-display text-2xl md:text-4xl font-bold text-foreground mb-2">
                  Seja Voluntário
                </h1>
                <p className="text-muted-foreground max-w-xl">
                  Preencha os campos abaixo e fale diretamente pelo WhatsApp com a coordenação do SafeFlood Sorocaba.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mt-8 max-w-md">
              <div className="bg-card border border-border rounded-xl p-3 text-center">
                <Heart className="w-5 h-5 text-safe mx-auto mb-1" />
                <p className="text-lg font-bold text-foreground">3</p>
                <p className="text-[10px] text-muted-foreground">Pontos ativos</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-3 text-center">
                <UserCheck className="w-5 h-5 text-primary mx-auto mb-1" />
                <p className="text-lg font-bold text-foreground">Ago</p>
                <p className="text-[10px] text-muted-foreground">Ativação</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-3 text-center">
                <MessageCircle className="w-5 h-5 text-green-500 mx-auto mb-1" />
                <p className="text-lg font-bold text-foreground">WA</p>
                <p className="text-[10px] text-muted-foreground">Contato direto</p>
              </div>
            </div>
          </div>
        </section>

        {/* Form */}
        <section className="container mx-auto px-5 py-10">
          <div className="max-w-xl mx-auto bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm space-y-5">
            <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-safe" /> Formulário de Voluntariado
            </h2>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Nome completo *</label>
              <input
                type="text"
                value={nome}
                onChange={e => setNome(e.target.value)}
                placeholder="Seu nome"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Bairro (opcional)</label>
              <input
                type="text"
                value={bairro}
                onChange={e => setBairro(e.target.value)}
                placeholder="Seu bairro em Sorocaba"
                className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Disponibilidade</label>
              <div className="grid grid-cols-2 gap-2">
                {DISPONIBILIDADES.map(d => (
                  <button
                    key={d.value}
                    type="button"
                    onClick={() => setDisponibilidade(d.value)}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all text-left ${
                      disponibilidade === d.value
                        ? "bg-primary/15 text-primary border-2 border-primary/40"
                        : "bg-muted/40 text-muted-foreground border border-border hover:bg-muted"
                    }`}
                  >
                    {d.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Habilidades * <span className="text-[10px] text-muted-foreground font-normal">(selecione uma ou mais)</span>
              </label>
              <div className="flex flex-wrap gap-2">
                {HABILIDADES_VOLUNTARIO.map(h => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => toggleHabilidade(h)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      habilidades.includes(h)
                        ? "bg-safe/20 text-safe border border-safe/40"
                        : "bg-muted/40 text-muted-foreground border border-border hover:bg-muted"
                    }`}
                  >
                    {habilidades.includes(h) ? "✓ " : ""}{h}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <p className="text-sm text-danger bg-danger/10 border border-danger/20 rounded-xl px-3 py-2">{error}</p>
            )}

            {/* Preview */}
            {nome && habilidades.length > 0 && (
              <div className="bg-green-500/5 border border-green-500/20 rounded-xl p-3 text-xs text-muted-foreground">
                <p className="font-semibold text-foreground mb-1">Mensagem que será enviada:</p>
                <p className="whitespace-pre-line leading-relaxed">
                  {`👤 Nome: ${nome}${bairro ? `\n📍 Bairro: ${bairro}` : ""}\n⏰ Disponibilidade: ${DISPONIBILIDADES.find(d => d.value === disponibilidade)?.label}\n🛠️ Habilidades: ${habilidades.join(", ")}`}
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={handleWhatsApp}
              disabled={!nome.trim() || habilidades.length === 0}
              className="w-full py-3.5 rounded-xl bg-green-600 text-white font-bold text-sm hover:bg-green-700 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-green-600/20"
            >
              <MessageCircle className="w-5 h-5" />
              Enviar cadastro pelo WhatsApp
            </button>

            <p className="text-[11px] text-muted-foreground text-center">
              Ao clicar, o WhatsApp abrirá com sua mensagem de cadastro já preenchida para a coordenação.
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Voluntarios;
