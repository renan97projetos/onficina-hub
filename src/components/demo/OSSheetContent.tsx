import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import {
  Phone, Copy, Clock, Circle, CheckCircle2, XCircle,
  AlertTriangle, CreditCard, Truck, ChevronRight,
} from "lucide-react";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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

  async function avancarEtapa(stageNovo: string, descricao: string, extra?: Record<string, unknown>) {
    await supabase.from("ordens_servico").update({ stage: stageNovo, ...extra }).eq("id", os.id);
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

  const allServicosCompleted = os.os_servicos?.every((s) => s.status === "concluido") ?? false;
  const clienteUrl = `${window.location.origin}/acompanhar/${os.token_cliente}`;
  const tecnicoUrl = `${window.location.origin}/tecnico/${os.id}`;
  const whatsappUrl = os.clientes?.telefone ? `https://wa.me/55${os.clientes.telefone.replace(/\D/g, "")}` : null;

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
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wide text-muted-foreground">Ações</h3>

            {/* CRIADO */}
            {os.stage === "criado" && (
              <div className="space-y-3">
                <button onClick={() => avancarEtapa("aguardando_carro", "OS confirmada → Aguardando carro")}
                  className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:brightness-110">
                  Confirmar OS → Aguardar carro
                </button>
                <RecusarButton motivoRecusa={motivoRecusa} setMotivoRecusa={setMotivoRecusa} onRecusar={recusarOS} />
              </div>
            )}

            {/* AGUARDANDO_CARRO */}
            {os.stage === "aguardando_carro" && (
              <div className="space-y-3">
                <button onClick={() => avancarEtapa("em_atendimento", "Carro chegou → Em atendimento")}
                  className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:brightness-110">
                  Confirmar chegada → Em atendimento
                </button>
                <RecusarButton motivoRecusa={motivoRecusa} setMotivoRecusa={setMotivoRecusa} onRecusar={recusarOS} />
              </div>
            )}

            {/* EM_ATENDIMENTO */}
            {os.stage === "em_atendimento" && (
              <div className="space-y-4">
                <h4 className="text-sm font-semibold text-foreground">Serviços</h4>
                {os.os_servicos?.map((srv) => (
                  <div key={srv.id} className="rounded-lg border border-border bg-background p-3">
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
