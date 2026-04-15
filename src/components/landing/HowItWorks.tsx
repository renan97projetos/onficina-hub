const steps = [
  {
    num: "01",
    title: "Cadastre o veículo",
    description: "Registre o carro com fotos, dados do cliente e descrição do problema. Tudo em menos de 2 minutos.",
  },
  {
    num: "02",
    title: "Crie o orçamento",
    description: "Adicione peças, mão de obra e prazos. Envie para aprovação do cliente por WhatsApp ou email.",
  },
  {
    num: "03",
    title: "Acompanhe o serviço",
    description: "Atualize o status em tempo real. Funilaria, preparação, pintura, polimento. Cada etapa registrada.",
  },
  {
    num: "04",
    title: "Finalize e receba",
    description: "Gere a nota, registre o pagamento e encerre a OS. Histórico completo salvo automaticamente.",
  },
];

const HowItWorks = () => {
  return (
    <section id="como-funciona" className="py-24">
      <div className="container mx-auto max-w-[1280px] px-6 lg:px-8">
        <div className="mb-6 max-w-2xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
            Como funciona
          </p>
          <h2 className="mb-4 text-3xl font-extrabold sm:text-4xl">
            Simples como deve ser
          </h2>
          <p className="text-muted-foreground">
            Você não precisa ser expert em tecnologia. O sistema foi feito para ser usado no dia a dia da oficina.
          </p>
        </div>

        <div className="mt-16 grid max-w-6xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div key={i} className="relative">
              <div className="mb-4 flex items-end gap-2">
                <span className="text-6xl font-bold text-white/5 leading-none">{step.num}</span>
                {i < steps.length - 1 && (
                  <div className="mb-3 hidden h-px flex-1 bg-white/10 lg:block" />
                )}
              </div>
              <h3 className="mb-2 text-base font-semibold text-foreground">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;