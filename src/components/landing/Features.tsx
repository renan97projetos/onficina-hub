import {
  LayoutDashboard,
  Bell,
  DollarSign,
  Eye,
  CalendarDays,
  BarChart3,
} from "lucide-react";

const features = [
  {
    icon: LayoutDashboard,
    title: "Pipeline de orçamentos",
    description: "Kanban visual com todas as etapas: do envio à finalização.",
  },
  {
    icon: Bell,
    title: "Notificações automáticas",
    description: "WhatsApp e e-mail para cada etapa do processo.",
  },
  {
    icon: DollarSign,
    title: "Módulo financeiro",
    description: "Controle de pagamentos, recibos, faturamento e contas a receber.",
  },
  {
    icon: Eye,
    title: "Acompanhamento em tempo real",
    description: "Seu cliente acompanha o serviço pelo celular, etapa por etapa.",
  },
  {
    icon: CalendarDays,
    title: "Agendamento",
    description: "Agenda de serviços com horários configuráveis por dia da semana.",
  },
  {
    icon: BarChart3,
    title: "Relatórios",
    description: "Métricas de desempenho, ticket médio e faturamento mensal.",
  },
];

const Features = () => {
  return (
    <section id="funcionalidades" className="border-t border-border py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Funcionalidades</h2>
          <p className="text-muted-foreground">
            Tudo que sua oficina precisa em um só lugar.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <div
              key={i}
              className="group rounded-2xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:bg-surface-elevated"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                <f.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{f.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
