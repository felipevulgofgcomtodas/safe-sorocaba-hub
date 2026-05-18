import { Link } from "react-router-dom";
import { ArrowLeft, Clock, CalendarDays, AlertTriangle, CheckCircle } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CRONOGRAMA } from "@/data/constants";

const COUNTDOWN_TARGET = new Date("2025-10-01T00:00:00-03:00");

function useCountdown(target: Date) {
  const now = new Date();
  const diff = Math.max(0, target.getTime() - now.getTime());
  const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return { days, hours, minutes };
}

const Cronograma = () => {
  const countdown = useCountdown(COUNTDOWN_TARGET);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 pb-16">
        <section className="bg-gradient-to-br from-primary/5 via-background to-danger/5 py-12 md:py-16 border-b border-border">
          <div className="container mx-auto px-5">
            <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Voltar
            </Link>
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <CalendarDays className="w-7 h-7 text-primary" />
              </div>
              <div>
                <h1 className="font-display text-2xl md:text-4xl font-bold text-foreground mb-2">
                  Cronograma Operacional
                </h1>
                <p className="text-muted-foreground max-w-xl">
                  Planejamento SafeFlood Sorocaba — Temporada de Enchentes 2025.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-5 py-10">
          {/* Countdown */}
          <div className="bg-card border border-danger/30 rounded-2xl p-6 mb-10 max-w-xl mx-auto text-center shadow-sm">
            <div className="flex items-center justify-center gap-2 mb-3">
              <AlertTriangle className="w-5 h-5 text-danger" />
              <span className="text-sm font-bold text-danger uppercase tracking-wide">Contagem regressiva — Pico Out/2025</span>
            </div>
            <div className="flex items-center justify-center gap-4">
              {[
                { v: countdown.days,    l: "dias" },
                { v: countdown.hours,   l: "horas" },
                { v: countdown.minutes, l: "min" },
              ].map(({ v, l }) => (
                <div key={l} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold tabular-nums text-foreground bg-muted/50 rounded-xl px-4 py-2 min-w-[70px]">
                    {String(v).padStart(2, "0")}
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">{l}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Período crítico previsto: Outubro–Novembro 2025
            </p>
          </div>

          {/* Timeline */}
          <div className="max-w-2xl mx-auto space-y-0">
            {CRONOGRAMA.map((item, idx) => (
              <div key={item.mes} className="flex gap-4">
                {/* Line + dot */}
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full border-2 ${item.border} ${item.bg} flex items-center justify-center shrink-0 z-10`}>
                    {item.status === "critico" ? (
                      <AlertTriangle className={`w-4 h-4 ${item.cor}`} />
                    ) : (
                      <Clock className={`w-4 h-4 ${item.cor}`} />
                    )}
                  </div>
                  {idx < CRONOGRAMA.length - 1 && (
                    <div className="w-0.5 flex-1 bg-border mt-1 mb-1" />
                  )}
                </div>

                {/* Content */}
                <div className={`flex-1 ${item.bg} border ${item.border} rounded-2xl p-5 mb-4`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-xs font-bold uppercase tracking-widest ${item.cor}`}>{item.mes}</span>
                    {item.status === "critico" && (
                      <span className="px-2 py-0.5 rounded-full bg-danger/20 text-danger text-[9px] font-bold uppercase animate-pulse">
                        CRÍTICO
                      </span>
                    )}
                  </div>
                  <h3 className="font-bold text-base text-foreground mb-1">{item.titulo}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.descricao}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Info card */}
          <div className="max-w-2xl mx-auto mt-8 bg-card border border-border rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle className="w-4 h-4 text-safe" />
              <span className="text-sm font-bold text-foreground">Informações do Projeto</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: "Ativação",       value: "Agosto 2025" },
                { label: "Pico esperado",  value: "Outubro 2025" },
                { label: "Pontos ativos",  value: "3 locais" },
                { label: "Capacidade",     value: "3.000 pessoas" },
              ].map(({ label, value }) => (
                <div key={label} className="bg-muted/30 rounded-xl p-3 text-center">
                  <p className="text-xs font-bold text-foreground">{value}</p>
                  <p className="text-[10px] text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Cronograma;
