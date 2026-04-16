import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Star, ExternalLink, Loader2 } from "lucide-react";

const DemoConfig = () => {
  const { oficina_id, user } = useAuth();
  const qc = useQueryClient();

  const { data: oficina, isLoading } = useQuery({
    queryKey: ["oficina-config", oficina_id],
    enabled: !!oficina_id,
    queryFn: async () => {
      const { data } = await supabase
        .from("oficinas")
        .select("id, nome, telefone, plano, trial_expires_at, google_review_url")
        .eq("id", oficina_id!)
        .maybeSingle();
      return data;
    },
  });

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [googleUrl, setGoogleUrl] = useState("");
  const [savingDados, setSavingDados] = useState(false);
  const [savingGoogle, setSavingGoogle] = useState(false);

  useEffect(() => {
    if (oficina) {
      setNome(oficina.nome || "");
      setTelefone(oficina.telefone || "");
      setGoogleUrl(oficina.google_review_url || "");
    }
  }, [oficina]);

  async function salvarDados() {
    if (!oficina_id) return;
    setSavingDados(true);
    const { error } = await supabase
      .from("oficinas")
      .update({ nome: nome.trim(), telefone: telefone.trim() || null })
      .eq("id", oficina_id);
    setSavingDados(false);
    if (error) {
      toast.error("Erro ao salvar dados.");
      return;
    }
    toast.success("Dados da oficina atualizados.");
    qc.invalidateQueries({ queryKey: ["oficina-config"] });
  }

  async function salvarGoogle() {
    if (!oficina_id) return;
    const value = googleUrl.trim();
    if (value && !/^https?:\/\//i.test(value)) {
      toast.error("Cole uma URL válida (começa com https://)");
      return;
    }
    setSavingGoogle(true);
    const { error } = await supabase
      .from("oficinas")
      .update({ google_review_url: value || null })
      .eq("id", oficina_id);
    setSavingGoogle(false);
    if (error) {
      toast.error("Erro ao salvar link.");
      return;
    }
    toast.success("Link do Google salvo.");
    qc.invalidateQueries({ queryKey: ["oficina-config"] });
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Carregando configurações...
      </div>
    );
  }

  const trialDias = oficina?.trial_expires_at
    ? Math.max(
        0,
        Math.ceil(
          (new Date(oficina.trial_expires_at).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
        ),
      )
    : null;

  return (
    <>
      <h2 className="mb-6 text-sm font-bold uppercase tracking-wide">Configurações</h2>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Workshop data */}
        <div className="rounded-lg border border-border p-5">
          <h3 className="mb-4 text-sm font-medium text-foreground">Dados da oficina</h3>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Nome</label>
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Telefone</label>
              <input
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(11) 99999-0000"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
            <button
              onClick={salvarDados}
              disabled={savingDados}
              className="mt-2 w-full rounded-lg bg-primary py-2 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 disabled:opacity-50"
            >
              {savingDados ? "Salvando..." : "Salvar"}
            </button>
          </div>
        </div>

        {/* Profile */}
        <div className="rounded-lg border border-border p-5">
          <h3 className="mb-4 text-sm font-medium text-foreground">Meu perfil</h3>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">E-mail</label>
              <input
                value={user?.email || ""}
                disabled
                className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-sm text-muted-foreground outline-none"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Seu e-mail é usado para login e não pode ser alterado por aqui.
            </p>
          </div>
        </div>

        {/* Google Reviews */}
        <div className="rounded-lg border border-border p-5 lg:col-span-2">
          <div className="mb-2 flex items-center gap-2">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <h3 className="text-sm font-medium text-foreground">Link de avaliação do Google</h3>
          </div>
          <p className="mb-4 text-xs text-muted-foreground">
            Acesse <strong className="text-foreground">Google Meu Negócio → Avaliações → Receber mais
            avaliações</strong> e copie o link aqui. Após o cliente avaliar pelo seu sistema, ele
            será convidado a publicar a mesma avaliação no Google.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              value={googleUrl}
              onChange={(e) => setGoogleUrl(e.target.value)}
              placeholder="https://g.page/r/..."
              className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
            <button
              onClick={salvarGoogle}
              disabled={savingGoogle}
              className="rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 disabled:opacity-50"
            >
              {savingGoogle ? "Salvando..." : "Salvar"}
            </button>
          </div>
          {googleUrl && /^https?:\/\//i.test(googleUrl) && (
            <a
              href={googleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-xs text-primary hover:underline"
            >
              <ExternalLink className="h-3 w-3" /> Testar link
            </a>
          )}
        </div>

        {/* Subscription */}
        <div className="rounded-lg border border-border p-5">
          <h3 className="mb-4 text-sm font-medium text-foreground">Assinatura</h3>
          <div className="mb-3 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-primary capitalize">Plano {oficina?.plano || "trial"}</p>
              {oficina?.plano === "trial" && trialDias !== null && (
                <p className="text-xs text-muted-foreground">
                  Trial — {trialDias} {trialDias === 1 ? "dia restante" : "dias restantes"}
                </p>
              )}
            </div>
          </div>
          <button className="w-full rounded-lg bg-primary py-2 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110">
            Escolher plano
          </button>
        </div>
      </div>
    </>
  );
};

export default DemoConfig;
