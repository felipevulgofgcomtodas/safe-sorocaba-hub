import { Link, useLocation } from "react-router-dom";
import { Menu, X, LogOut, User, Heart, MessageCircle } from "lucide-react";
import { useState } from "react";
import logoPrefeiture from "@/assets/logo-prefeitura.png";
import { useAuth } from "@/contexts/AuthContext";

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";
  const { user, logout } = useAuth();

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
          <Link to="/vaquinha" className="px-3 py-2 text-sm font-medium text-primary hover:text-primary/80 transition-colors flex items-center gap-1.5 active:scale-[0.97]">
            <Heart className="w-3.5 h-3.5" fill="currentColor" /> Vaquinha Solidária
          </Link>
          {user ? (
            <>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 border border-border">
                <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">{user.name}</span>
              </div>
              <button onClick={logout} className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5 active:scale-[0.97]">
                <LogOut className="w-3.5 h-3.5" /> Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Entrar
              </Link>
              <Link to="/cadastro" className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors active:scale-[0.97]">
                Cadastrar-se
              </Link>
            </>
          )}
        </nav>

        {/* Mobile toggle */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-foreground p-2">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden glass-strong border-t border-border px-4 py-4 flex flex-col gap-3 animate-in slide-in-from-top-2 duration-200">
          <Link to="/vaquinha" onClick={() => setMobileOpen(false)} className="px-4 py-2 text-sm font-medium text-primary flex items-center gap-2">
            <Heart className="w-4 h-4" fill="currentColor" /> Vaquinha Solidária
          </Link>
          {user ? (
            <>
              <div className="flex items-center gap-2 px-4 py-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-4 h-4 text-primary" />
                </div>
                <span className="text-sm font-medium text-foreground">{user.name}</span>
              </div>
              <button onClick={() => { logout(); setMobileOpen(false); }} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground flex items-center gap-2">
                <LogOut className="w-4 h-4" /> Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileOpen(false)} className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground">
                Entrar
              </Link>
              <Link to="/cadastro" onClick={() => setMobileOpen(false)} className="px-4 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground text-center">
                Cadastrar-se
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
