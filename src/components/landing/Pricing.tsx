import { Link } from "react-router-dom";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Essencial",
    price: "R$ 149",
    period: "/mês",
    popular: false,
    features: [
      "Até 50 OS por mês",
      "1 usuário",
      "Cadastro de clientes e veículos",
      "Relatórios básicos",
      "Suporte por e-mail",
    ],
  },
  {
    name: "Profissional",
    price: "R$ 299",
    period: "/mês",
    popular: true,
    features: [
      "OS ilimitadas",
      "Até 5 usuários",
      "Financeiro completo",
      "Relatórios avançados",
      "Notificações WhatsApp",
      "Suporte prioritário",
    ],
  },
  {
    name: "Empresarial",
    price: "R$ 499",
    period: "/mês",
    popular: false,
    features: [
      "Tudo do Profissional",
      "Usuários ilimitados",
      "Multi-filiais",
      "Gerente de conta dedicado",
      "Treinamento da equipe",
    ],
  },
];

const Pricing = () => {
  return (
    <section id="planos" className="py-24 bg-card/50">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
            Preços
          </p>
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">
            Planos que cabem no seu bolso
          </h2>
          <p className="text-muted-foreground">
            Comece grátis por 14 dias. Sem compromisso.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-8 transition-all duration-300 ${
                plan.popular
                  ? "border-primary/50 bg-card shadow-lg shadow-primary/10 scale-[1.03]"
                  : "border-border/50 bg-card hover:border-primary/20"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-bold text-primary-foreground">
                  Mais popular
                </div>
              )}

              <h3 className="mb-2 text-xl font-bold">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">{plan.price}</span>
                <span className="text-muted-foreground">{plan.period}</span>
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
                className={`block w-full rounded-full py-3 text-center text-sm font-semibold transition-all ${
                  plan.popular
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "border border-border text-foreground hover:bg-secondary"
                }`}
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
