import { Car, MoreHorizontal, Search } from "lucide-react";
import EmptyModuleState from "./EmptyModuleState";

const DemoVeiculos = () => (
  <>
    <div className="mb-6 flex items-center justify-between">
      <h2 className="text-sm font-bold uppercase tracking-wide">Veículos</h2>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <input
          placeholder="Buscar placa, modelo..."
          className="h-8 w-48 rounded-lg border border-border bg-background pl-8 pr-3 text-xs outline-none transition-colors focus:border-primary placeholder:text-muted-foreground"
        />
      </div>
    </div>

    <EmptyModuleState
      icon={Car}
      title="Nenhum veículo cadastrado"
      description="Os veículos atendidos pela sua oficina vão aparecer aqui com placa, modelo e histórico real assim que você começar os cadastros."
      primaryAction="Cadastrar veículo"
      secondaryAction="Buscar cliente"
      helperText="Sem registros fictícios: a lista está vazia até você inserir seus dados."
    />

    <div className="mt-4 flex justify-end">
      <button type="button" className="rounded p-1 text-muted-foreground transition-colors hover:text-foreground">
        <MoreHorizontal className="h-3.5 w-3.5" />
      </button>
    </div>
  </>
);

export default DemoVeiculos;
