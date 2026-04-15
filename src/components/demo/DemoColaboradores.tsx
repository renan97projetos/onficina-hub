import { Plus, Pencil, Trash2, Phone, Mail, Wrench } from "lucide-react";

const colaboradores = [
  { nome: "João Silva", email: "joao@oficina.com", tel: "(11) 99123-4567", servicos: ["Funilaria", "Preparação"], ativo: true },
  { nome: "Pedro Souza", email: "pedro@oficina.com", tel: "(11) 98765-4321", servicos: ["Pintura", "Polimento"], ativo: true },
  { nome: "Rafael Lima", email: "rafael@oficina.com", tel: "(11) 97654-3210", servicos: ["Funilaria", "Montagem"], ativo: true },
  { nome: "Carlos Santos", email: "carlos@oficina.com", tel: "(11) 96543-2109", servicos: ["Preparação", "Pintura"], ativo: false },
];

const DemoColaboradores = () => (
  <>
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold">Colaboradores</h1>
        <p className="text-sm text-muted-foreground">{colaboradores.filter(c => c.ativo).length} ativos de {colaboradores.length} — Plano Pro: até 5 colaboradores</p>
      </div>
      <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:brightness-110">
        <Plus className="h-4 w-4" /> Novo Colaborador
      </button>
    </div>

    {/* Plan guard banner */}
    <div className="mb-6 rounded-xl border border-amber-500/20 bg-amber-500/5 px-5 py-3">
      <p className="text-sm text-amber-400">
        <strong>Plano Pro:</strong> você pode ter até 5 colaboradores ativos. Restam 2 vagas.
      </p>
    </div>

    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
      {colaboradores.map((c) => (
        <div key={c.email} className={`rounded-xl border bg-[#111] p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg ${c.ativo ? "border-white/10" : "border-white/5 opacity-60"}`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                {c.nome.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </div>
              <div>
                <h3 className="font-semibold">{c.nome}</h3>
                <span className={`text-xs font-medium ${c.ativo ? "text-green-400" : "text-muted-foreground"}`}>
                  {c.ativo ? "Ativo" : "Inativo"}
                </span>
              </div>
            </div>
            <div className="flex gap-1">
              <button className="rounded-lg p-1.5 text-muted-foreground hover:bg-white/5"><Pencil className="h-4 w-4" /></button>
              <button className="rounded-lg p-1.5 text-muted-foreground hover:bg-white/5 hover:text-red-400"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-3.5 w-3.5" /> {c.email}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-3.5 w-3.5" /> {c.tel}
            </div>
          </div>
          <div className="mt-4 border-t border-white/5 pt-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
              <Wrench className="h-3.5 w-3.5" /> Serviços vinculados:
            </div>
            <div className="flex flex-wrap gap-1.5">
              {c.servicos.map((s) => (
                <span key={s} className="rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5 text-xs">{s}</span>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  </>
);

export default DemoColaboradores;
