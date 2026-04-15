import { useState } from "react";
import {
  FileText, Wrench, Users, Calendar, Car, Activity,
  DollarSign, BarChart3, Play, ChevronRight, Clock, BookOpen,
} from "lucide-react";
import SimulatedScreenOrcamentos from "./training/SimulatedScreenOrcamentos";

/* ───── Módulos de treinamento ───── */
const modulos = [
  {
    key: "orcamentos",
    icon: FileText,
    titulo: "Orçamentos (Pipeline)",
    duracao: "8 min",
    videoId: "dQw4w9WgXcQ", // placeholder
    resumo: "Gerencie todo o ciclo de vida de um orçamento — do recebimento até a finalização — com a pipeline kanban de 8 estágios.",
    topicos: [
      {
        titulo: "Entendendo a Pipeline",
        descricao: "A pipeline é dividida em 8 estágios sequenciais: Enviado → Orçado → Aprovado → Aguardando Carro → Em Atendimento → Pagamento → Finalizados → Recusado. Cada card no topo mostra a quantidade de OS naquele estágio.",
      },
      {
        titulo: "Filtrando por estágio",
        descricao: "Clique em qualquer card de estágio para filtrar a lista abaixo e ver apenas as OS daquele status. O card selecionado fica destacado com borda laranja.",
      },
      {
        titulo: "Respondendo um orçamento",
        descricao: "Na etapa 'Enviado', abra a OS para definir os serviços necessários, atribuir valor a cada um e enviar a proposta ao cliente por WhatsApp ou e-mail.",
      },
      {
        titulo: "Avançando etapas",
        descricao: "Use o botão de avançar (→) à direita de cada OS para mover para o próximo estágio. A transição de 'Pagamento' para 'Finalizados' só é permitida quando o pagamento está registrado.",
      },
      {
        titulo: "Enviando link de aprovação",
        descricao: "Na etapa 'Orçado', gere o link de aprovação que será enviado ao cliente. Ele pode aprovar ou recusar diretamente pelo link, sem precisar de login.",
      },
    ],
  },
  {
    key: "servicos",
    icon: Wrench,
    titulo: "Serviços",
    duracao: "4 min",
    videoId: "dQw4w9WgXcQ",
    resumo: "Cadastre e organize os serviços que sua oficina oferece, definindo ordem de execução e tempo estimado.",
    topicos: [
      {
        titulo: "Cadastrando um serviço",
        descricao: "Clique em '+ Novo' no canto superior direito. Preencha: nome do serviço (ex: Funilaria), duração estimada em minutos e a ordem de execução no fluxo da oficina.",
      },
      {
        titulo: "Ordem de execução",
        descricao: "O número à esquerda de cada serviço define a sequência. Exemplo: 1-Funilaria → 2-Preparação → 3-Pintura → 4-Polimento → 5-Montagem. Essa ordem é usada no módulo 'Em Atendimento'.",
      },
      {
        titulo: "Ativando e desativando",
        descricao: "Serviços inativos ficam esmaecidos e não aparecem como opção ao criar orçamentos. Use para serviços sazonais ou temporariamente indisponíveis.",
      },
      {
        titulo: "Editando e excluindo",
        descricao: "Use o ícone de lápis para editar nome, duração ou ordem. O ícone de lixeira remove o serviço permanentemente (apenas se não estiver vinculado a nenhuma OS ativa).",
      },
    ],
  },
  {
    key: "colaboradores",
    icon: Users,
    titulo: "Colaboradores",
    duracao: "5 min",
    videoId: "dQw4w9WgXcQ",
    resumo: "Gerencie a equipe da oficina, vincule colaboradores aos serviços e respeite os limites do seu plano.",
    topicos: [
      {
        titulo: "Adicionando colaboradores",
        descricao: "Clique em '+ Novo' e preencha nome, e-mail e telefone. O sistema mostra quantas vagas estão disponíveis no seu plano (ex: 3/5 vagas usadas no Plano Pro).",
      },
      {
        titulo: "Vínculo com serviços",
        descricao: "Cada colaborador pode ser vinculado a um ou mais serviços (ex: João Silva → Funilaria, Preparação). Isso define quais etapas ele pode executar no módulo 'Em Atendimento'.",
      },
      {
        titulo: "Limites por plano",
        descricao: "Básico: até 2 colaboradores. Pro: até 5. Premium: ilimitado. Ao atingir o limite, o botão '+ Novo' fica bloqueado com sugestão de upgrade.",
      },
      {
        titulo: "Desativando colaboradores",
        descricao: "Colaboradores podem ser desativados sem excluir. Útil para férias ou afastamentos — as OS já atribuídas são mantidas no histórico.",
      },
    ],
  },
  {
    key: "agenda",
    icon: Calendar,
    titulo: "Agenda",
    duracao: "4 min",
    videoId: "dQw4w9WgXcQ",
    resumo: "Configure os horários de funcionamento e visualize todos os agendamentos da oficina.",
    topicos: [
      {
        titulo: "Horários de trabalho",
        descricao: "O painel esquerdo mostra os horários de cada dia da semana. Configure hora de início e fim para cada dia. Dias sem horário aparecem como 'Fechado' (ex: Domingo).",
      },
      {
        titulo: "Visualizando agendamentos",
        descricao: "O painel direito lista todos os agendamentos com: número da OS, veículo, serviço a ser realizado, colaborador responsável e data/hora.",
      },
      {
        titulo: "Navegação por mês",
        descricao: "Use as setas no canto superior direito para navegar entre meses e visualizar agendamentos futuros ou passados.",
      },
    ],
  },
  {
    key: "veiculos",
    icon: Car,
    titulo: "Veículos",
    duracao: "3 min",
    videoId: "dQw4w9WgXcQ",
    resumo: "Consulte o histórico completo de veículos que já passaram pela oficina.",
    topicos: [
      {
        titulo: "Lista de veículos",
        descricao: "Cada veículo mostra: placa (em destaque laranja), marca/modelo/ano, cor, nome do proprietário e quantidade de OS realizadas.",
      },
      {
        titulo: "Busca rápida",
        descricao: "Use o campo de busca no canto superior direito para filtrar por placa, modelo ou nome do proprietário. A busca é em tempo real conforme você digita.",
      },
      {
        titulo: "Histórico do veículo",
        descricao: "Clique nos três pontos (⋯) à direita para ver o histórico completo de serviços realizados naquele veículo, com datas e valores.",
      },
    ],
  },
  {
    key: "atendimento",
    icon: Activity,
    titulo: "Em Atendimento",
    duracao: "6 min",
    videoId: "dQw4w9WgXcQ",
    resumo: "Acompanhe o progresso em tempo real de cada serviço em execução, etapa por etapa.",
    topicos: [
      {
        titulo: "Visão geral",
        descricao: "Cada OS em atendimento mostra: número, veículo, cliente, barra de progresso (%) e valor orçado. Clique na seta para expandir e ver as etapas.",
      },
      {
        titulo: "Etapas sequenciais",
        descricao: "Os serviços seguem a ordem definida no módulo 'Serviços'. Cada etapa tem um status: ● Concluído (verde), ▶ Em andamento (laranja), ○ Pendente (cinza).",
      },
      {
        titulo: "Iniciando e concluindo etapas",
        descricao: "Clique em 'Iniciar' para começar uma etapa. Quando finalizada, clique em 'Concluir'. A próxima etapa só pode ser iniciada após a anterior ser concluída.",
      },
      {
        titulo: "Observações por etapa",
        descricao: "Adicione observações em cada etapa (ex: 'Segunda demão aplicada'). Essas anotações ficam visíveis no histórico e podem ser compartilhadas com o cliente via link de acompanhamento.",
      },
    ],
  },
  {
    key: "financeiro",
    icon: DollarSign,
    titulo: "Financeiro (PDV)",
    duracao: "10 min",
    videoId: "dQw4w9WgXcQ",
    resumo: "Módulo completo de ponto de venda: registre pagamentos, controle o caixa, gere recibos e envie comprovantes.",
    topicos: [
      {
        titulo: "Dashboard financeiro",
        descricao: "No topo, 4 métricas principais: Faturamento mensal, Ticket médio, Valor a receber e OS finalizadas. Use o seletor de mês para filtrar o período.",
      },
      {
        titulo: "Registrando pagamento (PDV)",
        descricao: "Clique em uma OS com status 'Pendente' para abrir o PDV. Você pode: editar valores de cada serviço, aplicar desconto (R$ ou %), escolher forma de pagamento e definir status.",
      },
      {
        titulo: "Formas de pagamento",
        descricao: "5 opções: Dinheiro (com cálculo de troco automático), PIX, Cartão Débito, Cartão Crédito (com parcelamento de 1x a 12x) e Misto (distribui entre múltiplas formas).",
      },
      {
        titulo: "Pagamento misto",
        descricao: "Ao selecionar 'Misto', adicione quantas formas quiser. Ex: R$ 2.000 em Dinheiro + R$ 3.000 no PIX. O sistema valida se o total informado cobre o valor da OS.",
      },
      {
        titulo: "Pagamento parcial",
        descricao: "Marque como 'Parcial' quando o cliente paga apenas parte. O saldo pendente é calculado automaticamente. Depois, clique em 'Registrar pagamento restante' para completar.",
      },
      {
        titulo: "Recibos",
        descricao: "Cada pagamento gera um recibo sequencial (REC-0001, REC-0002...). Visualize, imprima ou envie por WhatsApp e e-mail diretamente do sistema.",
      },
      {
        titulo: "Controle de caixa",
        descricao: "Clique em 'Caixa' no topo para abrir o controle: saldo inicial, entradas, saídas. Registre sangrias (retiradas com motivo) e reforços. Feche o caixa no final do dia.",
      },
    ],
  },
  {
    key: "relatorios",
    icon: BarChart3,
    titulo: "Relatórios",
    duracao: "4 min",
    videoId: "dQw4w9WgXcQ",
    resumo: "Visualize métricas de desempenho da oficina com gráficos e indicadores-chave.",
    topicos: [
      {
        titulo: "Faturamento mensal",
        descricao: "Gráfico de barras mostrando a evolução do faturamento mês a mês. Permite identificar sazonalidade e tendências de crescimento.",
      },
      {
        titulo: "Serviços por tipo",
        descricao: "Ranking dos serviços mais realizados com porcentagem. Útil para entender quais serviços geram mais receita e demanda.",
      },
      {
        titulo: "Métricas do mês",
        descricao: "4 indicadores: Tempo médio de atendimento, Taxa de aprovação de orçamentos, OS por colaborador e Taxa de retorno de clientes.",
      },
      {
        titulo: "Próximas entregas",
        descricao: "Lista de OS com previsão de entrega próxima, ordenadas por data. Permite antecipar a comunicação com o cliente.",
      },
    ],
  },
];

