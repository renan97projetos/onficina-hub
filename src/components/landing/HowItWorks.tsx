const steps = [
  {
    num: "01",
    title: "Cadastre o veículo",
    description: "Registre o veículo com fotos e dados do cliente em menos de 2 minutos.",
  },
  {
    num: "02",
    title: "Crie o orçamento",
    description: "Adicione peças, mão de obra e envie por WhatsApp ou e-mail para aprovação.",
  },
  {
    num: "03",
    title: "Acompanhe o serviço",
    description: "Status em tempo real por etapa. Seu cliente acompanha pelo celular.",
  },
  {
    num: "04",
    title: "Finalize e receba",
    description: "Gere nota, receba o pagamento e mantenha o histórico salvo automaticamente.",
  },
];

const HowItWorks = () => {
  return (
    <section id="como-funciona" className="py-24 bg-card/50">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
            Como funciona
          </p>
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            Simples como deve ser
          </h2>
          <p className="text-muted-foreground">
            Você não precisa ser expert em tecnologia
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div key={i} className="relative text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
                <span className="text-lg font-bold text-primary">{step.num}</span>
              </div>
              <h3 className="mb-2 text-lg font-semibold">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>

              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="absolute right-0 top-7 hidden h-px w-8 translate-x-full bg-border lg:block" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
