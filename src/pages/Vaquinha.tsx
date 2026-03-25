import { useState, useEffect, useCallback } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Heart, TrendingUp, Users, ShieldCheck, Clock, DollarSign, Eye, CheckCircle, CreditCard, Smartphone, Copy, QrCode, X } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const FIRST_NAMES = ["Maria", "João", "Ana", "Carlos", "Fernanda", "Pedro", "Juliana", "Lucas", "Beatriz", "Rafael", "Camila", "Gustavo", "Larissa", "Thiago", "Isabela", "Mateus", "Amanda", "Bruno", "Letícia", "Diego"];
const LAST_INITIALS = ["S.", "P.", "M.", "R.", "L.", "C.", "F.", "A.", "O.", "T.", "B.", "G.", "D.", "N.", "V."];

const CATEGORIES = [
  { label: "Abrigos emergenciais", value: 5200, color: "hsl(var(--primary))" },
  { label: "Alimentação", value: 4800, color: "hsl(142 71% 45%)" },
  { label: "Água potável", value: 2300, color: "hsl(199 89% 48%)" },
  { label: "Kits de higiene", value: 1950, color: "hsl(45 93% 47%)" },
  { label: "Medicamentos", value: 1400, color: "hsl(0 84% 60%)" },
  { label: "Roupas e cobertores", value: 1300, color: "hsl(262 83% 58%)" },
  { label: "Transporte", value: 900, color: "hsl(25 95% 53%)" },
];

const DONATION_AMOUNTS = [10, 25, 50, 100];
const PIX_KEY = "safeflood@sorocaba.sp.gov.br";

interface Donation {
  id: number;
  name: string;
  amount: number;
  timeAgo: string;
  anonymous: boolean;
}

function generateDonation(id: number, minutesAgo: number): Donation {
  const anonymous = Math.random() < 0.2;
  const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const lastInit = LAST_INITIALS[Math.floor(Math.random() * LAST_INITIALS.length)];
  const amounts = [10, 15, 20, 25, 30, 50, 75, 100, 150, 200];
  return {
    id,
    name: anonymous ? "Anônimo" : `${firstName} ${lastInit}`,
    amount: amounts[Math.floor(Math.random() * amounts.length)],
    timeAgo: minutesAgo < 1 ? "agora" : minutesAgo < 60 ? `há ${minutesAgo} min` : `há ${Math.floor(minutesAgo / 60)}h`,
    anonymous,
  };
}

const initialHistory: Donation[] = Array.from({ length: 8 }, (_, i) => generateDonation(i, (i + 1) * 3 + Math.floor(Math.random() * 5)));

const AnimatedNumber = ({ value, prefix = "" }: { value: number; prefix?: string }) => {
  const [display, setDisplay] = useState(value);
  useEffect(() => {
    const start = display;
    const diff = value - start;
    if (diff === 0) return;
    const steps = 30;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      setDisplay(Math.round(start + (diff * step) / steps));
      if (step >= steps) clearInterval(timer);
    }, 20);
    return () => clearInterval(timer);
  }, [value]);
  return <span>{prefix}{display.toLocaleString("pt-BR")}</span>;
};

