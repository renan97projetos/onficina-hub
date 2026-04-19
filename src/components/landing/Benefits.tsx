import {
  ClipboardList,
  GitBranch,
  MessageCircle,
  Eye,
  Users,
  BarChart3,
  Smartphone,
  LayoutGrid,
  UserCog,
} from "lucide-react";

const benefits = [
  {
    icon: ClipboardList,
    title: "Orçamentos em PDF com 1 clique",
    description:
      "Monte o orçamento com peças e mão de obra, gere PDF com a logo da sua oficina e envie pelo WhatsApp para o cliente aprovar.",
  },
  {
    icon: MessageCircle,
    title: "WhatsApp em cada etapa",
    description:
      "Mensagens prontas para enviar ao cliente com 1 clique. Sem digitar, sem esquecer de avisar.",
  },
  {
    icon: GitBranch,
    title: "Gestão completa de OS pela Pipeline",
    description:
      "Acompanhe cada carro do orçamento até a entrega. Etapas claras, sem perder nada no caminho.",
  },
  {
    icon: Eye,
    title: "Serviço Ao Vivo",
    live: true,
    description:
      "O cliente acompanha o próprio carro em tempo real pelo celular — igual rastreio de pedido, sem precisar ligar.",
  },
  {
    icon: Users,
    title: "CRM — Controle e gestão de clientes",
    description:
      "Todo cliente e veículo que passou pela oficina fica salvo com histórico de serviços, valores e datas.",
  },
  {
    icon: BarChart3,
    title: "Indicadores reais da oficina",
    description:
      "Saiba exatamente quantas OS estão abertas, quanto faturou no mês e qual serviço mais dá lucro.",
  },
  {
    icon: Smartphone,
    title: "Acompanhe tudo pelo seu celular",
    description:
      "Sistema 100% responsivo. Veja a pipeline, status das OS e indicadores direto do celular, onde estiver.",
  },
  {
    icon: LayoutGrid,
    title: "Gestão de Pátio",
    description:
      "Controle quais carros estão na oficina, em qual técnico cada um está alocado e o prazo de entrega de cada serviço.",
  },
  {
    icon: UserCog,
    title: "Acompanhe a produtividade da sua equipe",
    description:
      "Veja quantos serviços cada técnico entregou, tempo médio por etapa e identifique gargalos antes que virem prejuízo.",
  },
];

const Benefits = () => {
  return (
    <section
      id="recursos"
      className="py-24"
      style={{ backgroundColor: "hsl(var(--benefits-bg))" }}
    >
      <div className="container mx-auto max-w-[1280px] px-6 lg:px-8">
        <div className="mb-6 max-w-2xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
            Recursos
          </p>
          <h2 className="mb-4 text-3xl font-extrabold sm:text-4xl">
            Tudo que sua oficina precisa para crescer
          </h2>
          <p className="text-muted-foreground">
            Ferramentas práticas pensadas por quem entende a rotina de uma oficina de funilaria e pintura.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b, i) => (
            <div
              key={i}
              className="rounded-2xl border-2 border-dashed border-border bg-card p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50 hover:shadow-lg"
            >
              {b.live ? (
                <div className="mb-5 flex h-12 items-center">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/15 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wide text-primary">
                    <span className="relative flex h-2 w-2">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                    </span>
                    Ao vivo
                  </span>
                </div>
              ) : (
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-muted">
                  <b.icon className="h-5 w-5 text-primary" />
                </div>
              )}
              <h3 className="mb-2 text-base font-semibold text-foreground">{b.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{b.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
