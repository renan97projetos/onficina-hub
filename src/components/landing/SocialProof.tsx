const testimonials = [
  {
    initial: "R",
    name: "Roberto Silva",
    role: "Dono da Funilaria Silva & Filhos",
    location: "São Paulo, SP",
    text: "Antes eu perdia tempo procurando papel. Agora abro o celular e sei exatamente o status de cada carro. Minha produção aumentou uns 30%.",
  },
  {
    initial: "M",
    name: "Marcos Oliveira",
    role: "Proprietário da Auto Pintura Express",
    location: "Belo Horizonte, MG",
    text: "O controle financeiro mudou meu negócio. Finalmente sei quanto cada serviço me dá de lucro real, depois de descontar tudo.",
  },
  {
    initial: "A",
    name: "Ana Paula Costa",
    role: "Gestora da Costa Funilaria",
    location: "Curitiba, PR",
    text: "Meus clientes adoram receber as fotos do andamento do serviço. Passa confiança e profissionalismo. Já ganhei indicações por causa disso.",
  },
];

const stats = [
  { value: "500+", label: "Oficinas ativas" },
  { value: "50mil+", label: "Ordens de serviço" },
  { value: "98%", label: "Satisfação" },
  { value: "24h", label: "Suporte" },
];

const SocialProof = () => {
  return (
    <section id="depoimentos" className="py-24">
      <div className="container mx-auto px-4">
        <div className="mb-6 max-w-2xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
            Depoimentos
          </p>
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            Quem usa, recomenda
          </h2>
          <p className="text-muted-foreground">
            Oficinas de todo o Brasil já transformaram sua gestão com o ONficina.
          </p>
        </div>

        <div className="mt-12 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border bg-background p-6 transition-all duration-300 hover:shadow-md"
            >
              <p className="mb-6 text-sm leading-relaxed text-foreground">
                "{t.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-semibold text-muted-foreground">
                  {t.initial}
                </div>
                <div>
                  <div className="text-sm font-semibold text-foreground">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.role}</div>
                  <div className="text-xs text-muted-foreground">{t.location}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mx-auto mt-20 grid max-w-4xl grid-cols-2 gap-8 border-t border-border pt-16 sm:grid-cols-4">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-4xl font-bold text-foreground sm:text-5xl">{s.value}</div>
              <div className="mt-2 text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;