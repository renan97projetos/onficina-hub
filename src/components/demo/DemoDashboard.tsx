import {
  FileText, Wrench, DollarSign, TrendingUp, Plus, Clock,
  ArrowUpRight, ArrowDownRight, MoreHorizontal, ChevronRight,
} from "lucide-react";

const kpis = [
  { label: "OS Abertas", value: "24", change: "+3 hoje", up: true, icon: FileText },
  { label: "Em Andamento", value: "18", change: "6 aguardando peça", up: true, icon: Wrench },
  { label: "Faturamento Mês", value: "R$ 47.280", change: "+12% vs mês ant.", up: true, icon: DollarSign },
  { label: "Ticket Médio", value: "R$ 1.970", change: "-2% vs mês ant.", up: false, icon: TrendingUp },
];

const pipeline = [
  {
    stage: "Orçamento", color: "bg-blue-500",
    items: [
      { id: "OS-0147", car: "Civic 2022", client: "Carlos M.", value: "R$ 3.200", days: 1 },
      { id: "OS-0148", car: "Corolla 2021", client: "Ana P.", value: "R$ 1.800", days: 0 },
      { id: "OS-0149", car: "HB20 2023", client: "João L.", value: "R$ 2.400", days: 2 },
    ],
  },
  {
    stage: "Aprovado", color: "bg-amber-500",
    items: [
      { id: "OS-0143", car: "Onix 2022", client: "Maria S.", value: "R$ 4.100", days: 3 },
      { id: "OS-0144", car: "T-Cross 2023", client: "Pedro R.", value: "R$ 5.600", days: 2 },
    ],
  },
  {
    stage: "Em Execução", color: "bg-orange-500",
    items: [
      { id: "OS-0139", car: "Tracker 2021", client: "Lucas F.", value: "R$ 6.200", days: 5 },
      { id: "OS-0140", car: "Creta 2022", client: "Fernanda C.", value: "R$ 3.800", days: 4 },
      { id: "OS-0141", car: "Polo 2023", client: "Ricardo A.", value: "R$ 2.900", days: 3 },
      { id: "OS-0142", car: "Kicks 2022", client: "Juliana M.", value: "R$ 4.500", days: 6 },
    ],
  },
  {
    stage: "Concluído", color: "bg-green-500",
    items: [
      { id: "OS-0135", car: "SW4 2020", client: "Bruno T.", value: "R$ 8.200", days: 0 },
      { id: "OS-0136", car: "Compass 2021", client: "Amanda G.", value: "R$ 5.100", days: 0 },
    ],
  },
];

const recentOS = [
  { id: "OS-0148", car: "Corolla 2021 Prata", client: "Ana Paula", status: "Orçamento", color: "text-blue-400 bg-blue-400/10", value: "R$ 1.800", date: "15/04/2026" },
  { id: "OS-0147", car: "Civic 2022 Preto", client: "Carlos Mendes", status: "Orçamento", color: "text-blue-400 bg-blue-400/10", value: "R$ 3.200", date: "15/04/2026" },
  { id: "OS-0143", car: "Onix 2022 Branco", client: "Maria Santos", status: "Aprovado", color: "text-amber-400 bg-amber-400/10", value: "R$ 4.100", date: "14/04/2026" },
  { id: "OS-0142", car: "Kicks 2022 Cinza", client: "Juliana Martins", status: "Execução", color: "text-orange-400 bg-orange-400/10", value: "R$ 4.500", date: "12/04/2026" },
  { id: "OS-0139", car: "Tracker 2021 Azul", client: "Lucas Ferreira", status: "Execução", color: "text-orange-400 bg-orange-400/10", value: "R$ 6.200", date: "10/04/2026" },
  { id: "OS-0135", car: "SW4 2020 Preta", client: "Bruno Tavares", status: "Concluído", color: "text-green-400 bg-green-400/10", value: "R$ 8.200", date: "09/04/2026" },
];

const DemoDashboard = () => (
  <>
    {/* KPIs */}
    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi) => (
        <div key={kpi.label} className="rounded-xl border border-white/10 bg-[#111] p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{kpi.label}</p>
            <kpi.icon className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="mt-2 text-2xl font-bold">{kpi.value}</p>
          <div className="mt-1 flex items-center gap-1">
            {kpi.up ? <ArrowUpRight className="h-3 w-3 text-green-400" /> : <ArrowDownRight className="h-3 w-3 text-red-400" />}
            <span className={`text-xs ${kpi.up ? "text-green-400" : "text-red-400"}`}>{kpi.change}</span>
          </div>
        </div>
      ))}
    </div>

    {/* Pipeline */}
    <div className="mb-8">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">Pipeline de Serviços</h2>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:brightness-110">
          <Plus className="h-4 w-4" /> Nova OS
        </button>
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        {pipeline.map((col) => (
          <div key={col.stage} className="rounded-xl border border-white/10 bg-[#111]">
            <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
              <div className={`h-2.5 w-2.5 rounded-full ${col.color}`} />
              <span className="text-sm font-semibold">{col.stage}</span>
              <span className="ml-auto rounded-full bg-white/5 px-2 py-0.5 text-xs font-medium text-muted-foreground">{col.items.length}</span>
            </div>
            <div className="space-y-2 p-3">
              {col.items.map((item) => (
                <div key={item.id} className="cursor-pointer rounded-lg border border-white/10 bg-background p-3 transition-all hover:-translate-y-0.5 hover:shadow-lg">
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
                        <Clock className="h-3 w-3" />{item.days}d
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

    {/* Recent OS */}
    <div className="rounded-xl border border-white/10 bg-[#111]">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
        <h2 className="text-lg font-bold">Ordens de Serviço Recentes</h2>
        <button className="text-sm font-medium text-primary hover:underline">Ver todas</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10 text-left">
              {["OS", "Veículo", "Cliente", "Status", "Valor", "Data", ""].map((h) => (
                <th key={h} className="px-5 py-3 text-xs font-semibold uppercase text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentOS.map((os) => (
              <tr key={os.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-3 text-sm font-semibold text-primary">{os.id}</td>
                <td className="px-5 py-3 text-sm">{os.car}</td>
                <td className="px-5 py-3 text-sm">{os.client}</td>
                <td className="px-5 py-3">
                  <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${os.color}`}>{os.status}</span>
                </td>
                <td className="px-5 py-3 text-sm font-medium">{os.value}</td>
                <td className="px-5 py-3 text-sm text-muted-foreground">{os.date}</td>
                <td className="px-5 py-3">
                  <button className="rounded-lg p-1.5 text-muted-foreground hover:bg-white/5"><ChevronRight className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </>
);

export default DemoDashboard;
