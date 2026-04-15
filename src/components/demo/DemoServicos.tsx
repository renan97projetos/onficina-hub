import { Plus, GripVertical, Pencil, Trash2, ToggleLeft, ToggleRight } from "lucide-react";

const servicos = [
  { id: 1, nome: "Funilaria", duracao: 480, ordem: 1, ativo: true },
  { id: 2, nome: "Preparação", duracao: 240, ordem: 2, ativo: true },
  { id: 3, nome: "Pintura", duracao: 360, ordem: 3, ativo: true },
  { id: 4, nome: "Polimento", duracao: 120, ordem: 4, ativo: true },
  { id: 5, nome: "Montagem", duracao: 180, ordem: 5, ativo: true },
  { id: 6, nome: "Lavagem", duracao: 60, ordem: 6, ativo: false },
];

const formatDuracao = (min: number) => {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h > 0 ? `${h}h${m > 0 ? ` ${m}min` : ""}` : `${m}min`;
};

const DemoServicos = () => (
  <>
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold">Serviços</h1>
        <p className="text-sm text-muted-foreground">Catálogo de serviços da oficina — defina a ordem de execução</p>
      </div>
      <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:brightness-110">
        <Plus className="h-4 w-4" /> Novo Serviço
      </button>
    </div>

    <div className="rounded-xl border border-white/10 bg-[#111] overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10 text-left">
            <th className="px-5 py-3 text-xs font-semibold uppercase text-muted-foreground w-10"></th>
            <th className="px-5 py-3 text-xs font-semibold uppercase text-muted-foreground">Ordem</th>
            <th className="px-5 py-3 text-xs font-semibold uppercase text-muted-foreground">Nome</th>
            <th className="px-5 py-3 text-xs font-semibold uppercase text-muted-foreground">Duração</th>
            <th className="px-5 py-3 text-xs font-semibold uppercase text-muted-foreground">Status</th>
            <th className="px-5 py-3 text-xs font-semibold uppercase text-muted-foreground">Ações</th>
          </tr>
        </thead>
        <tbody>
          {servicos.map((s) => (
            <tr key={s.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
              <td className="px-5 py-3">
                <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
              </td>
              <td className="px-5 py-3 text-sm font-semibold text-primary">{s.ordem}</td>
              <td className="px-5 py-3 text-sm font-medium">{s.nome}</td>
              <td className="px-5 py-3 text-sm text-muted-foreground">{formatDuracao(s.duracao)}</td>
              <td className="px-5 py-3">
                {s.ativo ? (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-green-400">
                    <ToggleRight className="h-4 w-4" /> Ativo
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <ToggleLeft className="h-4 w-4" /> Inativo
                  </span>
                )}
              </td>
              <td className="px-5 py-3">
                <div className="flex gap-2">
                  <button className="rounded-lg p-1.5 text-muted-foreground hover:bg-white/5 hover:text-foreground"><Pencil className="h-4 w-4" /></button>
                  <button className="rounded-lg p-1.5 text-muted-foreground hover:bg-white/5 hover:text-red-400"><Trash2 className="h-4 w-4" /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </>
);

export default DemoServicos;
