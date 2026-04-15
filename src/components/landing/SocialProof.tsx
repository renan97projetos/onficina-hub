import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Roberto Silva",
    role: "Funilaria Silva & Filhos — SP",
    text: "Conseguimos aumentar a produção em 30% só organizando melhor as ordens de serviço. O sistema é muito intuitivo.",
    rating: 5,
  },
  {
    name: "Marcos Oliveira",
    role: "Auto Pintura Express — MG",
    text: "Antes eu não sabia quanto lucrava por serviço. Agora tenho controle total do financeiro e das margens.",
    rating: 5,
  },
  {
    name: "Ana Paula Costa",
    role: "Costa Funilaria — PR",
    text: "Meus clientes adoram receber fotos do progresso do serviço. A confiança aumentou e as indicações também.",
    rating: 5,
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
        {/* Testimonials */}
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
            Depoimentos
          </p>
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            Quem usa, recomenda
          </h2>
        </div>

        <div className="mx-auto mb-20 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300 hover:border-primary/20"
            >
              <div className="mb-4 flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="mb-5 text-sm leading-relaxed text-muted-foreground">"{t.text}"</p>
              <div>
                <div className="font-semibold">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mx-auto grid max-w-4xl grid-cols-2 gap-8 sm:grid-cols-4">
          {stats.map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-bold text-primary sm:text-4xl">{s.value}</div>
              <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SocialProof;
