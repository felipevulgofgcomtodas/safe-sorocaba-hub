import { Shield } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border py-10">
    <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-2">
        <Shield className="w-5 h-5 text-primary" />
        <span className="font-display font-semibold text-foreground">SafeFlood Sorocaba</span>
      </div>
      <p className="text-sm text-muted-foreground">
        © 2025 Prefeitura de Sorocaba — Defesa Civil. Todos os direitos reservados.
      </p>
    </div>
  </footer>
);

export default Footer;
