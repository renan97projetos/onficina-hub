import { useEffect, useState } from "react";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { Loader2, AlertTriangle } from "lucide-react";
import { getStripe, getStripeEnvironment } from "@/lib/stripe";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  priceId: string;
  returnUrl: string;
}

export function StripeEmbeddedCheckout({ priceId, returnUrl }: Props) {
  const [error, setError] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  // Pré-checa sessão antes de montar o provider (evita tela preta silenciosa)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (cancelled) return;
      if (!session) {
        setError("Você precisa estar logado para assinar. Faça login e tente novamente.");
        return;
      }
      setReady(true);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const fetchClientSecret = async (): Promise<string> => {
    try {
      const { data, error: fnError } = await supabase.functions.invoke("create-checkout", {
        body: { priceId, returnUrl, environment: getStripeEnvironment() },
      });
      if (fnError) {
        console.error("[checkout] invoke error:", fnError);
        throw new Error(fnError.message || "Falha ao iniciar checkout");
      }
      if (!data?.clientSecret) {
        console.error("[checkout] no clientSecret:", data);
        throw new Error(data?.error || "Resposta inválida do servidor");
      }
      return data.clientSecret;
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Erro desconhecido";
      setError(msg);
      throw e;
    }
  };

  if (error) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 p-6 text-center">
        <AlertTriangle className="h-8 w-8 text-destructive" />
        <h3 className="text-base font-semibold text-foreground">Não foi possível abrir o checkout</h3>
        <p className="max-w-md text-sm text-muted-foreground">{error}</p>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div id="checkout" className="min-h-[500px]">
      <EmbeddedCheckoutProvider
        stripe={getStripe()}
        options={{ fetchClientSecret }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  );
}
