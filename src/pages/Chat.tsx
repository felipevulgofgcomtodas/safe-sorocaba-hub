import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Send, MapPin, AlertTriangle, MessageCircle, Filter } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import type { MensagemChat } from "@/integrations/supabase/types";

type Tipo = MensagemChat["tipo"] | "todos";

const TIPOS: { value: Tipo; label: string; icon: string }[] = [
  { value: "todos",      label: "Todos",      icon: "💬" },
  { value: "geral",      label: "Geral",      icon: "📢" },
  { value: "urgente",    label: "Urgente",    icon: "🚨" },
  { value: "voluntario", label: "Voluntários",icon: "🤝" },
  { value: "doacao",     label: "Doações",    icon: "💙" },
];

const LOCATIONS = [
  "Centro", "Av. Dom Aguirre", "Marginal do Rio Sorocaba",
  "Av. Afonso Vergueiro", "Vila Haro", "Jardim das Estrelas",
  "Parque Campolim", "Wanel Ville", "Vitória Régia",
];

const SEED_MSGS: MensagemChat[] = [
  { id: "s1", autor: "Defesa Civil",  texto: "Sistema SafeFlood ativo. Em caso de emergência ligue 199 (Defesa Civil) ou 193 (Bombeiros).", tipo: "urgente",    localizacao: null, data: new Date(Date.now() - 600000).toISOString() },
  { id: "s2", autor: "Ana C.",         texto: "Alguém sabe o horário de funcionamento do ponto de coleta da Paróquia Santo Antônio?",         tipo: "geral",      localizacao: "Vila Haro", data: new Date(Date.now() - 300000).toISOString() },
  { id: "s3", autor: "Pedro H.",       texto: "Precisam de voluntários para distribuição de kits na Comunidade Santa Bárbara sábado às 9h.", tipo: "voluntario", localizacao: "Jardim das Estrelas", data: new Date(Date.now() - 120000).toISOString() },
];

function timeAgo(iso: string): string {
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60)  return "agora";
  const m = Math.floor(s / 60);
  if (m < 60)  return `há ${m}min`;
  return `há ${Math.floor(m / 60)}h`;
}

function inferTipo(text: string): MensagemChat["tipo"] {
  if (/alaga|enchente|água|rio|perigo|urg/i.test(text)) return "urgente";
  if (/voluntár|ajud|equipe/i.test(text))                return "voluntario";
  if (/doa[çc]|kit|cesta/i.test(text))                  return "doacao";
  return "geral";
}

const tipoColors: Record<MensagemChat["tipo"], string> = {
  geral:      "bg-muted text-muted-foreground",
  urgente:    "bg-red-500/20 text-red-400",
  voluntario: "bg-green-500/20 text-green-400",
  doacao:     "bg-blue-500/20 text-blue-400",
};

