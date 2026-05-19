import { useNavigate } from "react-router-dom";
import { Map, Bell, Shield, Package, Radio, Heart, UserCheck, MessageCircle, CalendarDays, ArrowRight, CloudRain } from "lucide-react";

const features = [
  { icon: Map,         title: "Mapa Interativo",      desc: "Áreas de risco, zonas seguras e pontos de coleta em tempo real",  color: "text-primary", bg: "bg-primary/10", borderHover: "hover:border-primary/40", pulse: false, route: "/mapa" },
  { icon: CloudRain,   title: "Previsão do Tempo",    desc: "7 dias com % de perigo de enchente por dia — qualquer cidade",    color: "text-blue-400",bg: "bg-blue-400/10",borderHover: "hover:border-blue-400/40", pulse: true,  route: "/clima" },
  { icon: Bell,        title: "Alertas em Tempo Real", desc: "Notificações instantâneas sobre mudanças de risco",               color: "text-danger",  bg: "bg-danger/10",  borderHover: "hover:border-danger/40",  pulse: true,  route: "/alertas" },
  { icon: Shield,      title: "Pontos de Coleta",      desc: "3 pontos reais com endereço, capacidade e estoque",               color: "text-safe",    bg: "bg-safe/10",    borderHover: "hover:border-safe/40",    pulse: false, route: "/ocupacao" },
  { icon: Package,     title: "Kits & Doações",        desc: "Cestas, higiene, limpeza e água — acompanhe e contribua",         color: "text-warning", bg: "bg-warning/10", borderHover: "hover:border-warning/40", pulse: true,  route: "/doacoes" },
  { icon: Heart,       title: "Vaquinha Solidária",    desc: "3 campanhas ativas com PIX e acompanhamento de arrecadação",      color: "text-primary", bg: "bg-primary/10", borderHover: "hover:border-primary/40", pulse: false, route: "/vaquinha" },
  { icon: UserCheck,   title: "Voluntários",           desc: "Cadastre-se e ajude as famílias afetadas pelas enchentes",        color: "text-safe",    bg: "bg-safe/10",    borderHover: "hover:border-safe/40",    pulse: false, route: "/voluntarios" },
  { icon: MessageCircle, title: "Chat Comunitário",   desc: "Chat em tempo real via Supabase Realtime para coordenação",       color: "text-primary", bg: "bg-primary/10", borderHover: "hover:border-primary/40", pulse: true,  route: "/chat" },
  { icon: Radio,       title: "Monitoramento 24h",     desc: "Precipitação via Open-Meteo, sensores ativos",                   color: "text-safe",    bg: "bg-safe/10",    borderHover: "hover:border-safe/40",    pulse: true,  route: "/monitoramento" },
  { icon: CalendarDays, title: "Cronograma",           desc: "Timeline Aug–Nov/2025 com contagem regressiva para o pico",      color: "text-warning", bg: "bg-warning/10", borderHover: "hover:border-warning/40", pulse: false, route: "/cronograma" },
];

const FeaturesSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 md:py-24 relative">
      <div className="container mx-auto px-5">
        <div className="text-center mb-10 md:mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Radio className="w-3 h-3 text-primary" />
            <span className="text-[10px] font-semibold text-primary uppercase tracking-wider">Centro de Operações</span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl md:text-5xl font-bold text-foreground mb-3 text-balance">
            Monitoramento Urbano Inteligente
          </h2>
          <p className="text-sm md:text-base text-muted-foreground max-w-lg mx-auto text-pretty">
            Tecnologia a serviço da proteção civil de Sorocaba
          </p>
        </div>

        {/* 3-column grid */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-5">
          {features.map((f, idx) => (
            <button
              key={f.title}
              onClick={() => navigate(f.route)}
              className={`group glass rounded-xl md:rounded-2xl p-4 md:p-6 ${f.borderHover} transition-all duration-300 cursor-pointer active:scale-[0.97] text-left hover:shadow-xl hover:-translate-y-1 animate-fade-in border border-transparent`}
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl ${f.bg} flex items-center justify-center mb-3 md:mb-5 group-hover:scale-110 transition-transform duration-300 relative`}>
                <f.icon className={`w-4 h-4 md:w-6 md:h-6 ${f.color}`} />
                {f.pulse && (
                  <span className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 md:w-3 md:h-3 rounded-full ${f.color === 'text-danger' ? 'bg-danger' : f.color === 'text-warning' ? 'bg-warning' : 'bg-safe'}`}>
                    <span className={`absolute inset-0 rounded-full animate-ping ${f.color === 'text-danger' ? 'bg-danger' : f.color === 'text-warning' ? 'bg-warning' : 'bg-safe'} opacity-75`} />
                  </span>
                )}
              </div>
              <h3 className="font-display font-bold text-sm md:text-lg text-foreground mb-1 md:mb-2 leading-tight">{f.title}</h3>
              <p className="text-[11px] md:text-sm text-muted-foreground leading-relaxed mb-2 md:mb-4 line-clamp-2">{f.desc}</p>
              <div className="flex items-center justify-between">
                {f.pulse ? (
                  <div className="flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${f.color === 'text-danger' ? 'bg-danger' : f.color === 'text-warning' ? 'bg-warning' : 'bg-safe'} animate-pulse`} />
                    <span className={`text-[9px] md:text-[10px] font-bold uppercase tracking-wider ${f.color}`}>Ativo</span>
                  </div>
                ) : (
                  <div />
                )}
                <span className="inline-flex items-center gap-0.5 text-[10px] md:text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-0.5">
                  Acessar <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
