import { DollarSign, Wallet } from "lucide-react";
import EmptyModuleState from "./EmptyModuleState";

const metricas = [
  { label: "Faturamento", value: "R$ 0,00" },
  { label: "Ticket médio", value: "R$ 0,00" },
  { label: "A receber", value: "R$ 0,00" },
  { label: "OS finalizadas", value: "0" },
];

const DemoFinanceiro = () => {
  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-bold uppercase tracking-wide">Financeiro</h2>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted">
            <Wallet className="h-3.5 w-3.5" />
            Caixa fechado
          </button>
          <select className="h-8 rounded-lg border border-border bg-background px-3 text-xs outline-none focus:border-primary">
            <option>Mês atual</option>
          </select>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {metricas.map((metrica) => (
          <div key={metrica.label} className="rounded-lg border border-border bg-card p-3">
            <p className="text-xs text-muted-foreground">{metrica.label}</p>
            <p className="mt-1 text-lg font-bold text-foreground">{metrica.value}</p>
          </div>
        ))}
      </div>

      <EmptyModuleState
        icon={DollarSign}
        title="Nenhum lançamento financeiro"
        description="Os recebimentos, recibos, pagamentos parciais, movimentações de caixa e operações do PDV vão aparecer aqui conforme você registrar dados reais no sistema."
        primaryAction="Abrir PDV"
        secondaryAction="Registrar recebimento"
        helperText="Os totais estão zerados porque removi todos os dados fictícios deste módulo."
      />
    </>
  );
};

export default DemoFinanceiro;