const Chat = () => {
  const [messages, setMessages] = useState<MensagemChat[]>(SEED_MSGS);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<Tipo>("todos");
  const [showLocation, setShowLocation] = useState(false);
  const [location, setLocation] = useState("");
  const [autor, setAutor] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Load recent messages from Supabase
  useEffect(() => {
    supabase
      .from("mensagens_chat")
      .select("*")
      .order("data", { ascending: false })
      .limit(50)
      .then(({ data }) => {
        if (data?.length) {
          setMessages([...SEED_MSGS, ...data.reverse()]);
        }
      });
  }, []);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel("chat-room")
      .on<MensagemChat>(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "mensagens_chat" },
        payload => {
          setMessages(prev => [...prev, payload.new]);
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = useCallback(async () => {
    const text = input.trim();
    if (!text) return;
    setSending(true);
    const msg: Omit<MensagemChat, "id"> = {
      autor: autor.trim() || "Anônimo",
      texto: text,
      tipo: inferTipo(text),
      localizacao: location || null,
      data: new Date().toISOString(),
    };
    try {
      const { data, error } = await supabase.from("mensagens_chat").insert(msg).select().single();
      if (error || !data) {
        // Fallback: add locally
        setMessages(prev => [...prev, { ...msg, id: `local-${Date.now()}` }]);
      }
      // If success, Realtime will append it — but add locally too as Realtime may be delayed
      setMessages(prev => {
        if (data && !prev.find(m => m.id === data.id)) return [...prev, data];
        return prev;
      });
    } catch {
      setMessages(prev => [...prev, { ...msg, id: `local-${Date.now()}` }]);
    }
    setInput("");
    setLocation("");
    setShowLocation(false);
    setSending(false);
  }, [input, autor, location]);

  const filtered = filter === "todos" ? messages : messages.filter(m => m.tipo === filter);
  const unread = messages.filter(m => m.tipo === "urgente").length;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="glass-strong border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 h-14 flex items-center gap-3">
          <Link to="/" className="p-2 rounded-lg hover:bg-muted/50 transition-colors active:scale-95">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Link>
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <MessageCircle className="w-5 h-5 text-primary shrink-0" />
            <h1 className="font-display font-bold text-foreground truncate">Chat Comunitário</h1>
            <span className="text-xs text-muted-foreground hidden sm:inline">Sorocaba</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-safe animate-pulse" />
            <span className="text-xs text-muted-foreground tabular-nums">{messages.length}</span>
            {unread > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-danger/20 text-danger text-[9px] font-bold">{unread} urgentes</span>
            )}
          </div>
        </div>

        {/* Type filters */}
        <div className="container mx-auto px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide">
          {TIPOS.map(t => (
            <button key={t.value} onClick={() => setFilter(t.value)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all active:scale-95",
                filter === t.value
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted/50 text-muted-foreground hover:bg-muted border border-border"
              )}>
              <span>{t.icon}</span> {t.label}
              {t.value !== "todos" && (
                <span className="ml-0.5 opacity-70">
                  {messages.filter(m => m.tipo === t.value).length}
                </span>
              )}
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
        {filtered.map(msg => {
          const isOwn = msg.autor === (autor || "Anônimo") && msg.id.startsWith("local-");
          return (
            <div key={msg.id} className={cn("max-w-[85%] md:max-w-[70%]", isOwn ? "ml-auto" : "mr-auto")}>
              <div className={cn(
                "rounded-2xl px-4 py-3",
                isOwn
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : msg.tipo === "urgente"
                  ? "bg-destructive/15 border border-destructive/30 rounded-bl-md"
                  : "bg-muted/60 border border-border rounded-bl-md"
              )}>
                {!isOwn && (
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold text-foreground">{msg.autor}</span>
                    <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-semibold", tipoColors[msg.tipo])}>
                      {TIPOS.find(t => t.value === msg.tipo)?.icon}
                    </span>
                    <span className="text-[10px] text-muted-foreground ml-auto">{timeAgo(msg.data)}</span>
                  </div>
                )}
                {msg.tipo === "urgente" && !isOwn && (
                  <div className="flex items-center gap-1 mb-1.5">
                    <AlertTriangle className="w-3 h-3 text-destructive" />
                    <span className="text-[10px] font-bold text-destructive uppercase tracking-wide">Urgente</span>
                  </div>
                )}
                <p className={cn("text-sm leading-relaxed", isOwn ? "text-primary-foreground" : "text-foreground")}>
                  {msg.texto}
                </p>
                {msg.localizacao && (
                  <div className={cn("flex items-center gap-1 mt-1.5", isOwn ? "text-primary-foreground/70" : "text-muted-foreground")}>
                    <MapPin className="w-3 h-3" />
                    <span className="text-[10px]">{msg.localizacao}</span>
                  </div>
                )}
                {isOwn && (
                  <div className="text-[10px] text-primary-foreground/60 text-right mt-1">{timeAgo(msg.data)}</div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Location picker */}
      {showLocation && (
        <div className="border-t border-border bg-muted/30 px-4 py-2">
          <div className="flex flex-wrap gap-1.5">
            {LOCATIONS.map(loc => (
              <button key={loc} onClick={() => { setLocation(loc); setShowLocation(false); }}
                className={cn(
                  "px-2.5 py-1 rounded-full text-[11px] font-medium transition-all active:scale-95",
                  location === loc
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted border border-border text-muted-foreground hover:text-foreground"
                )}>
                📍 {loc}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input bar */}
      <div className="sticky bottom-0 border-t border-border glass-strong px-4 py-3">
        <div className="flex items-center gap-2 mb-2">
          <input
            type="text"
            value={autor}
            onChange={e => setAutor(e.target.value)}
            placeholder="Seu nome (opcional)"
            className="w-28 sm:w-36 px-3 py-1.5 rounded-xl border border-border bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
          />
          {location && (
            <div className="flex items-center gap-1 text-xs text-primary">
              <MapPin className="w-3 h-3" />
              <span>{location}</span>
              <button onClick={() => setLocation("")} className="ml-0.5 text-muted-foreground hover:text-foreground">✕</button>
            </div>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setShowLocation(!showLocation)}
            className={cn("p-2.5 rounded-xl transition-all active:scale-90",
              showLocation ? "bg-primary text-primary-foreground" : "bg-muted/50 text-muted-foreground hover:text-foreground border border-border")}>
            <MapPin className="w-4 h-4" />
          </button>
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSend()}
            placeholder="Compartilhe informações sobre Sorocaba..."
            className="flex-1 bg-muted/50 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
          <button onClick={handleSend} disabled={!input.trim() || sending}
            className="p-2.5 rounded-xl bg-primary text-primary-foreground disabled:opacity-40 transition-all active:scale-90 hover:bg-primary/90">
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-muted-foreground mt-1.5 text-center">
          Mensagens salvas em tempo real via Supabase Realtime
        </p>
      </div>
    </div>
  );
};

export default Chat;
