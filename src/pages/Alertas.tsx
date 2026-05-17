import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Bell, AlertTriangle, Info, ShieldAlert, Phone, CheckCircle2, Clock, MapPin, Calendar, ExternalLink, Trash2 } from "lucide-react";
import Header from "@/components/Header";

interface Alert {
  id: number;
  level: "emergencia" | "atencao" | "informativo";
  title: string;
  message: string;
  time: string;
  location: string;
}

const alerts: Alert[] = [
  { id: 1, level: "emergencia", title: "Risco Alto de Alagamento", message: "Nível do Rio Sorocaba subiu 60cm na última hora. Moradores da Av. Dom Aguirre devem procurar abrigo imediatamente.", time: "Há 3 min", location: "Av. Dom Aguirre" },
  { id: 2, level: "emergencia", title: "Enchente em Progresso", message: "Água invadindo vias na região do Parque das Águas. Evite a área.", time: "Há 8 min", location: "Parque das Águas" },
  { id: 3, level: "atencao", title: "Chuva Intensa Prevista", message: "Previsão de 80mm de chuva nas próximas 3 horas para toda a região de Sorocaba.", time: "Há 15 min", location: "Toda Sorocaba" },
  { id: 4, level: "atencao", title: "Abrigo Lotando", message: "CIC Sorocaba atingiu 85% da capacidade. Considere alternativas próximas.", time: "Há 22 min", location: "CIC Sorocaba" },
  { id: 5, level: "informativo", title: "Novo Abrigo Aberto", message: "Centro Comunitário Vila Haro agora recebe famílias desalojadas.", time: "Há 30 min", location: "Vila Haro" },
  { id: 6, level: "informativo", title: "Nível do Rio Estabilizando", message: "Monitoramento indica estabilização do nível na região do Éden.", time: "Há 45 min", location: "Éden" },
  { id: 7, level: "atencao", title: "Trânsito Interditado", message: "Av. Afonso Vergueiro parcialmente interditada devido a alagamento.", time: "Há 1h", location: "Av. Afonso Vergueiro" },
  { id: 8, level: "informativo", title: "Doações Recebidas", message: "UNISO recebeu carregamento de cobertores e alimentos.", time: "Há 2h", location: "UNISO" },
];

