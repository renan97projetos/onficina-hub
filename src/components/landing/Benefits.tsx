import { FileText, DollarSign, BarChart3, Users, CalendarClock, ShieldCheck } from "lucide-react";

const benefits = [
  {
    icon: FileText,
    title: "Ordens de serviço digitais",
    description: "Crie, acompanhe e finalize OS com fotos, peças e mão de obra detalhadas.",
  },
  {
    icon: DollarSign,
    title: "Controle financeiro",
    description: "Entradas, saídas, custos por serviço e margem de lucro em tempo real.",
  },
  {
    icon: BarChart3,
    title: "Relatórios que fazem sentido",
    description: "Serviços mais lucrativos, tempo médio de entrega e produtividade da equipe.",
  },
  {
    icon: Users,
    title: "Cadastro de clientes",
    description: "Histórico completo de cada cliente e veículo. Fidelização automática.",
  },
  {
    icon: CalendarClock,
    title: "Agendamento inteligente",
    description: "Fila de serviços organizada por prioridade e disponibilidade da equipe.",
  },
  {
    icon: ShieldCheck,
    title: "Dados seguros na nuvem",
    description: "Backup automático diário. Seus dados protegidos com criptografia.",
  },
];

const Benefits = () => {
  return (
    <section id="recursos" className="py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
            Recursos
          </p>
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            Tudo que sua oficina precisa para crescer
          </h2>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b, i) => (
            <div
              key={i}
              className="group rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
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
