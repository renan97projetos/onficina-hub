import { FileText, DollarSign, BarChart3, Users, Clock, Shield } from "lucide-react";

const benefits = [
  {
    icon: FileText,
    title: "Ordens de serviço digitais",
    description: "Crie, acompanhe e finalize OS com fotos, peças e histórico completo do veículo.",
  },
  {
    icon: DollarSign,
    title: "Controle financeiro",
    description: "Entradas, saídas, custos de peças e margem de lucro. Tudo em tempo real.",
  },
  {
    icon: BarChart3,
    title: "Relatórios que fazem sentido",
    description: "Saiba quais serviços dão mais lucro, tempo médio por reparo e produtividade da equipe.",
  },
  {
    icon: Users,
    title: "Cadastro de clientes",
    description: "Histórico completo de cada cliente e veículo. Fidelização facilitada.",
  },
  {
    icon: Clock,
    title: "Agendamento inteligente",
    description: "Organize a fila de serviços e saiba exatamente quando cada carro ficará pronto.",
  },
  {
    icon: Shield,
    title: "Dados seguros",
    description: "Backup automático na nuvem. Seus dados protegidos e acessíveis de qualquer lugar.",
  },
];

const Benefits = () => {
  return (
    <section id="recursos" className="py-24">
      <div className="container mx-auto px-4">
        <div className="mb-6 max-w-2xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
            Recursos
          </p>
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            Tudo que sua oficina precisa para crescer
          </h2>
          <p className="text-muted-foreground">
            Ferramentas práticas pensadas por quem entende a rotina de uma oficina de funilaria e pintura.
          </p>
        </div>

        <div className="mt-12 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((b, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border bg-background p-6 transition-all duration-300 hover:shadow-md"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl border border-border">
                <b.icon className="h-5 w-5 text-foreground" />
              </div>
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