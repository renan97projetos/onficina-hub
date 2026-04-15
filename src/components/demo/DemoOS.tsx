import { useState } from "react";

const pipelineStages = [
  { key: "enviado", label: "Enviado", color: "border-primary text-primary" },
  { key: "orcado", label: "Orçado", color: "border-white/20 text-foreground" },
  { key: "aprovado", label: "Aprovado", color: "border-green-500/40 text-green-400" },
  { key: "aguardando", label: "Aguardando carro", color: "border-amber-500/40 text-amber-400" },
  { key: "atendimento", label: "Em atendimento", color: "border-orange-500/40 text-orange-400" },
  { key: "pagamento", label: "Pagamento", color: "border-purple-500/40 text-purple-400" },
  { key: "finalizados", label: "Finalizados", color: "border-green-500/40 text-green-400" },
  { key: "recusado", label: "Recusado", color: "border-red-500/40 text-red-400" },
];

interface OS {
  id: string;
  cliente: string;
  veiculo: string;
  placa: string;
  valor: string;
  servicos: string;
  data: string;
  stage: string;
}

const allOS: OS[] = [
  { id: "OS-0150", cliente: "Marcos Vieira", veiculo: "Gol 2019", placa: "ZZZ-9Q99", valor: "—", servicos: "A definir", data: "15/04", stage: "enviado" },
  { id: "OS-0149", cliente: "João Lucas", veiculo: "HB20 2023", placa: "GHI-7F89", valor: "R$ 2.400,00", servicos: "Funilaria + Pintura", data: "15/04", stage: "orcado" },
  { id: "OS-0148", cliente: "Ana Paula", veiculo: "Corolla 2021", placa: "DEF-4E56", valor: "R$ 1.800,00", servicos: "Pintura parcial", data: "15/04", stage: "orcado" },
  { id: "OS-0147", cliente: "Carlos Mendes", veiculo: "Civic 2022", placa: "ABC-1D23", valor: "R$ 3.200,00", servicos: "Funilaria + Pintura", data: "15/04", stage: "orcado" },
  { id: "OS-0144", cliente: "Pedro Rodrigues", veiculo: "T-Cross 2023", placa: "MNO-3H45", valor: "R$ 5.600,00", servicos: "Restauração completa", data: "13/04", stage: "aprovado" },
  { id: "OS-0143", cliente: "Maria Santos", veiculo: "Onix 2022", placa: "JKL-0G12", valor: "R$ 4.100,00", servicos: "Funilaria + Pintura", data: "14/04", stage: "aprovado" },
  { id: "OS-0146", cliente: "Diego Nunes", veiculo: "Pulse 2023", placa: "KLM-2P34", valor: "R$ 2.800,00", servicos: "Pintura parcial", data: "14/04", stage: "aguardando" },
  { id: "OS-0142", cliente: "Juliana Martins", veiculo: "Kicks 2022", placa: "YZA-5L67", valor: "R$ 4.500,00", servicos: "Pintura completa", data: "12/04", stage: "atendimento" },
  { id: "OS-0141", cliente: "Ricardo Alves", veiculo: "Polo 2023", placa: "VWX-2K34", valor: "R$ 2.900,00", servicos: "Funilaria", data: "11/04", stage: "atendimento" },
  { id: "OS-0140", cliente: "Fernanda Costa", veiculo: "Creta 2022", placa: "STU-9J01", valor: "R$ 3.800,00", servicos: "Pintura parcial", data: "11/04", stage: "atendimento" },
  { id: "OS-0139", cliente: "Lucas Ferreira", veiculo: "Tracker 2021", placa: "PQR-6I78", valor: "R$ 6.200,00", servicos: "Funilaria + Pintura + Polimento", data: "10/04", stage: "atendimento" },
  { id: "OS-0138", cliente: "Felipe Santos", veiculo: "Argo 2022", placa: "NOP-5R67", valor: "R$ 3.400,00", servicos: "Funilaria + Pintura", data: "09/04", stage: "pagamento" },
  { id: "OS-0137", cliente: "Tatiana Lima", veiculo: "Renegade 2021", placa: "QRS-8S01", valor: "R$ 7.100,00", servicos: "Funilaria + Pintura + Polimento", data: "08/04", stage: "pagamento" },
  { id: "OS-0136", cliente: "Amanda Gonçalves", veiculo: "Compass 2021", placa: "EFG-1N23", valor: "R$ 5.100,00", servicos: "Funilaria + Pintura", data: "08/04", stage: "finalizados" },
  { id: "OS-0135", cliente: "Bruno Tavares", veiculo: "SW4 2020", placa: "BCD-8M90", valor: "R$ 8.200,00", servicos: "Restauração completa", data: "09/04", stage: "finalizados" },
  { id: "OS-0145", cliente: "Renata Pires", veiculo: "Mobi 2020", placa: "TUV-3T45", valor: "R$ 1.200,00", servicos: "Funilaria", data: "13/04", stage: "recusado" },
];

const DemoOS = () => {
  const [activeStage, setActiveStage] = useState("enviado");

  const counts = pipelineStages.map((s) => ({
    ...s,
    count: allOS.filter((o) => o.stage === s.key).length,
  }));

  const filtered = allOS.filter((o) => o.stage === activeStage);
  const activeLabel = pipelineStages.find((s) => s.key === activeStage)?.label || "";

  return (
    <>
      {/* Pipeline summary cards */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        {counts.map((s) => (
          <button
            key={s.key}
            onClick={() => setActiveStage(s.key)}
            className={`rounded-lg border p-3 text-center transition-all ${
              activeStage === s.key
                ? s.color + " bg-white/5"
                : "border-white/10 text-muted-foreground hover:border-white/20"
            }`}
          >
            <div className="text-xl font-bold">{s.count}</div>
            <div className="text-xs">{s.label}</div>
          </button>
        ))}
      </div>

      {/* Stage title */}
      <h2 className="mb-4 text-sm font-bold uppercase tracking-wide">
        {activeLabel} ({filtered.length})
      </h2>

      {/* List */}
      {filtered.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          Nenhuma solicitação nesta etapa.
        </p>
      ) : (
        <div className="space-y-2">
          {filtered.map((os) => (
            <div
              key={os.id}
              className="flex cursor-pointer items-center justify-between rounded-lg border border-white/10 px-4 py-3 transition-colors hover:bg-white/[0.03]"
            >
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold text-primary">{os.id}</span>
                <div>
                  <p className="text-sm font-medium">{os.cliente}</p>
                  <p className="text-xs text-muted-foreground">{os.veiculo} — {os.placa}</p>
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <span className="hidden text-xs text-muted-foreground sm:block">{os.servicos}</span>
                <span className="font-medium">{os.valor}</span>
                <span className="text-xs text-muted-foreground">{os.data}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {filtered.length === 0 && (
        <p className="mt-8 text-center text-sm text-muted-foreground">
          Selecione uma solicitação para ver os detalhes
        </p>
      )}
    </>
  );
};

export default DemoOS;
