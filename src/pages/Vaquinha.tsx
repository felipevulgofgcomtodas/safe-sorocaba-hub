import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Heart, X, Copy, CheckCircle, Smartphone, TrendingUp, Users, DollarSign } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { CAMPANHAS_FALLBACK } from "@/data/constants";
import { useQuery } from "@tanstack/react-query";
import type { Campanha } from "@/integrations/supabase/types";

const AMOUNTS = [10, 25, 50, 100];

function useValorTotal(campanhas: Campanha[]) {
  return campanhas.reduce((s, c) => s + c.valor_arrecadado, 0);
}

const Vaquinha = () => {
  const { data: campanhas = CAMPANHAS_FALLBACK as unknown as Campanha[] } = useQuery<Campanha[]>({
    queryKey: ["campanhas"],
    queryFn: async () => {
      const { data, error } = await supabase.from("campanhas").select("*").eq("ativa", true).order("created_at");
      if (error || !data?.length) return CAMPANHAS_FALLBACK as unknown as Campanha[];
      return data;
    },
    staleTime: 60_000,
  });

  const [selectedCampanha, setSelectedCampanha] = useState<Campanha | null>(null);
  const [amount, setAmount] = useState<number | null>(null);
  const [custom, setCustom] = useState("");
  const [doador, setDoador] = useState("");
  const [anonimo, setAnonimo] = useState(false);
  const [copied, setCopied] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [done, setDone] = useState(false);

  const valorTotal = useValorTotal(campanhas);
  const totalMeta = campanhas.reduce((s, c) => s + c.meta, 0);
  const totalDoadores = campanhas.reduce((s, c) => s + Math.floor(c.valor_arrecadado / 35), 0);

  const finalAmount = amount ?? (Number(custom) > 0 ? Number(custom) : 0);

  const openModal = (c: Campanha) => {
    setSelectedCampanha(c);
    setAmount(null);
    setCustom("");
    setDoador("");
    setAnonimo(false);
    setCopied(false);
    setDone(false);
  };

  const copyPix = () => {
    if (!selectedCampanha) return;
    navigator.clipboard.writeText(selectedCampanha.chave_pix);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const confirmPayment = async () => {
    if (!selectedCampanha || !finalAmount) return;
    setConfirming(true);
    try {
      await supabase.from("contribuicoes").insert({
        campanha_id: selectedCampanha.id,
        valor: finalAmount,
        nome_doador: anonimo ? null : doador.trim() || null,
        anonimo,
      });
    } catch { /* fail silently */ }
    setConfirming(false);
    setDone(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 pb-16">
        {/* Hero */}
        <section className="bg-gradient-to-br from-primary/10 via-background to-emerald-500/5 py-12 md:py-16 border-b border-border">
          <div className="container mx-auto px-5">
            <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Voltar
            </Link>
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-4">
                <Heart className="w-3.5 h-3.5" fill="currentColor" /> Vaquinha Solidária
              </div>
              <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-3">
                Ajude quem mais precisa
              </h1>
              <p className="text-muted-foreground max-w-lg mx-auto mb-8">
                Cada doação alimenta uma família, fornece água potável ou garante um kit de higiene para quem mais precisa em Sorocaba.
              </p>

              <div className="grid grid-cols-3 gap-3 max-w-2xl mx-auto">
                <div className="bg-card/80 backdrop-blur border border-border rounded-xl p-4 shadow-sm">
                  <DollarSign className="w-5 h-5 text-emerald-500 mx-auto mb-1" />
                  <p className="text-xl font-bold text-foreground tabular-nums">
                    R$ {valorTotal.toLocaleString("pt-BR")}
                  </p>
                  <p className="text-xs text-muted-foreground">arrecadados</p>
                </div>
                <div className="bg-card/80 backdrop-blur border border-border rounded-xl p-4 shadow-sm">
                  <Users className="w-5 h-5 text-primary mx-auto mb-1" />
                  <p className="text-xl font-bold text-foreground tabular-nums">{totalDoadores}</p>
                  <p className="text-xs text-muted-foreground">doadores</p>
                </div>
                <div className="bg-card/80 backdrop-blur border border-border rounded-xl p-4 shadow-sm">
                  <TrendingUp className="w-5 h-5 text-amber-500 mx-auto mb-1" />
                  <p className="text-xl font-bold text-foreground tabular-nums">
                    {Math.round((valorTotal / totalMeta) * 100)}%
                  </p>
                  <p className="text-xs text-muted-foreground">da meta</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Campaign cards */}
        <section className="container mx-auto px-5 py-10">
          <h2 className="text-xl font-bold text-foreground mb-6">Campanhas ativas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {campanhas.map(c => {
              const pct = Math.min(100, Math.round((c.valor_arrecadado / c.meta) * 100));
              return (
                <div key={c.id} className="bg-card border border-border rounded-2xl p-5 shadow-sm flex flex-col">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h3 className="font-bold text-base text-foreground leading-tight">{c.titulo}</h3>
                    <span className="px-2 py-0.5 rounded-full bg-safe/10 text-safe text-[10px] font-bold shrink-0">ATIVA</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4 flex-1">{c.descricao}</p>

                  <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="text-muted-foreground">Arrecadado</span>
                      <span className="font-semibold text-foreground tabular-nums">
                        R$ {c.valor_arrecadado.toLocaleString("pt-BR")} / R$ {c.meta.toLocaleString("pt-BR")}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full bg-emerald-500 transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">{pct}% da meta</p>
                  </div>

                  <button
                    onClick={() => openModal(c)}
                    className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold hover:bg-primary/90 transition-all active:scale-[0.97] flex items-center justify-center gap-2"
                  >
                    <Heart className="w-4 h-4" /> Contribuir
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <Footer />

      {/* PIX Modal */}
      {selectedCampanha && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-2xl p-6 max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-300 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-foreground text-base flex items-center gap-2">
                <Smartphone className="w-5 h-5 text-emerald-500" /> Pagar com PIX
              </h3>
              <button onClick={() => setSelectedCampanha(null)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>

            <p className="text-xs text-muted-foreground mb-4 truncate">{selectedCampanha.titulo}</p>

            {done ? (
              <div className="text-center py-6">
                <CheckCircle className="w-12 h-12 text-safe mx-auto mb-3" />
                <p className="font-bold text-foreground mb-1">Obrigado pela sua doação!</p>
                <p className="text-sm text-muted-foreground mb-4">Sua contribuição foi registrada.</p>
                <button
                  onClick={() => setSelectedCampanha(null)}
                  className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-semibold"
                >
                  Fechar
                </button>
              </div>
            ) : (
              <>
                {/* Amount selection */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  {AMOUNTS.map(a => (
                    <button key={a} onClick={() => { setAmount(a); setCustom(""); }}
                      className={`py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-[0.97] ${
                        amount === a
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted/50 text-foreground border border-border hover:border-primary/40"
                      }`}>
                      R$ {a}
                    </button>
                  ))}
                </div>
                <div className="relative mb-4">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">R$</span>
                  <input
                    type="number" min="1" placeholder="Outro valor"
                    value={custom}
                    onChange={e => { setCustom(e.target.value); setAmount(null); }}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                  />
                </div>

                {/* Donor name */}
                <div className="mb-4">
                  <input
                    type="text" placeholder="Seu nome (opcional)"
                    value={doador}
                    onChange={e => setDoador(e.target.value)}
                    disabled={anonimo}
                    className="w-full px-4 py-2.5 rounded-xl border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all disabled:opacity-50"
                  />
                  <label className="flex items-center gap-2 mt-2 cursor-pointer">
                    <input type="checkbox" checked={anonimo} onChange={e => setAnonimo(e.target.checked)} className="rounded" />
                    <span className="text-xs text-muted-foreground">Doar anonimamente</span>
                  </label>
                </div>

                {/* QR Code */}
                {finalAmount > 0 && (
                  <div className="flex flex-col items-center mb-4">
                    <p className="text-xs text-muted-foreground mb-2">Escaneie com o app do banco</p>
                    <div className="bg-white p-3 rounded-xl shadow-inner border border-border">
                      <QRCodeSVG
                        value={`${selectedCampanha.chave_pix}|${finalAmount.toFixed(2)}`}
                        size={160}
                        level="M"
                        includeMargin={false}
                      />
                    </div>
                    <p className="text-lg font-bold text-foreground tabular-nums mt-2">
                      R$ {finalAmount.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </p>
                  </div>
                )}

                {/* PIX key */}
                <div className="flex items-center gap-2 p-3 rounded-xl bg-muted/50 border border-border mb-4">
                  <code className="flex-1 text-xs text-foreground truncate">{selectedCampanha.chave_pix}</code>
                  <button onClick={copyPix} className="text-xs text-primary font-semibold flex items-center gap-1 shrink-0 hover:underline">
                    {copied ? <><CheckCircle className="w-3 h-3" /> Copiada</> : <><Copy className="w-3 h-3" /> Copiar</>}
                  </button>
                </div>

                <button
                  onClick={confirmPayment}
                  disabled={!finalAmount || confirming}
                  className="w-full py-3 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-all active:scale-[0.97] disabled:opacity-40 shadow-lg shadow-emerald-600/20"
                >
                  {confirming ? "Registrando..." : "✅ Já realizei o pagamento"}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Vaquinha;
