const meses = ["Jan", "Fev", "Mar", "Abr"];
const faturamento = [32400, 38100, 41900, 47280];
const maxFat = Math.max(...faturamento);

const servicosTipo = [
  { tipo: "Funilaria + Pintura", pct: 45 },
  { tipo: "Pintura parcial", pct: 25 },
  { tipo: "Restauração completa", pct: 15 },
  { tipo: "Polimento", pct: 10 },
  { tipo: "Outros", pct: 5 },
];

const DemoRelatorios = () => (
  <>
    <h2 className="mb-6 text-sm font-bold uppercase tracking-wide">Relatórios</h2>

    <div className="grid gap-6 lg:grid-cols-2">
      {/* Revenue chart */}
      <div className="rounded-lg border border-white/10 p-5">
        <h3 className="mb-4 text-sm font-medium text-muted-foreground">Faturamento mensal</h3>
        <div className="flex items-end gap-4 h-40">
          {meses.map((m, i) => (
            <div key={m} className="flex flex-1 flex-col items-center gap-2">
              <span className="text-xs text-muted-foreground">R$ {(faturamento[i] / 1000).toFixed(0)}k</span>
              <div className="w-full rounded-t bg-primary/60" style={{ height: `${(faturamento[i] / maxFat) * 100}%` }} />
              <span className="text-xs text-muted-foreground">{m}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Services breakdown */}
      <div className="rounded-lg border border-white/10 p-5">
        <h3 className="mb-4 text-sm font-medium text-muted-foreground">Serviços por tipo</h3>
        <div className="space-y-3">
          {servicosTipo.map((s) => (
            <div key={s.tipo}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span>{s.tipo}</span>
                <span className="text-muted-foreground">{s.pct}%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-white/5">
                <div className="h-full rounded-full bg-primary/50" style={{ width: `${s.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Key metrics */}
      <div className="rounded-lg border border-white/10 p-5">
        <h3 className="mb-4 text-sm font-medium text-muted-foreground">Métricas do mês</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Tempo médio", value: "4.2 dias" },
            { label: "Taxa aprovação", value: "87%" },
            { label: "OS por colaborador", value: "6.0" },
            { label: "Retorno clientes", value: "34%" },
          ].map((m) => (
            <div key={m.label} className="border border-white/5 rounded-lg p-3">
              <p className="text-xs text-muted-foreground">{m.label}</p>
              <p className="mt-1 text-lg font-bold">{m.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming deliveries */}
      <div className="rounded-lg border border-white/10 p-5">
        <h3 className="mb-4 text-sm font-medium text-muted-foreground">Próximas entregas</h3>
        <div className="space-y-2">
          {[
            { os: "OS-0141", car: "Polo 2023", date: "17/04" },
            { os: "OS-0140", car: "Creta 2022", date: "18/04" },
            { os: "OS-0142", car: "Kicks 2022", date: "19/04" },
            { os: "OS-0139", car: "Tracker 2021", date: "20/04" },
          ].map((e) => (
            <div key={e.os} className="flex items-center justify-between py-1.5">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-primary">{e.os}</span>
                <span className="text-sm">{e.car}</span>
              </div>
              <span className="text-sm text-muted-foreground">{e.date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </>
);

export default DemoRelatorios;
