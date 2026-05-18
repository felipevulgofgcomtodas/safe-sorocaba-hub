import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, UserCheck, Users, CheckCircle, Loader2, Heart } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { HABILIDADES_VOLUNTARIO } from "@/data/constants";

const DISPONIBILIDADES = [
  { value: "qualquer", label: "Qualquer horário" },
  { value: "semana",   label: "Dias de semana" },
  { value: "fins-de-semana", label: "Fins de semana" },
  { value: "plantao",  label: "Plantão (24h)" },
];

const Voluntarios = () => {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [bairro, setBairro] = useState("");
  const [disponibilidade, setDisponibilidade] = useState("fins-de-semana");
  const [habilidades, setHabilidades] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const toggleHabilidade = (h: string) => {
    setHabilidades(prev =>
      prev.includes(h) ? prev.filter(x => x !== h) : [...prev, h]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;
    if (habilidades.length === 0) { setError("Selecione pelo menos uma habilidade."); return; }
    setError("");
    setLoading(true);
    try {
      const { error: err } = await supabase.from("voluntarios").insert({
        nome: nome.trim(),
        telefone: telefone.trim() || null,
        bairro: bairro.trim() || null,
        disponibilidade,
        habilidades,
        ativo: true,
      });
      if (err) throw err;
      setSuccess(true);
      setNome(""); setTelefone(""); setBairro(""); setHabilidades([]);
    } catch {
      setError("Erro ao registrar. Tente novamente.");
    } finally {
      setLoading(false);
    }
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
                  Cadastre-se para ajudar durante as enchentes de Sorocaba. Sua contribuição faz a diferença para centenas de famílias.
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mt-8 max-w-md">
              <div className="bg-card border border-border rounded-xl p-3 text-center">
                <Users className="w-5 h-5 text-safe mx-auto mb-1" />
                <p className="text-lg font-bold text-foreground">0</p>
                <p className="text-[10px] text-muted-foreground">Registrados</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-3 text-center">
                <Heart className="w-5 h-5 text-primary mx-auto mb-1" />
                <p className="text-lg font-bold text-foreground">3</p>
                <p className="text-[10px] text-muted-foreground">Pontos ativos</p>
              </div>
              <div className="bg-card border border-border rounded-xl p-3 text-center">
                <CheckCircle className="w-5 h-5 text-warning mx-auto mb-1" />
                <p className="text-lg font-bold text-foreground">Ago</p>
                <p className="text-[10px] text-muted-foreground">Ativação</p>
              </div>
            </div>
          </div>
        </section>

        {/* Form */}
        <section className="container mx-auto px-5 py-10">
          <div className="max-w-xl mx-auto">
            {success ? (
              <div className="bg-card border border-safe/30 rounded-2xl p-8 text-center shadow-sm">
                <div className="w-16 h-16 rounded-full bg-safe/10 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-safe" />
                </div>
                <h2 className="text-xl font-bold text-foreground mb-2">Cadastro realizado!</h2>
                <p className="text-muted-foreground text-sm mb-6">
                  Obrigado por se voluntariar. Entraremos em contato quando a operação for ativada em Agosto/2025.
                </p>
                <button
                  onClick={() => setSuccess(false)}
                  className="px-6 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-colors"
                >
                  Cadastrar outro
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm space-y-5">
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
                    required
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">WhatsApp</label>
                    <input
                      type="tel"
                      value={telefone}
                      onChange={e => setTelefone(e.target.value)}
                      placeholder="(15) 9 0000-0000"
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Bairro</label>
                    <input
                      type="text"
                      value={bairro}
                      onChange={e => setBairro(e.target.value)}
                      placeholder="Seu bairro"
                      className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                    />
                  </div>
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
                  <p className="text-sm text-danger bg-danger/10 border border-danger/20 rounded-xl px-3 py-2">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading || !nome.trim()}
                  className="w-full py-3 rounded-xl bg-safe text-safe-foreground font-semibold text-sm hover:bg-safe/90 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-safe/20"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Registrando...</>
                  ) : (
                    <><UserCheck className="w-4 h-4" /> Me cadastrar como voluntário</>
                  )}
                </button>

                <p className="text-[11px] text-muted-foreground text-center">
                  Seus dados são usados apenas para coordenação interna da Defesa Civil de Sorocaba.
                </p>
              </form>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Voluntarios;
