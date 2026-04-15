import { Play, CheckCircle2, Clock, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";

interface Etapa {
  servico: string;
  colaborador: string;
  status: "pendente" | "em_andamento" | "concluido";
  observacao?: string;
  inicio?: string;
  conclusao?: string;
}

interface OSEmAtendimento {
  id: string;
  car: string;
  client: string;
  valor: string;
  etapas: Etapa[];
}

const osEmAtendimento: OSEmAtendimento[] = [
  {
    id: "OS-0139", car: "Tracker 2021 Azul", client: "Lucas Ferreira", valor: "R$ 6.200",
    etapas: [
      { servico: "Funilaria", colaborador: "João Silva", status: "concluido", inicio: "10/04 08:00", conclusao: "12/04 17:00", observacao: "Lateral esquerda reparada" },
      { servico: "Preparação", colaborador: "Rafael Lima", status: "concluido", inicio: "13/04 08:00", conclusao: "13/04 16:00" },
      { servico: "Pintura", colaborador: "Pedro Souza", status: "em_andamento", inicio: "14/04 08:00", observacao: "Aplicando segunda demão" },
      { servico: "Polimento", colaborador: "Pedro Souza", status: "pendente" },
      { servico: "Montagem", colaborador: "Rafael Lima", status: "pendente" },
    ],
  },
  {
    id: "OS-0140", car: "Creta 2022 Vermelho", client: "Fernanda Costa", valor: "R$ 3.800",
    etapas: [
      { servico: "Funilaria", colaborador: "João Silva", status: "concluido", inicio: "11/04 08:00", conclusao: "13/04 12:00" },
      { servico: "Preparação", colaborador: "Rafael Lima", status: "em_andamento", inicio: "14/04 08:00" },
      { servico: "Pintura", colaborador: "Pedro Souza", status: "pendente" },
      { servico: "Polimento", colaborador: "Pedro Souza", status: "pendente" },
    ],
  },
  {
    id: "OS-0141", car: "Polo 2023 Prata", client: "Ricardo Alves", valor: "R$ 2.900",
    etapas: [
      { servico: "Funilaria", colaborador: "João Silva", status: "em_andamento", inicio: "13/04 08:00", observacao: "Para-choque traseiro" },
      { servico: "Preparação", colaborador: "Rafael Lima", status: "pendente" },
      { servico: "Pintura", colaborador: "Pedro Souza", status: "pendente" },
    ],
  },
  {
    id: "OS-0142", car: "Kicks 2022 Cinza", client: "Juliana Martins", valor: "R$ 4.500",
    etapas: [
      { servico: "Funilaria", colaborador: "João Silva", status: "concluido", inicio: "09/04 08:00", conclusao: "11/04 17:00" },
      { servico: "Preparação", colaborador: "Rafael Lima", status: "concluido", inicio: "12/04 08:00", conclusao: "12/04 17:00" },
      { servico: "Pintura", colaborador: "Pedro Souza", status: "em_andamento", inicio: "13/04 08:00" },
      { servico: "Polimento", colaborador: "Pedro Souza", status: "pendente" },
      { servico: "Montagem", colaborador: "Rafael Lima", status: "pendente" },
    ],
  },
];

const statusIcon = {
  pendente: <Clock className="h-4 w-4 text-muted-foreground" />,
  em_andamento: <Play className="h-4 w-4 text-amber-400" />,
  concluido: <CheckCircle2 className="h-4 w-4 text-green-400" />,
};

const statusLabel = {
  pendente: "Pendente",
  em_andamento: "Em andamento",
  concluido: "Concluído",
};

const statusColor = {
  pendente: "text-muted-foreground",
  em_andamento: "text-amber-400",
  concluido: "text-green-400",
};

const DemoEmAtendimento = () => {
  const [expanded, setExpanded] = useState<string>(osEmAtendimento[0].id);

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Em Atendimento</h1>
        <p className="text-sm text-muted-foreground">{osEmAtendimento.length} veículos em execução</p>
      </div>

      <div className="space-y-4">
        {osEmAtendimento.map((os) => {
          const concluidas = os.etapas.filter(e => e.status === "concluido").length;
          const total = os.etapas.length;
          const pct = Math.round((concluidas / total) * 100);
          const isOpen = expanded === os.id;

          return (
            <div key={os.id} className="rounded-xl border border-white/10 bg-[#111] overflow-hidden">
              {/* Header */}
              <button
                onClick={() => setExpanded(isOpen ? "" : os.id)}
                className="flex w-full items-center justify-between px-5 py-4 hover:bg-white/[0.02] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-primary">{os.id}</span>
                  <span className="text-sm font-medium">{os.car}</span>
                  <span className="text-xs text-muted-foreground">— {os.client}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold">{os.valor}</span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-24 rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground">{pct}%</span>
                  </div>
                  {isOpen ? <ChevronUp className="h-4 w-4 text-muted-foreground" /> : <ChevronDown className="h-4 w-4 text-muted-foreground" />}
                </div>
              </button>

              {/* Steps */}
              {isOpen && (
                <div className="border-t border-white/10 px-5 py-4">
                  <div className="space-y-3">
                    {os.etapas.map((etapa, i) => (
                      <div key={i} className="flex items-start gap-4 rounded-lg border border-white/5 bg-white/[0.02] px-4 py-3">
                        <div className="mt-0.5">{statusIcon[etapa.status]}</div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="text-sm font-medium">{etapa.servico}</span>
                              <span className="ml-2 text-xs text-muted-foreground">— {etapa.colaborador}</span>
                            </div>
                            <span className={`text-xs font-medium ${statusColor[etapa.status]}`}>{statusLabel[etapa.status]}</span>
                          </div>
                          {etapa.inicio && (
                            <p className="mt-1 text-xs text-muted-foreground">
                              Início: {etapa.inicio}
                              {etapa.conclusao && ` — Conclusão: ${etapa.conclusao}`}
                            </p>
                          )}
                          {etapa.observacao && (
                            <div className="mt-1.5 flex items-start gap-1.5 text-xs text-muted-foreground">
                              <MessageSquare className="h-3 w-3 mt-0.5 shrink-0" />
                              {etapa.observacao}
                            </div>
                          )}
                          {etapa.status === "pendente" && (
                            <button className="mt-2 rounded-lg bg-primary/10 px-3 py-1 text-xs font-medium text-primary hover:bg-primary/20">
                              Iniciar etapa
                            </button>
                          )}
                          {etapa.status === "em_andamento" && (
                            <button className="mt-2 rounded-lg bg-green-500/10 px-3 py-1 text-xs font-medium text-green-400 hover:bg-green-500/20">
                              Concluir etapa
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
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
