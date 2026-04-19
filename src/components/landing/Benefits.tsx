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
    title: "Gestão de performance da sua equipe",
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
              className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              style={{
                backgroundImage:
                  "radial-gradient(circle, hsl(var(--foreground) / 0.08) 1px, transparent 1px)",
                backgroundSize: "14px 14px",
                backgroundPosition: "0 0",
              }}
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-muted">
                <b.icon className="h-5 w-5 text-primary" />
              </div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <h3 className="text-base font-semibold text-foreground">{b.title}</h3>
                {b.live && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-green-500/40 bg-green-500/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-green-500">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
                      <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
                    </span>
                    Ao vivo
                  </span>
                )}
              </div>
              <p className="text-sm leading-relaxed text-muted-foreground">{b.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
