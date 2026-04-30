import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  Plus,
  Loader2,
  FileText,
  Pencil,
  Download,
  Send,
  Trash2,
  Eye,
  CheckCircle2,
  XCircle,
  Wrench,
  Check,
} from "lucide-react";
import OrcamentoFormModal from "./OrcamentoFormModal";
import EmptyModuleState from "./EmptyModuleState";
import { downloadOrcamentoPdf } from "@/lib/orcamentoPdf";
import { publicUrl } from "@/lib/publicUrl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  rascunho: { label: "Rascunho", cls: "bg-muted text-muted-foreground" },
  enviado: { label: "Enviado", cls: "bg-blue-500/15 text-blue-400" },
  aguardando: { label: "Aguardando", cls: "bg-amber-500/15 text-amber-400" },
  aprovado: { label: "Aprovado", cls: "bg-emerald-500/15 text-emerald-400" },
  recusado: { label: "Recusado", cls: "bg-red-500/15 text-red-400" },
};

const brl = (n: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n || 0);

interface DemoOrcamentosProps {
  onNavigate?: (key: string, osId?: string) => void;
  embedded?: boolean;
}

function defaultPrazo() {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

const DemoOrcamentos = ({ onNavigate, embedded = false }: DemoOrcamentosProps = {}) => {
  const { oficina_id } = useAuth();
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("todos");
  const [creatingOsId, setCreatingOsId] = useState<string | null>(null);
  const [convertOrc, setConvertOrc] = useState<any | null>(null);
  const [convertColaboradorId, setConvertColaboradorId] = useState<string>("");
  const [convertPrazo, setConvertPrazo] = useState<string>(defaultPrazo());
  const [deleteOrc, setDeleteOrc] = useState<any | null>(null);

  const { data: colaboradoresAtivos } = useQuery({
    queryKey: ["colaboradores-ativos", oficina_id],
    enabled: !!oficina_id,
    queryFn: async () => {
      const { data } = await supabase
        .from("colaboradores")
        .select("id, nome, funcao")
        .eq("ativo", true)
        .eq("oficina_id", oficina_id!)
        .order("nome");
      return data || [];
    },
  });

  const { data: oficina } = useQuery({
    queryKey: ["oficina-pdf-meta", oficina_id],
    enabled: !!oficina_id,
    queryFn: async () => {
      const { data } = await supabase
        .from("oficinas")
        .select("nome, telefone, cnpj, endereco, logo_url")
        .eq("id", oficina_id!)
        .maybeSingle();
      return data;
    },
  });

  const { data: orcamentos, isLoading } = useQuery({
    queryKey: ["orcamentos", oficina_id],
    enabled: !!oficina_id,
    queryFn: async () => {
      const { data } = await supabase
        .from("orcamentos")
        .select("*")
        .eq("oficina_id", oficina_id!)
        .is("os_id", null)
        .order("created_at", { ascending: false });
      return data || [];
    },
  });

  const orcamentosFiltrados =
    filterStatus === "todos"
      ? orcamentos || []
      : (orcamentos || []).filter((o: any) => o.status === filterStatus);

  function openNew() {
    setEditingId(null);
    setShowForm(true);
  }
  function openEdit(id: string) {
    setEditingId(id);
    setShowForm(true);
  }

  async function confirmDelete() {
    if (!deleteOrc) return;
    const { error } = await supabase.from("orcamentos").delete().eq("id", deleteOrc.id);
    if (error) {
      toast.error("Erro ao excluir.");
      return;
    }
    toast.success("Orçamento excluído.");
    qc.invalidateQueries({ queryKey: ["orcamentos"] });
    setDeleteOrc(null);
  }

  async function handleDownloadPdf(orc: any) {
    if (!oficina) {
      toast.error("Configure os dados da oficina primeiro.");
      return;
    }
    try {
      await downloadOrcamentoPdf(
        {
          numero: orc.numero,
          data: orc.data_orcamento,
          nome_cliente: orc.nome_cliente,
          telefone_cliente: orc.telefone_cliente,
          marca: orc.marca,
          modelo: orc.modelo,
          placa: orc.placa,
          pecas: Array.isArray(orc.pecas) ? orc.pecas : [],
          mao_obra_descricao: orc.mao_obra_descricao,
          mao_obra_valor: Number(orc.mao_obra_valor) || 0,
          total_pecas: Number(orc.total_pecas) || 0,
          total_geral: Number(orc.total_geral) || 0,
          oficina,
        },
        `orcamento-${orc.numero || orc.id.slice(0, 8)}.pdf`,
      );
    } catch (e) {
      console.error(e);
      toast.error("Erro ao gerar PDF.");
    }
  }

  async function handleEnviarWhatsApp(orc: any) {
    if (!orc.telefone_cliente) {
      toast.error("Cliente sem telefone cadastrado no orçamento.");
      return;
    }
    // Marca como enviado/aguardando se ainda rascunho
    if (orc.status === "rascunho") {
      await supabase
        .from("orcamentos")
        .update({ status: "aguardando", enviado_em: new Date().toISOString() })
        .eq("id", orc.id);
      qc.invalidateQueries({ queryKey: ["orcamentos"] });
    }

    const link = publicUrl(`/aprovar/${orc.token_publico}`);
    const msg = encodeURIComponent(
      `Olá ${orc.nome_cliente}, segue o orçamento da ${oficina?.nome || "oficina"}:\n` +
        `Total: ${brl(Number(orc.total_geral) || 0)}\n` +
        `Acesse o link para visualizar e aprovar:\n${link}`,
    );
    const tel = orc.telefone_cliente.replace(/\D/g, "");
    window.open(`https://wa.me/${tel}?text=${msg}`, "_blank");

    await supabase
      .from("orcamentos")
      .update({ whatsapp_enviado: true })
      .eq("id", orc.id);
    qc.invalidateQueries({ queryKey: ["orcamentos"] });
  }

  function copiarLink(orc: any) {
    const link = publicUrl(`/aprovar/${orc.token_publico}`);
    navigator.clipboard.writeText(link);
    toast.success("Link copiado!");
  }

  async function handleCriarOS(
    orc: any,
    opts?: { colaboradorId?: string | null; prazoEstimado?: string | null },
  ) {
    if (!oficina_id) return;
    setCreatingOsId(orc.id);
    try {
      let clienteId: string | null = null;
      if (orc.nome_cliente) {
        const { data: cli } = await supabase
          .from("clientes")
          .select("id")
          .eq("oficina_id", oficina_id)
          .ilike("nome", orc.nome_cliente)
          .maybeSingle();
        if (cli) clienteId = cli.id;
        else {
          const { data: novoCli } = await supabase
            .from("clientes")
            .insert({
              oficina_id,
              nome: orc.nome_cliente,
              telefone: orc.telefone_cliente || null,
            })
            .select("id")
            .single();
          if (novoCli) clienteId = novoCli.id;
        }
      }

      let veiculoId: string | null = null;
      if (orc.placa && clienteId) {
        const { data: vei } = await supabase
          .from("veiculos")
          .select("id")
          .eq("oficina_id", oficina_id)
          .ilike("placa", orc.placa)
          .maybeSingle();
        if (vei) veiculoId = vei.id;
        else {
          const { data: novoVei } = await supabase
            .from("veiculos")
            .insert({
              oficina_id,
              cliente_id: clienteId,
              placa: orc.placa,
              marca: orc.marca || null,
              modelo: orc.modelo || null,
            })
            .select("id")
            .single();
          if (novoVei) veiculoId = novoVei.id;
        }
      }

      const pecasArr = Array.isArray(orc.pecas) ? orc.pecas : [];
      const pecasNorm = pecasArr.map((p: any) => ({
        qtd: Number(p.qtd ?? p.quantidade) || 0,
        descricao: p.descricao || "",
        valor: Number(p.valor ?? p.preco_unitario) || 0,
      }));
      const totalPecas = pecasNorm.reduce(
        (s: number, p: any) => s + (Number(p.qtd) || 0) * (Number(p.valor) || 0),
        0,
      );
      const servicosArr: any[] = Array.isArray(orc.servicos) ? orc.servicos : [];
      const totalServicos = servicosArr.reduce((s, sv) => s + (Number(sv.valor) || 0), 0);
      const valorTotal = totalServicos + totalPecas;

      const { data: osCriada, error } = await supabase
        .from("ordens_servico")
        .insert({
          oficina_id,
          cliente_id: clienteId,
          veiculo_id: veiculoId,
          colaborador_id: opts?.colaboradorId || null,
          prazo_estimado: opts?.prazoEstimado
            ? new Date(opts.prazoEstimado).toISOString()
            : null,
          stage: "criado",
          valor_total: valorTotal,
          observacoes: orc.observacao || null,
          pecas: pecasNorm,
        } as any)
        .select("id")
        .single();
      if (error) throw error;

      // Copia serviços do orçamento para a OS
      if (osCriada && servicosArr.length > 0) {
        const servicoIds = servicosArr.map((s) => s.servico_id).filter(Boolean);
        let etapasMap: Record<string, any> = {};
        if (servicoIds.length > 0) {
          const { data: cat } = await supabase
            .from("servicos_catalogo")
            .select("id, etapas")
            .in("id", servicoIds);
          (cat || []).forEach((c: any) => { etapasMap[c.id] = c.etapas || []; });
        }
        const rows = servicosArr
          .filter((s) => s.servico_id)
          .map((s) => ({
            os_id: osCriada.id,
            servico_id: s.servico_id,
            nome_servico: s.nome || "",
            valor: Number(s.valor) || 0,
            etapas_snapshot: etapasMap[s.servico_id] || [],
          }));
        if (rows.length > 0) {
          await supabase.from("os_servicos").insert(rows);
        }
      }

      // Marca movimentação inicial e vincula orçamento à OS
      if (osCriada) {
        await supabase.from("os_movimentacoes").insert({
          os_id: osCriada.id,
          stage_novo: "criado",
          descricao: "OS criada a partir do orçamento aprovado",
        });
        await supabase
          .from("orcamentos")
          .update({ os_id: osCriada.id, status: "aprovado" })
          .eq("id", orc.id);
      }

      toast.success("OS criada com peças e serviços do orçamento!");
      qc.invalidateQueries({ queryKey: ["ordens_servico"] });
      qc.invalidateQueries({ queryKey: ["orcamentos"] });
      onNavigate?.("os", osCriada?.id);
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message || "Erro ao criar OS.");
    } finally {
      setCreatingOsId(null);
    }
  }

  const counts = (orcamentos || []).reduce<Record<string, number>>((acc, o: any) => {
    acc[o.status] = (acc[o.status] || 0) + 1;
    return acc;
  }, {});

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Carregando orçamentos...
      </div>
    );
  }

  if (!orcamentos || orcamentos.length === 0) {
    if (embedded) {
      return (
        <>
          <div className="rounded-lg border border-dashed border-border bg-card/50 px-6 py-12 text-center">
            <p className="text-sm text-muted-foreground">
              Nenhum orçamento nesta etapa. Clique em "Novo Orçamento" para criar.
            </p>
          </div>
          <OrcamentoFormModal open={showForm} onOpenChange={setShowForm} orcamentoId={editingId} />
        </>
      );
    }
    return (
      <>
        <EmptyModuleState
          icon={FileText}
          title="Nenhum orçamento ainda"
          description="Crie seu primeiro orçamento profissional, gere o PDF com sua logo e envie ao cliente pelo WhatsApp."
          primaryAction="+ Novo Orçamento"
          onPrimaryAction={openNew}
        />
        <OrcamentoFormModal open={showForm} onOpenChange={setShowForm} orcamentoId={editingId} />
      </>
    );
  }

  return (
    <>
      {!embedded && (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-sm font-bold uppercase tracking-wide">Orçamentos</h2>
          <button
            onClick={openNew}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:brightness-110"
          >
            <Plus className="h-4 w-4" /> Novo Orçamento
          </button>
        </div>
      )}

      {/* Pipeline cards (filters) */}
      <div className="mb-4 grid gap-2 sm:grid-cols-3 lg:grid-cols-6">
        <PipelineChip
          label="Todos"
          count={orcamentos.length}
          active={filterStatus === "todos"}
          onClick={() => setFilterStatus("todos")}
        />
        {Object.keys(STATUS_LABELS).map((k) => (
          <PipelineChip
            key={k}
            label={STATUS_LABELS[k].label}
            count={counts[k] || 0}
            active={filterStatus === k}
            onClick={() => setFilterStatus(k)}
            color={STATUS_LABELS[k].cls}
          />
        ))}
      </div>

      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-3 py-2 text-left">Nº</th>
              <th className="px-3 py-2 text-left">Cliente</th>
              <th className="px-3 py-2 text-left">Veículo</th>
              <th className="px-3 py-2 text-right">Total</th>
              <th className="px-3 py-2 text-left">Status</th>
              <th className="px-3 py-2 text-left">Data</th>
              <th className="px-3 py-2 text-right">Ações</th>
            </tr>
          </thead>
          <tbody>
            {orcamentosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-3 py-10 text-center text-sm text-muted-foreground">
                  Nenhum orçamento neste filtro.
                </td>
              </tr>
            ) : orcamentosFiltrados.map((o: any) => {
              const st = STATUS_LABELS[o.status] || STATUS_LABELS.rascunho;
              return (
                <tr key={o.id} className="border-t border-border hover:bg-muted/20">
                  <td className="px-3 py-2 font-mono text-xs">#{o.numero}</td>
                  <td className="px-3 py-2 font-medium">{o.nome_cliente}</td>
                  <td className="px-3 py-2 text-muted-foreground">
                    {[o.marca, o.modelo].filter(Boolean).join(" ") || "—"}
                    {o.placa ? ` · ${o.placa}` : ""}
                  </td>
                  <td className="px-3 py-2 text-right font-semibold">{brl(Number(o.total_geral))}</td>
                  <td className="px-3 py-2">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${st.cls}`}>
                      {st.label}
                    </span>
                    {o.status === "recusado" && o.motivo_recusa && (
                      <div className="mt-1 text-xs text-muted-foreground">
                        Motivo: {o.motivo_recusa}
                      </div>
                    )}
                  </td>
                  <td className="px-3 py-2 text-xs text-muted-foreground">
                    {new Date(o.created_at).toLocaleDateString("pt-BR")}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex justify-end gap-1">
                      <IconBtn title="Ver link público" onClick={() => copiarLink(o)}>
                        <Eye className="h-3.5 w-3.5" />
                      </IconBtn>
                      <IconBtn title="Editar" onClick={() => openEdit(o.id)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </IconBtn>
                      <IconBtn title="Baixar PDF" onClick={() => handleDownloadPdf(o)}>
                        <Download className="h-3.5 w-3.5" />
                      </IconBtn>
                      {(() => {
                        const wppDisabled = o.status === "aprovado" || o.whatsapp_enviado;
                        const wppTitle = o.status === "aprovado"
                          ? "Orçamento já aprovado"
                          : o.whatsapp_enviado
                            ? "WhatsApp já enviado"
                            : "Enviar orçamento ao cliente pelo WhatsApp";
                        return (
                          <button
                            type="button"
                            onClick={() => handleEnviarWhatsApp(o)}
                            disabled={wppDisabled}
                            title={wppTitle}
                            className={
                              wppDisabled
                                ? "inline-flex items-center gap-1 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-400 cursor-not-allowed"
                                : "inline-flex items-center gap-1 rounded-md border border-[#25D366]/40 bg-[#25D366]/10 px-2 py-1 text-xs font-semibold text-[#25D366] transition-colors hover:bg-[#25D366]/20"
                            }
                          >
                            {wppDisabled ? (
                              <>
                                <Check className="h-3.5 w-3.5" />
                                Enviado ✓
                              </>
                            ) : (
                              <>
                                <Send className="h-3.5 w-3.5" />
                                Enviar WhatsApp →
                              </>
                            )}
                          </button>
                        );
                      })()}
                      {o.status === "aprovado" && (
                        <button
                          type="button"
                          disabled={!!o.os_id || creatingOsId === o.id}
                          onClick={() => {
                            setConvertColaboradorId("");
                            setConvertPrazo(defaultPrazo());
                            setConvertOrc(o);
                          }}
                          className="inline-flex items-center gap-1 rounded-md border border-emerald-500/40 bg-emerald-500/10 px-2 py-1 text-xs font-semibold text-emerald-400 transition-colors hover:bg-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                          title={o.os_id ? "OS já criada para este orçamento" : "Cria uma OS com todos os dados deste orçamento"}
                        >
                          {creatingOsId === o.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Wrench className="h-3.5 w-3.5" />
                          )}
                          Converter em OS →
                        </button>
                      )}
                      {o.status === "recusado" && (
                        <IconBtn
                          title="Voltar para edição"
                          onClick={async () => {
                            await supabase
                              .from("orcamentos")
                              .update({ status: "rascunho", motivo_recusa: null })
                              .eq("id", o.id);
                            qc.invalidateQueries({ queryKey: ["orcamentos"] });
                            toast.success("Orçamento voltou para rascunho.");
                          }}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </IconBtn>
                      )}
                      <IconBtn title="Excluir" onClick={() => setDeleteOrc(o)} danger>
                        <Trash2 className="h-3.5 w-3.5" />
                      </IconBtn>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <OrcamentoFormModal open={showForm} onOpenChange={setShowForm} orcamentoId={editingId} />

      <Dialog open={!!convertOrc} onOpenChange={(o) => !o && setConvertOrc(null)}>
        <DialogContent className="max-w-md">
          {convertOrc && (() => {
            const servicosArr: any[] = Array.isArray(convertOrc.servicos) ? convertOrc.servicos : [];
            const tituloVeic = [convertOrc.marca, convertOrc.modelo].filter(Boolean).join(" ") || "Veículo";
            return (
              <>
                <DialogHeader>
                  <DialogTitle>
                    Criar OS — {tituloVeic}
                    {convertOrc.placa ? ` · ${convertOrc.placa}` : ""}
                  </DialogTitle>
                  <DialogDescription>
                    Defina o técnico e prazo. Cliente, peças e serviços serão copiados automaticamente.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-2">
                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Técnico responsável
                    </label>
                    <select
                      value={convertColaboradorId}
                      onChange={(e) => setConvertColaboradorId(e.target.value)}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                    >
                      <option value="">Definir depois</option>
                      {(colaboradoresAtivos || []).map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.nome}{c.funcao ? ` — ${c.funcao}` : ""}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Prazo estimado
                    </label>
                    <input
                      type="datetime-local"
                      value={convertPrazo}
                      onChange={(e) => setConvertPrazo(e.target.value)}
                      className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                    />
                  </div>

                  <div className="rounded-md border border-border bg-muted/20 p-3 text-xs space-y-1">
                    <div>
                      <span className="font-semibold text-muted-foreground">Cliente: </span>
                      {convertOrc.nome_cliente}
                    </div>
                    <div>
                      <span className="font-semibold text-muted-foreground">Serviços: </span>
                      {servicosArr.length > 0
                        ? servicosArr.map((s) => s.nome).filter(Boolean).join(", ")
                        : "Nenhum"}
                    </div>
                    <div>
                      <span className="font-semibold text-muted-foreground">Valor total: </span>
                      <span className="font-semibold text-foreground">{brl(Number(convertOrc.total_geral))}</span>
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <button
                    type="button"
                    onClick={() => setConvertOrc(null)}
                    className="rounded-md border border-border px-4 py-2 text-sm font-medium hover:bg-muted"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    disabled={creatingOsId === convertOrc.id}
                    onClick={async () => {
                      const orc = convertOrc;
                      setConvertOrc(null);
                      await handleCriarOS(orc, {
                        colaboradorId: convertColaboradorId || null,
                        prazoEstimado: convertPrazo || null,
                      });
                    }}
                    className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-500 disabled:opacity-50"
                  >
                    {creatingOsId === convertOrc.id && <Loader2 className="h-4 w-4 animate-spin" />}
                    Confirmar e criar OS
                  </button>
                </DialogFooter>
              </>
            );
          })()}
        </DialogContent>
      </Dialog>
      <AlertDialog open={!!deleteOrc} onOpenChange={(o) => !o && setDeleteOrc(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir orçamento?</AlertDialogTitle>
            <AlertDialogDescription>
              {deleteOrc && (
                <>
                  Esta ação não pode ser desfeita. O orçamento <b>#{deleteOrc.numero}</b> de{" "}
                  <b>{deleteOrc.nome_cliente}</b> será removido permanentemente.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 text-white hover:bg-red-700"
            >
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

const PipelineChip = ({
  label,
  count,
  active,
  onClick,
  color,
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
  color?: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center justify-between rounded-lg border px-3 py-2 text-xs transition-all ${
      active
        ? "border-primary bg-primary/10 text-foreground"
        : "border-border bg-card text-muted-foreground hover:bg-muted/40"
    }`}
  >
    <span className="font-semibold">{label}</span>
    <span
      className={`ml-2 rounded-full px-2 py-0.5 font-mono text-[10px] ${
        color || "bg-muted text-muted-foreground"
      }`}
    >
      {count}
    </span>
  </button>
);

const IconBtn = ({
  children,
  onClick,
  title,
  accent,
  danger,
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  accent?: boolean;
  danger?: boolean;
}) => (
  <button
    type="button"
    title={title}
    onClick={onClick}
    className={`rounded-md border border-border p-1.5 transition-colors ${
      danger
        ? "text-muted-foreground hover:bg-red-500/10 hover:text-red-400"
        : accent
        ? "text-primary hover:bg-primary/10"
        : "text-muted-foreground hover:bg-muted hover:text-foreground"
    }`}
  >
    {children}
  </button>
);

export default DemoOrcamentos;
