import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface User {
  name: string;
  email: string;
  address: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  loginSocial: (provider: 'google' | 'facebook') => Promise<boolean>;
  signup: (name: string, email: string, password: string, address: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("safeflood_user");
    if (saved) setUser(JSON.parse(saved));
    setIsLoading(false);
  }, []);

  const persist = (u: User) => {
    setUser(u);
    localStorage.setItem("safeflood_user", JSON.stringify(u));
  };

  const login = async (email: string, _password: string) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));
    persist({ name: email.split("@")[0], email, address: "" });
    setIsLoading(false);
    return true;
  };

  const loginSocial = async (provider: 'google' | 'facebook') => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    const names = { google: "Usuário Google", facebook: "Usuário Facebook" };
    persist({ name: names[provider], email: `${provider}@safeflood.com`, address: "", avatar: provider });
    setIsLoading(false);
    return true;
  };

  const signup = async (name: string, email: string, _password: string, address: string) => {
    setIsLoading(true);
    await new Promise(r => setTimeout(r, 800));
    persist({ name, email, address });
    setIsLoading(false);
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("safeflood_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, loginSocial, signup, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
