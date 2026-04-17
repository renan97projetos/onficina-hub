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
} from "lucide-react";
import OrcamentoFormModal from "./OrcamentoFormModal";
import EmptyModuleState from "./EmptyModuleState";
import { downloadOrcamentoPdf } from "@/lib/orcamentoPdf";

const STATUS_LABELS: Record<string, { label: string; cls: string }> = {
  rascunho: { label: "Rascunho", cls: "bg-muted text-muted-foreground" },
  enviado: { label: "Enviado", cls: "bg-blue-500/15 text-blue-400" },
  aguardando: { label: "Aguardando", cls: "bg-amber-500/15 text-amber-400" },
  aprovado: { label: "Aprovado", cls: "bg-emerald-500/15 text-emerald-400" },
  recusado: { label: "Recusado", cls: "bg-red-500/15 text-red-400" },
};

const brl = (n: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n || 0);

const DemoOrcamentos = () => {
  const { oficina_id } = useAuth();
  const qc = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("todos");

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
    queryKey: ["orcamentos", oficina_id, filterStatus],
    enabled: !!oficina_id,
    queryFn: async () => {
      let q = supabase
        .from("orcamentos")
        .select("*")
        .eq("oficina_id", oficina_id!)
        .order("created_at", { ascending: false });
      if (filterStatus !== "todos") q = q.eq("status", filterStatus);
      const { data } = await q;
      return data || [];
    },
  });

  function openNew() {
    setEditingId(null);
    setShowForm(true);
  }
  function openEdit(id: string) {
    setEditingId(id);
    setShowForm(true);
  }

  async function handleDelete(id: string) {
    if (!confirm("Excluir este orçamento?")) return;
    const { error } = await supabase.from("orcamentos").delete().eq("id", id);
    if (error) {
      toast.error("Erro ao excluir.");
      return;
    }
    toast.success("Orçamento excluído.");
    qc.invalidateQueries({ queryKey: ["orcamentos"] });
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

    const link = `${window.location.origin}/aprovar/${orc.token_publico}`;
    const msg = encodeURIComponent(
      `Olá ${orc.nome_cliente}, segue o orçamento da ${oficina?.nome || "oficina"}:\n` +
        `Total: ${brl(Number(orc.total_geral) || 0)}\n` +
        `Acesse o link para visualizar e aprovar:\n${link}`,
    );
    const tel = orc.telefone_cliente.replace(/\D/g, "");
    window.open(`https://wa.me/${tel}?text=${msg}`, "_blank");
  }

  function copiarLink(orc: any) {
    const link = `${window.location.origin}/aprovar/${orc.token_publico}`;
    navigator.clipboard.writeText(link);
    toast.success("Link copiado!");
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
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-bold uppercase tracking-wide">Orçamentos</h2>
        <button
          onClick={openNew}
          className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:brightness-110"
        >
          <Plus className="h-4 w-4" /> Novo Orçamento
        </button>
      </div>

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
            {orcamentos.map((o: any) => {
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
                      <IconBtn
                        title="Enviar WhatsApp"
                        onClick={() => handleEnviarWhatsApp(o)}
                        accent
                      >
                        <Send className="h-3.5 w-3.5" />
                      </IconBtn>
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
                      {o.status !== "aprovado" && (
                        <IconBtn title="Excluir" onClick={() => handleDelete(o.id)} danger>
                          <Trash2 className="h-3.5 w-3.5" />
                        </IconBtn>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
            {orcamentos.length === 0 && (
              <tr>
                <td colSpan={7} className="px-3 py-8 text-center text-sm text-muted-foreground">
                  Nenhum orçamento neste filtro.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <OrcamentoFormModal open={showForm} onOpenChange={setShowForm} orcamentoId={editingId} />
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
