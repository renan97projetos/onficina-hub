import dashboardPreview from "@/assets/dashboard-preview.jpg";

const Demo = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
            Conheça o sistema
          </p>
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            Tudo que você precisa, em um único painel
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Ordens de serviço, controle financeiro e pipeline de atendimento — visual, intuitivo e profissional.
          </p>
        </div>

        <div className="relative mx-auto max-w-5xl">
          <div className="overflow-hidden rounded-2xl border border-border/50 shadow-2xl shadow-primary/5">
            <img
              src={dashboardPreview}
              alt="Demonstração do painel ONficina com ordens de serviço, financeiro e pipeline"
              loading="lazy"
              width={1280}
              height={800}
              className="w-full"
            />
          </div>
          <div className="pointer-events-none absolute -inset-8 -z-10 rounded-3xl bg-primary/5 blur-3xl" />

          {/* Feature labels */}
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
            {[
              { label: "Pipeline Kanban", desc: "Visualize cada orçamento do início ao fim" },
              { label: "Controle Financeiro", desc: "Faturamento, recibos e contas a receber" },
              { label: "Acompanhamento", desc: "Progresso em tempo real para você e seu cliente" },
            ].map((item, i) => (
              <div key={i} className="rounded-xl border border-border/50 bg-card p-5 text-center">
                <h4 className="mb-1 font-semibold">{item.label}</h4>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Demo;