const levelConfig = {
  emergencia: { icon: ShieldAlert, color: "text-danger", bg: "bg-danger/10", border: "border-danger/30", label: "Emergência", dot: "bg-danger" },
  atencao: { icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10", border: "border-warning/30", label: "Atenção", dot: "bg-warning" },
  informativo: { icon: Info, color: "text-safe", bg: "bg-safe/10", border: "border-safe/30", label: "Informativo", dot: "bg-safe" },
};

const Alertas = () => {
  const [phoneForm, setPhoneForm] = useState({ name: "", phone: "", bairro: "" });
  const [registered, setRegistered] = useState(false);
  const [filter, setFilter] = useState<string>("todos");

  const filtered = filter === "todos" ? alerts : alerts.filter(a => a.level === filter);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (phoneForm.name && phoneForm.phone) {
      localStorage.setItem("safeflood_phone_alert", JSON.stringify(phoneForm));
      setRegistered(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Voltar
          </Link>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Alerts list */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-danger/15 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-danger" />
                </div>
                <div>
                  <h1 className="font-display text-2xl font-bold text-foreground">Alertas em Tempo Real</h1>
                  <p className="text-sm text-muted-foreground">Últimas atualizações de risco em Sorocaba</p>
                </div>
                <span className="ml-auto flex items-center gap-1.5 px-3 py-1 rounded-full bg-danger/10 border border-danger/30">
                  <span className="w-2 h-2 rounded-full bg-danger animate-pulse" />
                  <span className="text-xs font-bold text-danger">AO VIVO</span>
                </span>
              </div>

              {/* Filters */}
              <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
                {[
                  { key: "todos", label: "Todos", count: alerts.length },
                  { key: "emergencia", label: "Emergência", count: alerts.filter(a => a.level === "emergencia").length },
                  { key: "atencao", label: "Atenção", count: alerts.filter(a => a.level === "atencao").length },
                  { key: "informativo", label: "Informativo", count: alerts.filter(a => a.level === "informativo").length },
                ].map(f => (
                  <button
                    key={f.key}
                    onClick={() => setFilter(f.key)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all active:scale-[0.96] whitespace-nowrap ${filter === f.key ? 'bg-primary text-primary-foreground' : 'bg-muted/50 border border-border text-muted-foreground hover:bg-muted'}`}
                  >
                    {f.label} ({f.count})
                  </button>
                ))}
              </div>

              {/* Alert cards */}
              <div className="space-y-3">
                {filtered.map((alert, i) => {
                  const cfg = levelConfig[alert.level];
                  const Icon = cfg.icon;
                  return (
                    <div
                      key={alert.id}
                      className={`${cfg.bg} border ${cfg.border} rounded-xl p-4 transition-all hover:shadow-md`}
                      style={{ animationDelay: `${i * 60}ms` }}
                    >
                      <div className="flex gap-3">
                        <div className={`w-9 h-9 rounded-lg ${cfg.bg} flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`w-4 h-4 ${cfg.color}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-1">
                            <h3 className="font-semibold text-foreground text-sm">{alert.title}</h3>
                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${cfg.bg} ${cfg.color} flex-shrink-0`}>{cfg.label}</span>
                          </div>
                          <p className="text-xs text-muted-foreground mb-2">{alert.message}</p>
                          <div className="flex items-center gap-4 text-[11px] text-muted-foreground">
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{alert.time}</span>
                            <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{alert.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Phone registration sidebar */}
            <div className="lg:w-96">
              <div className="glass rounded-2xl p-6 sticky top-24">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-foreground">Receber Alertas</h2>
                    <p className="text-xs text-muted-foreground">Cadastre-se para alertas por SMS/WhatsApp</p>
                  </div>
                </div>

                {registered ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 rounded-full bg-safe/15 flex items-center justify-center mx-auto mb-4">
                      <CheckCircle2 className="w-8 h-8 text-safe" />
                    </div>
                    <h3 className="font-display font-bold text-foreground mb-2">Cadastro Realizado!</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Você receberá alertas de enchente no número cadastrado.
                    </p>
                    <div className="glass rounded-xl p-3 text-left space-y-1">
                      <p className="text-xs text-muted-foreground"><strong className="text-foreground">Nome:</strong> {phoneForm.name}</p>
                      <p className="text-xs text-muted-foreground"><strong className="text-foreground">Telefone:</strong> {phoneForm.phone}</p>
                      <p className="text-xs text-muted-foreground"><strong className="text-foreground">Bairro:</strong> {phoneForm.bairro}</p>
                    </div>
                    <button onClick={() => setRegistered(false)} className="mt-4 text-xs text-primary hover:underline">
                      Alterar dados
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                      <label className="text-xs font-semibold text-foreground mb-1.5 block">Nome completo</label>
                      <input
                        type="text"
                        placeholder="Seu nome"
                        value={phoneForm.name}
                        onChange={e => setPhoneForm(p => ({ ...p, name: e.target.value }))}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-foreground mb-1.5 block">Telefone (WhatsApp)</label>
                      <input
                        type="tel"
                        placeholder="(15) 99999-9999"
                        value={phoneForm.phone}
                        onChange={e => setPhoneForm(p => ({ ...p, phone: e.target.value }))}
                        required
                        className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-foreground mb-1.5 block">Bairro / Endereço</label>
                      <input
                        type="text"
                        placeholder="Seu bairro em Sorocaba"
                        value={phoneForm.bairro}
                        onChange={e => setPhoneForm(p => ({ ...p, bairro: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/30 transition-all"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-all active:scale-[0.97] flex items-center justify-center gap-2"
                    >
                      <Bell className="w-4 h-4" />
                      Receber Alertas
                    </button>
                    <p className="text-[10px] text-muted-foreground text-center">
                      Seus dados são protegidos e usados apenas para alertas de emergência.
                    </p>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Informações Operacionais */}
          <div className="mt-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold text-foreground">Informações Operacionais</h2>
                <p className="text-sm text-muted-foreground">Calendário e capacidade do plano logístico</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="glass rounded-xl p-4 border border-warning/20">
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-1">Ativação do plano</p>
                <p className="text-2xl font-display font-bold text-warning">Agosto</p>
                <p className="text-xs text-muted-foreground mt-1">2 meses antes do pico de chuvas</p>
              </div>
              <div className="glass rounded-xl p-4 border border-danger/20">
                <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-1">Mês crítico</p>
                <p className="text-2xl font-display font-bold text-danger">Outubro</p>
                <p className="text-xs text-muted-foreground mt-1">Maior volume de chuvas esperado</p>
              </div>
            </div>

            <div className="glass rounded-xl p-5 mb-4">
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-3">Capacidade total estimada (todos os pontos)</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { label: "Cestas Básicas",  range: "2.000–3.000 un" },
                  { label: "Kits de Higiene", range: "2.400–3.500 un" },
                  { label: "Kits de Limpeza", range: "1.600–2.400 un" },
                  { label: "Água",            range: "7.500–11.000 L" },
                ].map(t => (
                  <div key={t.label} className="text-center p-3 rounded-lg bg-muted/30">
                    <p className="text-sm font-bold text-foreground tabular-nums">{t.range}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{t.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass rounded-xl p-5">
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mb-3">Status dos kits produzidos</p>
              <div className="space-y-2">
                {[
                  { tipo: "Kits de alimentos 72h (individual)", qtd: 45 },
                  { tipo: "Kits de alimentos 7 dias (família 4 pessoas)", qtd: 10 },
                  { tipo: "Kits de higiene", qtd: 114 },
                ].map(k => (
                  <div key={k.tipo} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0">
                    <p className="text-sm text-foreground">{k.tipo}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-safe tabular-nums">{k.qtd}</span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-safe/10 text-safe font-bold">100% conformidade</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Links Úteis — Descarte */}
          <div className="mt-10">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-safe/15 flex items-center justify-center">
                <Trash2 className="w-5 h-5 text-safe" />
              </div>
              <div>
                <h2 className="font-display text-xl font-bold text-foreground">Descarte de Alimentos Vencidos</h2>
                <p className="text-sm text-muted-foreground">Parceiros de descarte responsável em Sorocaba</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { nome: "Sorocaba Ambiental",       url: "https://www.sorocabaambiental.com.br/",    desc: "Gestão ambiental municipal" },
                { nome: "Grupo DS Ambiental",        url: "https://dsambiental.com.br/",              desc: "Gestão de resíduos orgânicos" },
                { nome: "Sorolix Ambiental",         url: "https://bio.site/sorolixambiental",        desc: "Coleta e destinação de resíduos" },
                { nome: "Banco de Alimentos",        url: "https://www.bancoalimentos.org.br/",       desc: "Redistribuição de alimentos próximos ao vencimento" },
                { nome: "Ecoponto Vila Helena",      url: "https://mapa.abrecon.org.br/ecoponto/939/ecoponto-vila-helena", desc: "Ecoponto municipal de descarte" },
              ].map(link => (
                <a
                  key={link.nome}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="glass rounded-xl p-4 flex items-center justify-between gap-3 hover:border-safe/40 border border-transparent transition-all group hover:-translate-y-0.5"
                >
                  <div>
                    <p className="text-sm font-semibold text-foreground group-hover:text-safe transition-colors">{link.nome}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{link.desc}</p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-safe transition-colors flex-shrink-0" />
                </a>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Alertas;
