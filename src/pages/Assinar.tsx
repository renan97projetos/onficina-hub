import { useState } from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Check, Loader2 } from "lucide-react";
import Logo from "@/components/Logo";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const plans = [
  {
    name: "Starter",
    desc: "Para digitalizar sua oficina do jeito certo",
    monthlyPrice: 97,
    popular: false,
    features: [
      "Orçamentos profissionais em PDF com envio pelo WhatsApp",
      "Gestão completa de OS pela Pipeline",
      "Mensagens prontas no WhatsApp em cada etapa",
      "ServiçoAo Vivo — cliente acompanha em tempo real",
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
  const { trialExpired, oficina } = useAuth();
  const [loadingPlano, setLoadingPlano] = useState<string | null>(null);

  const handleAssinar = async (plano: "starter" | "pro") => {
    setLoadingPlano(plano);
    try {
      const { data, error } = await supabase.functions.invoke(
        "create-checkout-session",
        { body: { plano } },
      );
      if (error) throw error;
      if (!data?.url) throw new Error("URL de checkout não retornada");
      window.location.href = data.url as string;
    } catch (err) {
      console.error(err);
      toast.error(
        (err as Error).message ?? "Erro ao iniciar checkout. Tente novamente.",
      );
      setLoadingPlano(null);
    }
  };

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

        <div className="grid gap-4 sm:grid-cols-2 mx-auto max-w-2xl">
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
                onClick={() => handleAssinar(p.name.toLowerCase() as "starter" | "pro")}
                disabled={loadingPlano !== null}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loadingPlano === p.name.toLowerCase() && (
                  <Loader2 className="h-4 w-4 animate-spin" />
                )}
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
