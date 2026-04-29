import { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { publicUrl } from "@/lib/publicUrl";
import {
  Phone,
  Copy,
  Clock,
  Circle,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  CreditCard,
  Truck,
  ChevronRight,
  Camera,
  X,
  Pencil,
  DollarSign,
  Star,
  MessageCircle,
  ExternalLink,
  LayoutGrid,
  Car,
  Trash2,
} from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import type { OSWithRelations } from "./DemoOS";
import type { Tables } from "@/integrations/supabase/types";

interface Props {
  os: OSWithRelations;
  onClose: () => void;
}

const STAGE_LABELS: Record<string, string> = {
  orcamento: "Orçamento criado",
  criado: "OS criada",
  aguardando_carro: "Aguardando entrada",
  em_atendimento: "Em atendimento",
  pagamento: "Pagamento",
  entrega: "Entrega do veículo",
  finalizado: "Finalizado",
  recusado: "Recusado",
};

const PRO_PLANS = ["pro", "trial"];

const OSSheetContent = ({ os, onClose }: Props) => {
  const { oficina } = useAuth();
  const isPro = !!oficina?.plano && PRO_PLANS.includes(oficina.plano);
  const queryClient = useQueryClient();
  const [motivoRecusa, setMotivoRecusa] = useState("");
  const [pagamentoForma, setPagamentoForma] = useState(os.pagamento_forma || "");
  const [notificado, setNotificado] = useState(os.cliente_notificado_entrega || false);
  const [kmFinal, setKmFinal] = useState<string>((os as any).km_final != null ? String((os as any).km_final) : "");
  const [savingKmFinal, setSavingKmFinal] = useState(false);

  // Edit OS dialog
  const [editOpen, setEditOpen] = useState(false);
  const [editValor, setEditValor] = useState(String(os.valor_total));
  const [editObs, setEditObs] = useState(os.observacoes || "");
  const [editColaborador, setEditColaborador] = useState(os.colaborador_id || "");
  const [editPrazo, setEditPrazo] = useState(
    os.prazo_estimado ? new Date(os.prazo_estimado).toISOString().slice(0, 16) : "",
  );
  const [editSaving, setEditSaving] = useState(false);

  // Value change dialog (em_atendimento only)
  const [valorChangeOpen, setValorChangeOpen] = useState(false);
  const [novoValor, setNovoValor] = useState("");
  const [motivoValor, setMotivoValor] = useState("");
  const [valorSaving, setValorSaving] = useState(false);

  // Comprovante pagamento
  const [comprovante, setComprovante] = useState<string | null>((os as any).comprovante_pagamento || null);
  const [uploadingComprovante, setUploadingComprovante] = useState(false);

  // Exit photos
  const [fotosSaida, setFotosSaida] = useState<File[]>([]);
  const [fotoSaidaPreviews, setFotoSaidaPreviews] = useState<string[]>([]);
  const [uploadingSaida, setUploadingSaida] = useState(false);
  const [savingServicoId, setSavingServicoId] = useState<string | null>(null);
  const [avaliacaoDialogOpen, setAvaliacaoDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleDeleteOS() {
    setDeleting(true);
    try {
      await supabase.from("os_servicos").delete().eq("os_id", os.id);
      await supabase.from("os_movimentacoes").delete().eq("os_id", os.id);
      const { error } = await supabase.from("ordens_servico").delete().eq("id", os.id);
      if (error) throw error;
      toast.success("OS excluída");
      queryClient.invalidateQueries({ queryKey: ["ordens_servico"] });
      setDeleteOpen(false);
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Erro ao excluir OS");
    } finally {
      setDeleting(false);
    }
  }

  const { data: movimentacoes = [] } = useQuery({
    queryKey: ["os_movimentacoes", os.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("os_movimentacoes")
        .select("*")
        .eq("os_id", os.id)
        .order("created_at", { ascending: false });
      return data || [];
    },
  });

  const { data: colaboradores = [] } = useQuery({
    queryKey: ["colaboradores_sheet"],
    queryFn: async () => {
      const { data } = await supabase.from("colaboradores").select("*").eq("ativo", true).order("nome");
      return data || [];
    },
  });

  const { data: avaliacao } = useQuery({
    queryKey: ["avaliacao", os.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("avaliacoes")
        .select("nota, comentario, nome_cliente, created_at")
        .eq("os_id", os.id)
        .maybeSingle();
      return data;
    },
    enabled: os.stage === "finalizado",
  });

  const isFullEdit = os.stage === "criado" || os.stage === "aguardando_carro";
  const isLimitedEdit = os.stage === "em_atendimento" || os.stage === "pagamento" || os.stage === "entrega";

  // Tracking de envios via os_movimentacoes (descrição padronizada)
  const WPP_ACOMP_DESC = "[whatsapp] Link de acompanhamento enviado ao cliente";
  const WPP_PRONTO_DESC = "[whatsapp] Aviso de veículo pronto enviado ao cliente";
  const WPP_FINAL_DESC = "[whatsapp] Conclusão + avaliação enviada ao cliente";
  const acompanhamentoEnviado = movimentacoes.some((m) => m.descricao === WPP_ACOMP_DESC);
  const prontoEnviado = movimentacoes.some((m) => m.descricao === WPP_PRONTO_DESC);
  const finalizacaoEnviada = movimentacoes.some((m) => m.descricao === WPP_FINAL_DESC);

  async function registrarEnvioWhatsapp(descricao: string) {
    await supabase.from("os_movimentacoes").insert({ os_id: os.id, descricao });
    queryClient.invalidateQueries({ queryKey: ["os_movimentacoes", os.id] });
  }

  async function avancarEtapa(stageNovo: string, descricao: string, extra?: Record<string, any>) {
    const updateData: any = { stage: stageNovo, ...extra };
    await supabase.from("ordens_servico").update(updateData).eq("id", os.id);
    await supabase.from("os_movimentacoes").insert({
      os_id: os.id,
      stage_anterior: os.stage,
      stage_novo: stageNovo,
      descricao,
    });
    queryClient.invalidateQueries({ queryKey: ["ordens_servico"] });
    queryClient.invalidateQueries({ queryKey: ["os_movimentacoes", os.id] });
    toast.success(descricao);
  }

  async function recusarOS() {
    if (!motivoRecusa.trim()) {
      toast.error("Informe o motivo da recusa");
      return;
    }
    await supabase.from("ordens_servico").update({ stage: "recusado", motivo_recusa: motivoRecusa }).eq("id", os.id);
    await supabase.from("os_movimentacoes").insert({
      os_id: os.id,
      stage_anterior: os.stage,
      stage_novo: "recusado",
      descricao: `OS recusada: ${motivoRecusa}`,
    });
    queryClient.invalidateQueries({ queryKey: ["ordens_servico"] });
    toast.success("OS recusada");
    setMotivoRecusa("");
  }

  async function reabrirOS() {
    await avancarEtapa("criado", "OS reaberta");
  }

  // Save edit
  async function handleSaveEdit() {
    setEditSaving(true);
    try {
      const valorAnterior = Number(os.valor_total);
      const valorNovo = parseFloat(editValor) || 0;
      const updates: any = {
        valor_total: valorNovo,
        observacoes: editObs.trim() || null,
      };
      if (isFullEdit) {
        updates.colaborador_id = editColaborador || null;
        updates.prazo_estimado = editPrazo ? new Date(editPrazo).toISOString() : null;
      }
      const { error: updateError } = await supabase.from("ordens_servico").update(updates).eq("id", os.id);
      if (updateError) throw updateError;

      if (valorNovo !== valorAnterior) {
        const { error: movError } = await supabase.from("os_movimentacoes").insert({
          os_id: os.id,
          descricao: `Valor alterado de R$ ${valorAnterior.toFixed(2)} para R$ ${valorNovo.toFixed(2)}${editObs.trim() ? ` — Obs: ${editObs.trim()}` : ""}`,
          valor_anterior: valorAnterior,
          valor_novo: valorNovo,
        });
        if (movError) throw movError;
      }

      await queryClient.invalidateQueries({ queryKey: ["ordens_servico"] });
      await queryClient.invalidateQueries({ queryKey: ["os_movimentacoes", os.id] });
      toast.success("OS atualizada");
      setEditOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Erro ao atualizar");
    } finally {
      setEditSaving(false);
    }
  }

  // Save value change with reason
  async function handleSaveValorChange() {
    if (!motivoValor.trim()) {
      toast.error("Informe o motivo da alteração");
      return;
    }
    const nv = parseFloat(novoValor);
    if (isNaN(nv) || nv < 0) {
      toast.error("Informe um valor válido");
      return;
    }
    setValorSaving(true);
    try {
      const valorAnterior = Number(os.valor_total);
      const { error: updErr } = await supabase.from("ordens_servico").update({ valor_total: nv }).eq("id", os.id);
      if (updErr) throw updErr;

      const { error: movErr } = await supabase.from("os_movimentacoes").insert({
        os_id: os.id,
        descricao: `Valor alterado de R$ ${valorAnterior.toFixed(2)} para R$ ${nv.toFixed(2)} — Motivo: ${motivoValor.trim()}`,
        valor_anterior: valorAnterior,
        valor_novo: nv,
      });
      if (movErr) {
        console.error("Erro ao registrar movimentação de valor:", movErr);
        throw movErr;
      }

      await queryClient.invalidateQueries({ queryKey: ["ordens_servico"] });
      await queryClient.invalidateQueries({ queryKey: ["os_movimentacoes", os.id] });
      toast.success("Valor atualizado");
      setValorChangeOpen(false);
      setNovoValor("");
      setMotivoValor("");
    } catch (err: any) {
      toast.error(err.message || "Erro ao alterar valor");
    } finally {
      setValorSaving(false);
    }
  }

  // Comprovante upload handler
  async function handleComprovanteUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingComprovante(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${os.id}/comprovante/${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from("os-fotos").upload(path, file);
      if (error) throw error;
      const { data: urlData } = supabase.storage.from("os-fotos").getPublicUrl(path);
      const url = urlData.publicUrl;
      await supabase
        .from("ordens_servico")
        .update({ comprovante_pagamento: url } as any)
        .eq("id", os.id);
      setComprovante(url);
      queryClient.invalidateQueries({ queryKey: ["ordens_servico"] });
      toast.success("Comprovante anexado");
    } catch (err: any) {
      toast.error(err.message || "Erro no upload");
    } finally {
      setUploadingComprovante(false);
    }
    e.target.value = "";
  }

  // Exit photo handlers
  function handleFotoSaidaChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    setFotosSaida((prev) => [...prev, ...files]);
    files.forEach((f) => {
      const reader = new FileReader();
      reader.onload = () => setFotoSaidaPreviews((prev) => [...prev, reader.result as string]);
      reader.readAsDataURL(f);
    });
    e.target.value = "";
  }

  function removeFotoSaida(index: number) {
    setFotosSaida((prev) => prev.filter((_, i) => i !== index));
    setFotoSaidaPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function uploadFotosSaida() {
    if (fotosSaida.length === 0) return;
    setUploadingSaida(true);
    try {
      const urls: string[] = [];
      for (const file of fotosSaida) {
        const ext = file.name.split(".").pop() || "jpg";
        const path = `${os.id}/saida/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
        const { error } = await supabase.storage.from("os-fotos").upload(path, file);
        if (error) {
          console.error(error);
          continue;
        }
        const { data: urlData } = supabase.storage.from("os-fotos").getPublicUrl(path);
        urls.push(urlData.publicUrl);
      }
      const existing = (os.fotos_saida as string[] | null) || [];
      const all = [...existing, ...urls];
      await supabase.from("ordens_servico").update({ fotos_saida: all }).eq("id", os.id);
      queryClient.invalidateQueries({ queryKey: ["ordens_servico"] });
      toast.success(`${urls.length} foto(s) de saída salvas`);
      setFotosSaida([]);
      setFotoSaidaPreviews([]);
    } catch (err: any) {
      toast.error(err.message || "Erro no upload");
    } finally {
      setUploadingSaida(false);
    }
  }

  async function iniciarServicoPainel(srvId: string) {
    setSavingServicoId(srvId);

    try {
      const { error } = await supabase
        .from("os_servicos")
        .update({
          status: "em_andamento",
          iniciado_em: new Date().toISOString(),
          etapa_atual: 0,
        })
        .eq("id", srvId);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ["ordens_servico"] });
      await queryClient.invalidateQueries({ queryKey: ["tecnico-os", os.id] });
      toast.success("Serviço iniciado");
    } catch (err: any) {
      toast.error(err.message || "Erro ao iniciar serviço");
    } finally {
      setSavingServicoId(null);
    }
  }

  async function concluirEtapaPainel(srv: Tables<"os_servicos">) {
    setSavingServicoId(srv.id);

    try {
      const { error } = await supabase
        .from("os_servicos")
        .update({
          status: "concluido",
          etapa_atual: 999,
          concluido_em: new Date().toISOString(),
        })
        .eq("id", srv.id);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ["ordens_servico"] });
      await queryClient.invalidateQueries({ queryKey: ["tecnico-os", os.id] });
      toast.success("Serviço concluído!");
    } catch (err: any) {
      toast.error(err.message || "Erro ao concluir serviço");
    } finally {
      setSavingServicoId(null);
    }
  }

  const allServicosCompleted = os.os_servicos?.every((s) => s.status === "concluido") ?? false;
  const clienteUrl = publicUrl(`/acompanhar/${os.token_cliente}`);
  const tecnicoUrl = publicUrl(`/tecnico/${os.id}`);
  const whatsappUrl = os.clientes?.telefone ? `https://wa.me/55${os.clientes.telefone.replace(/\D/g, "")}` : null;

  const avaliacaoUrl = publicUrl(`/avaliacao?os=${os.id}`);
  const oficinaNome = oficina?.nome || "nossa oficina";

  function buildWhatsappAvaliacao() {
    const msg = `Olá ${os.clientes?.nome || ""}! Obrigado por confiar na ${oficinaNome}. Ficamos felizes em atender você. Deixe sua avaliação aqui: ${avaliacaoUrl}`;
    const tel = os.clientes?.telefone?.replace(/\D/g, "") || "";
    return `https://wa.me/55${tel}?text=${encodeURIComponent(msg)}`;
  }

  function buildWhatsappAcompanhamento() {
    const nome = os.clientes?.nome || "";
    const marca = os.veiculos?.marca || "";
    const modelo = os.veiculos?.modelo || "";
    const placa = os.veiculos?.placa || "";
    const tel = os.clientes?.telefone?.replace(/\D/g, "") || "";

    const listaServicos = os.os_servicos?.length
      ? os.os_servicos.map((s) => `• ${s.nome_servico}`).join("\n")
      : "• Serviço contratado";

    const msg = `Olá, ${nome}! 👋

Seu veículo *${marca} ${modelo} - ${placa}* já está em atendimento aqui na *${oficinaNome}*.

Serviços contratados:
${listaServicos}

Acompanhe em tempo real cada etapa do seu serviço pelo link abaixo — você vê exatamente o que está sendo feito no seu carro:

🔗 ${clienteUrl}

Qualquer dúvida estamos à disposição. Obrigado pela confiança! 🚗`;

    if (!tel) return null;
    return `https://wa.me/55${tel}?text=${encodeURIComponent(msg)}`;
  }

  function buildWhatsappPronto() {
    const nome = os.clientes?.nome || "";
    const marca = os.veiculos?.marca || "";
    const modelo = os.veiculos?.modelo || "";
    const placa = os.veiculos?.placa || "";
    const tel = os.clientes?.telefone?.replace(/\D/g, "") || "";

    const msg = `Olá, ${nome}! 🚗✨

Boa notícia! Seu veículo *${marca} ${modelo} - ${placa}* está *pronto para retirada* aqui na *${oficinaNome}*.

Pode vir buscar quando preferir — estamos te esperando! 😊

Qualquer dúvida, é só chamar.`;

    if (!tel) return null;
    return `https://wa.me/55${tel}?text=${encodeURIComponent(msg)}`;
  }

  function buildWhatsappFinalizacao() {
    const nome = os.clientes?.nome || "";
    const marca = os.veiculos?.marca || "";
    const modelo = os.veiculos?.modelo || "";
    const placa = os.veiculos?.placa || "";
    const tel = os.clientes?.telefone?.replace(/\D/g, "") || "";

    const msg = `Olá, ${nome}! ✅

O serviço do seu *${marca} ${modelo} - ${placa}* foi concluído com sucesso!

Pode vir buscar seu veículo. Estamos te esperando aqui na *${oficinaNome}*. 😊

Sua opinião é muito importante pra nós. Leva só 30 segundos — avalie nosso atendimento:

⭐ ${avaliacaoUrl}

Obrigado pela preferência! Até a próxima. 🙏`;

    if (!tel) return null;
    return `https://wa.me/55${tel}?text=${encodeURIComponent(msg)}`;
  }

  const fotosEntradaUrls = (os.fotos_entrada as string[] | null) || [];
  const fotosSaidaUrls = (os.fotos_saida as string[] | null) || [];

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card px-6 py-4 pr-14">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-lg font-bold text-foreground truncate">{os.clientes?.nome || "—"}</h2>
            <p className="text-sm text-muted-foreground truncate">
              {os.veiculos?.placa} • {os.veiculos?.marca} {os.veiculos?.modelo}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              {STAGE_LABELS[os.stage] || os.stage}
            </span>
            <button
              type="button"
              onClick={() => setDeleteOpen(true)}
              title="Excluir OS"
              className="inline-flex items-center gap-1.5 rounded-md border border-red-500/40 bg-red-500/10 px-2.5 py-1.5 text-xs font-semibold text-red-400 transition-colors hover:bg-red-500/20"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Excluir
            </button>
          </div>
        </div>
      </div>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir esta OS?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A OS de <b>{os.clientes?.nome || "—"}</b>
              {os.veiculos?.placa ? <> ({os.veiculos.placa})</> : null} e seu histórico (serviços e movimentações) serão
              removidos permanentemente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                handleDeleteOS();
              }}
              disabled={deleting}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              {deleting ? "Excluindo..." : "Excluir OS"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex-1 overflow-y-auto">
        <div className="grid gap-6 p-6 lg:grid-cols-2">
          {/* Left column: actions */}
          <div className="space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Ações</h3>

            {/* Edit & value change buttons */}
            {(isFullEdit || isLimitedEdit) && (
              <div className="space-y-3">
                <button
                  onClick={() => {
                    setEditValor(String(os.valor_total));
                    setEditObs(os.observacoes || "");
                    setEditColaborador(os.colaborador_id || "");
                    setEditPrazo(os.prazo_estimado ? new Date(os.prazo_estimado).toISOString().slice(0, 16) : "");
                    setEditOpen(true);
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                  <Pencil className="h-4 w-4" /> Alterar OS
                </button>

                {os.stage === "em_atendimento" && (
                  <button
                    onClick={() => {
                      setNovoValor(String(os.valor_total));
                      setMotivoValor("");
                      setValorChangeOpen(true);
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-amber-700/40 bg-amber-900/10 px-4 py-3 text-sm font-medium text-amber-400 hover:bg-amber-900/20 transition-colors"
                  >
                    <DollarSign className="h-4 w-4" /> Registrar alteração de valor
                  </button>
                )}
              </div>
            )}

            {/* CRIADO */}
            {os.stage === "criado" && (
              <div className="space-y-4">
                <button
                  onClick={() => avancarEtapa("aguardando_carro", "OS confirmada → Aguardando entrada")}
                  className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:brightness-110 transition-all"
                >
                  Confirmar OS → Aguardando entrada
                </button>
                <RecusarButton motivoRecusa={motivoRecusa} setMotivoRecusa={setMotivoRecusa} onRecusar={recusarOS} />
              </div>
            )}

            {/* AGUARDANDO_CARRO */}
            {os.stage === "aguardando_carro" && (
              <div className="space-y-4">
                <div className="rounded-xl border border-amber-700/40 bg-amber-900/10 p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-900/20">
                      <Car className="h-4 w-4 text-amber-400" />
                    </div>
                    <p className="text-sm text-amber-200/90 leading-relaxed">
                      Aguardando chegada do veículo na oficina.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => avancarEtapa("em_atendimento", "Carro chegou → Em atendimento")}
                  className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:brightness-110 transition-all"
                >
                  Confirmar chegada → Em atendimento
                </button>
                <RecusarButton motivoRecusa={motivoRecusa} setMotivoRecusa={setMotivoRecusa} onRecusar={recusarOS} />
              </div>
            )}

            {/* EM_ATENDIMENTO */}
            {os.stage === "em_atendimento" && (
              <div className="space-y-5">
                {Array.isArray((os as any).pecas) && (os as any).pecas.length > 0 && (
                  <div>
                    <h4 className="mb-2 text-sm font-semibold text-foreground">Peças</h4>
                    <div className="overflow-hidden rounded-xl border border-border">
                      <div className="grid grid-cols-[60px_1fr_120px] gap-2 bg-muted/40 px-3 py-2 text-xs font-bold text-muted-foreground">
                        <span>QTD</span>
                        <span>Descrição</span>
                        <span className="text-right">Valor</span>
                      </div>
                      {((os as any).pecas as any[]).map((p, i) => (
                        <div
                          key={i}
                          className="grid grid-cols-[60px_1fr_120px] gap-2 border-t border-border px-3 py-2 text-xs"
                        >
                          <span className="text-center">{Number(p.qtd) || 0}</span>
                          <span>{p.descricao || "—"}</span>
                          <span className="text-right">
                            {new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(
                              (Number(p.qtd) || 0) * (Number(p.valor) || 0),
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <h4 className="text-sm font-semibold text-foreground">Serviços</h4>
                {os.os_servicos?.map((srv) => {
                  const isSavingServico = savingServicoId === srv.id;
                  return (
                    <div
                      key={srv.id}
                      className="rounded-xl border border-border bg-background p-4 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        {srv.status === "concluido" ? (
                          <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0" />
                        ) : srv.status === "em_andamento" ? (
                          <div className="h-5 w-5 rounded-full border-2 border-primary border-t-transparent animate-spin flex-shrink-0" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                        )}
                        <div>
                          <p className="text-sm font-medium text-foreground">{srv.nome_servico || "Serviço"}</p>
                          <p className="text-xs text-muted-foreground">
                            {srv.status === "concluido"
                              ? "Concluído"
                              : srv.status === "em_andamento"
                                ? "Em andamento"
                                : "Pendente"}
                          </p>
                        </div>
                      </div>

                      {srv.status === "pendente" && (
                        <button
                          onClick={() => iniciarServicoPainel(srv.id)}
                          disabled={isSavingServico}
                          className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:brightness-110 disabled:opacity-50"
                        >
                          {isSavingServico ? "..." : "Iniciar"}
                        </button>
                      )}
                      {srv.status === "em_andamento" && (
                        <button
                          onClick={() => concluirEtapaPainel(srv)}
                          disabled={isSavingServico}
                          className="rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:brightness-110 disabled:opacity-50"
                        >
                          {isSavingServico ? "..." : "Concluir"}
                        </button>
                      )}
                      {srv.status === "concluido" && <span className="text-xs font-medium text-primary">✓</span>}
                    </div>
                  );
                })}
                <div className="flex gap-3 pt-1">
                  <a
                    href={buildWhatsappAcompanhamento() || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      if (buildWhatsappAcompanhamento()) registrarEnvioWhatsapp(WPP_ACOMP_DESC);
                    }}
                    className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-3 text-xs font-semibold transition-colors ${
                      !buildWhatsappAcompanhamento()
                        ? "border border-border bg-background text-muted-foreground opacity-50 cursor-not-allowed pointer-events-none"
                        : acompanhamentoEnviado
                          ? "border border-green-700/40 bg-green-900/20 text-green-400 hover:bg-green-900/30"
                          : "bg-[#25D366] text-white hover:bg-[#1ebe5d]"
                    }`}
                    title={!os.clientes?.telefone ? "Telefone do cliente não cadastrado" : ""}
                  >
                    {acompanhamentoEnviado ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.555 4.122 1.523 5.855L0 24l6.337-1.501A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.652-.52-5.166-1.427l-.371-.22-3.762.891.948-3.658-.242-.38A9.944 9.944 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                      </svg>
                    )}
                    {acompanhamentoEnviado ? "Enviado" : "Enviar ao cliente"}
                  </a>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(tecnicoUrl);
                      toast.success("Link do técnico copiado");
                    }}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-border bg-background px-3 py-3 text-xs font-medium text-foreground hover:bg-muted transition-colors"
                  >
                    <Copy className="h-3.5 w-3.5" /> Link do técnico
                  </button>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => avancarEtapa("pagamento", "Atendimento finalizado → Pagamento")}
                    disabled={!allServicosCompleted}
                    className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Finalizar atendimento → Pagamento
                  </button>
                  {!allServicosCompleted && (
                    <p className="mt-2 text-xs text-yellow-400">Conclua todos os serviços antes de avançar.</p>
                  )}
                </div>
                <RecusarButton motivoRecusa={motivoRecusa} setMotivoRecusa={setMotivoRecusa} onRecusar={recusarOS} />
              </div>
            )}

            {/* PAGAMENTO */}
            {os.stage === "pagamento" && (
              <div className="space-y-5">
                <div className="rounded-xl border border-border bg-background p-5">
                  <p className="text-xs text-muted-foreground mb-1">Valor total</p>
                  <p className="text-2xl font-bold text-foreground">R$ {Number(os.valor_total).toFixed(2)}</p>
                </div>
                <div>
                  <label className="mb-2 block text-xs font-medium text-muted-foreground">Forma de pagamento</label>
                  <select
                    value={pagamentoForma}
                    onChange={(e) => setPagamentoForma(e.target.value)}
                    className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary"
                  >
                    <option value="">Selecione...</option>
                    <option value="dinheiro">Dinheiro</option>
                    <option value="pix">PIX</option>
                    <option value="cartao">Cartão</option>
                    <option value="boleto">Boleto</option>
                  </select>
                </div>

                {/* Comprovante de pagamento */}
                <div>
                  <label className="mb-2 block text-xs font-medium text-muted-foreground">
                    Comprovante de pagamento
                  </label>
                  {comprovante ? (
                    <div className="space-y-2">
                      <a
                        href={comprovante}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block rounded-xl border border-green-800/40 bg-green-900/10 p-3 text-center text-sm font-medium text-green-400 hover:bg-green-900/20 transition-colors"
                      >
                        <CheckCircle2 className="mr-2 inline h-4 w-4" /> Comprovante anexado — ver
                      </a>
                      <button
                        onClick={() => setComprovante(null)}
                        className="text-xs text-muted-foreground hover:text-destructive transition-colors"
                      >
                        Remover comprovante
                      </button>
                    </div>
                  ) : (
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={handleComprovanteUpload}
                        disabled={uploadingComprovante}
                        className="absolute inset-0 cursor-pointer opacity-0"
                      />
                      <div
                        className={`flex items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-background px-4 py-4 text-sm text-muted-foreground hover:border-primary/50 transition-colors ${uploadingComprovante ? "opacity-50" : ""}`}
                      >
                        <Camera className="h-4 w-4" />
                        {uploadingComprovante ? "Enviando..." : "Anexar comprovante (foto ou PDF)"}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  disabled={!pagamentoForma}
                  onClick={() =>
                    avancarEtapa("entrega", `Pagamento confirmado (${pagamentoForma})`, {
                      pagamento_forma: pagamentoForma,
                      pagamento_confirmado: true,
                      pagamento_confirmado_em: new Date().toISOString(),
                    })
                  }
                  className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  <CreditCard className="mr-2 inline h-4 w-4" /> Confirmar pagamento → Entrega
                </button>
                <RecusarButton motivoRecusa={motivoRecusa} setMotivoRecusa={setMotivoRecusa} onRecusar={recusarOS} />
              </div>
            )}

            {/* ENTREGA */}
            {os.stage === "entrega" && (
              <div className="space-y-5">
                <div className="rounded-xl border border-border bg-background p-5 space-y-2">
                  <p className="text-xs text-muted-foreground">Resumo</p>
                  <p className="text-sm text-foreground">
                    <strong>Valor:</strong> R$ {Number(os.valor_total).toFixed(2)} • <strong>Forma:</strong>{" "}
                    {os.pagamento_forma || "—"}
                  </p>
                  <p className="text-sm text-foreground">
                    <strong>Serviços:</strong> {os.os_servicos?.length || 0} realizados
                  </p>
                </div>

                {/* KM final */}
                <div className="rounded-xl border border-border bg-background p-5 space-y-2">
                  <label className="text-xs font-semibold text-muted-foreground">KM final do veículo (opcional)</label>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      min="0"
                      placeholder={
                        (os as any).km_inicial != null ? `Ex: ${Number((os as any).km_inicial) + 100}` : "Ex: 85100"
                      }
                      value={kmFinal}
                      onChange={(e) => setKmFinal(e.target.value)}
                    />
                    <button
                      type="button"
                      disabled={savingKmFinal}
                      onClick={async () => {
                        setSavingKmFinal(true);
                        const valor = kmFinal ? parseInt(kmFinal, 10) : null;
                        const { error } = await supabase
                          .from("ordens_servico")
                          .update({ km_final: valor } as any)
                          .eq("id", os.id);
                        setSavingKmFinal(false);
                        if (error) {
                          toast.error("Erro ao salvar KM final");
                          return;
                        }
                        toast.success("KM final salva");
                        queryClient.invalidateQueries({ queryKey: ["ordens_servico"] });
                      }}
                      className="rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground hover:brightness-110 disabled:opacity-50"
                    >
                      Salvar
                    </button>
                  </div>
                  {(os as any).km_inicial != null && (
                    <p className="text-xs text-muted-foreground">KM inicial: {(os as any).km_inicial}</p>
                  )}
                </div>

                {/* Exit photos upload */}
                <div>
                  <h4 className="mb-3 text-sm font-semibold text-foreground flex items-center gap-2">
                    <Camera className="h-4 w-4" /> Fotos de saída
                  </h4>
                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-background px-4 py-5 text-sm text-muted-foreground hover:border-primary hover:text-foreground transition-colors">
                    <Camera className="h-5 w-5" />
                    Selecionar fotos de saída
                    <input type="file" accept="image/*" multiple onChange={handleFotoSaidaChange} className="hidden" />
                  </label>
                  {fotoSaidaPreviews.length > 0 && (
                    <>
                      <div className="mt-3 grid grid-cols-4 gap-2">
                        {fotoSaidaPreviews.map((src, i) => (
                          <div
                            key={i}
                            className="group relative aspect-square overflow-hidden rounded-lg border border-border"
                          >
                            <img src={src} alt={`Saída ${i + 1}`} className="h-full w-full object-cover" />
                            <button
                              onClick={() => removeFotoSaida(i)}
                              className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <X className="h-3.5 w-3.5 text-white" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={uploadFotosSaida}
                        disabled={uploadingSaida}
                        className="mt-3 w-full rounded-xl border border-primary bg-primary/10 px-3 py-2.5 text-sm font-medium text-primary hover:bg-primary/20 disabled:opacity-50"
                      >
                        {uploadingSaida ? "Enviando..." : "Salvar fotos de saída"}
                      </button>
                    </>
                  )}
                </div>

                <a
                  href={buildWhatsappPronto() || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={async () => {
                    if (!buildWhatsappPronto()) return;
                    await registrarEnvioWhatsapp(WPP_PRONTO_DESC);
                    if (!notificado) {
                      setNotificado(true);
                      await supabase
                        .from("ordens_servico")
                        .update({ cliente_notificado_entrega: true })
                        .eq("id", os.id);
                      queryClient.invalidateQueries({ queryKey: ["ordens_servico"] });
                    }
                  }}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                    !buildWhatsappPronto()
                      ? "border border-border bg-background text-muted-foreground opacity-50 cursor-not-allowed pointer-events-none"
                      : prontoEnviado
                        ? "border border-green-700/40 bg-green-900/20 text-green-400 hover:bg-green-900/30"
                        : "bg-[#25D366] text-white hover:bg-[#1ebe5d]"
                  }`}
                  title={!os.clientes?.telefone ? "Telefone do cliente não cadastrado" : ""}
                >
                  {prontoEnviado ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.555 4.122 1.523 5.855L0 24l6.337-1.501A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.652-.52-5.166-1.427l-.371-.22-3.762.891.948-3.658-.242-.38A9.944 9.944 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                    </svg>
                  )}
                  {prontoEnviado ? "Aviso enviado" : "Avisar cliente: veículo pronto"}
                </a>

                <button
                  onClick={async () => {
                    await supabase.from("ordens_servico").update({ cliente_notificado_entrega: true }).eq("id", os.id);
                    await avancarEtapa("finalizado", "Veículo entregue ao cliente");
                    setAvaliacaoDialogOpen(true);
                  }}
                  className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:brightness-110 transition-all"
                >
                  <Truck className="mr-2 inline h-4 w-4" /> Confirmar entrega → Finalizado
                </button>
              </div>
            )}

            {/* FINALIZADO */}
            {os.stage === "finalizado" && (
              <div className="space-y-4">
                <div className="rounded-xl border border-border bg-background p-5">
                  <CheckCircle2 className="mb-3 h-7 w-7 text-green-400" />
                  <p className="text-sm font-semibold text-foreground">OS finalizada</p>
                  <p className="mt-1 text-xs text-muted-foreground">Veículo entregue com sucesso.</p>
                </div>

                {avaliacao ? (
                  <div className="rounded-xl border border-green-800/40 bg-green-900/10 p-5">
                    <div className="mb-2 flex items-center gap-2">
                      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                      <p className="text-xs font-bold uppercase tracking-wide text-green-400">Avaliação do cliente</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i <= avaliacao.nota ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-sm font-semibold text-foreground">{avaliacao.nota}/5</span>
                    </div>
                    {avaliacao.comentario && (
                      <p className="mt-3 text-sm italic text-foreground">“{avaliacao.comentario}”</p>
                    )}
                    {avaliacao.nome_cliente && (
                      <p className="mt-2 text-xs text-muted-foreground">— {avaliacao.nome_cliente}</p>
                    )}
                  </div>
                ) : (
                  <a
                    href={buildWhatsappFinalizacao() || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      if (buildWhatsappFinalizacao()) registrarEnvioWhatsapp(WPP_FINAL_DESC);
                    }}
                    className={`flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                      !buildWhatsappFinalizacao()
                        ? "border border-border bg-background text-muted-foreground opacity-50 cursor-not-allowed pointer-events-none"
                        : finalizacaoEnviada
                          ? "border border-green-700/40 bg-green-900/20 text-green-400 hover:bg-green-900/30"
                          : "bg-[#25D366] text-white hover:bg-[#1ebe5d]"
                    }`}
                    title={!os.clientes?.telefone ? "Telefone do cliente não cadastrado" : ""}
                  >
                    {finalizacaoEnviada ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.555 4.122 1.523 5.855L0 24l6.337-1.501A11.946 11.946 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.885 0-3.652-.52-5.166-1.427l-.371-.22-3.762.891.948-3.658-.242-.38A9.944 9.944 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                      </svg>
                    )}
                    {finalizacaoEnviada
                      ? "Enviado — clique para reenviar"
                      : "Enviar conclusão + avaliação via WhatsApp"}
                  </a>
                )}
              </div>
            )}

            {/* RECUSADO */}
            {os.stage === "recusado" && (
              <div className="space-y-4">
                <div className="rounded-xl border border-red-800/40 bg-red-900/10 p-5">
                  <XCircle className="mb-3 h-7 w-7 text-red-400" />
                  <p className="text-sm font-semibold text-red-400">OS recusada</p>
                  <p className="mt-2 text-xs text-muted-foreground">{os.motivo_recusa || "Motivo não informado"}</p>
                </div>
                <button
                  onClick={reabrirOS}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
                >
                  Reabrir OS
                </button>
              </div>
            )}
          </div>

          {/* Right column: info */}
          <div className="space-y-4 rounded-xl border border-primary/25 bg-primary/12 p-5">
            <h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Informações</h3>

            {/* Client info */}
            <div className="rounded-lg border border-border bg-background p-4 space-y-2">
              <p className="text-sm font-semibold text-foreground">{os.clientes?.nome}</p>
              {os.clientes?.telefone && (
                <a
                  href={whatsappUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-primary hover:underline"
                >
                  <Phone className="h-3.5 w-3.5" /> {os.clientes.telefone}
                </a>
              )}
              {os.clientes?.email && <p className="text-xs text-muted-foreground">{os.clientes.email}</p>}
            </div>

            {/* Vehicle */}
            <div className="rounded-lg border border-border bg-background p-4 space-y-1">
              <p className="text-sm text-foreground">
                {os.veiculos?.placa} • {os.veiculos?.marca} {os.veiculos?.modelo} {os.veiculos?.cor} {os.veiculos?.ano}
              </p>
              {((os as any).km_inicial != null || (os as any).km_final != null) && (
                <p className="text-xs text-muted-foreground">
                  KM: {(os as any).km_inicial ?? "—"}
                  {(os as any).km_final != null && ` → ${(os as any).km_final}`}
                </p>
              )}
            </div>

            {/* Colaborador */}
            {os.colaboradores && (
              <div className="rounded-lg border border-border bg-background p-4">
                <p className="text-xs text-muted-foreground">Responsável</p>
                <p className="text-sm font-medium text-foreground">{os.colaboradores.nome}</p>
              </div>
            )}

            {/* Dates */}
            <div className="rounded-lg border border-border bg-background p-4 space-y-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                Aberta em {format(new Date(os.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
              </div>
              {os.prazo_estimado && (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  Prazo: {format(new Date(os.prazo_estimado), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                </div>
              )}
            </div>

            {/* Photos comparison */}
            {(fotosEntradaUrls.length > 0 || fotosSaidaUrls.length > 0) && (
              <div>
                <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                  Fotos do veículo
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  {fotosEntradaUrls.length > 0 && (
                    <div>
                      <p className="mb-1 text-xs font-medium text-muted-foreground">Entrada</p>
                      <div className="grid grid-cols-2 gap-1">
                        {fotosEntradaUrls.map((url, i) => (
                          <img
                            key={i}
                            src={url}
                            alt={`Entrada ${i + 1}`}
                            className="aspect-square rounded-md border border-border object-cover cursor-pointer hover:opacity-80"
                            onClick={() => window.open(url, "_blank")}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                  {fotosSaidaUrls.length > 0 && (
                    <div>
                      <p className="mb-1 text-xs font-medium text-muted-foreground">Saída</p>
                      <div className="grid grid-cols-2 gap-1">
                        {fotosSaidaUrls.map((url, i) => (
                          <img
                            key={i}
                            src={url}
                            alt={`Saída ${i + 1}`}
                            className="aspect-square rounded-md border border-border object-cover cursor-pointer hover:opacity-80"
                            onClick={() => window.open(url, "_blank")}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Movimentações */}
            <div>
              <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">Histórico</h4>
              {movimentacoes.length === 0 ? (
                <p className="text-xs text-muted-foreground">Nenhuma movimentação.</p>
              ) : (
                <div className="space-y-2">
                  {movimentacoes.map((mov) => (
                    <div key={mov.id} className="flex items-start gap-2">
                      <ChevronRight className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                      <div>
                        <p className="text-xs text-foreground">{mov.descricao}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {mov.created_at ? format(new Date(mov.created_at), "dd/MM HH:mm", { locale: ptBR }) : ""}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit OS Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Alterar OS</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Valor total (R$)</label>
              <Input type="number" value={editValor} onChange={(e) => setEditValor(e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Observações</label>
              <textarea
                value={editObs}
                onChange={(e) => setEditObs(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
            {isFullEdit && (
              <>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Responsável</label>
                  <select
                    value={editColaborador}
                    onChange={(e) => setEditColaborador(e.target.value)}
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"
                  >
                    <option value="">Nenhum</option>
                    {colaboradores.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nome}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Prazo estimado</label>
                  <Input type="datetime-local" value={editPrazo} onChange={(e) => setEditPrazo(e.target.value)} />
                </div>
              </>
            )}
          </div>
          <DialogFooter>
            <button
              onClick={() => setEditOpen(false)}
              className="rounded-lg border border-border px-4 py-2 text-sm text-foreground hover:bg-muted"
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveEdit}
              disabled={editSaving}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:brightness-110 disabled:opacity-50"
            >
              {editSaving ? "Salvando..." : "Salvar"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Value Change Dialog */}
      <Dialog open={valorChangeOpen} onOpenChange={setValorChangeOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar alteração de valor</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="rounded-lg bg-muted/50 p-3 text-xs text-muted-foreground">
              Valor atual: <strong className="text-foreground">R$ {Number(os.valor_total).toFixed(2)}</strong>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Novo valor (R$)</label>
              <Input type="number" value={novoValor} onChange={(e) => setNovoValor(e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Motivo da alteração *</label>
              <textarea
                value={motivoValor}
                onChange={(e) => setMotivoValor(e.target.value)}
                rows={3}
                placeholder="Descreva o motivo..."
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>
          <DialogFooter>
            <button
              onClick={() => setValorChangeOpen(false)}
              className="rounded-lg border border-border px-4 py-2 text-sm text-foreground hover:bg-muted"
            >
              Cancelar
            </button>
            <button
              onClick={handleSaveValorChange}
              disabled={valorSaving || !motivoValor.trim()}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:brightness-110 disabled:opacity-50"
            >
              {valorSaving ? "Salvando..." : "Confirmar alteração"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Avaliação Dialog */}
      <Dialog open={avaliacaoDialogOpen} onOpenChange={setAvaliacaoDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-400" /> Veículo entregue!
            </DialogTitle>
            <DialogDescription>
              Envie o link de avaliação para o cliente enquanto ele ainda está na oficina.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-xl border border-border bg-muted/30 p-4 text-sm text-foreground leading-relaxed">
              Olá {os.clientes?.nome || ""}! Obrigado por confiar na {oficinaNome}. Ficamos felizes em atender você.
              Deixe sua avaliação aqui: {avaliacaoUrl}
            </div>

            <div className="flex flex-col gap-2">
              {os.clientes?.telefone && (
                <a
                  href={buildWhatsappAvaliacao()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-4 py-3 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
                >
                  <ExternalLink className="h-4 w-4" /> Enviar pelo WhatsApp →
                </a>
              )}

              <button
                onClick={() => {
                  navigator.clipboard.writeText(avaliacaoUrl);
                  toast.success("Link de avaliação copiado!");
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                <Copy className="h-4 w-4" /> Copiar link
              </button>
            </div>
          </div>

          <div className="flex justify-center pt-2">
            <button
              onClick={() => setAvaliacaoDialogOpen(false)}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              Fechar
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

function RecusarButton({
  motivoRecusa,
  setMotivoRecusa,
  onRecusar,
}: {
  motivoRecusa: string;
  setMotivoRecusa: (v: string) => void;
  onRecusar: () => void;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="w-full rounded-lg border border-red-800/40 bg-red-900/10 px-4 py-2 text-sm font-medium text-red-400 hover:bg-red-900/20">
          Recusar OS
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Recusar OS</AlertDialogTitle>
          <AlertDialogDescription>
            Informe o motivo da recusa. Esta ação pode ser revertida depois.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <textarea
          value={motivoRecusa}
          onChange={(e) => setMotivoRecusa(e.target.value)}
          placeholder="Motivo da recusa..."
          className="h-20 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
        />
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onRecusar} className="bg-red-600 hover:bg-red-700">
            Confirmar recusa
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default OSSheetContent;
