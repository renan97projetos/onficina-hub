import { BarChart3 } from "lucide-react";
import EmptyModuleState from "./EmptyModuleState";

const metricas = [
  { label: "Tempo médio", value: "—" },
  { label: "Taxa de aprovação", value: "—" },
  { label: "OS por colaborador", value: "—" },
  { label: "Retorno de clientes", value: "—" },
];

const DemoRelatorios = () => (
  <>
    <h2 className="mb-6 text-sm font-bold uppercase tracking-wide">Relatórios</h2>

    <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {metricas.map((metrica) => (
        <div key={metrica.label} className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">{metrica.label}</p>
          <p className="mt-1 text-lg font-bold text-foreground">{metrica.value}</p>
        </div>
      ))}
    </div>

    <EmptyModuleState
      icon={BarChart3}
      title="Sem dados para gerar relatórios"
      description="Assim que sua oficina começar a registrar orçamentos, atendimentos e pagamentos reais, os gráficos e indicadores vão aparecer aqui automaticamente."
      primaryAction="Ver métricas"
      secondaryAction="Configurar período"
      helperText="Os gráficos de exemplo foram removidos para deixar o painel limpo."
    />
  </>
);

export default DemoRelatorios;
