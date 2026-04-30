import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { type StripeEnv, verifyWebhook } from "../_shared/stripe.ts";

let _supabase: ReturnType<typeof createClient> | null = null;
function getSupabase() {
  if (!_supabase) {
    _supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
  }
  return _supabase;
}

function planoFromPriceId(priceId: string | undefined): string | null {
  if (!priceId) return null;
  if (priceId === "starter_monthly") return "starter";
  if (priceId === "pro_monthly") return "pro";
  return null;
}

async function upsertSubscription(subscription: any, env: StripeEnv) {
  const oficinaId = subscription.metadata?.oficina_id;
  if (!oficinaId) {
    console.error("Sem oficina_id na subscription metadata");
    return;
  }

  const item = subscription.items?.data?.[0];
  const priceId =
    item?.price?.metadata?.lovable_external_id ??
    subscription.metadata?.price_id ??
    item?.price?.id;
  const productId = item?.price?.product;
  const periodStart = item?.current_period_start ?? subscription.current_period_start;
  const periodEnd = item?.current_period_end ?? subscription.current_period_end;

  await getSupabase().from("subscriptions").upsert(
    {
      oficina_id: oficinaId,
      stripe_subscription_id: subscription.id,
      stripe_customer_id: subscription.customer,
      product_id: productId,
      price_id: priceId,
      status: subscription.status,
      current_period_start: periodStart
        ? new Date(periodStart * 1000).toISOString()
        : null,
      current_period_end: periodEnd
        ? new Date(periodEnd * 1000).toISOString()
        : null,
      cancel_at_period_end: subscription.cancel_at_period_end ?? false,
      environment: env,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "stripe_subscription_id" },
  );

  // Atualizar plano da oficina
  const plano = planoFromPriceId(priceId);
  const ativo =
    ["active", "trialing", "past_due"].includes(subscription.status) ||
    (subscription.status === "canceled" &&
      periodEnd &&
      new Date(periodEnd * 1000) > new Date());

  if (plano && ativo) {
    await getSupabase()
      .from("oficinas")
      .update({
        plano,
        stripe_customer_id: subscription.customer,
        stripe_subscription_id: subscription.id,
      })
      .eq("id", oficinaId);
  }
}

async function handleSubscriptionDeleted(subscription: any, env: StripeEnv) {
  const oficinaId = subscription.metadata?.oficina_id;

  await getSupabase()
    .from("subscriptions")
    .update({ status: "canceled", updated_at: new Date().toISOString() })
    .eq("stripe_subscription_id", subscription.id)
    .eq("environment", env);

  if (oficinaId) {
    await getSupabase()
      .from("oficinas")
      .update({ plano: "trial", stripe_subscription_id: null })
      .eq("id", oficinaId);
  }
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }
  const rawEnv = new URL(req.url).searchParams.get("env");
  if (rawEnv !== "sandbox" && rawEnv !== "live") {
    console.error("Webhook com env inválido:", rawEnv);
    return new Response(
      JSON.stringify({ received: true, ignored: "invalid env" }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  }
  const env: StripeEnv = rawEnv;

  try {
    const event = await verifyWebhook(req, env);

    switch (event.type) {
      case "customer.subscription.created":
      case "customer.subscription.updated":
        await upsertSubscription(event.data.object, env);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(event.data.object, env);
        break;
      default:
        console.log("Evento ignorado:", event.type);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("payments-webhook error:", err);
    return new Response(`Webhook error: ${(err as Error).message}`, {
      status: 400,
    });
  }
});
