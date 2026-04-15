import { Plus, Pencil, Trash2 } from "lucide-react";

const colaboradores = [
  { nome: "João Silva", email: "joao@oficina.com", tel: "(11) 99123-4567", servicos: ["Funilaria", "Preparação"], ativo: true },
  { nome: "Pedro Souza", email: "pedro@oficina.com", tel: "(11) 98765-4321", servicos: ["Pintura", "Polimento"], ativo: true },
  { nome: "Rafael Lima", email: "rafael@oficina.com", tel: "(11) 97654-3210", servicos: ["Funilaria", "Montagem"], ativo: true },
];

const DemoColaboradores = () => (
  <>
    <div className="mb-6 flex items-center justify-between">
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wide">Colaboradores</h2>
        <p className="text-xs text-muted-foreground mt-1">Plano Pro — {colaboradores.length}/5 vagas usadas</p>
      </div>
      <button className="flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:brightness-110">
        <Plus className="h-3.5 w-3.5" /> Novo
      </button>
    </div>

    <div className="space-y-1">
      {colaboradores.map((c) => (
        <div key={c.email} className="flex items-center justify-between rounded-lg border border-white/10 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center text-xs font-semibold text-muted-foreground">
              {c.nome.split(" ").map(n => n[0]).join("")}
            </div>
            <div>
              <p className="text-sm font-medium">{c.nome}</p>
              <p className="text-xs text-muted-foreground">{c.servicos.join(", ")}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground hidden sm:block">{c.tel}</span>
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

export default DemoColaboradores;
