import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import Stripe from "https://esm.sh/stripe@17.5.0?target=deno";

// Webhook precisa receber o body raw — nao pode aplicar CORS padrao.
// Stripe chama via servidor, sem preflight, entao basta responder OK.

const STARTER_MONTHLY = Deno.env.get("STRIPE_PRICE_STARTER_MONTHLY");
const PRO_MONTHLY = Deno.env.get("STRIPE_PRICE_PRO_MONTHLY");

function planoFromPriceId(priceId: string | undefined): string | null {
  if (!priceId) return null;
  if (priceId === STARTER_MONTHLY) return "starter";
  if (priceId === PRO_MONTHLY) return "pro";
  return null;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
    apiVersion: "2024-11-20.acacia",
  });

  const signature = req.headers.get("stripe-signature");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

  if (!signature || !webhookSecret) {
    return new Response("Missing signature or webhook secret", { status: 400 });
  }

  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(
      body,
      signature,
      webhookSecret,
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return new Response(`Webhook Error: ${(err as Error).message}`, {
      status: 400,
    });
  }

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const oficinaId =
          (session.metadata?.oficina_id as string | undefined) ??
          (session.client_reference_id as string | undefined);
        const plano =
          (session.metadata?.plano as string | undefined) ?? "starter";

        if (!oficinaId) {
          console.error("checkout.session.completed sem oficina_id");
          break;
        }

        const customerId =
          typeof session.customer === "string"
            ? session.customer
            : session.customer?.id;
        const subscriptionId =
          typeof session.subscription === "string"
            ? session.subscription
            : session.subscription?.id;

        await admin
          .from("oficinas")
          .update({
            plano,
            stripe_customer_id: customerId ?? null,
            stripe_subscription_id: subscriptionId ?? null,
          })
          .eq("id", oficinaId);
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const oficinaId = sub.metadata?.oficina_id as string | undefined;
        const priceId = sub.items.data[0]?.price?.id;
        const plano = planoFromPriceId(priceId);

        if (!oficinaId) break;

        const updates: Record<string, unknown> = {
          stripe_subscription_id: sub.id,
        };
        if (plano) updates.plano = plano;
        if (sub.status === "canceled" || sub.status === "unpaid") {
          updates.plano = "trial";
        }

        await admin.from("oficinas").update(updates).eq("id", oficinaId);
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const oficinaId = sub.metadata?.oficina_id as string | undefined;
        if (!oficinaId) break;

        await admin
          .from("oficinas")
          .update({
            plano: "trial",
            stripe_subscription_id: null,
          })
          .eq("id", oficinaId);
        break;
      }

      default:
        console.log("Evento ignorado:", event.type);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("stripe-webhook handler error:", err);
    return new Response(
      JSON.stringify({ error: (err as Error).message ?? "Erro interno" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
});
