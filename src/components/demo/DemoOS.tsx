import { useState } from "react";
import { FileText } from "lucide-react";
import EmptyModuleState from "./EmptyModuleState";

const pipelineStages = [
  { key: "enviado", label: "Enviado" },
  { key: "orcado", label: "Orçado" },
  { key: "aprovado", label: "Aprovado" },
  { key: "aguardando", label: "Aguardando carro" },
  { key: "atendimento", label: "Em atendimento" },
  { key: "pagamento", label: "Pagamento" },
  { key: "finalizados", label: "Finalizados" },
  { key: "recusado", label: "Recusado" },
];

interface OS {
  stage: string;
}

const allOS: OS[] = [];

const DemoOS = () => {
  const [activeStage, setActiveStage] = useState("enviado");

  const counts = pipelineStages.map((stage) => ({
    ...stage,
    count: allOS.filter((os) => os.stage === stage.key).length,
  }));

  const filtered = allOS.filter((os) => os.stage === activeStage);
  const activeLabel = pipelineStages.find((stage) => stage.key === activeStage)?.label || "";

  return (
    <>
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        {counts.map((stage) => (
          <button
            key={stage.key}
            type="button"
            onClick={() => setActiveStage(stage.key)}
            className={`rounded-lg border p-3 text-center transition-colors ${
              activeStage === stage.key
                ? "border-primary bg-primary/5 text-primary"
                : "border-border bg-card text-muted-foreground hover:border-primary/30"
            }`}
          >
            <div className="text-xl font-bold">{stage.count}</div>
            <div className="text-xs">{stage.label}</div>
          </button>
        ))}
      </div>

      <h2 className="mb-4 text-sm font-bold uppercase tracking-wide">
        {activeLabel} ({filtered.length})
      </h2>

      <EmptyModuleState
        icon={FileText}
        title="Nenhum orçamento cadastrado"
        description="As solicitações reais da sua oficina vão aparecer aqui assim que você começar a cadastrar orçamentos e ordens de serviço."
        primaryAction="Novo orçamento"
        secondaryAction="Cadastrar cliente"
        helperText="Painel limpo: não há dados de exemplo carregados neste módulo."
      />
    </>
  );
};

export default DemoOS;
