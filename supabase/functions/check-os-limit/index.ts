import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const LIMITS: Record<string, number | null> = {
  trial: 50,
  starter: 50,
  pro: null, // ilimitado
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing auth" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );

    const {
      data: { user },
      error: userErr,
    } = await supabase.auth.getUser();
    if (userErr || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Buscar oficina (dono direto OU membro via usuarios_oficina)
    let oficinaId: string | null = null;
    let plano = "trial";

    const { data: membro } = await admin
      .from("usuarios_oficina")
      .select("oficina_id")
      .eq("user_id", user.id)
      .eq("ativo", true)
      .maybeSingle();

    if (membro?.oficina_id) {
      oficinaId = membro.oficina_id;
    } else {
      const { data: of } = await admin
        .from("oficinas")
        .select("id")
        .eq("auth_user_id", user.id)
        .maybeSingle();
      oficinaId = of?.id ?? null;
    }

    if (!oficinaId) {
      return new Response(JSON.stringify({ error: "Oficina não encontrada" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: of } = await admin
      .from("oficinas")
      .select("plano")
      .eq("id", oficinaId)
      .maybeSingle();
    plano = of?.plano ?? "trial";

    const limit = LIMITS[plano] ?? null;

    // Contar OS criadas no mês corrente
    const now = new Date();
    const inicioMes = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    const { count, error: countErr } = await admin
      .from("ordens_servico")
      .select("id", { count: "exact", head: true })
      .eq("oficina_id", oficinaId)
      .gte("created_at", inicioMes);

    if (countErr) throw countErr;

    const total = count ?? 0;
    const exceeded = limit !== null && total >= limit;

    return new Response(
      JSON.stringify({
        plano,
        count: total,
        limit,
        exceeded,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (err) {
    console.error("check-os-limit error", err);
    return new Response(
      JSON.stringify({ error: (err as Error).message ?? "Erro interno" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
