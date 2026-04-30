import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import Logo from "@/components/Logo";
import {
  FileText,
  Wrench,
  Users,
  UserRound,
  Calendar,
  Car,
  DollarSign,
  BarChart3,
  LogOut,
  RefreshCw,
  GraduationCap,
  Settings,
  LayoutGrid,
  TrendingUp,
  Bell,
  AlertTriangle,
  CalendarClock,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

type Notif = {
  id: string;
  tipo: "lembrete" | "os_atrasada";
  titulo: string;
  descricao: string;
  data: string; // ISO date
  refId: string; // cliente_id (lembrete) or os_id (os_atrasada)
};

const baseNavItems = [
  { icon: FileText, label: "Gestão de OS", key: "os" },
  { icon: UserRound, label: "Clientes", key: "clientes" },
  { icon: Wrench, label: "Serviços", key: "servicos" },
  { icon: Users, label: "Colaboradores", key: "colaboradores" },
  { icon: Calendar, label: "Agenda", key: "agenda" },
  { icon: Car, label: "Veículos", key: "veiculos" },
  { icon: DollarSign, label: "Financeiro", key: "financeiro" },
  { icon: BarChart3, label: "Relatórios", key: "relatorios" },
  { icon: Settings, label: "Configurações", key: "config" },
];

const PRO_ONLY_NAV = [
  { icon: TrendingUp, label: "Analytics", key: "analytics" },
];

const PRO_PLANS = ["pro", "trial"];

interface DemoLayoutProps {
  activeKey: string;
  onNavigate: (key: string, osId?: string) => void;
  children: React.ReactNode;
}

const DemoLayout = ({ activeKey, onNavigate, children }: DemoLayoutProps) => {
  const navigate = useNavigate();
  const { signOut, oficina, oficina_id, isDono } = useAuth();

  const isPro = !!oficina?.plano && PRO_PLANS.includes(oficina.plano);

  // Operadores não veem Configurações nem Financeiro
  const filteredBase = baseNavItems.filter((it) => {
    if (isDono) return true;
    return it.key !== "config" && it.key !== "financeiro";
  });

  // Sempre mostrar Pátio e Analytics; bloquear se não-Pro
  type NavItem = {
    icon: typeof FileText;
    label: string;
    key: string;
    proLocked?: boolean;
  };
  const navItems: NavItem[] = [
    filteredBase[0],
    { icon: LayoutGrid, label: "Pátio", key: "patio", proLocked: !isPro },
    ...filteredBase.slice(1),
    { icon: TrendingUp, label: "Analytics", key: "analytics", proLocked: !isPro },
  ];

  const handleNavClick = (item: NavItem) => {
    if (item.proLocked) {
      toast.info(`${item.label} está disponível no plano Pro`, {
        action: { label: "Fazer upgrade", onClick: () => navigate("/assinar") },
      });
      navigate("/assinar");
      return;
    }
    onNavigate(item.key);
  };


  // Badge: agendamentos pendentes
  const [pendentes, setPendentes] = useState(0);

  useEffect(() => {
    if (!oficina_id) return;
    let mounted = true;
    const fetchCount = async () => {
      const { count } = await supabase
        .from("agendamentos")
        .select("id", { count: "exact", head: true })
        .eq("oficina_id", oficina_id)
        .eq("confirmado", false);
      if (mounted) setPendentes(count || 0);
    };
    fetchCount();
    const ch = supabase
      .channel("agenda-badge")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "agendamentos", filter: `oficina_id=eq.${oficina_id}` },
        (payload) => {
          fetchCount();
          if (payload.eventType === "INSERT" && (payload.new as { origem?: string })?.origem === "cliente") {
            toast.info("Novo agendamento online recebido!");
          }
        },
      )
      .subscribe();
    return () => {
      mounted = false;
      supabase.removeChannel(ch);
    };
  }, [oficina_id]);

  // Notificações: lembretes vencendo + OS atrasadas
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifReadAt, setNotifReadAt] = useState<number>(() => {
    const v = typeof window !== "undefined" ? localStorage.getItem("notif_read_at") : null;
    return v ? Number(v) : 0;
  });
  const notifRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!oficina_id) return;
    let mounted = true;

    const fetchNotifs = async () => {
      const today = new Date();
      const todayIso = today.toISOString().slice(0, 10);
      const nowIso = today.toISOString();

      const [lembretesRes, osRes] = await Promise.all([
        supabase
          .from("crm_lembretes")
          .select("id, descricao, data_lembrete, cliente_id, clientes:cliente_id(nome)")
          .eq("oficina_id", oficina_id)
          .eq("concluido", false)
          .lte("data_lembrete", todayIso)
          .order("data_lembrete", { ascending: true }),
        supabase
          .from("ordens_servico")
          .select("id, prazo_estimado, stage, cliente_id, clientes:cliente_id(nome)")
          .eq("oficina_id", oficina_id)
          .lt("prazo_estimado", nowIso)
          .not("stage", "in", "(finalizado,recusado)")
          .order("prazo_estimado", { ascending: true }),
      ]);

      const list: Notif[] = [];
      (lembretesRes.data || []).forEach((l: any) => {
        list.push({
          id: `lemb-${l.id}`,
          tipo: "lembrete",
          titulo: l.clientes?.nome || "Cliente",
          descricao: l.descricao,
          data: l.data_lembrete,
          refId: l.cliente_id,
        });
      });
      (osRes.data || []).forEach((o: any) => {
        list.push({
          id: `os-${o.id}`,
          tipo: "os_atrasada",
          titulo: "OS atrasada",
          descricao: `OS de ${o.clientes?.nome || "cliente"} está atrasada`,
          data: o.prazo_estimado,
          refId: o.id,
        });
      });
      list.sort((a, b) => a.data.localeCompare(b.data));
      if (mounted) setNotifs(list);
    };

    fetchNotifs();
    const interval = setInterval(fetchNotifs, 60_000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [oficina_id]);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    if (!notifOpen) return;
    const onClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [notifOpen]);

  const unread = notifs.filter((n) => new Date(n.data).getTime() >= notifReadAt).length;

  const toggleNotifs = () => {
    setNotifOpen((o) => {
      const next = !o;
      if (next) {
        const ts = Date.now();
        setNotifReadAt(ts);
        localStorage.setItem("notif_read_at", String(ts));
      }
      return next;
    });
  };

  const handleNotifClick = (n: Notif) => {
    setNotifOpen(false);
    if (n.tipo === "lembrete") onNavigate("clientes", n.refId);
    else onNavigate("os", n.refId);
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="flex h-14 items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <span className="text-sm font-medium text-muted-foreground">Sistema ONficina</span>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              <RefreshCw className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <LogOut className="h-4 w-4" /> Sair
            </button>
          </div>
        </div>

        <nav className="flex items-center overflow-x-auto px-4 lg:px-6">
          <div className="flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => handleNavClick(item)}
                className={`relative flex shrink-0 items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors ${
                  activeKey === item.key
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                } ${item.proLocked ? "opacity-80" : ""}`}
                title={item.proLocked ? "Disponível no plano Pro — clique para fazer upgrade" : undefined}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
                {item.proLocked && (
                  <span className="ml-1 inline-flex items-center rounded-full bg-primary/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-primary">
                    Pro
                  </span>
                )}
                {item.key === "agenda" && pendentes > 0 && (
                  <span className="ml-1 inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-destructive px-1.5 text-[10px] font-bold text-destructive-foreground">
                    {pendentes}
                  </span>
                )}
              </button>
            ))}
          </div>

          <div className="ml-4 flex items-center gap-2 border-l border-border pl-4">
            <button
              type="button"
              onClick={() => onNavigate("treinamentos")}
              className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition-colors ${
                activeKey === "treinamentos"
                  ? "bg-primary text-primary-foreground"
                  : "bg-primary/15 text-primary hover:bg-primary/25"
              }`}
            >
              <GraduationCap className="h-4 w-4" />
              Treinamentos
            </button>
          </div>
        </nav>
      </header>

      <main className="p-4 lg:p-6">{children}</main>
    </div>
  );
};

export default DemoLayout;
