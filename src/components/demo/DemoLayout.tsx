import { Link, useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import {
  FileText, Wrench, Users, Calendar, Car,
  Activity, DollarSign, BarChart3, LogOut, Eye, RefreshCw,
} from "lucide-react";

const navItems = [
  { icon: FileText, label: "Orçamentos", key: "os" },
  { icon: Wrench, label: "Serviços", key: "servicos" },
  { icon: Users, label: "Colaboradores", key: "colaboradores" },
  { icon: Calendar, label: "Agenda", key: "agenda" },
  { icon: Car, label: "Veículos", key: "veiculos" },
  { icon: Activity, label: "Em Atendimento", key: "atendimento" },
  { icon: DollarSign, label: "Financeiro", key: "financeiro" },
  { icon: BarChart3, label: "Relatórios", key: "relatorios" },
];

interface DemoLayoutProps {
  activeKey: string;
  onNavigate: (key: string) => void;
  children: React.ReactNode;
}

const DemoLayout = ({ activeKey, onNavigate, children }: DemoLayoutProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Top header */}
      <header className="border-b border-white/10 bg-[#111]">
        <div className="flex h-14 items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-3">
            <Logo size="sm" />
            <span className="text-sm font-medium text-muted-foreground">Painel Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="rounded-lg p-2 text-muted-foreground hover:bg-white/5">
              <RefreshCw className="h-4 w-4" />
            </button>
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 rounded-lg border border-white/10 px-3 py-1.5 text-sm text-muted-foreground hover:bg-white/5"
            >
              <LogOut className="h-4 w-4" /> Sair
            </button>
          </div>
        </div>

        {/* Navigation tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto px-4 lg:px-6">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={`flex shrink-0 items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-medium transition-colors ${
                activeKey === item.key
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>
      </header>

      {/* Demo banner */}
      <div className="border-b border-primary/20 bg-primary/5 px-4 py-2 lg:px-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-primary" />
            <span className="text-xs text-muted-foreground">Modo demonstração — dados fictícios</span>
          </div>
          <Link to="/cadastro" className="rounded-lg bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground hover:brightness-110">
            Criar minha conta
          </Link>
        </div>
      </div>

      {/* Content */}
      <main className="p-4 lg:p-6">
        {children}
      </main>
    </div>
  );
};

export default DemoLayout;
