import { Search, MoreHorizontal } from "lucide-react";

const veiculos = [
  { placa: "ABC-1D23", modelo: "Honda Civic 2022", cor: "Preto", cliente: "Carlos Mendes", osAtivas: 1 },
  { placa: "DEF-4E56", modelo: "Toyota Corolla 2021", cor: "Prata", cliente: "Ana Paula", osAtivas: 1 },
  { placa: "GHI-7F89", modelo: "Hyundai HB20 2023", cor: "Branco", cliente: "João Lucas", osAtivas: 1 },
  { placa: "JKL-0G12", modelo: "Chevrolet Onix 2022", cor: "Branco", cliente: "Maria Santos", osAtivas: 1 },
  { placa: "MNO-3H45", modelo: "VW T-Cross 2023", cor: "Cinza", cliente: "Pedro Rodrigues", osAtivas: 1 },
  { placa: "PQR-6I78", modelo: "Chevrolet Tracker 2021", cor: "Azul", cliente: "Lucas Ferreira", osAtivas: 1 },
  { placa: "STU-9J01", modelo: "Hyundai Creta 2022", cor: "Vermelho", cliente: "Fernanda Costa", osAtivas: 1 },
  { placa: "VWX-2K34", modelo: "VW Polo 2023", cor: "Prata", cliente: "Ricardo Alves", osAtivas: 0 },
  { placa: "YZA-5L67", modelo: "Nissan Kicks 2022", cor: "Cinza", cliente: "Juliana Martins", osAtivas: 1 },
  { placa: "BCD-8M90", modelo: "Toyota SW4 2020", cor: "Preta", cliente: "Bruno Tavares", osAtivas: 0 },
];

const DemoVeiculos = () => (
  <>
    <div className="mb-6 flex items-center justify-between">
      <h2 className="text-sm font-bold uppercase tracking-wide">Veículos</h2>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        <input placeholder="Buscar placa, modelo..." className="h-8 w-48 rounded-lg border border-white/10 bg-white/5 pl-8 pr-3 text-xs outline-none focus:border-primary placeholder:text-muted-foreground" />
      </div>
    </div>

    <div className="space-y-1">
      {veiculos.map((v) => (
        <div key={v.placa} className="flex items-center justify-between rounded-lg border border-white/10 px-4 py-3">
          <div className="flex items-center gap-4">
            <span className="text-sm font-mono font-semibold text-primary">{v.placa}</span>
            <span className="text-sm">{v.modelo}</span>
            <span className="text-xs text-muted-foreground">{v.cor}</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <span className="text-muted-foreground">{v.cliente}</span>
            <span className="text-xs text-muted-foreground">{v.osAtivas} OS</span>
            <button className="rounded p-1 text-muted-foreground hover:text-foreground"><MoreHorizontal className="h-3.5 w-3.5" /></button>
          </div>
        </div>
      ))}
    </div>
  </>
);

export default DemoVeiculos;
