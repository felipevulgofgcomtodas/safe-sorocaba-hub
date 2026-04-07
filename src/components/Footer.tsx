import { Link } from "react-router-dom";
import { Shield, MapPin, Bell, Phone } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border bg-card/50 py-8 md:py-12">
    <div className="container mx-auto px-5">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
        <div className="col-span-2 md:col-span-1 mb-2 md:mb-0">
          <div className="flex items-center gap-2 mb-2">
            <Shield className="w-4 h-4 text-primary" />
            <span className="font-display font-bold text-sm text-foreground">SafeFlood Sorocaba</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed max-w-xs">
            Sistema integrado de monitoramento e proteção civil contra enchentes.
          </p>
        </div>
        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2.5">Acesso Rápido</p>
          <div className="space-y-1.5">
            <Link to="/mapa" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
              <MapPin className="w-3 h-3" /> Mapa de Risco
            </Link>
            <Link to="/alertas" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
              <Bell className="w-3 h-3" /> Alertas
            </Link>
          </div>
        </div>
        <div>
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2.5">Emergência</p>
          <div className="space-y-1.5">
            <a href="tel:199" className="flex items-center gap-1.5 text-xs text-danger hover:text-danger/80 transition-colors font-semibold">
              <Phone className="w-3 h-3" /> Defesa Civil — 199
            </a>
            <a href="tel:193" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors">
              <Phone className="w-3 h-3" /> Bombeiros — 193
            </a>
          </div>
        </div>
      </div>
      <div className="border-t border-border pt-4 md:pt-6">
        <p className="text-[10px] md:text-xs text-muted-foreground text-center">
          © 2025 Prefeitura de Sorocaba — Defesa Civil. Todos os direitos reservados.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
