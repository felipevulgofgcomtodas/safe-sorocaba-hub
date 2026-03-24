import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import logoPrefeiture from "@/assets/logo-prefeitura.png";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 ${isHome ? 'glass' : 'glass-strong'}`}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <img src={logoPrefeiture} alt="Prefeitura de Sorocaba" className="h-10 w-auto" />
          <div className="h-8 w-px bg-border" />
          <span className="font-display font-bold text-lg text-foreground">SafeFlood <span className="text-primary">Sorocaba</span></span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-3">
          <Link to="/login" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Entrar
          </Link>
          <Link to="/cadastro" className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
            Cadastrar-se
          </Link>
        </nav>

        {/* Mobile toggle */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-foreground p-2">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden glass-strong border-t border-border px-4 py-4 flex flex-col gap-3">
          <Link to="/login" onClick={() => setMobileOpen(false)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
            Entrar
          </Link>
          <Link to="/cadastro" onClick={() => setMobileOpen(false)} className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground text-center">
            Cadastrar-se
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
