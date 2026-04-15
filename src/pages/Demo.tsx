import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import {
  LayoutDashboard,
  FileText,
  Users,
  Car,
  DollarSign,
  BarChart3,
  Settings,
  LogOut,
  Plus,
  Search,
  Bell,
  ChevronRight,
  Clock,
  CheckCircle2,
  AlertCircle,
  Wrench,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  MoreHorizontal,
  Eye,
} from "lucide-react";

/* ───── fake data ───── */
const kpis = [
  { label: "OS Abertas", value: "24", change: "+3 hoje", up: true, icon: FileText },
  { label: "Em Andamento", value: "18", change: "6 aguardando peça", up: true, icon: Wrench },
  { label: "Faturamento Mês", value: "R$ 47.280", change: "+12% vs mês ant.", up: true, icon: DollarSign },
  { label: "Ticket Médio", value: "R$ 1.970", change: "-2% vs mês ant.", up: false, icon: TrendingUp },
];

const pipeline = [
  {
    stage: "Orçamento",
    color: "bg-blue-500",
    items: [
      { id: "OS-0147", car: "Civic 2022", client: "Carlos M.", value: "R$ 3.200", days: 1 },
      { id: "OS-0148", car: "Corolla 2021", client: "Ana P.", value: "R$ 1.800", days: 0 },
      { id: "OS-0149", car: "HB20 2023", client: "João L.", value: "R$ 2.400", days: 2 },
    ],
  },
  {
    stage: "Aprovado",
    color: "bg-amber-500",
    items: [
      { id: "OS-0143", car: "Onix 2022", client: "Maria S.", value: "R$ 4.100", days: 3 },
      { id: "OS-0144", car: "T-Cross 2023", client: "Pedro R.", value: "R$ 5.600", days: 2 },
    ],
  },
  {
    stage: "Em Execução",
    color: "bg-orange-500",
    items: [
      { id: "OS-0139", car: "Tracker 2021", client: "Lucas F.", value: "R$ 6.200", days: 5 },
      { id: "OS-0140", car: "Creta 2022", client: "Fernanda C.", value: "R$ 3.800", days: 4 },
      { id: "OS-0141", car: "Polo 2023", client: "Ricardo A.", value: "R$ 2.900", days: 3 },
      { id: "OS-0142", car: "Kicks 2022", client: "Juliana M.", value: "R$ 4.500", days: 6 },
    ],
  },
  {
    stage: "Concluído",
    color: "bg-green-500",
    items: [
      { id: "OS-0135", car: "SW4 2020", client: "Bruno T.", value: "R$ 8.200", days: 0 },
      { id: "OS-0136", car: "Compass 2021", client: "Amanda G.", value: "R$ 5.100", days: 0 },
    ],
  },
];

const recentOS = [
  { id: "OS-0148", car: "Corolla 2021 Prata", client: "Ana Paula", status: "Orçamento", statusColor: "text-blue-600 bg-blue-50", value: "R$ 1.800", date: "15/04/2026" },
  { id: "OS-0147", car: "Civic 2022 Preto", client: "Carlos Mendes", status: "Orçamento", statusColor: "text-blue-600 bg-blue-50", value: "R$ 3.200", date: "15/04/2026" },
  { id: "OS-0143", car: "Onix 2022 Branco", client: "Maria Santos", status: "Aprovado", statusColor: "text-amber-600 bg-amber-50", value: "R$ 4.100", date: "14/04/2026" },
  { id: "OS-0142", car: "Kicks 2022 Cinza", client: "Juliana Martins", status: "Execução", statusColor: "text-orange-600 bg-orange-50", value: "R$ 4.500", date: "12/04/2026" },
  { id: "OS-0139", car: "Tracker 2021 Azul", client: "Lucas Ferreira", status: "Execução", statusColor: "text-orange-600 bg-orange-50", value: "R$ 6.200", date: "10/04/2026" },
  { id: "OS-0135", car: "SW4 2020 Preta", client: "Bruno Tavares", status: "Concluído", statusColor: "text-green-600 bg-green-50", value: "R$ 8.200", date: "09/04/2026" },
];

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: FileText, label: "Ordens de Serviço" },
  { icon: Car, label: "Veículos" },
  { icon: Users, label: "Clientes" },
  { icon: DollarSign, label: "Financeiro" },
  { icon: BarChart3, label: "Relatórios" },
  { icon: Settings, label: "Configurações" },
];