const Vaquinha = () => {
  const [totalRaised, setTotalRaised] = useState(18450);
  const [totalDonations, setTotalDonations] = useState(327);
  const [history, setHistory] = useState<Donation[]>(initialHistory);
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [nextId, setNextId] = useState(100);
  const [paymentMethod, setPaymentMethod] = useState<"pix" | "card">("pix");
  const [showPixModal, setShowPixModal] = useState(false);
  const [pixCopied, setPixCopied] = useState(false);
  const [cardForm, setCardForm] = useState({ name: "", number: "", expiry: "", cvv: "" });
  const [processingPayment, setProcessingPayment] = useState(false);
  const goal = 50000;

  const addDonation = useCallback((amount: number, userName?: string) => {
    setTotalRaised(prev => prev + amount);
    setTotalDonations(prev => prev + 1);
    const newDon: Donation = {
      id: nextId,
      name: userName || "Você",
      amount,
      timeAgo: "agora",
      anonymous: false,
    };
    setNextId(prev => prev + 1);
    setHistory(prev => [newDon, ...prev.slice(0, 19)]);
  }, [nextId]);

  useEffect(() => {
    const interval = setInterval(() => {
      const d = generateDonation(Date.now(), 0);
      setTotalRaised(prev => prev + d.amount);
      setTotalDonations(prev => prev + 1);
      setHistory(prev => [{ ...d, timeAgo: "agora" }, ...prev.slice(0, 19)]);
    }, 12000 + Math.random() * 8000);
    return () => clearInterval(interval);
  }, []);

  const getDonationAmount = () => selectedAmount || Number(customAmount) || 0;

  const handleDonatePix = () => {
    const amount = getDonationAmount();
    if (!amount || amount <= 0) return;
    setShowPixModal(true);
  };

  const confirmPixPayment = () => {
    const amount = getDonationAmount();
    addDonation(amount);
    setShowPixModal(false);
    setShowSuccess(true);
    setSelectedAmount(null);
    setCustomAmount("");
    setTimeout(() => setShowSuccess(false), 4000);
  };

  const handleDonateCard = () => {
    const amount = getDonationAmount();
    if (!amount || amount <= 0) return;
    if (!cardForm.name || !cardForm.number || !cardForm.expiry || !cardForm.cvv) return;
    setProcessingPayment(true);
    setTimeout(() => {
      addDonation(amount);
      setProcessingPayment(false);
      setShowSuccess(true);
      setSelectedAmount(null);
      setCustomAmount("");
      setCardForm({ name: "", number: "", expiry: "", cvv: "" });
      setTimeout(() => setShowSuccess(false), 4000);
    }, 2000);
  };

  const copyPix = () => {
    navigator.clipboard.writeText(PIX_KEY);
    setPixCopied(true);
    setTimeout(() => setPixCopied(false), 3000);
  };

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, "").slice(0, 4);
    if (digits.length > 2) return digits.slice(0, 2) + "/" + digits.slice(2);
    return digits;
  };

  const progress = Math.min((totalRaised / goal) * 100, 100);
  const maxCat = Math.max(...CATEGORIES.map(c => c.value));

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 pb-16">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-emerald-500/5 py-16 md:py-24">
          <div className="absolute inset-0 opacity-5">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="absolute w-1 bg-primary/30 rounded-full animate-pulse" style={{
                left: `${5 + i * 5}%`, top: `${Math.random() * 100}%`,
                height: `${20 + Math.random() * 40}px`,
                animationDelay: `${i * 0.2}s`,
              }} />
            ))}
          </div>

          <div className="container mx-auto px-4 text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
              <Heart className="w-4 h-4" fill="currentColor" /> Vaquinha Solidária
            </div>
            <h1 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4" style={{ lineHeight: "1.1" }}>
              Ajude quem mais precisa
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-10">
              Cada doação faz diferença. Contribua para ajudar famílias afetadas por enchentes em Sorocaba.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto mb-8">
              <div className="bg-card/80 backdrop-blur border border-border rounded-2xl p-5 shadow-sm">
                <DollarSign className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                <div className="text-2xl md:text-3xl font-bold text-foreground tabular-nums">
                  R$ <AnimatedNumber value={totalRaised} />
                </div>
                <p className="text-sm text-muted-foreground mt-1">arrecadados</p>
              </div>
              <div className="bg-card/80 backdrop-blur border border-border rounded-2xl p-5 shadow-sm">
                <Users className="w-6 h-6 text-primary mx-auto mb-2" />
                <div className="text-2xl md:text-3xl font-bold text-foreground tabular-nums">
                  <AnimatedNumber value={totalDonations} />
                </div>
                <p className="text-sm text-muted-foreground mt-1">doações</p>
              </div>
              <div className="bg-card/80 backdrop-blur border border-border rounded-2xl p-5 shadow-sm">
                <TrendingUp className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                <div className="text-2xl md:text-3xl font-bold text-foreground tabular-nums">
                  R$ <AnimatedNumber value={goal} />
                </div>
                <p className="text-sm text-muted-foreground mt-1">meta</p>
              </div>
            </div>

            {/* Progress */}
            <div className="max-w-2xl mx-auto">
              <div className="flex justify-between text-sm text-muted-foreground mb-2">
                <span>{progress.toFixed(1)}% da meta</span>
                <span>R$ {goal.toLocaleString("pt-BR")}</span>
              </div>
              <Progress value={progress} className="h-4 bg-muted" />
            </div>
          </div>
        </section>

        {/* Donation + History */}
        <section className="container mx-auto px-4 py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Donate card */}
            <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Heart className="w-5 h-5 text-primary" /> Faça sua doação
              </h2>

              {/* Amount selection */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                {DONATION_AMOUNTS.map(amt => (
                  <button key={amt} onClick={() => { setSelectedAmount(amt); setCustomAmount(""); }}
                    className={`py-3 px-4 rounded-xl text-sm font-semibold transition-all active:scale-[0.97] ${
                      selectedAmount === amt
                        ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                        : "bg-muted/50 text-foreground border border-border hover:border-primary/40 hover:bg-primary/5"
                    }`}>
                    R$ {amt}
                  </button>
                ))}
              </div>

              <div className="mb-6">
                <label className="text-sm text-muted-foreground mb-2 block">Outro valor</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">R$</span>
                  <input
                    type="number" min="1" placeholder="Digite o valor"
                    value={customAmount}
                    onChange={e => { setCustomAmount(e.target.value); setSelectedAmount(null); }}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                  />
                </div>
              </div>

              {/* Payment method tabs */}
              <div className="flex gap-2 mb-6">
                <button onClick={() => setPaymentMethod("pix")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${
                    paymentMethod === "pix"
                      ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-2 border-emerald-500/40"
                      : "bg-muted/50 text-muted-foreground border border-border hover:bg-muted"
                  }`}>
                  <Smartphone className="w-4 h-4" /> PIX
                </button>
                <button onClick={() => setPaymentMethod("card")}
                  className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all ${
                    paymentMethod === "card"
                      ? "bg-primary/10 text-primary border-2 border-primary/40"
                      : "bg-muted/50 text-muted-foreground border border-border hover:bg-muted"
                  }`}>
                  <CreditCard className="w-4 h-4" /> Cartão
                </button>
              </div>

              {/* PIX section */}
              {paymentMethod === "pix" && (
                <div className="space-y-4 animate-in fade-in duration-300">
                  <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                    <p className="text-sm font-medium text-foreground mb-2">Chave PIX:</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-sm bg-background px-3 py-2 rounded-lg border border-border text-foreground truncate">
                        {PIX_KEY}
                      </code>
                      <button onClick={copyPix}
                        className="px-3 py-2 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/20 transition-colors text-sm font-medium flex items-center gap-1.5 active:scale-[0.97]">
                        {pixCopied ? <><CheckCircle className="w-3.5 h-3.5" /> Copiada!</> : <><Copy className="w-3.5 h-3.5" /> Copiar</>}
                      </button>
                    </div>
                  </div>

                  <button onClick={handleDonatePix}
                    disabled={!getDonationAmount()}
                    className="w-full py-4 rounded-xl bg-emerald-600 text-white font-bold text-base hover:bg-emerald-700 transition-all active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2">
                    <QrCode className="w-5 h-5" /> Pagar com PIX
                  </button>
                </div>
              )}

              {/* Card section */}
              {paymentMethod === "card" && (
                <div className="space-y-3 animate-in fade-in duration-300">
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Nome no cartão</label>
                    <input type="text" placeholder="Nome completo"
                      value={cardForm.name}
                      onChange={e => setCardForm(f => ({ ...f, name: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all text-sm" />
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground mb-1 block">Número do cartão</label>
                    <input type="text" placeholder="0000 0000 0000 0000"
                      value={cardForm.number}
                      onChange={e => setCardForm(f => ({ ...f, number: formatCardNumber(e.target.value) }))}
                      maxLength={19}
                      className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all text-sm tabular-nums" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">Validade</label>
                      <input type="text" placeholder="MM/AA"
                        value={cardForm.expiry}
                        onChange={e => setCardForm(f => ({ ...f, expiry: formatExpiry(e.target.value) }))}
                        maxLength={5}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all text-sm tabular-nums" />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-1 block">CVV</label>
                      <input type="text" placeholder="123"
                        value={cardForm.cvv}
                        onChange={e => setCardForm(f => ({ ...f, cvv: e.target.value.replace(/\D/g, "").slice(0, 4) }))}
                        maxLength={4}
                        className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all text-sm tabular-nums" />
                    </div>
                  </div>

                  <button onClick={handleDonateCard}
                    disabled={!getDonationAmount() || processingPayment || !cardForm.name || !cardForm.number || !cardForm.expiry || !cardForm.cvv}
                    className="w-full py-4 rounded-xl bg-primary text-primary-foreground font-bold text-base hover:bg-primary/90 transition-all active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-primary/20 flex items-center justify-center gap-2 mt-2">
                    {processingPayment ? (
                      <><div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" /> Processando...</>
                    ) : (
                      <><CreditCard className="w-5 h-5" /> Doar com cartão</>
                    )}
                  </button>
                </div>
              )}

              {showSuccess && (
                <div className="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <CheckCircle className="w-5 h-5 shrink-0" />
                  <div>
                    <p className="font-semibold text-sm">Doação registrada com sucesso!</p>
                    <p className="text-xs opacity-80">Obrigado por sua generosidade 💙</p>
                  </div>
                </div>
              )}

              {/* Trust badges */}
              <div className="mt-6 grid grid-cols-3 gap-2">
                {[
                  { icon: ShieldCheck, text: "100% transparente" },
                  { icon: Eye, text: "Tempo real" },
                  { icon: CheckCircle, text: "Contas públicas" },
                ].map(({ icon: Icon, text }) => (
                  <div key={text} className="flex flex-col items-center gap-1 py-3 px-2 rounded-lg bg-muted/30 text-center">
                    <Icon className="w-4 h-4 text-primary" />
                    <span className="text-[11px] text-muted-foreground font-medium leading-tight">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* History */}
            <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm">
              <h2 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" /> Doações recentes
              </h2>

              <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
                {history.map((d, i) => (
                  <div key={d.id} className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors"
                    style={{ animationDelay: `${i * 60}ms` }}>
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold ${
                        d.anonymous ? "bg-muted text-muted-foreground" : "bg-primary/15 text-primary"
                      }`}>
                        {d.anonymous ? "?" : d.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{d.name}</p>
                        <p className="text-xs text-muted-foreground">{d.timeAgo}</p>
                      </div>
                    </div>
                    <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
                      R$ {d.amount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Transparency */}
        <section className="container mx-auto px-4 py-12 md:py-16">
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8 shadow-sm max-w-3xl mx-auto">
            <h2 className="text-xl font-bold text-foreground mb-2 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" /> Como o dinheiro está sendo usado
            </h2>
            <p className="text-sm text-muted-foreground mb-8">Acompanhe em tempo real a distribuição dos recursos arrecadados</p>

            <div className="space-y-4">
              {CATEGORIES.map(cat => (
                <div key={cat.label}>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="font-medium text-foreground">{cat.label}</span>
                    <span className="font-bold tabular-nums text-foreground">R$ {cat.value.toLocaleString("pt-BR")}</span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{
                      width: `${(cat.value / maxCat) * 100}%`,
                      backgroundColor: cat.color,
                    }} />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 rounded-xl bg-primary/5 border border-primary/10 text-center">
              <p className="text-sm text-muted-foreground">
                Total distribuído: <span className="font-bold text-foreground">R$ {CATEGORIES.reduce((s, c) => s + c.value, 0).toLocaleString("pt-BR")}</span>
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />

      {/* PIX Modal */}
      {showPixModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-card border border-border rounded-2xl p-6 md:p-8 max-w-md w-full shadow-2xl animate-in zoom-in-95 duration-300">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                <QrCode className="w-5 h-5 text-emerald-500" /> Pagar com PIX
              </h3>
              <button onClick={() => setShowPixModal(false)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="text-center mb-6">
              <p className="text-sm text-muted-foreground mb-1">Valor da doação</p>
              <p className="text-3xl font-bold text-foreground tabular-nums">R$ {getDonationAmount()}</p>
            </div>

            {/* QR Code visual */}
            <div className="flex justify-center mb-6">
              <div className="w-48 h-48 bg-white rounded-xl p-3 shadow-inner border border-border">
                <div className="w-full h-full grid grid-cols-8 grid-rows-8 gap-[2px]">
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div key={i} className={`rounded-[1px] ${
                      Math.random() > 0.4 ? "bg-gray-900" : "bg-white"
                    }`} />
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-6">
              <div className="p-3 rounded-xl bg-muted/50 border border-border">
                <p className="text-xs text-muted-foreground mb-1">Chave PIX</p>
                <div className="flex items-center gap-2">
                  <code className="flex-1 text-sm text-foreground truncate">{PIX_KEY}</code>
                  <button onClick={copyPix} className="text-xs text-primary font-medium hover:underline flex items-center gap-1">
                    {pixCopied ? <><CheckCircle className="w-3 h-3" /> Copiada</> : <><Copy className="w-3 h-3" /> Copiar</>}
                  </button>
                </div>
              </div>

              <p className="text-xs text-center text-muted-foreground">
                Escaneie o QR Code ou copie a chave PIX para realizar o pagamento
              </p>
            </div>

            <button onClick={confirmPixPayment}
              className="w-full py-4 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 transition-all active:scale-[0.97] shadow-lg shadow-emerald-600/20">
              ✅ Confirmar pagamento
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vaquinha;
