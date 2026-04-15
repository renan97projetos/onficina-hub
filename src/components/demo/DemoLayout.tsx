import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import {
  LayoutDashboard, FileText, Wrench, Users, Calendar, Car, UserCheck,
  Activity, DollarSign, BarChart3, Settings, LogOut, Search, Bell, Eye, Menu,
} from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", key: "dashboard" },
  { icon: FileText, label: "Orçamentos", key: "os" },
  { icon: Wrench, label: "Serviços", key: "servicos" },
  { icon: Users, label: "Colaboradores", key: "colaboradores" },
  { icon: Calendar, label: "Agenda", key: "agenda" },
  { icon: Car, label: "Veículos", key: "veiculos" },
  { icon: UserCheck, label: "Clientes", key: "clientes" },
  { icon: Activity, label: "Em Atendimento", key: "atendimento" },
  { icon: DollarSign, label: "Financeiro", key: "financeiro" },
  { icon: BarChart3, label: "Relatórios", key: "relatorios" },
  { icon: Settings, label: "Configurações", key: "config" },
];

interface DemoLayoutProps {
  activeKey: string;
  onNavigate: (key: string) => void;
  children: React.ReactNode;
}

const DemoLayout = ({ activeKey, onNavigate, children }: DemoLayoutProps) => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className={`hidden md:flex flex-col border-r border-white/10 bg-[#111] transition-all duration-300 ${collapsed ? "w-16" : "w-60"}`}>
        <div className="flex h-16 items-center gap-2 border-b border-white/10 px-4">
          {!collapsed && <Logo size="sm" />}
          {collapsed && <span className="mx-auto text-lg font-bold text-primary">ON</span>}
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                activeKey === item.key
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
              }`}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="border-t border-white/10 p-3">
          {!collapsed && (
            <div className="mb-3 rounded-lg bg-primary/5 border border-primary/20 p-3">
              <p className="text-xs font-semibold text-primary">Plano Pro</p>
              <p className="text-xs text-muted-foreground">Trial — 12 dias restantes</p>
            </div>
          )}
          <button
            onClick={() => navigate("/")}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!collapsed && <span>Sair do demo</span>}
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 items-center justify-between border-b border-white/10 bg-[#111] px-4 md:px-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setCollapsed(!collapsed)} className="hidden md:block rounded-lg p-2 text-muted-foreground hover:bg-white/5">
              <Menu className="h-4 w-4" />
            </button>
            {/* Mobile nav */}
            <div className="flex md:hidden items-center gap-1 overflow-x-auto">
              {navItems.slice(0, 6).map((item) => (
                <button
                  key={item.key}
                  onClick={() => onNavigate(item.key)}
                  className={`shrink-0 rounded-lg p-2 ${activeKey === item.key ? "bg-primary/10 text-primary" : "text-muted-foreground"}`}
                >
                  <item.icon className="h-4 w-4" />
                </button>
              ))}
            </div>
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                placeholder="Buscar OS, cliente, veículo..."
                className="h-9 w-72 rounded-lg border border-white/10 bg-white/5 pl-9 pr-4 text-sm text-foreground outline-none focus:border-primary placeholder:text-muted-foreground"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="relative rounded-lg p-2 text-muted-foreground hover:bg-white/5">
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
            </button>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">DM</div>
              <div className="hidden sm:block text-sm">
                <p className="font-medium">Demo Oficina</p>
                <p className="text-xs text-muted-foreground">admin@demo.com</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 px-5 py-3">
            <Eye className="h-5 w-5 text-primary shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-primary">Modo Demonstração</p>
              <p className="text-xs text-muted-foreground">Dados fictícios. Nenhuma alteração será salva.</p>
            </div>
            <Link to="/cadastro" className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:brightness-110">
              Criar minha conta
            </Link>
          </div>
          {children}
        </main>
      </div>
    </div>
  );
};

export default DemoLayout;
