import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Send, MapPin, ThumbsUp, AlertTriangle, MessageCircle, Filter, Users } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

type Category = "todos" | "enchentes" | "transito" | "abrigos" | "alertas";

interface ChatMessage {
  id: string;
  author: string;
  text: string;
  time: Date;
  category: Category;
  location?: string;
  likes: number;
  liked: boolean;
  isAlert: boolean;
  isOwn: boolean;
}

const CATEGORIES: { value: Category; label: string; icon: string }[] = [
  { value: "todos", label: "Todos", icon: "💬" },
  { value: "enchentes", label: "Enchentes", icon: "🌊" },
  { value: "transito", label: "Trânsito", icon: "🚗" },
  { value: "abrigos", label: "Abrigos", icon: "🏠" },
  { value: "alertas", label: "Alertas", icon: "🚨" },
];

const LOCATIONS = [
  "Centro", "Av. Dom Aguirre", "Marginal do Rio Sorocaba", "Jd. Europa",
  "Av. Afonso Vergueiro", "Região do Shopping Iguatemi", "Vila Hortência",
  "Parque Campolim", "Jd. Santa Rosália", "Av. Ipanema", "Região do CIC",
  "Av. General Carneiro", "Vila Barão", "Wanel Ville", "Éden",
];

const SIMULATED: { text: string; category: Category; location?: string; isAlert: boolean }[] = [
  { text: "Aqui na marginal está tudo parado, água subindo rápido", category: "enchentes", location: "Marginal do Rio Sorocaba", isAlert: true },
  { text: "Trânsito parado próximo ao shopping, desviem pela Itavuvu", category: "transito", location: "Região do Shopping Iguatemi", isAlert: false },
  { text: "Abrigo do CIC ainda tem vagas, pessoal!", category: "abrigos", location: "Região do CIC", isAlert: false },
  { text: "⚠️ Rua alagada próximo ao centro — evitar passagem", category: "enchentes", location: "Centro", isAlert: true },
  { text: "Na Afonso Vergueiro começou a alagar, cuidado!", category: "enchentes", location: "Av. Afonso Vergueiro", isAlert: true },
  { text: "Semáforo apagado na Dom Aguirre, trânsito lento", category: "transito", location: "Av. Dom Aguirre", isAlert: false },
  { text: "Voluntários distribuindo água no abrigo da UNISO", category: "abrigos", location: "Jd. Santa Rosália", isAlert: false },
  { text: "Nível do rio subindo na Vila Hortência, fiquem atentos", category: "enchentes", location: "Vila Hortência", isAlert: true },
  { text: "Trânsito fluindo bem pela Raposo Tavares sentido interior", category: "transito", isAlert: false },
  { text: "Precisamos de cobertores no abrigo Éden", category: "abrigos", location: "Éden", isAlert: false },
  { text: "Chuva forte prevista para as próximas 2h na região norte", category: "alertas", isAlert: true },
  { text: "Desvio pela Av. Ipanema funcionando bem agora", category: "transito", location: "Av. Ipanema", isAlert: false },
  { text: "Água baixou um pouco na Barão, mas ainda com risco", category: "enchentes", location: "Vila Barão", isAlert: false },
  { text: "Abrigo Campolim recebendo famílias, ainda tem espaço", category: "abrigos", location: "Parque Campolim", isAlert: false },
  { text: "🚨 Deslizamento reportado no Wanel Ville", category: "alertas", location: "Wanel Ville", isAlert: true },
];

const NAMES = [
  "Ana C.", "Carlos M.", "Fernanda S.", "João P.", "Mariana L.",
  "Pedro H.", "Juliana R.", "Roberto A.", "Camila F.", "Lucas D.",
  "Beatriz N.", "Thiago O.", "Patrícia G.", "Rafael T.", "Anônimo",
];

function timeAgo(date: Date): string {
  const s = Math.floor((Date.now() - date.getTime()) / 1000);
  if (s < 60) return "agora";
  const m = Math.floor(s / 60);
  if (m < 60) return `há ${m} min`;
  const h = Math.floor(m / 60);
  return `há ${h}h`;
}

let nextId = 1;
const mkId = () => `msg-${nextId++}`;

