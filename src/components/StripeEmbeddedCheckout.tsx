import { useState } from "react";
import {
  EmbeddedCheckoutProvider,
  EmbeddedCheckout,
} from "@stripe/react-stripe-js";
import { Loader2, AlertTriangle } from "lucide-react";
import { getStripe, getStripeEnvironment } from "@/lib/stripe";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
  priceId: string;
  returnUrl: string;
}

export function StripeEmbeddedCheckout({ priceId, returnUrl }: Props) {
  const { session, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const fetchClientSecret = async (): Promise<string> => {
    try {
      if (!session?.access_token) {
        throw new Error("Você precisa estar logado para assinar. Faça login e tente novamente.");
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
            apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          },
          body: JSON.stringify({
            priceId,
            returnUrl,
            environment: getStripeEnvironment(),
          }),
        },
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        console.error("[checkout] http error:", response.status, data);
        throw new Error(data?.error || "Falha ao iniciar checkout");
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

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 p-6 text-center">
        <AlertTriangle className="h-8 w-8 text-destructive" />
        <h3 className="text-base font-semibold text-foreground">Não foi possível abrir o checkout</h3>
        <p className="max-w-md text-sm text-muted-foreground">
          Você precisa estar logado para assinar. Faça login e tente novamente.
        </p>
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
