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
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const { priceId, returnUrl, environment } = await req.json();

    if (!priceId || !/^[a-zA-Z0-9_-]+$/.test(priceId)) {
      throw new Error("priceId inválido");
    }
    if (!returnUrl) throw new Error("returnUrl obrigatório");
    if (environment !== "sandbox" && environment !== "live") {
      throw new Error("environment inválido");
    }

    // Auth: descobrir oficina_id
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Não autenticado");
    const token = authHeader.replace("Bearer ", "");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
    if (authErr || !user) throw new Error("Token inválido");

    // Buscar oficina_id (membro ou dono)
    const { data: membro } = await supabase
      .from("usuarios_oficina")
      .select("oficina_id, role")
      .eq("user_id", user.id)
      .eq("ativo", true)
      .maybeSingle();

    let oficinaId: string | null = membro?.oficina_id ?? null;
    if (!oficinaId) {
      const { data: of } = await supabase
        .from("oficinas")
        .select("id")
        .eq("auth_user_id", user.id)
        .maybeSingle();
      oficinaId = of?.id ?? null;
    }
    if (!oficinaId) throw new Error("Oficina não encontrada");

    const stripe = createStripeClient(environment as StripeEnv);

    // Resolver priceId humano via lookup_keys
    const prices = await stripe.prices.list({ lookup_keys: [priceId] });
    if (!prices.data.length) throw new Error("Price não encontrado");
    const stripePrice = prices.data[0];

    const session = await stripe.checkout.sessions.create({
      line_items: [{ price: stripePrice.id, quantity: 1 }],
      mode: "subscription",
      ui_mode: "embedded_page",
      return_url: returnUrl,
      customer_email: user.email,
      metadata: { oficina_id: oficinaId, price_id: priceId },
      subscription_data: {
        metadata: { oficina_id: oficinaId, price_id: priceId },
      },
    });

    return new Response(
      JSON.stringify({ clientSecret: session.client_secret }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("create-checkout error:", err);
    return new Response(
      JSON.stringify({ error: (err as Error).message }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
