// Edge function: dono cadastra um operador na sua oficina
// - Cria conta no auth (com senha) usando service role
// - Insere registro em usuarios_oficina vinculado à oficina do dono
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const ANON_KEY = Deno.env.get("SUPABASE_PUBLISHABLE_KEY") ??
      Deno.env.get("SUPABASE_ANON_KEY")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const authHeader = req.headers.get("Authorization") ?? "";
    if (!authHeader.startsWith("Bearer ")) {
      return json(401, { error: "Não autenticado." });
    }

    // Cliente como o usuário chamador (para identificar e validar role via RLS)
    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const admin = createClient(SUPABASE_URL, SERVICE_KEY);

    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) return json(401, { error: "Sessão inválida." });

    // Buscar oficina e role do chamador
    const { data: caller } = await admin
      .from("usuarios_oficina")
      .select("oficina_id, role, ativo")
      .eq("user_id", userData.user.id)
      .maybeSingle();

    if (!caller || !caller.ativo || caller.role !== "dono") {
      return json(403, { error: "Apenas o dono pode cadastrar membros." });
    }

    const body = await req.json().catch(() => ({}));
    const email = String(body.email ?? "").trim().toLowerCase();
    const senha = String(body.senha ?? "");
    const nome = String(body.nome ?? "").trim();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json(400, { error: "E-mail inválido." });
    }
    if (senha.length < 6) {
      return json(400, { error: "Senha deve ter ao menos 6 caracteres." });
    }
    if (!nome || nome.length < 2) {
      return json(400, { error: "Informe o nome do membro." });
    }

    // Criar usuário no auth (auto-confirm para login imediato)
    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email,
      password: senha,
      email_confirm: true,
      user_metadata: { nome, oficina_id: caller.oficina_id, role: "operador" },
    });
    if (createErr || !created.user) {
      const msg = createErr?.message ?? "Erro ao criar conta.";
      return json(400, {
        error: msg.includes("already") || msg.includes("registered")
          ? "Este e-mail já está em uso."
          : msg,
      });
    }

    // Inserir vínculo
    const { error: linkErr } = await admin
      .from("usuarios_oficina")
      .insert({
        oficina_id: caller.oficina_id,
        user_id: created.user.id,
        role: "operador",
        nome,
        ativo: true,
      });

    if (linkErr) {
      // Rollback: apaga usuário criado
      await admin.auth.admin.deleteUser(created.user.id);
      return json(500, { error: "Erro ao vincular membro: " + linkErr.message });
    }

    return json(200, { ok: true, user_id: created.user.id });
  } catch (e) {
    return json(500, { error: (e as Error).message });
  }
});
