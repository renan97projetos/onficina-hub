import { Plus, Wrench } from "lucide-react";
import EmptyModuleState from "./EmptyModuleState";

const DemoServicos = () => (
  <>
    <div className="mb-6 flex items-center justify-between">
      <h2 className="text-sm font-bold uppercase tracking-wide">Serviços</h2>
      <button className="flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-all hover:brightness-110">
        <Plus className="h-3.5 w-3.5" /> Novo
      </button>
    </div>

    <EmptyModuleState
      icon={Wrench}
      title="Nenhum serviço cadastrado"
      description="Cadastre os serviços reais da sua oficina para montar o fluxo de execução, o atendimento e os orçamentos com sua própria base."
      primaryAction="Adicionar serviço"
      secondaryAction="Definir ordem de execução"
    />
  </>
);

export default DemoServicos;
