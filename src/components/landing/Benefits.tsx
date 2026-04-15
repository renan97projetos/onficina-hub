import { TrendingUp, FolderKanban, ShieldCheck, Zap, BarChart3, Users } from "lucide-react";

const benefits = [
  {
    icon: TrendingUp,
    title: "Controle financeiro sem planilhas",
    description: "Faturamento, recibos e contas a receber em um painel visual. Chega de Excel.",
  },
  {
    icon: FolderKanban,
    title: "Organize sua oficina em um só lugar",
    description: "Pipeline kanban com todas as etapas: do orçamento à finalização do serviço.",
  },
  {
    icon: Zap,
    title: "Reduza erros operacionais",
    description: "Automações que eliminam retrabalho: notificações, status e cobranças automáticas.",
  },
  {
    icon: ShieldCheck,
    title: "Transparência para o cliente",
    description: "Seu cliente acompanha o serviço em tempo real pelo celular, etapa por etapa.",
  },
  {
    icon: BarChart3,
    title: "Decisões baseadas em dados",
    description: "Relatórios de desempenho, ticket médio e faturamento mensal sempre atualizados.",
  },
  {
    icon: Users,
    title: "Equipe sincronizada",
    description: "Colaboradores vinculados aos serviços, agenda organizada e progresso compartilhado.",
  },
];

const Benefits = () => {
  return (
    <section id="funcionalidades" className="py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
            Por que o ONficina?
          </p>
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            Resultados reais para sua oficina
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Focamos no que importa: mais organização, menos trabalho manual e clientes satisfeitos.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b, i) => (
            <div
              key={i}
              className="group rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300 hover:border-primary/30 hover:bg-surface-elevated"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/15">
                <b.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">{b.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{b.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
