import { useNavigate } from "react-router-dom";
import { Map, Bell, Shield, Users, Radio, Navigation, ArrowRight } from "lucide-react";

const features = [
  { icon: Map, title: "Mapa Interativo", desc: "Visualize áreas de risco e pontos seguros em tempo real no mapa de Sorocaba", color: "text-primary", bg: "bg-primary/10", borderHover: "hover:border-primary/40", pulse: false, route: "/mapa" },
  { icon: Bell, title: "Alertas em Tempo Real", desc: "Receba notificações instantâneas sobre mudanças no nível de risco da sua região", color: "text-danger", bg: "bg-danger/10", borderHover: "hover:border-danger/40", pulse: true, route: "/alertas" },
  { icon: Shield, title: "Zonas de Segurança", desc: "Encontre o abrigo mais próximo com capacidade e informações atualizadas", color: "text-safe", bg: "bg-safe/10", borderHover: "hover:border-safe/40", pulse: false, route: "/mapa?view=shelters" },
  { icon: Users, title: "Ocupação Simulada", desc: "Acompanhe a lotação dos abrigos em tempo real antes de se deslocar", color: "text-warning", bg: "bg-warning/10", borderHover: "hover:border-warning/40", pulse: true, route: "/ocupacao" },
  { icon: Radio, title: "Monitoramento 24h", desc: "Sistema de sensores ativos continuamente monitorando rios e chuvas", color: "text-safe", bg: "bg-safe/10", borderHover: "hover:border-safe/40", pulse: true, route: "/monitoramento" },
  { icon: Navigation, title: "Rotas Seguras", desc: "Sugestões inteligentes de trajeto para evitar áreas alagadas", color: "text-primary", bg: "bg-primary/10", borderHover: "hover:border-primary/40", pulse: false, route: "/mapa?view=routes" },
];

const FeaturesSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-5">
            <Radio className="w-3.5 h-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">Centro de Operações</span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4 text-balance">
            Monitoramento Urbano Inteligente
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-pretty">
            Tecnologia avançada a serviço da proteção civil de Sorocaba. Clique para acessar cada módulo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, idx) => (
            <button
              key={f.title}
              onClick={() => navigate(f.route)}
              className={`group glass rounded-2xl p-6 ${f.borderHover} transition-all duration-300 cursor-pointer active:scale-[0.97] text-left hover:shadow-xl hover:-translate-y-1.5 animate-fade-in`}
              style={{ animationDelay: `${idx * 100}ms` }}
            >
              <div className={`w-14 h-14 rounded-2xl ${f.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 relative`}>
                <f.icon className={`w-6 h-6 ${f.color}`} />
                {f.pulse && (
                  <span className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${f.color === 'text-danger' ? 'bg-danger' : f.color === 'text-warning' ? 'bg-warning' : 'bg-safe'}`}>
                    <span className={`absolute inset-0 rounded-full animate-ping ${f.color === 'text-danger' ? 'bg-danger' : f.color === 'text-warning' ? 'bg-warning' : 'bg-safe'} opacity-75`} />
                  </span>
                )}
              </div>
              <h3 className="font-display font-bold text-lg text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{f.desc}</p>
              <div className="flex items-center justify-between">
                {f.pulse ? (
                  <div className="flex items-center gap-1.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${f.color === 'text-danger' ? 'bg-danger' : f.color === 'text-warning' ? 'bg-warning' : 'bg-safe'} animate-pulse`} />
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${f.color}`}>Ativo agora</span>
                  </div>
                ) : (
                  <div />
                )}
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
                  Acessar <ArrowRight className="w-3.5 h-3.5" />
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
