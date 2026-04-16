import { Link, useSearchParams } from "react-router-dom";
import { AlertTriangle, Check } from "lucide-react";
import Logo from "@/components/Logo";
import { useAuth } from "@/contexts/AuthContext";

const plans = [
  {
    name: "Básico",
    monthlyPrice: 97,
    yearlyPrice: 970,
    features: ["Pipeline completo", "Até 2 colaboradores", "Notificações", "Financeiro básico"],
  },
  {
    name: "Pro",
    monthlyPrice: 197,
    yearlyPrice: 1970,
    popular: true,
    features: ["Tudo do Básico", "Até 5 colaboradores", "Agendamento", "CRM", "Relatórios avançados"],
  },
  {
    name: "Premium",
    monthlyPrice: 297,
    yearlyPrice: 2970,
    features: ["Tudo do Pro", "Colaboradores ilimitados", "Landing page", "WhatsApp Business API"],
  },
];

const Assinar = () => {
  const { trialExpired, oficina } = useAuth();
  const [searchParams] = useSearchParams();
  const annual = searchParams.get("ciclo") === "anual";

  return (
    <div className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-block">
            <Logo size="lg" />
          </Link>

          {trialExpired ? (
            <div className="mx-auto mt-6 max-w-md rounded-xl border border-warning/30 bg-warning/5 p-4">
              <div className="flex items-center justify-center gap-2 text-warning">
                <AlertTriangle className="h-5 w-5" />
                <h1 className="text-lg font-bold">Seu período de teste expirou</h1>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                {oficina?.nome ? `A oficina "${oficina.nome}" precisa` : "Você precisa"} de um plano ativo para continuar usando o sistema.
              </p>
            </div>
          ) : (
            <>
              <h1 className="mt-6 text-2xl font-bold">Escolha seu plano</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Assine agora e tenha acesso completo ao ONficina
              </p>
            </>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {plans.map((p) => (
            <div
              key={p.name}
              className={`relative rounded-xl border p-6 transition-all ${
                p.popular
                  ? "border-primary bg-primary/5 shadow-lg shadow-primary/10"
                  : "border-border hover:border-primary/30"
              }`}
            >
              {p.popular && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-[10px] font-bold uppercase text-primary-foreground">
                  Popular
                </span>
              )}
              <div className="text-sm font-semibold">{p.name}</div>
              <div className="mt-2 text-2xl font-bold">
                R$ {annual ? Math.round(p.yearlyPrice / 12) : p.monthlyPrice}
                <span className="text-sm font-normal text-muted-foreground">/mês</span>
              </div>
              {annual && (
                <p className="text-xs text-muted-foreground">
                  R$ {p.yearlyPrice}/ano (economize 17%)
                </p>
              )}
              <ul className="mt-4 space-y-2">
                {p.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Check className="h-3.5 w-3.5 shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              <button className="mt-6 w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110">
                Assinar {p.name}
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Pagamento seguro via Stripe. Cancele a qualquer momento.
        </p>
      </div>
    </div>
  );
};

export default Assinar;
