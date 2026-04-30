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

function planoNomeFromPriceId(priceId: string | undefined): string {
  if (priceId === "starter_monthly") return "Starter";
  if (priceId === "pro_monthly") return "Pro";
  return "Plano";
}

function formatBRL(cents: number | null | undefined): string {
  if (cents == null) return "0,00";
  return (cents / 100).toFixed(2).replace(".", ",");
}

function formatDateBR(unix: number | null | undefined): string {
  if (!unix) return "";
  return new Date(unix * 1000).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

async function sendSubscriptionReceiptEmail(params: {
  oficinaId: string;
  invoice: any;
  isRenovacao: boolean;
}) {
  try {
    const { oficinaId, invoice, isRenovacao } = params;

    const { data: oficina } = await getSupabase()
      .from("oficinas")
      .select("id, nome, auth_user_id")
      .eq("id", oficinaId)
      .maybeSingle();

    if (!oficina?.auth_user_id) {
      console.error("[email] oficina sem auth_user_id:", oficinaId);
      return;
    }

    const { data: userResp } = await (getSupabase() as any).auth.admin.getUserById(
      oficina.auth_user_id,
    );
    const userEmail = userResp?.user?.email;
    const userName =
      userResp?.user?.user_metadata?.nome ||
      userResp?.user?.user_metadata?.full_name ||
      "";

    if (!userEmail) {
      console.error("[email] user sem email:", oficina.auth_user_id);
      return;
    }

    const line = invoice.lines?.data?.[0];
    const priceId =
      line?.price?.metadata?.lovable_external_id ?? line?.price?.id;
    const planoNome = planoNomeFromPriceId(priceId);

    const idempotencyKey = `sub-receipt-${invoice.id}`;
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const resp = await fetch(`${supabaseUrl}/functions/v1/send-transactional-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${serviceKey}`,
        apikey: serviceKey,
      },
      body: JSON.stringify({
        templateName: "subscription-receipt",
        recipientEmail: userEmail,
        idempotencyKey,
        templateData: {
          clienteNome: userName || undefined,
          oficinaNome: oficina.nome,
          planoNome,
          valor: formatBRL(invoice.amount_paid),
          dataPagamento: formatDateBR(
            invoice.status_transitions?.paid_at ?? invoice.created,
          ),
          proximaCobranca: formatDateBR(line?.period?.end),
          numeroFatura: invoice.number || undefined,
          invoiceUrl: invoice.hosted_invoice_url || undefined,
          isRenovacao,
        },
      }),
    });

    if (!resp.ok) {
      const txt = await resp.text();
      console.error("[email] falha ao enviar:", resp.status, txt);
    } else {
      console.log("[email] recibo enviado para:", userEmail);
    }
  } catch (e) {
    console.error("[email] erro inesperado:", e);
  }
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
