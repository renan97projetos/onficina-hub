import { Plus, GripVertical, Pencil, Trash2 } from "lucide-react";

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
    <div className="mb-6 flex items-center justify-between">
      <h2 className="text-sm font-bold uppercase tracking-wide">Serviços</h2>
      <button className="flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:brightness-110">
        <Plus className="h-3.5 w-3.5" /> Novo
      </button>
    </div>

    <div className="space-y-1">
      {servicos.map((s) => (
        <div key={s.id} className={`flex items-center justify-between rounded-lg border border-white/10 px-4 py-3 ${!s.ativo ? "opacity-40" : ""}`}>
          <div className="flex items-center gap-3">
            <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
            <span className="text-xs text-muted-foreground w-6">{s.ordem}</span>
            <span className="text-sm font-medium">{s.nome}</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">{formatDuracao(s.duracao)}</span>
            <span className={`text-xs ${s.ativo ? "text-green-400" : "text-muted-foreground"}`}>
              {s.ativo ? "Ativo" : "Inativo"}
            </span>
            <div className="flex gap-1">
              <button className="rounded p-1 text-muted-foreground hover:text-foreground"><Pencil className="h-3.5 w-3.5" /></button>
              <button className="rounded p-1 text-muted-foreground hover:text-red-400"><Trash2 className="h-3.5 w-3.5" /></button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </>
);

export default DemoServicos;
