import { useState } from "react";
import {
  FileText, Wrench, Users, Calendar, Car, Activity,
  DollarSign, BarChart3, ChevronRight, Clock, BookOpen,
} from "lucide-react";
import TopicSimulation from "./training/TopicSimulation";
import {
  pipelineFrames,
  filtrandoFrames,
  respondendoFrames,
  avancandoFrames,
  aprovacaoFrames,
} from "./training/orcamentosTopicFrames";

/* ───── Frames map por módulo/tópico ───── */
const topicFramesMap: Record<string, Record<number, any[]>> = {
  orcamentos: {
    0: pipelineFrames,
    1: filtrandoFrames,
    2: respondendoFrames,
    3: avancandoFrames,
    4: aprovacaoFrames,
  },
};

/* ───── Módulos de treinamento ───── */
const modulos = [
  {
    key: "orcamentos",
    icon: FileText,
    titulo: "Orçamentos (Pipeline)",
    duracao: "8 min",
    resumo: "Gerencie todo o ciclo de vida de um orçamento — do recebimento até a finalização — com a pipeline kanban de 8 estágios.",
    topicos: [
      { titulo: "Entendendo a Pipeline", descricao: "A pipeline é dividida em 8 estágios sequenciais: Enviado → Orçado → Aprovado → Aguardando Carro → Em Atendimento → Pagamento → Finalizados → Recusado. Cada card no topo mostra a quantidade de OS naquele estágio." },
      { titulo: "Filtrando por estágio", descricao: "Clique em qualquer card de estágio para filtrar a lista abaixo e ver apenas as OS daquele status. O card selecionado fica destacado com borda laranja." },
      { titulo: "Respondendo um orçamento", descricao: "Na etapa 'Enviado', abra a OS para definir os serviços necessários, atribuir valor a cada um e enviar a proposta ao cliente por WhatsApp ou e-mail." },
      { titulo: "Avançando etapas", descricao: "Use o botão de avançar (→) à direita de cada OS para mover para o próximo estágio. A transição de 'Pagamento' para 'Finalizados' só é permitida quando o pagamento está registrado." },
      { titulo: "Enviando link de aprovação", descricao: "Na etapa 'Orçado', gere o link de aprovação que será enviado ao cliente. Ele pode aprovar ou recusar diretamente pelo link, sem precisar de login." },
    ],
  },
  {
    key: "servicos",
    icon: Wrench,
    titulo: "Serviços",
    duracao: "4 min",
    resumo: "Cadastre e organize os serviços que sua oficina oferece, definindo ordem de execução e tempo estimado.",
    topicos: [
      { titulo: "Cadastrando um serviço", descricao: "Clique em '+ Novo' no canto superior direito. Preencha: nome do serviço (ex: Funilaria), duração estimada em minutos e a ordem de execução no fluxo da oficina." },
      { titulo: "Ordem de execução", descricao: "O número à esquerda de cada serviço define a sequência. Exemplo: 1-Funilaria → 2-Preparação → 3-Pintura → 4-Polimento → 5-Montagem." },
      { titulo: "Ativando e desativando", descricao: "Serviços inativos ficam esmaecidos e não aparecem como opção ao criar orçamentos." },
      { titulo: "Editando e excluindo", descricao: "Use o ícone de lápis para editar nome, duração ou ordem. O ícone de lixeira remove o serviço permanentemente." },
    ],
  },
  {
    key: "colaboradores",
    icon: Users,
    titulo: "Colaboradores",
    duracao: "5 min",
    resumo: "Gerencie a equipe da oficina, vincule colaboradores aos serviços e respeite os limites do seu plano.",
    topicos: [
      { titulo: "Adicionando colaboradores", descricao: "Clique em '+ Novo' e preencha nome, e-mail e telefone. O sistema mostra quantas vagas estão disponíveis no seu plano." },
      { titulo: "Vínculo com serviços", descricao: "Cada colaborador pode ser vinculado a um ou mais serviços. Isso define quais etapas ele pode executar no módulo 'Em Atendimento'." },
      { titulo: "Limites por plano", descricao: "Básico: até 2 colaboradores. Pro: até 5. Premium: ilimitado." },
      { titulo: "Desativando colaboradores", descricao: "Colaboradores podem ser desativados sem excluir. Útil para férias ou afastamentos." },
    ],
  },
  {
    key: "agenda",
    icon: Calendar,
    titulo: "Agenda",
    duracao: "4 min",
    resumo: "Configure os horários de funcionamento e visualize todos os agendamentos da oficina.",
    topicos: [
      { titulo: "Horários de trabalho", descricao: "O painel esquerdo mostra os horários de cada dia da semana. Configure hora de início e fim para cada dia." },
      { titulo: "Visualizando agendamentos", descricao: "O painel direito lista todos os agendamentos com: número da OS, veículo, serviço, colaborador e data/hora." },
      { titulo: "Navegação por mês", descricao: "Use as setas para navegar entre meses e visualizar agendamentos futuros ou passados." },
    ],
  },
  {
    key: "veiculos",
    icon: Car,
    titulo: "Veículos",
    duracao: "3 min",
    resumo: "Consulte o histórico completo de veículos que já passaram pela oficina.",
    topicos: [
      { titulo: "Lista de veículos", descricao: "Cada veículo mostra: placa, marca/modelo/ano, cor, nome do proprietário e quantidade de OS realizadas." },
      { titulo: "Busca rápida", descricao: "Use o campo de busca para filtrar por placa, modelo ou nome do proprietário. A busca é em tempo real." },
      { titulo: "Histórico do veículo", descricao: "Clique nos três pontos (⋯) para ver o histórico completo de serviços realizados naquele veículo." },
    ],
  },
  {
    key: "atendimento",
    icon: Activity,
    titulo: "Em Atendimento",
    duracao: "6 min",
    resumo: "Acompanhe o progresso em tempo real de cada serviço em execução, etapa por etapa.",
    topicos: [
      { titulo: "Visão geral", descricao: "Cada OS em atendimento mostra: número, veículo, cliente, barra de progresso (%) e valor orçado." },
      { titulo: "Etapas sequenciais", descricao: "Os serviços seguem a ordem definida no módulo 'Serviços'. Cada etapa tem um status: ● Concluído, ▶ Em andamento, ○ Pendente." },
      { titulo: "Iniciando e concluindo etapas", descricao: "Clique em 'Iniciar' para começar uma etapa. Quando finalizada, clique em 'Concluir'." },
      { titulo: "Observações por etapa", descricao: "Adicione observações em cada etapa. Essas anotações ficam visíveis no histórico." },
    ],
  },
  {
    key: "financeiro",
    icon: DollarSign,
    titulo: "Financeiro (PDV)",
    duracao: "10 min",
    resumo: "Módulo completo de ponto de venda: registre pagamentos, controle o caixa, gere recibos e envie comprovantes.",
    topicos: [
      { titulo: "Dashboard financeiro", descricao: "No topo, 4 métricas principais: Faturamento mensal, Ticket médio, Valor a receber e OS finalizadas." },
      { titulo: "Registrando pagamento (PDV)", descricao: "Clique em uma OS com status 'Pendente' para abrir o PDV. Edite valores, aplique desconto e escolha forma de pagamento." },
      { titulo: "Formas de pagamento", descricao: "5 opções: Dinheiro, PIX, Cartão Débito, Cartão Crédito (com parcelamento) e Misto." },
      { titulo: "Pagamento misto", descricao: "Ao selecionar 'Misto', adicione quantas formas quiser. O sistema valida se o total cobre o valor da OS." },
      { titulo: "Pagamento parcial", descricao: "Marque como 'Parcial' quando o cliente paga apenas parte. O saldo pendente é calculado automaticamente." },
      { titulo: "Recibos", descricao: "Cada pagamento gera um recibo sequencial. Visualize, imprima ou envie por WhatsApp e e-mail." },
      { titulo: "Controle de caixa", descricao: "Controle saldo inicial, entradas, saídas. Registre sangrias e reforços. Feche o caixa no final do dia." },
    ],
  },
  {
    key: "relatorios",
    icon: BarChart3,
    titulo: "Relatórios",
    duracao: "4 min",
    resumo: "Visualize métricas de desempenho da oficina com gráficos e indicadores-chave.",
    topicos: [
      { titulo: "Faturamento mensal", descricao: "Gráfico de barras mostrando a evolução do faturamento mês a mês." },
      { titulo: "Serviços por tipo", descricao: "Ranking dos serviços mais realizados com porcentagem." },
      { titulo: "Métricas do mês", descricao: "4 indicadores: Tempo médio, Taxa de aprovação, OS por colaborador e Taxa de retorno." },
      { titulo: "Próximas entregas", descricao: "Lista de OS com previsão de entrega próxima, ordenadas por data." },
    ],
  },
];

