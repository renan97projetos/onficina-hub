import { BarChart3, TrendingUp, PieChart, Calendar } from "lucide-react";

const meses = ["Jan", "Fev", "Mar", "Abr"];
const faturamento = [32400, 38100, 41900, 47280];
const maxFat = Math.max(...faturamento);

const servicosTipo = [
  { tipo: "Funilaria + Pintura", pct: 45, cor: "bg-primary" },
  { tipo: "Pintura parcial", pct: 25, cor: "bg-amber-500" },
  { tipo: "Restauração completa", pct: 15, cor: "bg-blue-500" },
  { tipo: "Polimento", pct: 10, cor: "bg-green-500" },
  { tipo: "Outros", pct: 5, cor: "bg-white/20" },
];

const DemoRelatorios = () => (
  <>
    <div className="mb-6">
      <h1 className="text-2xl font-bold">Relatórios</h1>
      <p className="text-sm text-muted-foreground">Visão geral de performance</p>
    </div>

    <div className="grid gap-6 lg:grid-cols-2">
      {/* Faturamento chart */}
      <div className="rounded-xl border border-white/10 bg-[#111] p-6">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-semibold">Faturamento Mensal</h3>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="flex items-end gap-4 h-48">
          {meses.map((m, i) => (
            <div key={m} className="flex flex-1 flex-col items-center gap-2">
              <span className="text-xs font-semibold">R$ {(faturamento[i] / 1000).toFixed(1)}k</span>
              <div className="w-full rounded-t-lg bg-primary/80 transition-all" style={{ height: `${(faturamento[i] / maxFat) * 100}%` }} />
              <span className="text-xs text-muted-foreground">{m}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Serviços por tipo */}
      <div className="rounded-xl border border-white/10 bg-[#111] p-6">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-semibold">Serviços por Tipo</h3>
          <PieChart className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="space-y-4">
          {servicosTipo.map((s) => (
            <div key={s.tipo}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span>{s.tipo}</span>
                <span className="text-muted-foreground">{s.pct}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/5">
                <div className={`h-full rounded-full ${s.cor}`} style={{ width: `${s.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Métricas */}
      <div className="rounded-xl border border-white/10 bg-[#111] p-6">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-semibold">Métricas do Mês</h3>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Tempo médio de execução", value: "4.2 dias" },
            { label: "Taxa de aprovação", value: "87%" },
            { label: "OS por mecânico", value: "6.0" },
            { label: "Retorno de clientes", value: "34%" },
          ].map((m) => (
            <div key={m.label} className="rounded-lg border border-white/5 bg-white/[0.02] p-4">
              <p className="text-xs text-muted-foreground">{m.label}</p>
              <p className="mt-1 text-xl font-bold">{m.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Agenda */}
      <div className="rounded-xl border border-white/10 bg-[#111] p-6">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="font-semibold">Próximas Entregas</h3>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </div>
        <div className="space-y-3">
          {[
            { os: "OS-0141", car: "Polo 2023", date: "17/04", days: 2 },
            { os: "OS-0140", car: "Creta 2022", date: "18/04", days: 3 },
            { os: "OS-0142", car: "Kicks 2022", date: "19/04", days: 4 },
            { os: "OS-0139", car: "Tracker 2021", date: "20/04", days: 5 },
          ].map((e) => (
            <div key={e.os} className="flex items-center justify-between rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3">
              <div>
                <span className="text-sm font-semibold text-primary">{e.os}</span>
                <span className="ml-2 text-sm">{e.car}</span>
              </div>
              <div className="text-right">
                <p className="text-sm">{e.date}</p>
                <p className="text-xs text-muted-foreground">em {e.days} dias</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </>
);

export default DemoRelatorios;
