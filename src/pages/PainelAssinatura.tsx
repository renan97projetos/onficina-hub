import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { AlertTriangle, CheckCircle2, Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { getStripeEnvironment } from "@/lib/stripe";
import { toast } from "sonner";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PaymentTestModeBanner } from "@/components/PaymentTestModeBanner";
import { useQuery } from "@tanstack/react-query";

const PLAN_META: Record<
  string,
  { label: string; badge: string; price: string | null }
> = {
  trial: { label: "Trial", badge: "bg-muted text-muted-foreground", price: null },
  starter: { label: "Starter", badge: "bg-emerald-500/15 text-emerald-500", price: "R$ 97/mês" },
  pro: { label: "Pro", badge: "bg-purple-500/15 text-purple-500", price: "R$ 197/mês" },
};

const PainelAssinatura = () => {
  const { oficina, oficina_id, loading } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [openingPortal, setOpeningPortal] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const status = searchParams.get("status");

  // Polling após retorno do checkout: aguarda webhook atualizar oficina
  useEffect(() => {
    if (status !== "success" || !oficina_id) return;

    let cancelled = false;
    let attempts = 0;
    setSyncing(true);

    const poll = async () => {
      while (!cancelled && attempts < 15) {
        attempts++;
        const { data } = await supabase
          .from("oficinas")
          .select("plano")
          .eq("id", oficina_id)
          .maybeSingle();

        if (data?.plano && data.plano !== "trial") {
          if (!cancelled) {
            setSyncing(false);
            toast.success("Assinatura ativada!");
            // limpa querystring
            const np = new URLSearchParams(searchParams);
            np.delete("status");
            np.delete("session_id");
            setSearchParams(np, { replace: true });
            window.location.reload();
          }
          return;
        }
        await new Promise((r) => setTimeout(r, 2000));
      }
      if (!cancelled) {
        setSyncing(false);
        toast.error(
          "Pagamento confirmado, mas a sincronização está demorando. Recarregue em alguns segundos.",
        );
      }
    };

    poll();
    return () => {
      cancelled = true;
    };
  }, [status, oficina_id, searchParams, setSearchParams]);

  const plano = oficina?.plano ?? "trial";
  const meta = PLAN_META[plano] ?? PLAN_META.trial;

  // Carrega subscription para detectar past_due / cancel_at_period_end
  const { data: subscription } = useQuery({
    queryKey: ["subscription", oficina_id, getStripeEnvironment()],
    enabled: !!oficina_id,
    queryFn: async () => {
      const { data } = await supabase
        .from("subscriptions")
        .select("status, current_period_end, cancel_at_period_end")
        .eq("oficina_id", oficina_id!)
        .eq("environment", getStripeEnvironment())
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      return data;
    },
  });

  const isPastDue = subscription?.status === "past_due";
  const willCancel = subscription?.cancel_at_period_end && subscription?.current_period_end;

  const diasRestantes = (() => {
    if (plano !== "trial" || !oficina?.trial_expires_at) return null;
    const ms = new Date(oficina.trial_expires_at).getTime() - Date.now();
    return Math.max(0, Math.ceil(ms / (24 * 60 * 60 * 1000)));
  })();

  const stripeCustomerId = oficina?.stripe_customer_id ?? null;
  const podeUpgrade = plano === "trial" || plano === "starter";

  const handleAbrirPortal = async () => {
    setOpeningPortal(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "create-portal-session",
        {
          body: {
            environment: getStripeEnvironment(),
            returnUrl: `${window.location.origin}/painel/assinatura`,
          },
        },
      );
      if (error) throw error;
      if (!data?.url) throw new Error("URL do portal não retornada");
      window.open(data.url, "_blank");
    } catch (err) {
      console.error(err);
      toast.error((err as Error).message ?? "Erro ao abrir portal.");
    } finally {
      setOpeningPortal(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <PaymentTestModeBanner />
      <div className="mx-auto w-full max-w-md space-y-8 px-4 py-12">
        <div className="flex justify-center">
          <Logo size="md" />
        </div>

        {syncing && (
          <Card className="flex items-center gap-3 p-4 border-primary/40 bg-primary/5">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
            <div className="text-sm">
              <p className="font-medium">Confirmando seu pagamento…</p>
              <p className="text-xs text-muted-foreground">
                Pode levar alguns segundos.
              </p>
            </div>
          </Card>
        )}

        {status === "success" && !syncing && plano !== "trial" && (
          <Card className="flex items-center gap-3 p-4 border-emerald-500/30 bg-emerald-500/5">
            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
            <p className="text-sm font-medium">Plano ativo!</p>
          </Card>
        )}

        {isPastDue && (
          <Card className="flex items-start gap-3 p-4 border-destructive/40 bg-destructive/5">
            <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-destructive">Pagamento pendente</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Seu último pagamento falhou e estamos tentando cobrar novamente. Atualize seu cartão clicando em <strong>Gerenciar assinatura</strong> abaixo para evitar a interrupção do serviço.
              </p>
            </div>
          </Card>
        )}

        {willCancel && !isPastDue && (
          <Card className="flex items-start gap-3 p-4 border-amber-500/40 bg-amber-500/5">
            <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-amber-600 dark:text-amber-400">Assinatura cancelada</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Você ainda tem acesso até {new Date(subscription!.current_period_end!).toLocaleDateString("pt-BR")}. Reative pelo Portal a qualquer momento.
              </p>
            </div>
          </Card>
        )}
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

            {meta.price && <p className="text-2xl font-bold">{meta.price}</p>}
          </div>

          <div className="space-y-2">
            {podeUpgrade && (
              <Button asChild className="w-full">
                <Link to="/assinar">
                  {plano === "trial" ? "Assinar agora" : "Fazer upgrade"}
                </Link>
              </Button>
            )}

            {stripeCustomerId && (
              <Button
                variant="outline"
                className="w-full"
                onClick={handleAbrirPortal}
                disabled={openingPortal}
              >
                {openingPortal && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Gerenciar assinatura
              </Button>
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
