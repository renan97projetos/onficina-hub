import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import {
  Phone, Copy, Clock, Circle, CheckCircle2, XCircle,
  AlertTriangle, CreditCard, Truck, ChevronRight, Camera, X, Pencil, DollarSign,
} from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import type { OSWithRelations } from "./DemoOS";
import type { Tables } from "@/integrations/supabase/types";

interface Props {
  os: OSWithRelations;
  onClose: () => void;
}

const STAGE_LABELS: Record<string, string> = {
  criado: "Criado",
  aguardando_carro: "Aguardando carro",
  em_atendimento: "Em atendimento",
  pagamento: "Pagamento",
  entrega: "Entrega do veículo",
  finalizado: "Finalizado",
  recusado: "Recusado",
};

const OSSheetContent = ({ os, onClose }: Props) => {
  const queryClient = useQueryClient();
  const [motivoRecusa, setMotivoRecusa] = useState("");
  const [pagamentoForma, setPagamentoForma] = useState(os.pagamento_forma || "");
  const [notificado, setNotificado] = useState(os.cliente_notificado_entrega || false);

  // Edit OS dialog
  const [editOpen, setEditOpen] = useState(false);
  const [editValor, setEditValor] = useState(String(os.valor_total));
  const [editObs, setEditObs] = useState(os.observacoes || "");
  const [editColaborador, setEditColaborador] = useState(os.colaborador_id || "");
  const [editPrazo, setEditPrazo] = useState(os.prazo_estimado ? new Date(os.prazo_estimado).toISOString().slice(0, 16) : "");
  const [editSaving, setEditSaving] = useState(false);

  // Value change dialog (em_atendimento only)
  const [valorChangeOpen, setValorChangeOpen] = useState(false);
  const [novoValor, setNovoValor] = useState("");
  const [motivoValor, setMotivoValor] = useState("");
  const [valorSaving, setValorSaving] = useState(false);

  // Exit photos
  const [fotosSaida, setFotosSaida] = useState<File[]>([]);
  const [fotoSaidaPreviews, setFotoSaidaPreviews] = useState<string[]>([]);
  const [uploadingSaida, setUploadingSaida] = useState(false);

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

  const isFullEdit = os.stage === "criado" || os.stage === "aguardando_carro";
  const isLimitedEdit = os.stage === "em_atendimento" || os.stage === "pagamento" || os.stage === "entrega";

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
    if (!motivoRecusa.trim()) { toast.error("Informe o motivo da recusa"); return; }
    await supabase.from("ordens_servico").update({ stage: "recusado", motivo_recusa: motivoRecusa }).eq("id", os.id);
    await supabase.from("os_movimentacoes").insert({
      os_id: os.id, stage_anterior: os.stage, stage_novo: "recusado", descricao: `OS recusada: ${motivoRecusa}`,
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
      const updates: any = {
        valor_total: parseFloat(editValor) || 0,
        observacoes: editObs.trim() || null,
      };
      if (isFullEdit) {
        updates.colaborador_id = editColaborador || null;
        updates.prazo_estimado = editPrazo ? new Date(editPrazo).toISOString() : null;
      }
      await supabase.from("ordens_servico").update(updates).eq("id", os.id);
      queryClient.invalidateQueries({ queryKey: ["ordens_servico"] });
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
    if (!motivoValor.trim()) { toast.error("Informe o motivo da alteração"); return; }
    const nv = parseFloat(novoValor);
    if (isNaN(nv) || nv < 0) { toast.error("Informe um valor válido"); return; }
    setValorSaving(true);
    try {
      const valorAnterior = Number(os.valor_total);
      await supabase.from("ordens_servico").update({ valor_total: nv }).eq("id", os.id);
      await supabase.from("os_movimentacoes").insert({
        os_id: os.id,
        descricao: `Valor alterado de R$${valorAnterior.toFixed(2)} para R$${nv.toFixed(2)}: ${motivoValor.trim()}`,
        valor_anterior: valorAnterior,
        valor_novo: nv,
      });
      queryClient.invalidateQueries({ queryKey: ["ordens_servico"] });
      queryClient.invalidateQueries({ queryKey: ["os_movimentacoes", os.id] });
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
        if (error) { console.error(error); continue; }
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

  const allServicosCompleted = os.os_servicos?.every((s) => s.status === "concluido") ?? false;
  const clienteUrl = `${window.location.origin}/acompanhar/${os.token_cliente}`;
  const tecnicoUrl = `${window.location.origin}/tecnico/${os.id}`;
  const whatsappUrl = os.clientes?.telefone ? `https://wa.me/55${os.clientes.telefone.replace(/\D/g, "")}` : null;

  const fotosEntradaUrls = (os.fotos_entrada as string[] | null) || [];
  const fotosSaidaUrls = (os.fotos_saida as string[] | null) || [];

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-foreground">{os.clientes?.nome || "—"}</h2>
            <p className="text-sm text-muted-foreground">
              {os.veiculos?.placa} • {os.veiculos?.marca} {os.veiculos?.modelo}
            </p>
          </div>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {STAGE_LABELS[os.stage] || os.stage}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="grid gap-6 p-6 lg:grid-cols-2">
          {/* Left column: actions */}
          <div className="space-y-5">
            <h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Ações</h3>

            {/* Edit & value change buttons */}
            {(isFullEdit || isLimitedEdit) && (
              <div className="space-y-3">
                <button onClick={() => { setEditValor(String(os.valor_total)); setEditObs(os.observacoes || ""); setEditColaborador(os.colaborador_id || ""); setEditPrazo(os.prazo_estimado ? new Date(os.prazo_estimado).toISOString().slice(0, 16) : ""); setEditOpen(true); }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 py-3 text-sm font-medium text-foreground hover:bg-muted transition-colors">
                  <Pencil className="h-4 w-4" /> Alterar OS
                </button>

                {os.stage === "em_atendimento" && (
                  <button onClick={() => { setNovoValor(String(os.valor_total)); setMotivoValor(""); setValorChangeOpen(true); }}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-amber-700/40 bg-amber-900/10 px-4 py-3 text-sm font-medium text-amber-400 hover:bg-amber-900/20 transition-colors">
                    <DollarSign className="h-4 w-4" /> Registrar alteração de valor
                  </button>
                )}
              </div>
            )}

            {/* CRIADO */}
            {os.stage === "criado" && (
              <div className="space-y-4">
                <button onClick={() => avancarEtapa("aguardando_carro", "OS confirmada → Aguardando carro")}
                  className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:brightness-110 transition-all">
                  Confirmar OS → Aguardar carro
                </button>
                <RecusarButton motivoRecusa={motivoRecusa} setMotivoRecusa={setMotivoRecusa} onRecusar={recusarOS} />
              </div>
            )}

            {/* AGUARDANDO_CARRO */}
            {os.stage === "aguardando_carro" && (
              <div className="space-y-4">
                <button onClick={() => avancarEtapa("em_atendimento", "Carro chegou → Em atendimento")}
                  className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:brightness-110 transition-all">
                  Confirmar chegada → Em atendimento
                </button>
                <RecusarButton motivoRecusa={motivoRecusa} setMotivoRecusa={setMotivoRecusa} onRecusar={recusarOS} />
              </div>
            )}

            {/* EM_ATENDIMENTO */}
            {os.stage === "em_atendimento" && (
              <div className="space-y-5">
                <h4 className="text-sm font-semibold text-foreground">Serviços</h4>
                {os.os_servicos?.map((srv) => (
                  <div key={srv.id} className="rounded-xl border border-border bg-background p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-foreground">{srv.nome_servico || "Serviço"}</span>
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        srv.status === "concluido" ? "bg-green-900/30 text-green-400" :
                        srv.status === "em_andamento" ? "bg-blue-900/30 text-blue-400" :
                        "bg-muted text-muted-foreground"
                      }`}>
                        {srv.status === "concluido" ? "Concluído" : srv.status === "em_andamento" ? "Em andamento" : "Pendente"}
                      </span>
                    </div>
                    {srv.etapas_snapshot && Array.isArray(srv.etapas_snapshot) && (srv.etapas_snapshot as string[]).length > 0 && (
                      <div className="mt-2 space-y-1">
                        {(srv.etapas_snapshot as string[]).map((etapa, i) => (
                          <div key={i} className="flex items-center gap-2 text-xs">
                            {i < srv.etapa_atual ? (
                              <CheckCircle2 className="h-3.5 w-3.5 text-green-400" />
                            ) : (
                              <Circle className="h-3.5 w-3.5 text-muted-foreground" />
                            )}
                            <span className={i < srv.etapa_atual ? "text-green-400" : "text-muted-foreground"}>{etapa}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                <div className="flex gap-2">
                  <button onClick={() => { navigator.clipboard.writeText(clienteUrl); toast.success("Link do cliente copiado"); }}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground hover:bg-muted">
                    <Copy className="h-3.5 w-3.5" /> Link do cliente
                  </button>
                  <button onClick={() => { navigator.clipboard.writeText(tecnicoUrl); toast.success("Link do técnico copiado"); }}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground hover:bg-muted">
                    <Copy className="h-3.5 w-3.5" /> Link do técnico
                  </button>
                </div>

                <button onClick={() => avancarEtapa("pagamento", "Atendimento finalizado → Pagamento")}
                  disabled={!allServicosCompleted}
                  className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed">
                  Finalizar atendimento → Pagamento
                </button>
                {!allServicosCompleted && (
                  <p className="text-xs text-yellow-400">Conclua todos os serviços antes de avançar.</p>
                )}
                <RecusarButton motivoRecusa={motivoRecusa} setMotivoRecusa={setMotivoRecusa} onRecusar={recusarOS} />
              </div>
            )}

            {/* PAGAMENTO */}
            {os.stage === "pagamento" && (
              <div className="space-y-4">
                <div className="rounded-lg border border-border bg-background p-4">
                  <p className="text-xs text-muted-foreground">Valor total</p>
                  <p className="text-2xl font-bold text-foreground">R$ {Number(os.valor_total).toFixed(2)}</p>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Forma de pagamento</label>
                  <select value={pagamentoForma} onChange={(e) => setPagamentoForma(e.target.value)}
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary">
                    <option value="">Selecione...</option>
                    <option value="dinheiro">Dinheiro</option>
                    <option value="pix">PIX</option>
                    <option value="cartao">Cartão</option>
                    <option value="boleto">Boleto</option>
                  </select>
                </div>
                <button
                  disabled={!pagamentoForma}
                  onClick={() => avancarEtapa("entrega", `Pagamento confirmado (${pagamentoForma})`, {
                    pagamento_forma: pagamentoForma,
                    pagamento_confirmado: true,
                    pagamento_confirmado_em: new Date().toISOString(),
                  })}
                  className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed">
                  <CreditCard className="mr-2 inline h-4 w-4" /> Confirmar pagamento → Entrega
                </button>
                <RecusarButton motivoRecusa={motivoRecusa} setMotivoRecusa={setMotivoRecusa} onRecusar={recusarOS} />
              </div>
            )}

            {/* ENTREGA */}
            {os.stage === "entrega" && (
              <div className="space-y-4">
                <div className="rounded-lg border border-border bg-background p-4 space-y-2">
                  <p className="text-xs text-muted-foreground">Resumo</p>
                  <p className="text-sm text-foreground">
                    <strong>Valor:</strong> R$ {Number(os.valor_total).toFixed(2)} • <strong>Forma:</strong> {os.pagamento_forma || "—"}
                  </p>
                  <p className="text-sm text-foreground">
                    <strong>Serviços:</strong> {os.os_servicos?.length || 0} realizados
                  </p>
                </div>

                {/* Exit photos upload */}
                <div>
                  <h4 className="mb-2 text-sm font-semibold text-foreground flex items-center gap-2">
                    <Camera className="h-4 w-4" /> Fotos de saída
                  </h4>
                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-background px-4 py-4 text-sm text-muted-foreground hover:border-primary hover:text-foreground transition-colors">
                    <Camera className="h-5 w-5" />
                    Selecionar fotos de saída
                    <input type="file" accept="image/*" multiple onChange={handleFotoSaidaChange} className="hidden" />
                  </label>
                  {fotoSaidaPreviews.length > 0 && (
                    <>
                      <div className="mt-2 grid grid-cols-4 gap-2">
                        {fotoSaidaPreviews.map((src, i) => (
                          <div key={i} className="group relative aspect-square overflow-hidden rounded-lg border border-border">
                            <img src={src} alt={`Saída ${i + 1}`} className="h-full w-full object-cover" />
                            <button onClick={() => removeFotoSaida(i)}
                              className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                              <X className="h-3.5 w-3.5 text-white" />
                            </button>
                          </div>
                        ))}
                      </div>
                      <button onClick={uploadFotosSaida} disabled={uploadingSaida}
                        className="mt-2 w-full rounded-lg border border-primary bg-primary/10 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/20 disabled:opacity-50">
                        {uploadingSaida ? "Enviando..." : "Salvar fotos de saída"}
                      </button>
                    </>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <Checkbox id="notif" checked={notificado} onCheckedChange={(v) => setNotificado(!!v)} />
                  <label htmlFor="notif" className="text-sm text-foreground">
                    Cliente foi notificado via WhatsApp que o veículo está pronto
                  </label>
                </div>

                <button
                  disabled={!notificado}
                  onClick={async () => {
                    await supabase.from("ordens_servico").update({ cliente_notificado_entrega: true }).eq("id", os.id);
                    await avancarEtapa("finalizado", "Veículo entregue ao cliente");
                  }}
                  className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed">
                  <Truck className="mr-2 inline h-4 w-4" /> Confirmar entrega → Finalizado
                </button>
              </div>
            )}

            {/* FINALIZADO */}
            {os.stage === "finalizado" && (
              <div className="rounded-lg border border-border bg-background p-4">
                <CheckCircle2 className="mb-2 h-6 w-6 text-green-400" />
                <p className="text-sm font-semibold text-foreground">OS finalizada</p>
                <p className="text-xs text-muted-foreground">Sem ações disponíveis.</p>
              </div>
            )}

            {/* RECUSADO */}
            {os.stage === "recusado" && (
              <div className="space-y-3">
                <div className="rounded-lg border border-red-800/40 bg-red-900/10 p-4">
                  <XCircle className="mb-2 h-6 w-6 text-red-400" />
                  <p className="text-sm font-semibold text-red-400">OS recusada</p>
                  <p className="mt-1 text-xs text-muted-foreground">{os.motivo_recusa || "Motivo não informado"}</p>
                </div>
                <button onClick={reabrirOS}
                  className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground hover:bg-muted">
                  Reabrir OS
                </button>
              </div>
            )}
          </div>

          {/* Right column: info */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Informações</h3>

            {/* Client info */}
            <div className="rounded-lg border border-border bg-background p-4 space-y-2">
              <p className="text-sm font-semibold text-foreground">{os.clientes?.nome}</p>
              {os.clientes?.telefone && (
                <a href={whatsappUrl || "#"} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 text-xs text-primary hover:underline">
                  <Phone className="h-3.5 w-3.5" /> {os.clientes.telefone}
                </a>
              )}
              {os.clientes?.email && <p className="text-xs text-muted-foreground">{os.clientes.email}</p>}
            </div>

            {/* Vehicle */}
            <div className="rounded-lg border border-border bg-background p-4">
              <p className="text-sm text-foreground">
                {os.veiculos?.placa} • {os.veiculos?.marca} {os.veiculos?.modelo} {os.veiculos?.cor} {os.veiculos?.ano}
              </p>
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
                <h4 className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">Fotos do veículo</h4>
                <div className="grid grid-cols-2 gap-4">
                  {fotosEntradaUrls.length > 0 && (
                    <div>
                      <p className="mb-1 text-xs font-medium text-muted-foreground">Entrada</p>
                      <div className="grid grid-cols-2 gap-1">
                        {fotosEntradaUrls.map((url, i) => (
                          <img key={i} src={url} alt={`Entrada ${i + 1}`}
                            className="aspect-square rounded-md border border-border object-cover cursor-pointer hover:opacity-80"
                            onClick={() => window.open(url, "_blank")} />
                        ))}
                      </div>
                    </div>
                  )}
                  {fotosSaidaUrls.length > 0 && (
                    <div>
                      <p className="mb-1 text-xs font-medium text-muted-foreground">Saída</p>
                      <div className="grid grid-cols-2 gap-1">
                        {fotosSaidaUrls.map((url, i) => (
                          <img key={i} src={url} alt={`Saída ${i + 1}`}
                            className="aspect-square rounded-md border border-border object-cover cursor-pointer hover:opacity-80"
                            onClick={() => window.open(url, "_blank")} />
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
              <textarea value={editObs} onChange={(e) => setEditObs(e.target.value)} rows={3}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
            </div>
            {isFullEdit && (
              <>
                <div>
                  <label className="mb-1 block text-xs font-medium text-muted-foreground">Responsável</label>
                  <select value={editColaborador} onChange={(e) => setEditColaborador(e.target.value)}
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary">
                    <option value="">Nenhum</option>
                    {colaboradores.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
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
            <button onClick={() => setEditOpen(false)} className="rounded-lg border border-border px-4 py-2 text-sm text-foreground hover:bg-muted">
              Cancelar
            </button>
            <button onClick={handleSaveEdit} disabled={editSaving}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:brightness-110 disabled:opacity-50">
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
              <textarea value={motivoValor} onChange={(e) => setMotivoValor(e.target.value)} rows={3} placeholder="Descreva o motivo..."
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
            </div>
          </div>
          <DialogFooter>
            <button onClick={() => setValorChangeOpen(false)} className="rounded-lg border border-border px-4 py-2 text-sm text-foreground hover:bg-muted">
              Cancelar
            </button>
            <button onClick={handleSaveValorChange} disabled={valorSaving || !motivoValor.trim()}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:brightness-110 disabled:opacity-50">
              {valorSaving ? "Salvando..." : "Confirmar alteração"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

function RecusarButton({ motivoRecusa, setMotivoRecusa, onRecusar }: { motivoRecusa: string; setMotivoRecusa: (v: string) => void; onRecusar: () => void; }) {
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
          <AlertDialogDescription>Informe o motivo da recusa. Esta ação pode ser revertida depois.</AlertDialogDescription>
        </AlertDialogHeader>
        <textarea value={motivoRecusa} onChange={(e) => setMotivoRecusa(e.target.value)} placeholder="Motivo da recusa..."
          className="h-20 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={onRecusar} className="bg-red-600 hover:bg-red-700">Confirmar recusa</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default OSSheetContent;
