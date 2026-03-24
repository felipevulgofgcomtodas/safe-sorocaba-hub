import { Map, Bell, Shield, Users, Radio, Navigation } from "lucide-react";

const features = [
  { icon: Map, title: "Mapa Interativo", desc: "Visualize áreas de risco e pontos seguros em tempo real" },
  { icon: Bell, title: "Alertas em Tempo Real", desc: "Receba notificações instantâneas sobre mudanças no nível de risco" },
  { icon: Shield, title: "Zonas de Segurança", desc: "Encontre o abrigo mais próximo com informações de capacidade" },
  { icon: Users, title: "Ocupação Simulada", desc: "Acompanhe a lotação dos abrigos antes de se deslocar" },
  { icon: Radio, title: "Monitoramento 24h", desc: "Sistema ativo continuamente para sua proteção" },
  { icon: Navigation, title: "Rotas Seguras", desc: "Sugestões de trajeto para evitar áreas alagadas" },
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
            <div key={f.title} className="group glass rounded-xl p-6 hover:border-primary/30 transition-all duration-300">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-display font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