const Chat = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<Category>("todos");
  const [showLocation, setShowLocation] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const simIdx = useRef(0);

  // Seed initial messages
  useEffect(() => {
    const seed: ChatMessage[] = [];
    for (let i = 0; i < 6; i++) {
      const s = SIMULATED[i % SIMULATED.length];
      seed.push({
        id: mkId(),
        author: NAMES[Math.floor(Math.random() * NAMES.length)],
        text: s.text,
        time: new Date(Date.now() - (6 - i) * 120000),
        category: s.category,
        location: s.location,
        likes: Math.floor(Math.random() * 12),
        liked: false,
        isAlert: s.isAlert,
        isOwn: false,
      });
    }
    setMessages(seed);
    simIdx.current = 6;
  }, []);

  // Simulated incoming messages
  useEffect(() => {
    const interval = setInterval(() => {
      const s = SIMULATED[simIdx.current % SIMULATED.length];
      simIdx.current++;
      setMessages(prev => [
        ...prev,
        {
          id: mkId(),
          author: NAMES[Math.floor(Math.random() * NAMES.length)],
          text: s.text,
          time: new Date(),
          category: s.category,
          location: s.location,
          likes: 0,
          liked: false,
          isAlert: s.isAlert,
          isOwn: false,
        },
      ]);
    }, 8000 + Math.random() * 7000);
    return () => clearInterval(interval);
  }, []);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(() => {
    const text = input.trim();
    if (!text) return;
    const category: Category = text.match(/alag|enchente|água|rio/i)
      ? "enchentes"
      : text.match(/trânsito|parado|semáforo/i)
      ? "transito"
      : text.match(/abrigo|vaga/i)
      ? "abrigos"
      : text.match(/alert|perigo|cuidado|urgente/i)
      ? "alertas"
      : "todos";

    setMessages(prev => [
      ...prev,
      {
        id: mkId(),
        author: user?.name || "Você",
        text,
        time: new Date(),
        category,
        location: selectedLocation || undefined,
        likes: 0,
        liked: false,
        isAlert: false,
        isOwn: true,
      },
    ]);
    setInput("");
    setSelectedLocation("");
    setShowLocation(false);
  }, [input, user, selectedLocation]);

  const toggleLike = (id: string) => {
    setMessages(prev =>
      prev.map(m =>
        m.id === id
          ? { ...m, liked: !m.liked, likes: m.liked ? m.likes - 1 : m.likes + 1 }
          : m
      )
    );
  };

  const toggleAlert = (id: string) => {
    setMessages(prev =>
      prev.map(m => (m.id === id ? { ...m, isAlert: !m.isAlert } : m))
    );
  };

  const filtered = filter === "todos" ? messages : messages.filter(m => m.category === filter);

  const categoryColor = (c: Category) => {
    switch (c) {
      case "enchentes": return "bg-blue-500/20 text-blue-400";
      case "transito": return "bg-yellow-500/20 text-yellow-400";
      case "abrigos": return "bg-green-500/20 text-green-400";
      case "alertas": return "bg-red-500/20 text-red-400";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background mesh-gradient flex flex-col">
      {/* Header */}
      <header className="glass-strong border-b border-white/5 sticky top-0 z-50 shadow-xl">
        <div className="container mx-auto px-4 h-16 flex items-center gap-3">
          <Link to="/" className="p-2.5 rounded-xl hover:bg-white/5 transition-all active:scale-90 bg-white/5 border border-white/5">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Link>
          <div className="flex flex-col flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary shrink-0" />
              <h1 className="font-display font-bold text-foreground truncate text-lg">Chat da Cidade</h1>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Sorocaba • Ao Vivo</span>
            </div>
          </div>
          <div className="px-3 py-1.5 rounded-full bg-white/5 border border-white/10 flex items-center gap-2">
             <Users className="w-3.5 h-3.5 text-primary" />
             <span className="text-xs font-bold tabular-nums">{messages.length + 12}</span>
          </div>
        </div>

        {/* Filters */}
        <div className="container mx-auto px-4 pb-3 flex gap-2 overflow-x-auto scrollbar-hide no-scrollbar">
          {CATEGORIES.map(c => (
            <button
              key={c.value}
              onClick={() => setFilter(c.value)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all active:scale-95 border",
                filter === c.value
                  ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/20"
                  : "bg-white/5 text-muted-foreground hover:text-foreground border-white/5 hover:bg-white/10"
              )}
            >
              <span className="text-sm">{c.icon}</span> {c.label}
            </button>
          ))}
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-20 text-muted-foreground">
            <MessageCircle className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">Nenhuma mensagem neste filtro ainda.</p>
          </div>
        )}
        {filtered.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "max-w-[85%] md:max-w-[70%] animate-in fade-in slide-in-from-bottom-2 duration-300",
              msg.isOwn ? "ml-auto" : "mr-auto"
            )}
          >
            <div
              className={cn(
                "rounded-2xl px-4 py-3 relative transition-all shadow-sm border",
                msg.isOwn
                  ? "bg-primary text-primary-foreground rounded-br-none border-primary shadow-primary/10"
                  : msg.isAlert
                  ? "bg-destructive/10 border-destructive/20 rounded-bl-none"
                  : "bg-white/5 border-white/5 rounded-bl-none backdrop-blur-md"
              )}
            >
              {/* Author + time */}
              {!msg.isOwn && (
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-xs font-bold text-foreground/90">{msg.author}</span>
                  <span className={cn("text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider", categoryColor(msg.category))}>
                    {CATEGORIES.find(c => c.value === msg.category)?.label}
                  </span>
                  <span className="text-[10px] text-muted-foreground ml-auto tabular-nums">{timeAgo(msg.time)}</span>
                </div>
              )}

              {/* Alert badge */}
              {msg.isAlert && !msg.isOwn && (
                <div className="flex items-center gap-1.5 mb-2 px-2 py-1 rounded-lg bg-destructive/10 border border-destructive/20 w-fit">
                  <AlertTriangle className="w-3 h-3 text-destructive" />
                  <span className="text-[9px] font-black text-destructive uppercase tracking-widest">ALERTA CRÍTICO</span>
                </div>
              )}

              <p className={cn("text-sm leading-relaxed", msg.isOwn ? "text-primary-foreground font-medium" : "text-foreground/90")}>
                {msg.text}
              </p>

              {/* Location */}
              {msg.location && (
                <div className={cn("flex items-center gap-1.5 mt-2 pt-2 border-t", msg.isOwn ? "border-white/10 text-primary-foreground/70" : "border-white/5 text-muted-foreground")}>
                  <MapPin className="w-3 h-3" />
                  <span className="text-[10px] font-medium">{msg.location}</span>
                </div>
              )}

              {msg.isOwn && (
                <div className="text-[10px] text-primary-foreground/60 text-right mt-1.5 font-medium tabular-nums">{timeAgo(msg.time)}</div>
              )}
            </div>

            {/* Actions */}
            {!msg.isOwn && (
              <div className="flex items-center gap-3 mt-1 px-2">
                <button
                  onClick={() => toggleLike(msg.id)}
                  className={cn(
                    "flex items-center gap-1 text-[11px] transition-all active:scale-90",
                    msg.liked ? "text-primary font-semibold" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <ThumbsUp className={cn("w-3 h-3", msg.liked && "fill-primary")} />
                  {msg.likes > 0 && msg.likes}
                </button>
                <button
                  onClick={() => toggleAlert(msg.id)}
                  className={cn(
                    "flex items-center gap-1 text-[11px] transition-all active:scale-90",
                    msg.isAlert ? "text-destructive font-semibold" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <AlertTriangle className={cn("w-3 h-3", msg.isAlert && "fill-destructive/30")} /> Alerta
                </button>
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Location picker */}
      {showLocation && (
        <div className="border-t border-border bg-muted/30 px-4 py-2">
          <div className="flex flex-wrap gap-1.5">
            {LOCATIONS.map(loc => (
              <button
                key={loc}
                onClick={() => { setSelectedLocation(loc); setShowLocation(false); }}
                className={cn(
                  "px-2.5 py-1 rounded-full text-[11px] font-medium transition-all active:scale-95",
                  selectedLocation === loc
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted border border-border text-muted-foreground hover:text-foreground"
                )}
              >
                📍 {loc}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input bar */}
      <div className="sticky bottom-0 border-t border-border glass-strong px-4 py-3 safe-area-bottom">
        {selectedLocation && (
          <div className="flex items-center gap-1.5 mb-2 text-xs text-primary">
            <MapPin className="w-3 h-3" />
            <span>{selectedLocation}</span>
            <button onClick={() => setSelectedLocation("")} className="ml-1 text-muted-foreground hover:text-foreground">✕</button>
          </div>
        )}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowLocation(!showLocation)}
            className={cn(
              "p-2.5 rounded-xl transition-all active:scale-90",
              showLocation ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground hover:text-foreground border border-border"
            )}
          >
            <MapPin className="w-4 h-4" />
          </button>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSend()}
            placeholder="Compartilhe informações sobre a cidade..."
            className="flex-1 bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="p-2.5 rounded-xl bg-primary text-primary-foreground disabled:opacity-40 transition-all active:scale-90 hover:bg-primary/90"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
