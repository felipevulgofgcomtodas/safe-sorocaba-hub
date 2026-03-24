import { Map, Bell, Shield, Users, Radio, Navigation } from "lucide-react";

const features = [
  { icon: Map, title: "Mapa Interativo", desc: "Visualize áreas de risco e pontos seguros em tempo real", color: "text-primary", bg: "bg-primary/15", pulse: false },
  { icon: Bell, title: "Alertas em Tempo Real", desc: "Receba notificações instantâneas sobre mudanças no nível de risco", color: "text-danger", bg: "bg-danger/15", pulse: true },
  { icon: Shield, title: "Zonas de Segurança", desc: "Encontre o abrigo mais próximo com informações de capacidade", color: "text-safe", bg: "bg-safe/15", pulse: false },
  { icon: Users, title: "Ocupação Simulada", desc: "Acompanhe a lotação dos abrigos antes de se deslocar", color: "text-warning", bg: "bg-warning/15", pulse: true },
  { icon: Radio, title: "Monitoramento 24h", desc: "Sistema ativo continuamente para sua proteção", color: "text-safe", bg: "bg-safe/15", pulse: true },
  { icon: Navigation, title: "Rotas Seguras", desc: "Sugestões de trajeto para evitar áreas alagadas", color: "text-primary", bg: "bg-primary/15", pulse: false },
];

const FeaturesSection = () => {
  return (
    <section className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
            Centro de Monitoramento <span className="text-primary">Urbano</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Tecnologia a serviço da proteção civil de Sorocaba
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => (
            <div key={f.title} className="group glass rounded-xl p-6 hover:border-primary/30 transition-all duration-300 cursor-pointer active:scale-[0.98]">
              <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 relative`}>
                <f.icon className={`w-5 h-5 ${f.color}`} />
                {f.pulse && (
                  <span className={`absolute -top-1 -right-1 w-3 h-3 rounded-full ${f.color === 'text-danger' ? 'bg-danger' : f.color === 'text-warning' ? 'bg-warning' : 'bg-safe'}`}>
                    <span className={`absolute inset-0 rounded-full animate-ping ${f.color === 'text-danger' ? 'bg-danger' : f.color === 'text-warning' ? 'bg-warning' : 'bg-safe'} opacity-75`} />
                  </span>
                )}
              </div>
              <h3 className="font-display font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
              {f.pulse && (
                <div className="mt-3 flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${f.color === 'text-danger' ? 'bg-danger' : f.color === 'text-warning' ? 'bg-warning' : 'bg-safe'} animate-pulse`} />
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${f.color}`}>Ativo agora</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
