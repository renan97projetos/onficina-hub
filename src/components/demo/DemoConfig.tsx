import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Star, ExternalLink, Loader2, Upload, X, CalendarDays, Copy, Globe, Users, UserPlus, Trash2, MessageCircle } from "lucide-react";
import { publicUrl, getPublicBaseUrl } from "@/lib/publicUrl";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const DemoConfig = () => {
  const { oficina_id, user, isDono } = useAuth();
  const qc = useQueryClient();
  const fileRef = useRef<HTMLInputElement>(null);

  const { data: oficina, isLoading } = useQuery({
    queryKey: ["oficina-config", oficina_id],
    enabled: !!oficina_id,
    queryFn: async () => {
      const { data } = await supabase
        .from("oficinas")
        .select("id, nome, telefone, plano, trial_expires_at, google_review_url, logo_url, cnpj, endereco, slug, landing_template, landing_ativo, landing_descricao, landing_servicos_exibidos, email_digest_ativo, email_digest")
        .eq("id", oficina_id!)
        .maybeSingle();
      return data;
    },
  });

  const { data: agendaConfig } = useQuery({
    queryKey: ["agenda-config-cfg", oficina_id],
    enabled: !!oficina_id,
    queryFn: async () => {
      const { data } = await supabase
        .from("agenda_config")
        .select("*")
        .eq("oficina_id", oficina_id!)
        .maybeSingle();
      return data;
    },
  });

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [endereco, setEndereco] = useState("");
  const [googleUrl, setGoogleUrl] = useState("");
  const [savingDados, setSavingDados] = useState(false);
  const [savingGoogle, setSavingGoogle] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  // ===== Site da oficina (Pro) =====
  const [siteAtivo, setSiteAtivo] = useState(false);
  const [siteSlug, setSiteSlug] = useState("");
  const [siteTemplate, setSiteTemplate] = useState<number>(1);
  const [siteDescricao, setSiteDescricao] = useState("");
  const [siteServicos, setSiteServicos] = useState<string[]>([]);
  const [savingSite, setSavingSite] = useState(false);

  // ===== Notificações por e-mail =====
  const [digestAtivo, setDigestAtivo] = useState(false);
  const [digestEmail, setDigestEmail] = useState("");
  const [savingDigest, setSavingDigest] = useState(false);

  const { data: servicosCatalogo } = useQuery({
    queryKey: ["servicos-catalogo-config", oficina_id],
    enabled: !!oficina_id,
    queryFn: async () => {
      const { data } = await supabase
        .from("servicos_catalogo")
        .select("id, nome")
        .eq("oficina_id", oficina_id!)
        .order("nome");
      return data ?? [];
    },
  });

  // ===== Equipe (só dono) =====
  const [novoEmail, setNovoEmail] = useState("");
  const [novoNome, setNovoNome] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [criandoMembro, setCriandoMembro] = useState(false);

  const { data: membros, refetch: refetchMembros } = useQuery({
    queryKey: ["usuarios-oficina", oficina_id],
    enabled: !!oficina_id && isDono,
    queryFn: async () => {
      const { data } = await supabase
        .from("usuarios_oficina")
        .select("id, user_id, nome, role, ativo, created_at")
        .eq("oficina_id", oficina_id!)
        .order("created_at", { ascending: true });
      return data ?? [];
    },
  });

  async function criarMembro() {
    if (!novoEmail.trim() || !novoNome.trim() || novaSenha.length < 6) {
      toast.error("Preencha nome, e-mail e senha (mín. 6 caracteres).");
      return;
    }
    setCriandoMembro(true);
    const { data, error } = await supabase.functions.invoke("criar-membro-oficina", {
      body: {
        email: novoEmail.trim(),
        nome: novoNome.trim(),
        senha: novaSenha,
      },
    });
    setCriandoMembro(false);
    if (error || (data as any)?.error) {
      toast.error((data as any)?.error || error?.message || "Erro ao criar membro.");
      return;
    }
    toast.success("Membro criado! Compartilhe as credenciais com ele.");
    setNovoEmail("");
    setNovoNome("");
    setNovaSenha("");
    refetchMembros();
  }

  async function toggleMembroAtivo(id: string, atual: boolean) {
    const { error } = await supabase
      .from("usuarios_oficina")
      .update({ ativo: !atual })
      .eq("id", id);
    if (error) {
      toast.error("Erro ao atualizar membro.");
      return;
    }
    toast.success(!atual ? "Membro reativado." : "Membro desativado.");
    refetchMembros();
  }

  async function removerMembro(id: string) {
    const { error } = await supabase
      .from("usuarios_oficina")
      .delete()
      .eq("id", id);
    if (error) {
      toast.error("Erro ao remover membro.");
      return;
    }
    toast.success("Membro removido.");
    refetchMembros();
  }

  useEffect(() => {
    if (oficina) {
      setNome(oficina.nome || "");
      setTelefone(oficina.telefone || "");
      setCnpj(oficina.cnpj || "");
      setEndereco(oficina.endereco || "");
      setGoogleUrl(oficina.google_review_url || "");
      setSiteAtivo(!!(oficina as any).landing_ativo);
      setSiteSlug(oficina.slug || "");
      setSiteTemplate(Number((oficina as any).landing_template) || 1);
      setSiteDescricao((oficina as any).landing_descricao || "");
      const arr = (oficina as any).landing_servicos_exibidos;
      setSiteServicos(Array.isArray(arr) ? arr : []);
      setDigestAtivo(!!(oficina as any).email_digest_ativo);
      setDigestEmail((oficina as any).email_digest || "");
    }
  }, [oficina]);

  async function salvarDigest(novoAtivo: boolean, novoEmail: string) {
    if (!oficina_id) return;
    if (novoAtivo) {
      const e = novoEmail.trim();
      if (!e || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) {
        toast.error("Informe um e-mail válido para receber o resumo.");
        return;
      }
    }
    setSavingDigest(true);
    const { error } = await supabase
      .from("oficinas")
      .update({
        email_digest_ativo: novoAtivo,
        email_digest: novoAtivo ? novoEmail.trim() : null,
      } as any)
      .eq("id", oficina_id);
    setSavingDigest(false);
    if (error) {
      toast.error("Erro ao salvar notificações.");
      return;
    }
    toast.success(
      novoAtivo ? "Resumo diário ativado!" : "Resumo diário desativado.",
    );
    qc.invalidateQueries({ queryKey: ["oficina-config"] });
  }

  function slugify(v: string) {
    return v
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
      .slice(0, 50);
  }

  async function salvarSite() {
    if (!oficina_id) return;
    const cleanSlug = slugify(siteSlug);
    if (siteAtivo && cleanSlug.length < 3) {
      toast.error("Informe um endereço com pelo menos 3 caracteres.");
      return;
    }
    setSavingSite(true);
    const { error } = await supabase
      .from("oficinas")
      .update({
        landing_ativo: siteAtivo,
        slug: cleanSlug || null,
        landing_template: siteTemplate,
        landing_descricao: siteDescricao.trim() || null,
        landing_servicos_exibidos: siteServicos as any,
      } as any)
      .eq("id", oficina_id);
    setSavingSite(false);
    if (error) {
      toast.error(
        error.message?.includes("duplicate")
          ? "Esse endereço já está em uso. Escolha outro."
          : "Erro ao salvar site.",
      );
      return;
    }
    setSiteSlug(cleanSlug);
    toast.success("Site atualizado!");
    qc.invalidateQueries({ queryKey: ["oficina-config"] });
  }

  function toggleServico(id: string) {
    setSiteServicos((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  }

  async function salvarDados() {
    if (!oficina_id) return;
    setSavingDados(true);
    const { error } = await supabase
      .from("oficinas")
      .update({
        nome: nome.trim(),
        telefone: telefone.trim() || null,
        cnpj: cnpj.trim() || null,
        endereco: endereco.trim() || null,
      })
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

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !oficina_id) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Imagem muito grande (máx. 2MB).");
      return;
    }
    setUploadingLogo(true);
    const ext = file.name.split(".").pop() || "png";
    const path = `${oficina_id}/logo.${ext}`;
    const { error: upErr } = await supabase.storage
      .from("oficina-logos")
      .upload(path, file, { upsert: true, contentType: file.type });
    if (upErr) {
      setUploadingLogo(false);
      toast.error("Erro ao enviar logo.");
      return;
    }
    const { data: pub } = supabase.storage.from("oficina-logos").getPublicUrl(path);
    const url = `${pub.publicUrl}?v=${Date.now()}`;
    const { error: updErr } = await supabase
      .from("oficinas")
      .update({ logo_url: url })
      .eq("id", oficina_id);
    setUploadingLogo(false);
    if (updErr) {
      toast.error("Logo enviada mas não salva no perfil.");
      return;
    }
    toast.success("Logo atualizada!");
    qc.invalidateQueries({ queryKey: ["oficina-config"] });
  }

  async function removerLogo() {
    if (!oficina_id) return;
    const { error } = await supabase
      .from("oficinas")
      .update({ logo_url: null })
      .eq("id", oficina_id);
    if (error) {
      toast.error("Erro ao remover.");
      return;
    }
    toast.success("Logo removida.");
    qc.invalidateQueries({ queryKey: ["oficina-config"] });
  }

  async function toggleModoCliente(novo: boolean) {
    if (!oficina_id) return;
    if (agendaConfig) {
      await supabase
        .from("agenda_config")
        .update({ modo_cliente_ativo: novo })
        .eq("oficina_id", oficina_id);
    } else {
      await supabase.from("agenda_config").insert({
        oficina_id,
        modo_cliente_ativo: novo,
      });
    }
    qc.invalidateQueries({ queryKey: ["agenda-config-cfg", oficina_id] });
    toast.success(novo ? "Agendamento online ativado!" : "Agendamento online desativado.");
  }

  async function salvarLimites(limite: number, min: number, max: number) {
    if (!oficina_id) return;
    if (agendaConfig) {
      await supabase
        .from("agenda_config")
        .update({ limite_por_dia: limite, dias_antecedencia_min: min, dias_antecedencia_max: max })
        .eq("oficina_id", oficina_id);
    } else {
      await supabase.from("agenda_config").insert({
        oficina_id,
        limite_por_dia: limite,
        dias_antecedencia_min: min,
        dias_antecedencia_max: max,
      });
    }
    qc.invalidateQueries({ queryKey: ["agenda-config-cfg", oficina_id] });
    toast.success("Configurações da agenda salvas.");
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
        <div className="rounded-lg border border-border p-5 lg:col-span-2">
          <h3 className="mb-4 text-sm font-medium text-foreground">Dados da oficina</h3>
          <div className="grid gap-4 md:grid-cols-[140px_1fr]">
            {/* Logo */}
            <div className="flex flex-col items-center">
              <label className="mb-2 block text-xs text-muted-foreground self-start">Logo</label>
              <div className="relative h-28 w-28 overflow-hidden rounded-full border-2 border-border bg-muted/20 flex items-center justify-center">
                {oficina?.logo_url ? (
                  <img src={oficina.logo_url} alt="Logo" className="h-full w-full object-cover" />
                ) : (
                  <Upload className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
              <div className="mt-2 flex gap-1">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={uploadingLogo}
                  className="rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground hover:bg-muted disabled:opacity-50"
                >
                  {uploadingLogo ? "..." : "Enviar"}
                </button>
                {oficina?.logo_url && (
                  <button
                    type="button"
                    onClick={removerLogo}
                    className="rounded-md border border-border bg-background p-1 text-muted-foreground hover:bg-muted"
                    aria-label="Remover logo"
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </div>
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleLogoUpload}
              />
            </div>

            {/* Fields */}
            <div className="grid gap-3 md:grid-cols-2">
              <div className="md:col-span-2">
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
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">CNPJ</label>
                <input
                  value={cnpj}
                  onChange={(e) => setCnpj(e.target.value)}
                  placeholder="00.000.000/0000-00"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block text-xs text-muted-foreground">Endereço</label>
                <input
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  placeholder="Rua, número – bairro – cidade – UF"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>
              <div className="md:col-span-2">
                <button
                  onClick={salvarDados}
                  disabled={savingDados}
                  className="w-full rounded-lg bg-primary py-2 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 disabled:opacity-50"
                >
                  {savingDados ? "Salvando..." : "Salvar"}
                </button>
              </div>
            </div>
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

        {/* Notificações por e-mail */}
        <div className="rounded-lg border border-border p-5 lg:col-span-2">
          <div className="mb-2 flex items-center justify-between gap-2">
            <h3 className="text-sm font-medium text-foreground">Notificações</h3>
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              <input
                type="checkbox"
                checked={digestAtivo}
                onChange={(e) => {
                  const v = e.target.checked;
                  setDigestAtivo(v);
                  if (!v) {
                    salvarDigest(false, "");
                  }
                }}
                className="h-4 w-4 accent-primary"
              />
              Receber resumo diário por e-mail
            </label>
          </div>
          <p className="mb-3 text-xs text-muted-foreground">
            Enviamos todo dia às 18h um resumo com OS abertas, finalizadas, atrasos e
            faturamento confirmado.
          </p>
          {digestAtivo && (
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                type="email"
                value={digestEmail}
                onChange={(e) => setDigestEmail(e.target.value)}
                placeholder="seu@email.com"
                className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <button
                onClick={() => salvarDigest(true, digestEmail)}
                disabled={savingDigest}
                className="rounded-lg bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 disabled:opacity-50"
              >
                {savingDigest ? "Salvando..." : "Salvar"}
              </button>
            </div>
          )}
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

        {/* Agendamento online (Pro) */}
        <div className="rounded-lg border border-border p-5 lg:col-span-2">
          <div className="mb-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-medium text-foreground">Agendamento online pelo cliente</h3>
            </div>
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              <input
                type="checkbox"
                checked={!!agendaConfig?.modo_cliente_ativo}
                onChange={(e) => toggleModoCliente(e.target.checked)}
                className="h-4 w-4 accent-primary"
              />
              Ativar
            </label>
          </div>
          <p className="mb-3 text-xs text-muted-foreground">
            Quando ativo, seus clientes podem escolher um dia disponível e solicitar a entrada do
            veículo pela URL pública abaixo.
          </p>
          {agendaConfig?.modo_cliente_ativo && oficina?.slug && (
            <div className="mb-3 flex flex-col gap-2 rounded-lg border border-primary/30 bg-primary/5 p-3 sm:flex-row sm:items-center">
              <code className="flex-1 truncate text-xs text-primary">
                {getPublicBaseUrl()}/agendar/{oficina.slug}
              </code>
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(publicUrl(`/agendar/${oficina.slug}`));
                  toast.success("Link copiado!");
                }}
                className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-2 py-1 text-xs text-foreground hover:bg-muted"
              >
                <Copy className="h-3 w-3" /> Copiar
              </button>
            </div>
          )}
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Vagas/dia</label>
              <input
                type="number"
                min={1}
                defaultValue={agendaConfig?.limite_por_dia ?? 4}
                key={`lim-${agendaConfig?.limite_por_dia}`}
                onBlur={(e) =>
                  salvarLimites(
                    Math.max(1, Number(e.target.value) || 4),
                    agendaConfig?.dias_antecedencia_min ?? 1,
                    agendaConfig?.dias_antecedencia_max ?? 14,
                  )
                }
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Mín. dias futuros</label>
              <input
                type="number"
                min={0}
                defaultValue={agendaConfig?.dias_antecedencia_min ?? 1}
                key={`min-${agendaConfig?.dias_antecedencia_min}`}
                onBlur={(e) =>
                  salvarLimites(
                    agendaConfig?.limite_por_dia ?? 4,
                    Math.max(0, Number(e.target.value) || 1),
                    agendaConfig?.dias_antecedencia_max ?? 14,
                  )
                }
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Máx. dias futuros</label>
              <input
                type="number"
                min={1}
                defaultValue={agendaConfig?.dias_antecedencia_max ?? 14}
                key={`max-${agendaConfig?.dias_antecedencia_max}`}
                onBlur={(e) =>
                  salvarLimites(
                    agendaConfig?.limite_por_dia ?? 4,
                    agendaConfig?.dias_antecedencia_min ?? 1,
                    Math.max(1, Number(e.target.value) || 14),
                  )
                }
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>
        </div>

        {/* Site da oficina (Pro) */}
        <div className="rounded-lg border border-border p-5 lg:col-span-2">
          <div className="mb-2 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-medium text-foreground">Site da oficina</h3>
            </div>
            <label className="flex items-center gap-2 text-xs text-muted-foreground">
              <input
                type="checkbox"
                checked={siteAtivo}
                onChange={(e) => setSiteAtivo(e.target.checked)}
                className="h-4 w-4 accent-primary"
              />
              Ativar site público
            </label>
          </div>
          <p className="mb-4 text-xs text-muted-foreground">
            Tenha uma página pública profissional para sua oficina, com seus serviços e
            avaliações. Personalizado sob consulta — fale com o suporte para algo único.
          </p>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Endereço do site</label>
              <div className="flex items-stretch overflow-hidden rounded-lg border border-border bg-background">
                <span className="flex items-center px-2 text-xs text-muted-foreground">
                  /oficina/
                </span>
                <input
                  value={siteSlug}
                  onChange={(e) => setSiteSlug(slugify(e.target.value))}
                  placeholder="restauracar"
                  className="flex-1 bg-transparent px-1 py-2 text-sm outline-none"
                />
              </div>
              {siteSlug && (
                <p className="mt-1 truncate text-xs text-primary">
                  {getPublicBaseUrl()}/oficina/{siteSlug}
                </p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Template visual</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 1, label: "Bold escuro", bg: "bg-zinc-900", accent: "bg-amber-500" },
                  { id: 2, label: "Clean claro", bg: "bg-zinc-100", accent: "bg-zinc-900" },
                  { id: 3, label: "Cor primária", bg: "bg-primary/30", accent: "bg-primary" },
                ].map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSiteTemplate(t.id)}
                    className={`group flex flex-col items-stretch gap-1 rounded-lg border-2 p-1.5 text-left transition ${
                      siteTemplate === t.id
                        ? "border-primary"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <div className={`h-12 rounded ${t.bg} relative overflow-hidden`}>
                      <div className={`absolute bottom-1 left-1 h-1.5 w-6 rounded-full ${t.accent}`} />
                      <div className="absolute top-1 left-1 h-2 w-2 rounded-full bg-foreground/30" />
                    </div>
                    <span className="text-[10px] font-medium text-foreground">{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-xs text-muted-foreground">
                Descrição da oficina
              </label>
              <textarea
                value={siteDescricao}
                onChange={(e) => setSiteDescricao(e.target.value.slice(0, 280))}
                rows={3}
                placeholder="Conte em 1 ou 2 frases o que sua oficina faz de melhor."
                className="w-full resize-none rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <p className="mt-1 text-right text-[10px] text-muted-foreground">
                {siteDescricao.length}/280
              </p>
            </div>

            <div className="md:col-span-2">
              <label className="mb-1 block text-xs text-muted-foreground">
                Serviços a exibir <span className="text-[10px]">(vazio = todos)</span>
              </label>
              {servicosCatalogo && servicosCatalogo.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {servicosCatalogo.map((s) => {
                    const active = siteServicos.includes(s.id);
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => toggleServico(s.id)}
                        className={`rounded-full border px-3 py-1 text-xs transition ${
                          active
                            ? "border-primary bg-primary text-primary-foreground"
                            : "border-border bg-background text-foreground hover:border-primary/50"
                        }`}
                      >
                        {s.nome}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">
                  Cadastre serviços no catálogo para selecioná-los aqui.
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <button
              onClick={salvarSite}
              disabled={savingSite}
              className="flex-1 rounded-lg bg-primary py-2 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 disabled:opacity-50"
            >
              {savingSite ? "Salvando..." : "Salvar site"}
            </button>
            {siteAtivo && siteSlug && (
              <a
                href={`/oficina/${siteSlug}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-1 rounded-lg border border-primary px-4 py-2 text-sm font-semibold text-primary hover:bg-primary/10"
              >
                <ExternalLink className="h-4 w-4" /> Ver meu site
              </a>
            )}
          </div>

          <a
            href="https://wa.me/5527992373501?text=Ol%C3%A1%2C%20gostaria%20de%20um%20site%20personalizado%20para%20minha%20oficina"
            target="_blank"
            rel="noreferrer"
            className="mt-3 flex items-center justify-between rounded-lg border border-primary/30 bg-primary/5 px-4 py-3 text-sm transition hover:bg-primary/10"
          >
            <div>
              <p className="font-medium text-foreground">Quer um site personalizado?</p>
              <p className="text-xs text-muted-foreground">
                Templates exclusivos e identidade visual única para sua oficina — fale com a gente.
              </p>
            </div>
            <MessageCircle className="ml-3 h-5 w-5 flex-shrink-0 text-primary" />
          </a>
        </div>

        {/* Minha equipe (só dono) */}
        {isDono && (
          <div className="rounded-lg border border-border p-5 lg:col-span-2">
            <div className="mb-4 flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              <h3 className="text-sm font-medium text-foreground">Minha equipe</h3>
            </div>
            <p className="mb-4 text-xs text-muted-foreground">
              Crie contas para seus operadores. Eles acessam tudo, exceto Configurações e
              Financeiro. As credenciais são entregues por você (WhatsApp, etc).
            </p>

            {/* Form criar membro */}
            <div className="mb-5 grid gap-2 rounded-lg border border-border bg-muted/20 p-3 sm:grid-cols-[1fr_1fr_1fr_auto]">
              <input
                value={novoNome}
                onChange={(e) => setNovoNome(e.target.value)}
                placeholder="Nome do operador"
                className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <input
                type="email"
                value={novoEmail}
                onChange={(e) => setNovoEmail(e.target.value)}
                placeholder="email@exemplo.com"
                className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <input
                type="text"
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                placeholder="Senha (mín. 6)"
                className="rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={criarMembro}
                disabled={criandoMembro}
                className="inline-flex items-center justify-center gap-1 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 disabled:opacity-50"
              >
                {criandoMembro ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <UserPlus className="h-4 w-4" /> Criar
                  </>
                )}
              </button>
            </div>

            {/* Lista de membros */}
            <div className="space-y-2">
              {!membros || membros.length === 0 ? (
                <p className="rounded-md border border-dashed border-border bg-card/50 px-3 py-4 text-center text-xs text-muted-foreground">
                  Nenhum membro cadastrado ainda.
                </p>
              ) : (
                membros.map((m) => {
                  const isMe = m.user_id === user?.id;
                  return (
                    <div
                      key={m.id}
                      className="flex items-center justify-between gap-3 rounded-lg border border-border bg-background px-3 py-2"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-foreground">
                          {m.nome || "(sem nome)"} {isMe && <span className="text-xs text-muted-foreground">(você)</span>}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          <span
                            className={`inline-block rounded px-1.5 py-0.5 text-[10px] font-bold uppercase ${
                              m.role === "dono"
                                ? "bg-primary/15 text-primary"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {m.role}
                          </span>
                          {!m.ativo && <span className="ml-2 text-amber-500">Inativo</span>}
                        </p>
                      </div>
                      {!isMe && m.role !== "dono" && (
                        <div className="flex items-center gap-2">
                          <label className="flex items-center gap-1 text-xs text-muted-foreground">
                            <input
                              type="checkbox"
                              checked={m.ativo}
                              onChange={() => toggleMembroAtivo(m.id, m.ativo)}
                              className="h-4 w-4 accent-primary"
                            />
                            Ativo
                          </label>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <button
                                type="button"
                                className="rounded-md border border-border p-1.5 text-muted-foreground hover:border-destructive hover:text-destructive"
                                aria-label="Remover"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Remover {m.nome}?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  O acesso dessa pessoa será revogado imediatamente. Esta ação
                                  não pode ser desfeita.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={() => removerMembro(m.id)}>
                                  Remover
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default DemoConfig;
