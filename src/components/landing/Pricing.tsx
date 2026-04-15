import { Link } from "react-router-dom";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Essencial",
    desc: "Para oficinas que estão começando a se organizar",
    price: "—",
    period: "/mês",
    popular: false,
    features: [
      "Até 50 OS por mês",
      "1 usuário",
      "Cadastro de clientes",
      "Relatórios básicos",
      "Suporte por email",
    ],
  },
  {
    name: "Profissional",
    desc: "Para oficinas que querem crescer com controle",
    price: "—",
    period: "/mês",
    popular: true,
    features: [
      "OS ilimitadas",
      "Até 5 usuários",
      "Controle financeiro completo",
      "Relatórios avançados",
      "Envio de fotos por WhatsApp",
      "Suporte prioritário",
    ],
  },
  {
    name: "Empresarial",
    desc: "Para redes e oficinas de grande porte",
    price: "—",
    period: "/mês",
    popular: false,
    features: [
      "Tudo do Profissional",
      "Usuários ilimitados",
      "Multi-filiais",
      "API de integração",
      "Gerente de conta dedicado",
      "Treinamento da equipe",
    ],
  },
];

const Pricing = () => {
  return (
    <section id="planos" className="py-24">
      <div className="container mx-auto max-w-[1280px] px-6 lg:px-8">
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
            Preços
          </p>
          <h2 className="mb-4 text-3xl font-extrabold sm:text-4xl">
            Planos que cabem no seu bolso
          </h2>
          <p className="text-muted-foreground">
            Comece grátis por 14 dias. Sem compromisso, sem cartão de crédito.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border bg-card p-8 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg ${
                plan.popular
                  ? "border-primary shadow-lg shadow-primary/10"
                  : "border-white/10"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full px-4 py-1 text-xs font-bold text-primary-foreground" style={{ background: 'linear-gradient(180deg, #f97316, #ea580c)' }}>
                  Mais popular
                </div>
              )}

              <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{plan.desc}</p>

              <div className="mt-6 mb-8">
                <span className="text-sm text-muted-foreground">R$ </span>
                <span className="text-5xl font-bold text-foreground">{plan.price}</span>
                <span className="text-sm text-muted-foreground">{plan.period}</span>
              </div>

              <ul className="mb-8 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="text-muted-foreground">{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/cadastro"
                className={`block w-full rounded-full py-3.5 text-center text-sm font-semibold transition-all ${
                  plan.popular
                    ? "text-primary-foreground hover:brightness-110"
                    : "border border-white/20 text-foreground hover:bg-white/5"
                }`}
                style={plan.popular ? { background: 'linear-gradient(180deg, #f97316, #ea580c)' } : undefined}
              >
                Começar teste grátis
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;