const Demo = () => {
  const navigate = useNavigate();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-muted/30">
      {/* Sidebar */}
      <aside className={`flex flex-col border-r border-border bg-card transition-all duration-300 ${sidebarCollapsed ? "w-16" : "w-60"}`}>
        <div className="flex h-16 items-center gap-2 border-b border-border px-4">
          {!sidebarCollapsed && <Logo size="sm" />}
          {sidebarCollapsed && <span className="mx-auto text-lg font-bold text-primary">ON</span>}
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                item.active
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {!sidebarCollapsed && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="border-t border-border p-3">
          {!sidebarCollapsed && (
            <div className="mb-3 rounded-lg bg-primary/5 p-3">
              <p className="text-xs font-semibold text-primary">Plano Profissional</p>
              <p className="text-xs text-muted-foreground">Trial — 12 dias restantes</p>
            </div>
          )}
          <button
            onClick={() => navigate("/")}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            {!sidebarCollapsed && <span>Sair do demo</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top bar */}
        <header className="flex h-16 items-center justify-between border-b border-border bg-card px-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarCollapsed(!sidebarCollapsed)} className="rounded-lg p-2 text-muted-foreground hover:bg-muted">
              <LayoutDashboard className="h-4 w-4" />
            </button>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                placeholder="Buscar OS, cliente, veículo..."
                className="h-9 w-72 rounded-lg border border-input bg-background pl-9 pr-4 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative rounded-lg p-2 text-muted-foreground hover:bg-muted">
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-primary" />
            </button>
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">
                DM
              </div>
              <div className="text-sm">
                <p className="font-medium">Demo Oficina</p>
                <p className="text-xs text-muted-foreground">Administrador</p>
              </div>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {/* Demo banner */}
          <div className="mb-6 flex items-center gap-3 rounded-xl border border-primary/20 bg-primary/5 px-5 py-3">
            <Eye className="h-5 w-5 text-primary shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-primary">Modo Demonstração</p>
              <p className="text-xs text-muted-foreground">Você está visualizando dados fictícios. Nenhuma alteração será salva.</p>
            </div>
            <Link to="/cadastro" className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
              Criar minha conta
            </Link>
          </div>

          {/* KPIs */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {kpis.map((kpi) => (
              <div key={kpi.label} className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{kpi.label}</p>
                  <kpi.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <p className="mt-2 text-2xl font-bold">{kpi.value}</p>
                <div className="mt-1 flex items-center gap-1">
                  {kpi.up ? (
                    <ArrowUpRight className="h-3 w-3 text-green-600" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-red-500" />
                  )}
                  <span className={`text-xs ${kpi.up ? "text-green-600" : "text-red-500"}`}>{kpi.change}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Pipeline Kanban */}
          <div className="mb-8">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold">Pipeline de Serviços</h2>
              <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90">
                <Plus className="h-4 w-4" />
                Nova OS
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
              {pipeline.map((col) => (
                <div key={col.stage} className="rounded-xl border border-border bg-card">
                  <div className="flex items-center gap-2 border-b border-border px-4 py-3">
                    <div className={`h-2.5 w-2.5 rounded-full ${col.color}`} />
                    <span className="text-sm font-semibold">{col.stage}</span>
                    <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                      {col.items.length}
                    </span>
                  </div>
                  <div className="space-y-2 p-3">
                    {col.items.map((item) => (
                      <div
                        key={item.id}
                        className="cursor-pointer rounded-lg border border-border bg-background p-3 transition-shadow hover:shadow-md"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-primary">{item.id}</span>
                          <MoreHorizontal className="h-3 w-3 text-muted-foreground" />
                        </div>
                        <p className="mt-1 text-sm font-medium">{item.car}</p>
                        <p className="text-xs text-muted-foreground">{item.client}</p>
                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-xs font-semibold">{item.value}</span>
                          {item.days > 0 && (
                            <span className="flex items-center gap-1 text-xs text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {item.days}d
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent OS table */}
          <div className="rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="text-lg font-bold">Ordens de Serviço Recentes</h2>
              <button className="text-sm font-medium text-primary hover:underline">Ver todas</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="px-5 py-3 text-xs font-semibold uppercase text-muted-foreground">OS</th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase text-muted-foreground">Veículo</th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase text-muted-foreground">Cliente</th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase text-muted-foreground">Status</th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase text-muted-foreground">Valor</th>
                    <th className="px-5 py-3 text-xs font-semibold uppercase text-muted-foreground">Data</th>
                    <th className="px-5 py-3"></th>
                  </tr>
                </thead>
                <tbody>
                  {recentOS.map((os) => (
                    <tr key={os.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="px-5 py-3 text-sm font-semibold text-primary">{os.id}</td>
                      <td className="px-5 py-3 text-sm">{os.car}</td>
                      <td className="px-5 py-3 text-sm">{os.client}</td>
                      <td className="px-5 py-3">
                        <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${os.statusColor}`}>
                          {os.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-sm font-medium">{os.value}</td>
                      <td className="px-5 py-3 text-sm text-muted-foreground">{os.date}</td>
                      <td className="px-5 py-3">
                        <button className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted">
                          <ChevronRight className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Demo;
