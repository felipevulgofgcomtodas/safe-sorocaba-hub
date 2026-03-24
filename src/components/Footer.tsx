import { Link } from "react-router-dom";
import { Shield, MapPin, Bell, Phone } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border bg-card/50 py-12">
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Shield className="w-5 h-5 text-primary" />
            <span className="font-display font-bold text-foreground">SafeFlood Sorocaba</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Sistema integrado de monitoramento e proteção civil contra enchentes.
          </p>
        </div>
        <div>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Acesso Rápido</p>
          <div className="space-y-2">
            <Link to="/mapa" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
              <MapPin className="w-3.5 h-3.5" /> Mapa de Risco
            </Link>
            <Link to="/alertas" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
              <Bell className="w-3.5 h-3.5" /> Alertas
            </Link>
          </div>
        </div>
        <div>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Emergência</p>
          <div className="space-y-2">
            <a href="tel:199" className="flex items-center gap-2 text-sm text-danger hover:text-danger/80 transition-colors font-semibold">
              <Phone className="w-3.5 h-3.5" /> Defesa Civil — 199
            </a>
            <a href="tel:193" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <Phone className="w-3.5 h-3.5" /> Bombeiros — 193
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-border pt-6">
        <p className="text-xs text-muted-foreground text-center">
          © 2025 Prefeitura de Sorocaba — Defesa Civil. Todos os direitos reservados.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
