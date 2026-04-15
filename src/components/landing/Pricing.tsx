import { useState } from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";

const plans = [
  {
    name: "Básico",
    monthlyPrice: 97,
    yearlyPrice: 970,
    popular: false,
    features: [
      "Pipeline de orçamentos completo",
      "Até 2 colaboradores",
      "Notificações WhatsApp e e-mail",
      "Relatório financeiro básico",
      "Suporte por e-mail",
    ],
  },
  {
    name: "Pro",
    monthlyPrice: 197,
    yearlyPrice: 1970,
    popular: true,
    features: [
      "Tudo do Básico",
      "Até 5 colaboradores",
      "Agendamento online",
      "CRM de clientes e veículos",
      "Relatórios avançados",
      "Suporte prioritário",
    ],
  },
  {
    name: "Premium",
    monthlyPrice: 297,
    yearlyPrice: 2970,
    popular: false,
    features: [
      "Tudo do Pro",
      "Colaboradores ilimitados",
      "Landing page personalizada",
      "WhatsApp Business API",
      "Gerente de conta dedicado",
    ],
  },
];

const Pricing = () => {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="planos" className="border-t border-border py-24">
      <div className="container mx-auto px-4">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold sm:text-4xl">Planos</h2>
          <p className="mb-8 text-muted-foreground">
            Escolha o plano ideal para sua oficina.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-3 rounded-full border border-border bg-card p-1">
            <button
              onClick={() => setAnnual(false)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                !annual ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Mensal
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-all ${
                annual ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Anual
              <span className="ml-1.5 text-xs opacity-75">-17%</span>
            </button>
          </div>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-8 transition-all ${
                plan.popular
                  ? "border-primary bg-card shadow-lg shadow-primary/10 scale-105"
                  : "border-border bg-card hover:border-primary/30"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-bold text-primary-foreground">
                  Mais popular
                </div>
              )}

              <h3 className="mb-2 text-xl font-bold">{plan.name}</h3>
              <div className="mb-6">
                <span className="text-4xl font-bold">
                  R$ {annual ? Math.round(plan.yearlyPrice / 12) : plan.monthlyPrice}
                </span>
                <span className="text-muted-foreground">/mês</span>
                {annual && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    R$ {plan.yearlyPrice.toLocaleString("pt-BR")}/ano
                  </div>
                )}
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
                className={`block w-full rounded-xl py-3 text-center text-sm font-semibold transition-all ${
                  plan.popular
                    ? "bg-primary text-primary-foreground hover:brightness-110"
                    : "border border-border text-foreground hover:bg-surface-elevated"
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