const DemoTreinamentos = () => {
  const [moduloAtivo, setModuloAtivo] = useState(modulos[0].key);
  const [topicoAberto, setTopicoAberto] = useState<number | null>(0);

  const modulo = modulos.find((m) => m.key === moduloAtivo)!;
  const Icon = modulo.icon;

  const getTopicFrames = (topicIndex: number) => {
    return topicFramesMap[moduloAtivo]?.[topicIndex] || null;
  };

  return (
    <>
      <div className="mb-6 flex items-center gap-2">
        <BookOpen className="h-4 w-4 text-primary" />
        <h2 className="text-sm font-bold uppercase tracking-wide">Treinamentos do Sistema</h2>
      </div>

      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        {/* Sidebar — lista de módulos */}
        <div className="space-y-1">
          {modulos.map((m) => {
            const MIcon = m.icon;
            const isActive = moduloAtivo === m.key;
            return (
              <button
                key={m.key}
                onClick={() => { setModuloAtivo(m.key); setTopicoAberto(0); }}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-muted-foreground hover:bg-white/5 border border-transparent"
                }`}
              >
                <MIcon className="h-4 w-4 shrink-0" />
                <span className="flex-1 truncate">{m.titulo}</span>
                <span className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {m.duracao}
                </span>
              </button>
            );
          })}
        </div>

        {/* Conteúdo do módulo */}
        <div>
          {/* Header do módulo */}
          <div className="mb-5 flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-bold">{modulo.titulo}</h3>
              <p className="mt-0.5 text-sm text-muted-foreground">{modulo.resumo}</p>
            </div>
          </div>

          {/* Lista de tópicos com simulação inline */}
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
              Conteúdo do treinamento — {modulo.topicos.length} tópicos
            </p>
            {modulo.topicos.map((topico, i) => {
              const isOpen = topicoAberto === i;
              const frames = getTopicFrames(i);
              return (
                <div key={i} className="rounded-lg border border-white/10 overflow-hidden">
                  <button
                    onClick={() => setTopicoAberto(isOpen ? null : i)}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-white/[0.02] transition-colors"
                  >
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/5 text-[10px] font-bold text-muted-foreground">
                      {i + 1}
                    </span>
                    <span className="flex-1 text-sm font-medium">{topico.titulo}</span>
                    {frames && (
                      <span className="text-[9px] text-primary bg-primary/10 px-1.5 py-0.5 rounded">simulação</span>
                    )}
                    <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-90" : ""}`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pl-[52px] space-y-3">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {topico.descricao}
                      </p>
                      {frames ? (
                        <TopicSimulation frames={frames} />
                      ) : (
                        <div className="w-full max-w-md rounded-lg border border-white/10 bg-[#0a0a0a] p-4 flex items-center justify-center" style={{ minHeight: 100 }}>
                          <span className="text-[10px] text-muted-foreground">Simulação em breve</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default DemoTreinamentos;
