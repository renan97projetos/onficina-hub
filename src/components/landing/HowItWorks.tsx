import { FileText, Send, Wrench, CreditCard } from "lucide-react";

const steps = [
  {
    icon: FileText,
    title: "Cliente solicita orçamento",
    description: "Formulário online com fotos do veículo e descrição do dano.",
  },
  {
    icon: Send,
    title: "Oficina envia proposta",
    description: "Defina valor, serviços e envie por WhatsApp e e-mail.",
  },
  {
    icon: Wrench,
    title: "Serviço com acompanhamento",
    description: "Cliente acompanha cada etapa em tempo real pelo celular.",
  },
  {
    icon: CreditCard,
    title: "Pagamento e avaliação",
    description: "Pagamento online ou presencial. Avaliação no Google automática.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
            Como funciona
          </p>
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            4 passos para uma oficina organizada
          </h2>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div key={i} className="relative text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
                <step.icon className="h-6 w-6 text-primary" />
              </div>
              <div className="mb-2 text-xs font-bold uppercase tracking-widest text-primary">
                Passo {i + 1}
              </div>
              <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
