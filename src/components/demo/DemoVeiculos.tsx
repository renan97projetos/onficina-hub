import { Search, Plus, MoreHorizontal } from "lucide-react";

const veiculos = [
  { placa: "ABC-1D23", modelo: "Honda Civic 2022", cor: "Preto", cliente: "Carlos Mendes", osAtivas: 1, status: "Em serviço" },
  { placa: "DEF-4E56", modelo: "Toyota Corolla 2021", cor: "Prata", cliente: "Ana Paula", osAtivas: 1, status: "Em serviço" },
  { placa: "GHI-7F89", modelo: "Hyundai HB20 2023", cor: "Branco", cliente: "João Lucas", osAtivas: 1, status: "Orçamento" },
  { placa: "JKL-0G12", modelo: "Chevrolet Onix 2022", cor: "Branco", cliente: "Maria Santos", osAtivas: 1, status: "Aprovado" },
  { placa: "MNO-3H45", modelo: "VW T-Cross 2023", cor: "Cinza", cliente: "Pedro Rodrigues", osAtivas: 1, status: "Aprovado" },
  { placa: "PQR-6I78", modelo: "Chevrolet Tracker 2021", cor: "Azul", cliente: "Lucas Ferreira", osAtivas: 1, status: "Em serviço" },
  { placa: "STU-9J01", modelo: "Hyundai Creta 2022", cor: "Vermelho", cliente: "Fernanda Costa", osAtivas: 1, status: "Em serviço" },
  { placa: "VWX-2K34", modelo: "VW Polo 2023", cor: "Prata", cliente: "Ricardo Alves", osAtivas: 0, status: "Disponível" },
  { placa: "YZA-5L67", modelo: "Nissan Kicks 2022", cor: "Cinza", cliente: "Juliana Martins", osAtivas: 1, status: "Em serviço" },
  { placa: "BCD-8M90", modelo: "Toyota SW4 2020", cor: "Preta", cliente: "Bruno Tavares", osAtivas: 0, status: "Concluído" },
  { placa: "EFG-1N23", modelo: "Jeep Compass 2021", cor: "Branco", cliente: "Amanda Gonçalves", osAtivas: 0, status: "Concluído" },
  { placa: "HIJ-4O56", modelo: "Fiat Pulse 2023", cor: "Vermelho", cliente: "João Lucas", osAtivas: 0, status: "Disponível" },
];

const statusColor: Record<string, string> = {
  "Em serviço": "text-orange-400 bg-orange-400/10",
  "Orçamento": "text-blue-400 bg-blue-400/10",
  "Aprovado": "text-amber-400 bg-amber-400/10",
  "Concluído": "text-green-400 bg-green-400/10",
  "Disponível": "text-muted-foreground bg-white/5",
};

const DemoVeiculos = () => (
  <>
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold">Veículos</h1>
        <p className="text-sm text-muted-foreground">{veiculos.length} veículos cadastrados</p>
      </div>
      <div className="flex gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input placeholder="Buscar placa, modelo..." className="h-9 w-56 rounded-lg border border-white/10 bg-white/5 pl-9 pr-4 text-sm outline-none focus:border-primary placeholder:text-muted-foreground" />
        </div>
        <button className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:brightness-110">
          <Plus className="h-4 w-4" /> Novo Veículo
        </button>
      </div>
    </div>

    <div className="rounded-xl border border-white/10 bg-[#111] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10 text-left">
              {["Placa", "Modelo", "Cor", "Cliente", "OS Ativas", "Status", ""].map((h) => (
                <th key={h} className="px-5 py-3 text-xs font-semibold uppercase text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {veiculos.map((v) => (
              <tr key={v.placa} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-3 text-sm font-mono font-semibold text-primary">{v.placa}</td>
                <td className="px-5 py-3 text-sm font-medium">{v.modelo}</td>
                <td className="px-5 py-3 text-sm text-muted-foreground">{v.cor}</td>
                <td className="px-5 py-3 text-sm">{v.cliente}</td>
                <td className="px-5 py-3 text-sm text-center">{v.osAtivas}</td>
                <td className="px-5 py-3">
                  <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${statusColor[v.status]}`}>{v.status}</span>
                </td>
                <td className="px-5 py-3">
                  <button className="rounded-lg p-1.5 text-muted-foreground hover:bg-white/5"><MoreHorizontal className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </>
);

export default DemoVeiculos;
