import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const PLAN_META: Record<
  string,
  { label: string; badge: string; price: string | null }
> = {
  trial: {
    label: "Trial",
    badge: "bg-muted text-muted-foreground",
    price: null,
  },
  starter: {
    label: "Starter",
    badge: "bg-emerald-500/15 text-emerald-500",
    price: "R$ 97/mês",
  },
  pro: {
    label: "Pro",
    badge: "bg-purple-500/15 text-purple-500",
    price: "R$ 197/mês",
  },
};

const PainelAssinatura = () => {
  const { oficina, loading } = useAuth();

  const plano = oficina?.plano ?? "trial";
  const meta = PLAN_META[plano] ?? PLAN_META.trial;

  const diasRestantes = (() => {
    if (plano !== "trial" || !oficina?.trial_expires_at) return null;
    const ms = new Date(oficina.trial_expires_at).getTime() - Date.now();
    return Math.max(0, Math.ceil(ms / (24 * 60 * 60 * 1000)));
  })();

  // stripe_customer_id ainda não existe em oficinas — feature flag
  const stripeCustomerId: string | null = null;

  const podeUpgrade = plano === "trial" || plano === "starter";

  return (
    <div className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto w-full max-w-md space-y-8">
        <div className="flex justify-center">
          <Logo size="md" />
        </div>

        <Card className="space-y-6 p-8">
          <div className="text-center">
            <h1 className="text-xl font-bold">Sua assinatura</h1>
            {oficina?.nome && (
              <p className="mt-1 text-sm text-muted-foreground">{oficina.nome}</p>
            )}
          </div>

          <div className="flex flex-col items-center gap-3">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${meta.badge}`}
            >
              Plano {meta.label}
            </span>

            {loading ? (
              <p className="text-sm text-muted-foreground">Carregando…</p>
            ) : plano === "trial" ? (
              <p className="text-sm text-muted-foreground">
                {diasRestantes !== null
                  ? `${diasRestantes} ${diasRestantes === 1 ? "dia restante" : "dias restantes"} do seu período gratuito`
                  : "Período gratuito ativo"}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">Plano ativo</p>
            )}

            {meta.price && (
              <p className="text-2xl font-bold">{meta.price}</p>
            )}
          </div>

          <div className="space-y-2">
            {podeUpgrade && (
              <Button asChild className="w-full">
                <Link to="/assinar">Fazer upgrade</Link>
              </Button>
            )}

            {stripeCustomerId && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span className="block w-full">
                      <Button
                        variant="outline"
                        className="w-full"
                        disabled
                      >
                        Gerenciar assinatura via Stripe
                      </Button>
                    </span>
                  </TooltipTrigger>
                  <TooltipContent>
                    Em breve — integração Stripe em andamento
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}

            <div className="pt-2 text-center">
              <Link
                to="/assinar"
                className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                Ver planos
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PainelAssinatura;
