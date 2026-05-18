import { Link, useLocation } from "react-router-dom";
import { Menu, X, LogOut, User, Heart, MessageCircle, UserCheck, Map, Bell, Package, Clock } from "lucide-react";
import { useState } from "react";
import logoPrefeiture from "@/assets/logo-prefeitura.png";
import { useAuth } from "@/contexts/AuthContext";

const NAV_LINKS = [
  { to: "/mapa",         label: "Mapa",       icon: Map },
  { to: "/alertas",      label: "Alertas",     icon: Bell },
  { to: "/ocupacao",     label: "Coleta",      icon: Package },
  { to: "/doacoes",      label: "Doações",     icon: Heart },
  { to: "/vaquinha",     label: "Vaquinha",    icon: Heart },
  { to: "/voluntarios",  label: "Voluntários", icon: UserCheck },
  { to: "/chat",         label: "Chat",        icon: MessageCircle },
  { to: "/cronograma",   label: "Cronograma",  icon: Clock },
];

const Header = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";
  const { user, logout } = useAuth();

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 ${isHome ? 'glass' : 'glass-strong'}`}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 shrink-0">
          <img src={logoPrefeiture} alt="Prefeitura de Sorocaba" className="h-9 w-auto" />
          <div className="h-7 w-px bg-border hidden sm:block" />
          <span className="font-display font-bold text-base text-foreground hidden sm:block">
            SafeFlood <span className="text-primary">Sorocaba</span>
          </span>
        </Link>

        {/* Desktop nav — compact scroll */}
        <nav className="hidden lg:flex items-center gap-1 overflow-x-auto scrollbar-hide">
          {NAV_LINKS.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                location.pathname === to
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Right side */}
        <div className="hidden lg:flex items-center gap-2 shrink-0">
          {user ? (
            <>
              <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-muted/50 border border-border">
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <User className="w-3 h-3 text-primary" />
                </div>
                <span className="text-xs font-medium text-foreground">{user.name}</span>
              </div>
              <button onClick={logout} className="px-2.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5">
                <LogOut className="w-3.5 h-3.5" /> Sair
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors">
                Entrar
              </Link>
              <Link to="/cadastro" className="px-3 py-1.5 text-xs font-medium rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                Cadastrar
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden text-foreground p-2 rounded-lg hover:bg-muted/50">
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden glass-strong border-t border-border px-4 py-3 grid grid-cols-2 gap-2 animate-in slide-in-from-top-2 duration-200">
          {NAV_LINKS.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === to
                  ? "bg-primary/15 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
              }`}
            >
              <Icon className="w-4 h-4" /> {label}
            </Link>
          ))}
          <div className="col-span-2 border-t border-border pt-2 mt-1 flex gap-2">
            {user ? (
              <button onClick={() => { logout(); setMobileOpen(false); }} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/50">
                <LogOut className="w-4 h-4" /> Sair
              </button>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 text-center px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground rounded-lg hover:bg-muted/50">
                  Entrar
                </Link>
                <Link to="/cadastro" onClick={() => setMobileOpen(false)} className="flex-1 text-center px-3 py-2 text-sm font-medium rounded-lg bg-primary text-primary-foreground">
                  Cadastrar
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
