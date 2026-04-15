import { useState } from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import Logo from "@/components/Logo";

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
    features: ["Tudo do Básico", "Até 5 colaboradores", "Agendamento", "CRM", "Relatórios avançados"],
  },
  {
    name: "Premium",
    monthlyPrice: 297,
    yearlyPrice: 2970,
    features: ["Tudo do Pro", "Colaboradores ilimitados", "Landing page", "WhatsApp Business API"],
  },
];

const Cadastro = () => {
  const [annual, setAnnual] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("Pro");

  return (
    <div className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-block">
            <Logo size="lg" />
          </Link>
          <h1 className="mt-6 text-2xl font-bold">Cadastre sua oficina</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Teste grátis por 14 dias — sem cartão de crédito
          </p>
        </div>

        <div className="space-y-6 rounded-2xl border border-border bg-card p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Nome da oficina</label>
              <input className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Nome do responsável</label>
              <input className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">E-mail</label>
              <input type="email" className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Telefone</label>
              <input type="tel" className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
            </div>
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Senha</label>
            <input type="password" className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary" />
          </div>

          {/* Plan selector */}
          <div>
            <label className="mb-3 block text-sm font-medium">Escolha seu plano</label>
            <div className="mb-4 flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background p-1">
                <button
                  onClick={() => setAnnual(false)}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${!annual ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
                >
                  Mensal
                </button>
                <button
                  onClick={() => setAnnual(true)}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${annual ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
                >
                  Anual (-17%)
                </button>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {plans.map((p) => (
                <button
                  key={p.name}
                  onClick={() => setSelectedPlan(p.name)}
                  className={`rounded-xl border p-4 text-left transition-all ${
                    selectedPlan === p.name
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <div className="text-sm font-semibold">{p.name}</div>
                  <div className="mt-1 text-lg font-bold">
                    R$ {annual ? Math.round(p.yearlyPrice / 12) : p.monthlyPrice}
                    <span className="text-xs font-normal text-muted-foreground">/mês</span>
                  </div>
                  <ul className="mt-2 space-y-1">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Check className="h-3 w-3 text-primary shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>
          </div>

          <button className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110">
            Iniciar teste grátis de 14 dias
          </button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Já tem conta?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Fazer login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Cadastro;
