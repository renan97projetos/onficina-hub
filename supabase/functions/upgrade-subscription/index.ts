import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { type StripeEnv, createStripeClient } from "../_shared/stripe.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { targetPriceId, environment } = await req.json();
    if (!targetPriceId) throw new Error("targetPriceId obrigatório");
    if (environment !== "sandbox" && environment !== "live") {
      throw new Error("environment inválido");
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Não autenticado");
    const token = authHeader.replace("Bearer ", "");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
    if (authErr || !user) throw new Error("Token inválido");

    const { data: of } = await supabase
      .from("oficinas")
      .select("id")
      .eq("auth_user_id", user.id)
      .maybeSingle();
    if (!of?.id) throw new Error("Oficina não encontrada");

    const { data: sub } = await supabase
      .from("subscriptions")
      .select("stripe_subscription_id, stripe_customer_id")
      .eq("oficina_id", of.id)
      .eq("environment", environment)
      .in("status", ["active", "trialing", "past_due"])
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!sub?.stripe_subscription_id) {
      throw new Error("Nenhuma assinatura ativa encontrada");
    }

    const stripe = createStripeClient(environment as StripeEnv);

    const subscription = await stripe.subscriptions.retrieve(
      sub.stripe_subscription_id,
    );
    const currentItemId = subscription.items.data[0]?.id;
    if (!currentItemId) throw new Error("Item da assinatura não encontrado");

    const prices = await stripe.prices.list({ lookup_keys: [targetPriceId] });
    if (!prices.data.length) {
      throw new Error("Plano de destino não encontrado");
    }
    const newPriceId = prices.data[0].id;

    if (subscription.items.data[0].price.id === newPriceId) {
      throw new Error("Você já está neste plano");
    }

    await stripe.subscriptions.update(sub.stripe_subscription_id, {
      items: [{ id: currentItemId, price: newPriceId }],
      proration_behavior: "create_prorations",
      cancel_at_period_end: false,
    });

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("upgrade-subscription error:", err);
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
