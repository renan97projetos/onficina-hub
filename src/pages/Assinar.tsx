import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { AlertTriangle, ArrowLeft, Check } from "lucide-react";
import Logo from "@/components/Logo";
import { useAuth } from "@/contexts/AuthContext";
import { StripeEmbeddedCheckout } from "@/components/StripeEmbeddedCheckout";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";

const plans = [
  {
    name: "Starter",
    priceId: "starter_monthly",
    desc: "Para digitalizar sua oficina do jeito certo",
    monthlyPrice: 97,
    popular: false,
    features: [
      "Orçamentos profissionais em PDF com envio pelo WhatsApp",
      "Gestão completa de OS pela Pipeline",
      "Mensagens prontas no WhatsApp em cada etapa",
      "ServiçoAo Vivo — cliente acompanha em tempo real",
      "Painel do técnico no celular — sem instalar nenhum app",
      "Registro de fotos de entrada e saída do veículo",
      "CRM — histórico de clientes e veículos",
      "Avaliação no sistema e no Google",
      "Controle financeiro",
      "Indicadores da oficina",
      "Notificações automáticas por e-mail",
      "Onboarding guiado + treinamentos",
      "1 usuário",
    ],
  },
  {
    name: "Pro",
    priceId: "pro_monthly",
    desc: "Para oficinas que querem crescer com controle",
    monthlyPrice: 197,
    popular: true,
    features: [
      "Tudo do Starter",
      "Gestão de Pátio (3 visões: técnico, serviço e OS)",
      "Controle de Agendamento",
      "Site próprio da sua oficina",
      "Gestão de performance da equipe",
      "Analytics avançado",
      "Acesso para sua equipe com permissões",
      "Suporte prioritário",
    ],
  },
];

const Assinar = () => {
  const { trialExpired, oficina, session, loading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const requestedPlan = searchParams.get("plan");
  const [selectedPriceId, setSelectedPriceId] = useState<string | null>(
    plans.some((plan) => plan.priceId === requestedPlan) ? requestedPlan : null,
  );

  const returnUrl = `${window.location.origin}/painel/assinatura?status=success&session_id={CHECKOUT_SESSION_ID}`;

  const handleSelectPlan = (priceId: string) => {
    if (loading) return;

    if (!session) {
      navigate(`/login?returnUrl=${encodeURIComponent(`/assinar?plan=${priceId}`)}`);
      return;
    }

    setSelectedPriceId(priceId);
  };

  if (selectedPriceId && session) {
    return (
      <div className="min-h-screen bg-background">
        <PaymentTestModeBanner />
        <div className="mx-auto max-w-2xl px-4 py-8">
          <button
            onClick={() => setSelectedPriceId(null)}
            className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Voltar
          </button>
          <div className="rounded-xl border border-border bg-card p-2 sm:p-4">
            <StripeEmbeddedCheckout priceId={selectedPriceId} returnUrl={returnUrl} />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <PaymentTestModeBanner />
      <div className="mx-auto max-w-3xl space-y-8 px-4 py-12">
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

        <div className="mx-auto grid max-w-2xl gap-4 sm:grid-cols-2">
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
              <p className="mt-1 text-xs text-muted-foreground">{p.desc}</p>
              <div className="mt-3 text-2xl font-bold">
                R$ {p.monthlyPrice}
                <span className="text-sm font-normal text-muted-foreground">/mês</span>
              </div>
              <ul className="mt-4 space-y-2">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              <button
                onClick={() => handleSelectPlan(p.priceId)}
                disabled={loading}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110"
              >
                Assinar {p.name}
              </button>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-muted-foreground">
          Pagamento seguro. Cancele a qualquer momento.
        </p>
      </div>
    </div>
  );
};

export default Assinar;
