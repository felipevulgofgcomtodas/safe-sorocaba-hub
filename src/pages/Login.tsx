import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Shield, Mail, Lock, ArrowLeft, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, loginSocial } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { setError("Preencha todos os campos"); return; }
    setLoading(true);
    setError("");
    const ok = await login(email, password);
    setLoading(false);
    if (ok) navigate("/mapa");
    else setError("Erro ao entrar");
  };

  const handleSocial = async (provider: 'google' | 'facebook') => {
    setLoading(true);
    await loginSocial(provider);
    setLoading(false);
    navigate("/mapa");
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Voltar
        </Link>

        <div className="glass-strong rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Shield className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-display font-bold text-xl text-foreground">Entrar</h1>
              <p className="text-sm text-muted-foreground">SafeFlood Sorocaba</p>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-danger/10 border border-danger/20 text-sm text-danger animate-in fade-in">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Email</label>
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-muted/50 border border-border focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" className="bg-transparent w-full text-foreground placeholder:text-muted-foreground outline-none text-sm" />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Senha</label>
              <div className="flex items-center gap-3 px-4 py-3 rounded-lg bg-muted/50 border border-border focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <Lock className="w-4 h-4 text-muted-foreground" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="bg-transparent w-full text-foreground placeholder:text-muted-foreground outline-none text-sm" />
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-all disabled:opacity-50 active:scale-[0.98] flex items-center justify-center gap-2">
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Entrando...</> : "Entrar"}
            </button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-muted-foreground">ou continue com</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => handleSocial('google')} disabled={loading} className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-border text-sm text-foreground hover:bg-muted/50 transition-colors active:scale-[0.97] disabled:opacity-50">
              <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Google
            </button>
            <button onClick={() => handleSocial('facebook')} disabled={loading} className="flex items-center justify-center gap-2 py-2.5 rounded-lg border border-border text-sm text-foreground hover:bg-muted/50 transition-colors active:scale-[0.97] disabled:opacity-50">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              Facebook
            </button>
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Não tem conta?{" "}
            <Link to="/cadastro" className="text-primary hover:underline">Cadastrar-se</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