const DemoTreinamentos = () => {
  const [moduloAtivo, setModuloAtivo] = useState(modulos[0].key);
  const [topicoAberto, setTopicoAberto] = useState<number | null>(0);

  const modulo = modulos.find((m) => m.key === moduloAtivo)!;
  const Icon = modulo.icon;

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

          {/* Vídeo / Simulação */}
          <div className="mb-6">
            {moduloAtivo === "orcamentos" ? (
              <SimulatedScreenOrcamentos activeTopicIndex={topicoAberto} />
            ) : (
              <div className="overflow-hidden rounded-xl border border-white/10 bg-black aspect-video flex items-center justify-center relative group cursor-pointer">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />
                <div className="flex flex-col items-center gap-3 z-10">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/20 border border-primary/30 group-hover:bg-primary/30 transition-colors">
                    <Play className="h-7 w-7 text-primary ml-1" />
                  </div>
                  <span className="text-sm text-muted-foreground">Em breve — {modulo.duracao}</span>
                </div>
                <div className="absolute bottom-3 left-4 z-10">
                  <span className="text-xs text-muted-foreground">{modulo.titulo}</span>
                </div>
                <div className="absolute bottom-3 right-4 z-10">
                  <span className="text-[10px] text-muted-foreground bg-white/10 px-2 py-0.5 rounded">
                    {modulo.duracao}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Lista de tópicos */}
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
              Conteúdo do treinamento — {modulo.topicos.length} tópicos
            </p>
            {modulo.topicos.map((topico, i) => {
              const isOpen = topicoAberto === i;
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
                    <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-90" : ""}`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pl-[52px]">
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {topico.descricao}
                      </p>
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
