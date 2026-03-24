import { useState, useEffect } from "react";
import { Bell, X, AlertTriangle, Users, Package, Droplets } from "lucide-react";

interface Notification {
  id: number;
  type: "alert" | "shelter" | "donation" | "rain";
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const initialNotifications: Notification[] = [
  { id: 1, type: "alert", title: "Alerta de Enchente", message: "Nível do Rio Sorocaba subiu 40cm na última hora", time: "2 min", read: false },
  { id: 2, type: "shelter", title: "Abrigo Lotando", message: "CIC Sorocaba atingiu 96% da capacidade", time: "5 min", read: false },
  { id: 3, type: "donation", title: "Doação Urgente", message: "Parque Chico Mendes precisa de colchões", time: "12 min", read: false },
  { id: 4, type: "rain", title: "Previsão de Chuva", message: "Chuva forte prevista para as próximas 3 horas", time: "18 min", read: true },
  { id: 5, type: "shelter", title: "Novo Abrigo Aberto", message: "Centro Comunitário Vila Haro agora recebe famílias", time: "25 min", read: true },
];

const iconMap = {
  alert: AlertTriangle,
  shelter: Users,
  donation: Package,
  rain: Droplets,
};

const colorMap = {
  alert: "text-danger bg-danger/15",
  shelter: "text-warning bg-warning/15",
  donation: "text-primary bg-primary/15",
  rain: "text-safe bg-safe/15",
};

const NotificationSystem = () => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState(initialNotifications);
  const [newCount, setNewCount] = useState(0);

  const unread = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const interval = setInterval(() => {
      const types: Notification["type"][] = ["alert", "shelter", "donation", "rain"];
      const messages = [
        { type: "alert" as const, title: "Nível Crítico", message: "Av. Dom Aguirre com alagamento reportado" },
        { type: "shelter" as const, title: "Vagas Disponíveis", message: "UNISO liberou mais 50 vagas" },
        { type: "donation" as const, title: "Necessidade Urgente", message: "FACENS precisa de água potável" },
        { type: "rain" as const, title: "Atualização Climática", message: "Volume de chuva aumentou 15mm/h" },
      ];
      const msg = messages[Math.floor(Math.random() * messages.length)];
      setNotifications(prev => [{
        id: Date.now(),
        ...msg,
        time: "agora",
        read: false,
      }, ...prev.slice(0, 9)]);
      setNewCount(c => c + 1);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setNewCount(0);
  };

  return (
    <div className="relative">
      <button
        onClick={() => { setOpen(!open); if (!open) setNewCount(0); }}
        className="relative p-2 rounded-xl bg-muted/50 border border-border hover:bg-muted transition-colors active:scale-[0.96]"
      >
        <Bell className="w-4 h-4 text-foreground" />
        {(unread > 0 || newCount > 0) && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-danger text-[9px] font-bold text-danger-foreground flex items-center justify-center animate-in zoom-in">
            {unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-12 w-80 md:w-96 bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h3 className="font-display font-bold text-foreground text-sm">Notificações</h3>
              <div className="flex items-center gap-2">
                {unread > 0 && (
                  <button onClick={markAllRead} className="text-[10px] text-primary hover:underline">
                    Marcar todas como lidas
                  </button>
                )}
                <button onClick={() => setOpen(false)} className="p-1 hover:bg-muted rounded-lg transition-colors">
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.map(n => {
                const Icon = iconMap[n.type];
                return (
                  <div key={n.id} className={`px-4 py-3 border-b border-border/50 flex gap-3 transition-colors ${!n.read ? 'bg-primary/5' : 'hover:bg-muted/30'}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${colorMap[n.type]}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-semibold text-foreground truncate">{n.title}</p>
                        <span className="text-[10px] text-muted-foreground flex-shrink-0">{n.time}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{n.message}</p>
                    </div>
                    {!n.read && <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-2" />}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NotificationSystem;
