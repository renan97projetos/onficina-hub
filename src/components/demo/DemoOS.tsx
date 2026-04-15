import { Search, Plus, ChevronRight } from "lucide-react";
import { useState } from "react";

const allOS = [
  { id: "OS-0150", car: "Gol 2019 Branco", placa: "ZZZ-9Q99", client: "Marcos Vieira", status: "Enviado", value: "—", date: "15/04/2026", servicos: "A definir" },
  { id: "OS-0149", car: "HB20 2023 Branco", placa: "GHI-7F89", client: "João Lucas", status: "Orçado", value: "R$ 2.400,00", date: "15/04/2026", servicos: "Funilaria + Pintura" },
  { id: "OS-0148", car: "Corolla 2021 Prata", placa: "DEF-4E56", client: "Ana Paula", status: "Orçado", value: "R$ 1.800,00", date: "15/04/2026", servicos: "Pintura parcial" },
  { id: "OS-0147", car: "Civic 2022 Preto", placa: "ABC-1D23", client: "Carlos Mendes", status: "Orçado", value: "R$ 3.200,00", date: "15/04/2026", servicos: "Funilaria + Pintura" },
  { id: "OS-0146", car: "Pulse 2023 Vermelho", placa: "KLM-2P34", client: "Diego Nunes", status: "Aguardando Carro", value: "R$ 2.800,00", date: "14/04/2026", servicos: "Pintura parcial" },
  { id: "OS-0144", car: "T-Cross 2023 Cinza", placa: "MNO-3H45", client: "Pedro Rodrigues", status: "Aprovado", value: "R$ 5.600,00", date: "13/04/2026", servicos: "Restauração completa" },
  { id: "OS-0143", car: "Onix 2022 Branco", placa: "JKL-0G12", client: "Maria Santos", status: "Aprovado", value: "R$ 4.100,00", date: "14/04/2026", servicos: "Funilaria + Pintura" },
  { id: "OS-0142", car: "Kicks 2022 Cinza", placa: "YZA-5L67", client: "Juliana Martins", status: "Em Atendimento", value: "R$ 4.500,00", date: "12/04/2026", servicos: "Pintura completa" },
  { id: "OS-0141", car: "Polo 2023 Prata", placa: "VWX-2K34", client: "Ricardo Alves", status: "Em Atendimento", value: "R$ 2.900,00", date: "11/04/2026", servicos: "Funilaria" },
  { id: "OS-0140", car: "Creta 2022 Vermelho", placa: "STU-9J01", client: "Fernanda Costa", status: "Em Atendimento", value: "R$ 3.800,00", date: "11/04/2026", servicos: "Pintura parcial" },
  { id: "OS-0139", car: "Tracker 2021 Azul", placa: "PQR-6I78", client: "Lucas Ferreira", status: "Em Atendimento", value: "R$ 6.200,00", date: "10/04/2026", servicos: "Funilaria + Pintura + Polimento" },
  { id: "OS-0138", car: "Argo 2022 Cinza", placa: "NOP-5R67", client: "Felipe Santos", status: "Pagamento", value: "R$ 3.400,00", date: "09/04/2026", servicos: "Funilaria + Pintura" },
  { id: "OS-0137", car: "Renegade 2021 Prata", placa: "QRS-8S01", client: "Tatiana Lima", status: "Pagamento", value: "R$ 7.100,00", date: "08/04/2026", servicos: "Funilaria + Pintura + Polimento" },
  { id: "OS-0136", car: "Compass 2021 Branco", placa: "EFG-1N23", client: "Amanda Gonçalves", status: "Finalizados", value: "R$ 5.100,00", date: "08/04/2026", servicos: "Funilaria + Pintura" },
  { id: "OS-0135", car: "SW4 2020 Preta", placa: "BCD-8M90", client: "Bruno Tavares", status: "Finalizados", value: "R$ 8.200,00", date: "09/04/2026", servicos: "Restauração completa" },
  { id: "OS-0145", car: "Mobi 2020 Prata", placa: "TUV-3T45", client: "Renata Pires", status: "Recusado", value: "R$ 1.200,00", date: "13/04/2026", servicos: "Funilaria" },
];

const statusColor: Record<string, string> = {
  "Enviado": "text-slate-400 bg-slate-400/10",
  "Orçado": "text-blue-400 bg-blue-400/10",
  "Aprovado": "text-amber-400 bg-amber-400/10",
  "Aguardando Carro": "text-yellow-400 bg-yellow-400/10",
  "Em Atendimento": "text-orange-400 bg-orange-400/10",
  "Pagamento": "text-purple-400 bg-purple-400/10",
  "Finalizados": "text-green-400 bg-green-400/10",
  "Recusado": "text-red-400 bg-red-400/10",
};

const filters = ["Todos", "Enviado", "Orçado", "Aprovado", "Aguardando Carro", "Em Atendimento", "Pagamento", "Finalizados", "Recusado"];

const DemoOS = () => {
  const [filter, setFilter] = useState("Todos");
  const filtered = filter === "Todos" ? allOS : allOS.filter((o) => o.status === filter);

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Orçamentos</h1>
          <p className="text-sm text-muted-foreground">{allOS.length} OS no total</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input placeholder="Buscar OS..." className="h-9 w-56 rounded-lg border border-white/10 bg-white/5 pl-9 pr-4 text-sm outline-none focus:border-primary placeholder:text-muted-foreground" />
          </div>
          <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:brightness-110">
            <Plus className="h-4 w-4" /> Nova OS
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-medium transition-colors ${
              filter === f ? "bg-primary text-primary-foreground" : "border border-white/10 bg-white/5 text-muted-foreground hover:text-foreground"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-white/10 bg-[#111] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 text-left">
                {["OS", "Veículo", "Placa", "Cliente", "Serviços", "Status", "Valor", "Data", ""].map((h) => (
                  <th key={h} className="px-5 py-3 text-xs font-semibold uppercase text-muted-foreground whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((os) => (
                <tr key={os.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3 text-sm font-semibold text-primary">{os.id}</td>
                  <td className="px-5 py-3 text-sm font-medium whitespace-nowrap">{os.car}</td>
                  <td className="px-5 py-3 text-sm font-mono text-muted-foreground">{os.placa}</td>
                  <td className="px-5 py-3 text-sm">{os.client}</td>
                  <td className="px-5 py-3 text-xs text-muted-foreground">{os.servicos}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap ${statusColor[os.status]}`}>{os.status}</span>
                  </td>
                  <td className="px-5 py-3 text-sm font-semibold">{os.value}</td>
                  <td className="px-5 py-3 text-sm text-muted-foreground">{os.date}</td>
                  <td className="px-5 py-3">
                    <button className="rounded-lg p-1.5 text-muted-foreground hover:bg-white/5"><ChevronRight className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default DemoOS;
