import { Activity } from "lucide-react";
import EmptyModuleState from "./EmptyModuleState";

const DemoEmAtendimento = () => {
  return (
    <>
      <h2 className="mb-4 text-sm font-bold uppercase tracking-wide">Em Atendimento (0)</h2>

      <EmptyModuleState
        icon={Activity}
        title="Nenhuma OS em atendimento"
        description="Quando seus orçamentos forem aprovados e avançarem no fluxo da oficina, as etapas em execução vão aparecer aqui com progresso e responsáveis reais."
        primaryAction="Abrir ordem de serviço"
        secondaryAction="Definir fluxo da equipe"
      />
    </>
  );
};

export default DemoEmAtendimento;
