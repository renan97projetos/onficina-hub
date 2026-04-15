import { Play, CheckCircle2, Clock, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface Etapa {
  servico: string;
  colaborador: string;
  status: "pendente" | "em_andamento" | "concluido";
  observacao?: string;
}

const osEmAtendimento = [
  {
    id: "OS-0139", car: "Tracker 2021", client: "Lucas Ferreira", valor: "R$ 6.200,00",
    etapas: [
      { servico: "Funilaria", colaborador: "João Silva", status: "concluido" as const },
      { servico: "Preparação", colaborador: "Rafael Lima", status: "concluido" as const },
      { servico: "Pintura", colaborador: "Pedro Souza", status: "em_andamento" as const, observacao: "Segunda demão" },
      { servico: "Polimento", colaborador: "Pedro Souza", status: "pendente" as const },
      { servico: "Montagem", colaborador: "Rafael Lima", status: "pendente" as const },
    ],
  },
  {
    id: "OS-0140", car: "Creta 2022", client: "Fernanda Costa", valor: "R$ 3.800,00",
    etapas: [
      { servico: "Funilaria", colaborador: "João Silva", status: "concluido" as const },
      { servico: "Preparação", colaborador: "Rafael Lima", status: "em_andamento" as const },
      { servico: "Pintura", colaborador: "Pedro Souza", status: "pendente" as const },
    ],
  },
  {
    id: "OS-0141", car: "Polo 2023", client: "Ricardo Alves", valor: "R$ 2.900,00",
    etapas: [
      { servico: "Funilaria", colaborador: "João Silva", status: "em_andamento" as const, observacao: "Para-choque traseiro" },
      { servico: "Preparação", colaborador: "Rafael Lima", status: "pendente" as const },
      { servico: "Pintura", colaborador: "Pedro Souza", status: "pendente" as const },
    ],
  },
  {
    id: "OS-0142", car: "Kicks 2022", client: "Juliana Martins", valor: "R$ 4.500,00",
    etapas: [
      { servico: "Funilaria", colaborador: "João Silva", status: "concluido" as const },
      { servico: "Preparação", colaborador: "Rafael Lima", status: "concluido" as const },
      { servico: "Pintura", colaborador: "Pedro Souza", status: "em_andamento" as const },
      { servico: "Polimento", colaborador: "Pedro Souza", status: "pendente" as const },
    ],
  },
];

const statusIcon = {
  pendente: <Clock className="h-3.5 w-3.5 text-muted-foreground" />,
  em_andamento: <Play className="h-3.5 w-3.5 text-primary" />,
  concluido: <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />,
};

const DemoEmAtendimento = () => {
  const [expanded, setExpanded] = useState<string>(osEmAtendimento[0].id);

  return (
    <>
      <h2 className="mb-4 text-sm font-bold uppercase tracking-wide">Em Atendimento ({osEmAtendimento.length})</h2>

      <div className="space-y-1">
        {osEmAtendimento.map((os) => {
          const concluidas = os.etapas.filter(e => e.status === "concluido").length;
          const pct = Math.round((concluidas / os.etapas.length) * 100);
          const isOpen = expanded === os.id;

          return (
            <div key={os.id} className="rounded-lg border border-white/10 overflow-hidden">
              <button
                onClick={() => setExpanded(isOpen ? "" : os.id)}
                className="flex w-full items-center justify-between px-4 py-3 text-left hover:bg-white/[0.02]"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-primary">{os.id}</span>
                  <span className="text-sm">{os.car}</span>
                  <span className="text-xs text-muted-foreground">— {os.client}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-1.5 w-16 rounded-full bg-white/10">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="text-xs text-muted-foreground w-8">{pct}%</span>
                  <span className="text-sm font-medium">{os.valor}</span>
                  {isOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                </div>
              </button>

              {isOpen && (
                <div className="border-t border-white/10 px-4 py-3 space-y-2">
                  {os.etapas.map((etapa, i) => (
                    <div key={i} className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-2">
                        {statusIcon[etapa.status]}
                        <span className="text-sm">{etapa.servico}</span>
                        <span className="text-xs text-muted-foreground">— {etapa.colaborador}</span>
                        {etapa.observacao && (
                          <span className="flex items-center gap-1 text-xs text-muted-foreground">
                            <MessageSquare className="h-3 w-3" /> {etapa.observacao}
                          </span>
                        )}
                      </div>
                      {etapa.status === "pendente" && (
                        <button className="text-xs text-primary hover:underline">Iniciar</button>
                      )}
                      {etapa.status === "em_andamento" && (
                        <button className="text-xs text-green-400 hover:underline">Concluir</button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};

export default DemoEmAtendimento;
