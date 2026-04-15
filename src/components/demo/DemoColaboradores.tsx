import { Plus, Users } from "lucide-react";
import EmptyModuleState from "./EmptyModuleState";

const DemoColaboradores = () => (
  <>
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wide">Colaboradores</h2>
        <p className="mt-1 text-xs text-muted-foreground">Cadastre sua equipe para distribuir os serviços reais da oficina.</p>
      </div>
      <button className="flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-all hover:brightness-110">
        <Plus className="h-3.5 w-3.5" /> Novo
      </button>
    </div>

    <EmptyModuleState
      icon={Users}
      title="Nenhum colaborador cadastrado"
      description="Adicione os membros da sua equipe para definir quem executa cada etapa do processo e organizar o atendimento sem usar nomes de exemplo."
      primaryAction="Adicionar colaborador"
      secondaryAction="Vincular serviços"
    />
  </>
);

export default DemoColaboradores;
