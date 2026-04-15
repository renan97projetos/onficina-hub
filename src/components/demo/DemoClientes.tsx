import { Search, MoreHorizontal } from "lucide-react";

const clientes = [
  { nome: "Carlos Mendes", email: "carlos@email.com", tel: "(11) 99123-4567", veiculos: 2, osTotal: 5 },
  { nome: "Ana Paula Costa", email: "ana.paula@email.com", tel: "(11) 98765-4321", veiculos: 1, osTotal: 3 },
  { nome: "Maria Santos", email: "maria.s@email.com", tel: "(11) 97654-3210", veiculos: 1, osTotal: 4 },
  { nome: "João Lucas", email: "joao.l@email.com", tel: "(11) 96543-2109", veiculos: 3, osTotal: 8 },
  { nome: "Pedro Rodrigues", email: "pedro.r@email.com", tel: "(21) 99876-5432", veiculos: 1, osTotal: 2 },
  { nome: "Lucas Ferreira", email: "lucas.f@email.com", tel: "(21) 98765-1234", veiculos: 2, osTotal: 6 },
  { nome: "Fernanda Costa", email: "fernanda@email.com", tel: "(11) 91234-5678", veiculos: 1, osTotal: 3 },
  { nome: "Bruno Tavares", email: "bruno.t@email.com", tel: "(31) 99876-1234", veiculos: 1, osTotal: 7 },
];

const DemoClientes = () => (
  <>
    <div className="mb-6 flex items-center justify-between">
      <h2 className="text-sm font-bold uppercase tracking-wide">Clientes</h2>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <input placeholder="Buscar cliente..." className="h-8 w-48 rounded-lg border border-white/10 bg-white/5 pl-8 pr-3 text-xs outline-none focus:border-primary placeholder:text-muted-foreground" />
      </div>
    </div>

    <div className="space-y-1">
      {clientes.map((c) => (
        <div key={c.email} className="flex items-center justify-between rounded-lg border border-white/10 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center text-xs font-semibold text-muted-foreground">
              {c.nome.split(" ").map(n => n[0]).join("").slice(0, 2)}
            </div>
            <div>
              <p className="text-sm font-medium">{c.nome}</p>
              <p className="text-xs text-muted-foreground">{c.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="hidden sm:block">{c.tel}</span>
            <span className="text-xs">{c.veiculos} veíc. · {c.osTotal} OS</span>
            <button className="rounded p-1 hover:text-foreground"><MoreHorizontal className="h-3.5 w-3.5" /></button>
          </div>
        </div>
      ))}
    </div>
  </>
);

export default DemoClientes;
