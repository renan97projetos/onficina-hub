import { Search, Plus, Phone, Mail, MoreHorizontal, Car } from "lucide-react";

const clientes = [
  { nome: "Carlos Mendes", email: "carlos@email.com", tel: "(11) 99123-4567", veiculos: 2, osTotal: 5, ultimaOS: "15/04/2026" },
  { nome: "Ana Paula Costa", email: "ana.paula@email.com", tel: "(11) 98765-4321", veiculos: 1, osTotal: 3, ultimaOS: "15/04/2026" },
  { nome: "Maria Santos", email: "maria.s@email.com", tel: "(11) 97654-3210", veiculos: 1, osTotal: 4, ultimaOS: "14/04/2026" },
  { nome: "João Lucas", email: "joao.l@email.com", tel: "(11) 96543-2109", veiculos: 3, osTotal: 8, ultimaOS: "13/04/2026" },
  { nome: "Pedro Rodrigues", email: "pedro.r@email.com", tel: "(21) 99876-5432", veiculos: 1, osTotal: 2, ultimaOS: "12/04/2026" },
  { nome: "Lucas Ferreira", email: "lucas.f@email.com", tel: "(21) 98765-1234", veiculos: 2, osTotal: 6, ultimaOS: "10/04/2026" },
  { nome: "Fernanda Costa", email: "fernanda@email.com", tel: "(11) 91234-5678", veiculos: 1, osTotal: 3, ultimaOS: "09/04/2026" },
  { nome: "Juliana Martins", email: "juliana.m@email.com", tel: "(11) 92345-6789", veiculos: 2, osTotal: 4, ultimaOS: "08/04/2026" },
  { nome: "Bruno Tavares", email: "bruno.t@email.com", tel: "(31) 99876-1234", veiculos: 1, osTotal: 7, ultimaOS: "09/04/2026" },
  { nome: "Amanda Gonçalves", email: "amanda.g@email.com", tel: "(31) 98765-4321", veiculos: 1, osTotal: 2, ultimaOS: "07/04/2026" },
];

const DemoClientes = () => (
  <>
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold">Clientes</h1>
        <p className="text-sm text-muted-foreground">{clientes.length} clientes cadastrados</p>
      </div>
      <div className="flex gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input placeholder="Buscar cliente..." className="h-9 w-56 rounded-lg border border-white/10 bg-white/5 pl-9 pr-4 text-sm outline-none focus:border-primary placeholder:text-muted-foreground" />
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:brightness-110">
          <Plus className="h-4 w-4" /> Novo Cliente
        </button>
      </div>
    </div>

    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {clientes.map((c) => (
        <div key={c.email} className="rounded-xl border border-white/10 bg-[#111] p-5 transition-all hover:-translate-y-0.5 hover:shadow-lg">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                {c.nome.split(" ").map(n => n[0]).join("").slice(0, 2)}
              </div>
              <div>
                <h3 className="font-semibold">{c.nome}</h3>
                <p className="text-xs text-muted-foreground">Última OS: {c.ultimaOS}</p>
              </div>
            </div>
            <button className="rounded-lg p-1.5 text-muted-foreground hover:bg-white/5">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-3.5 w-3.5" /> {c.email}
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Phone className="h-3.5 w-3.5" /> {c.tel}
            </div>
          </div>
          <div className="mt-4 flex gap-4 border-t border-white/5 pt-3">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Car className="h-3.5 w-3.5" /> {c.veiculos} veículo{c.veiculos > 1 ? "s" : ""}
            </div>
            <div className="text-xs text-muted-foreground">{c.osTotal} OS total</div>
          </div>
        </div>
      ))}
    </div>
  </>
);

export default DemoClientes;
