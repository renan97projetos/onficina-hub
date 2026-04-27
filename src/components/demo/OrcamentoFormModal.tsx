import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Trash2, Save, Loader2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import VeiculoSelector, { type VeiculoSelectorValue } from "./VeiculoSelector";
import type { TipoVeiculo } from "@/data/veiculosCatalogo";

interface Peca {
  qtd: number;
  descricao: string;
  valor: number;
}

interface ServicoSel {
  servico_id: string;
  nome: string;
  valor: number;
}

interface OrcamentoFormModalProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  orcamentoId?: string | null;
}

const brl = (n: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n || 0);

const OrcamentoFormModal = ({ open, onOpenChange, orcamentoId }: OrcamentoFormModalProps) => {
  const { oficina_id } = useAuth();
  const qc = useQueryClient();

  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [data, setData] = useState(() => new Date().toISOString().slice(0, 10));
  const [placa, setPlaca] = useState("");
  const [veiculo, setVeiculo] = useState<VeiculoSelectorValue>({
    tipo: "",
    marca: "",
    modelo: "",
    versao: "",
    ano: "",
  });
  const [pecas, setPecas] = useState<Peca[]>([]);
  const [servicosSel, setServicosSel] = useState<Record<string, number>>({}); // servico_id -> valor
  const [observacao, setObservacao] = useState("");
  const [saving, setSaving] = useState(false);

  // Catálogo de serviços
  const { data: servicosCatalogo = [] } = useQuery({
    queryKey: ["servicos_catalogo", oficina_id],
    enabled: open && !!oficina_id,
    queryFn: async () => {
      const { data } = await supabase.from("servicos_catalogo").select("*").order("nome");
      return data || [];
    },
  });

  // Load existing
  const { data: existing } = useQuery({
    queryKey: ["orcamento-edit", orcamentoId],
    enabled: open && !!orcamentoId,
    queryFn: async () => {
      const { data } = await supabase.from("orcamentos").select("*").eq("id", orcamentoId!).maybeSingle();
      return data;
    },
  });

  useEffect(() => {
    if (!open) return;
    if (orcamentoId && existing) {
      setNome(existing.nome_cliente || "");
      setTelefone(existing.telefone_cliente || "");
      setData(existing.data_orcamento || new Date().toISOString().slice(0, 10));
      setPlaca(existing.placa || "");
      setVeiculo({
        tipo: ((existing as any).tipo_veiculo as TipoVeiculo) || "",
        marca: existing.marca || "",
        modelo: existing.modelo || "",
        versao: (existing as any).versao || "",
        ano: (existing as any).ano ? String((existing as any).ano) : "",
      });
      setPecas(Array.isArray(existing.pecas) ? (existing.pecas as unknown as Peca[]) : []);
      const svs = Array.isArray((existing as any).servicos)
        ? ((existing as any).servicos as ServicoSel[])
        : [];
      const map: Record<string, number> = {};
      svs.forEach((s) => { if (s.servico_id) map[s.servico_id] = Number(s.valor) || 0; });
      setServicosSel(map);
      setObservacao((existing as any).observacao || "");
    } else if (!orcamentoId) {
      setNome("");
      setTelefone("");
      setData(new Date().toISOString().slice(0, 10));
      setPlaca("");
      setVeiculo({ tipo: "", marca: "", modelo: "", versao: "", ano: "" });
      setPecas([]);
      setServicosSel({});
      setObservacao("");
    }
  }, [open, orcamentoId, existing]);

  const totalPecas = pecas.reduce((s, p) => s + (Number(p.qtd) || 0) * (Number(p.valor) || 0), 0);
  const totalServicos = Object.values(servicosSel).reduce((s, v) => s + (Number(v) || 0), 0);
  const totalGeral = totalPecas + totalServicos;

  function addPeca() {
    setPecas((prev) => [...prev, { qtd: 1, descricao: "", valor: 0 }]);
  }
  function updatePeca(idx: number, patch: Partial<Peca>) {
    setPecas((prev) => prev.map((p, i) => (i === idx ? { ...p, ...patch } : p)));
  }
  function removePeca(idx: number) {
    setPecas((prev) => prev.filter((_, i) => i !== idx));
  }

  function toggleServico(id: string, precoBase: number) {
    setServicosSel((prev) => {
      const next = { ...prev };
      if (next[id] !== undefined) delete next[id];
      else next[id] = precoBase;
      return next;
    });
  }

  async function salvar() {
    if (!oficina_id) return;
    if (!nome.trim()) {
      toast.error("Informe o nome do cliente.");
      return;
    }
    setSaving(true);

    const servicosPayload: ServicoSel[] = Object.entries(servicosSel).map(([sid, valor]) => {
      const srv = servicosCatalogo.find((s) => s.id === sid);
      return { servico_id: sid, nome: srv?.nome || "", valor: Number(valor) || 0 };
    });

    const payload = {
      oficina_id,
      nome_cliente: nome.trim(),
      telefone_cliente: telefone.trim() || null,
      data_orcamento: data,
      tipo_veiculo: veiculo.tipo || null,
      marca: veiculo.marca.trim() || null,
      modelo: veiculo.modelo.trim() || null,
      versao: veiculo.versao.trim() || null,
      ano: veiculo.ano ? parseInt(veiculo.ano, 10) || null : null,
      placa: placa.trim() || null,
      pecas: pecas.map((p) => ({
        qtd: Number(p.qtd) || 0,
        descricao: p.descricao,
        valor: Number(p.valor) || 0,
      })),
      servicos: servicosPayload,
      observacao: observacao.trim() || null,
      // Mantém compat com PDF/legado
      mao_obra_descricao: servicosPayload.map((s) => s.nome).filter(Boolean).join(", ") || null,
      mao_obra_valor: totalServicos,
      total_pecas: totalPecas,
      total_geral: totalGeral,
    };

    const res = orcamentoId
      ? await supabase.from("orcamentos").update(payload as any).eq("id", orcamentoId)
      : await supabase.from("orcamentos").insert(payload as any);

    setSaving(false);
    if (res.error) {
      toast.error("Erro ao salvar orçamento.");
      return;
    }
    toast.success(orcamentoId ? "Orçamento atualizado." : "Orçamento criado.");
    qc.invalidateQueries({ queryKey: ["orcamentos"] });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{orcamentoId ? "Editar Orçamento" : "Novo Orçamento"}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Nome do Cliente">
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: João da Silva"
              className="input-base"
            />
          </Field>
          <Field label="Data">
            <input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="input-base"
            />
          </Field>
          <Field label="Telefone do Cliente">
            <input
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              placeholder="(11) 99999-0000"
              className="input-base"
            />
          </Field>
          <Field label="Placa">
            <input
              value={placa}
              onChange={(e) => setPlaca(e.target.value.toUpperCase())}
              placeholder="Ex: MTY-6226"
              className="input-base"
            />
          </Field>
        </div>

        {/* Veículo (tipo → marca → modelo → versão → ano) */}
        <div className="mt-4">
          <VeiculoSelector value={veiculo} onChange={setVeiculo} />
        </div>

        {/* Peças */}
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <h4 className="text-sm font-bold">Peças</h4>
            <button
              type="button"
              onClick={addPeca}
              className="inline-flex items-center gap-1 rounded-md border border-border bg-background px-3 py-1.5 text-xs hover:bg-muted"
            >
              <Plus className="h-3 w-3" /> Adicionar
            </button>
          </div>

          <div className="overflow-hidden rounded-lg border border-border">
            <div className="grid grid-cols-[60px_1fr_120px_40px] gap-2 bg-slate-900 px-3 py-2 text-xs font-bold text-white">
              <span>QTD</span>
              <span>Descrição</span>
              <span className="text-right">Valor (R$)</span>
              <span></span>
            </div>
            {pecas.length === 0 ? (
              <div className="px-3 py-6 text-center text-xs text-muted-foreground">
                Nenhuma peça adicionada
              </div>
            ) : (
              pecas.map((p, idx) => (
                <div
                  key={idx}
                  className="grid grid-cols-[60px_1fr_120px_40px] gap-2 border-t border-border px-3 py-2"
                >
                  <input
                    type="number"
                    min="1"
                    value={p.qtd}
                    onChange={(e) => updatePeca(idx, { qtd: Number(e.target.value) })}
                    className="input-base text-center"
                  />
                  <input
                    value={p.descricao}
                    onChange={(e) => updatePeca(idx, { descricao: e.target.value })}
                    placeholder="Descrição da peça"
                    className="input-base"
                  />
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={p.valor}
                    onChange={(e) => updatePeca(idx, { valor: Number(e.target.value) })}
                    className="input-base text-right"
                  />
                  <button
                    type="button"
                    onClick={() => removePeca(idx)}
                    className="rounded-md text-muted-foreground hover:text-destructive"
                    aria-label="Remover"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))
            )}
            <div className="flex items-center justify-between bg-muted/40 px-3 py-2 text-sm font-bold">
              <span>Total Peças:</span>
              <span>{brl(totalPecas)}</span>
            </div>
          </div>
        </div>

        {/* Serviços (catálogo) */}
        <div className="mt-4">
          <h4 className="mb-2 text-sm font-bold">Serviços</h4>
          {servicosCatalogo.length === 0 ? (
            <p className="rounded-lg border border-dashed border-border bg-card/40 px-3 py-4 text-xs text-muted-foreground">
              Nenhum serviço cadastrado. Cadastre no módulo Serviços primeiro.
            </p>
          ) : (
            <div className="space-y-2">
              {servicosCatalogo.map((srv) => {
                const selected = servicosSel[srv.id] !== undefined;
                return (
                  <div
                    key={srv.id}
                    className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${
                      selected ? "border-primary bg-primary/5" : "border-border"
                    }`}
                  >
                    <Checkbox
                      checked={selected}
                      onCheckedChange={() => toggleServico(srv.id, Number(srv.preco_base) || 0)}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{srv.nome}</p>
                      {srv.tempo_medio_horas && (
                        <p className="text-xs text-muted-foreground">~{srv.tempo_medio_horas}h estimadas</p>
                      )}
                    </div>
                    {selected ? (
                      <Input
                        type="number"
                        step="0.01"
                        value={servicosSel[srv.id]}
                        className="w-28 text-right"
                        onChange={(e) =>
                          setServicosSel((p) => ({ ...p, [srv.id]: parseFloat(e.target.value) || 0 }))
                        }
                      />
                    ) : (
                      <span className="text-sm text-muted-foreground">
                        {Number(srv.preco_base) > 0 ? brl(Number(srv.preco_base)) : "Definir valor"}
                      </span>
                    )}
                  </div>
                );
              })}
              <div className="flex items-center justify-between rounded-lg bg-muted/40 px-3 py-2 text-sm font-bold">
                <span>Total Serviços:</span>
                <span>{brl(totalServicos)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Observação */}
        <div className="mt-4">
          <h4 className="mb-2 text-sm font-bold">Observação</h4>
          <textarea
            value={observacao}
            onChange={(e) => setObservacao(e.target.value)}
            placeholder="Observações sobre o orçamento (opcional)..."
            rows={3}
            className="input-base resize-none"
          />
        </div>

        {/* Total geral */}
        <div className="mt-4 flex items-center justify-between rounded-lg bg-slate-900 px-4 py-3 text-white">
          <span className="text-sm font-bold">TOTAL GERAL:</span>
          <span className="text-lg font-bold">{brl(totalGeral)}</span>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-md border border-border bg-background px-4 py-2 text-sm hover:bg-muted"
          >
            Cancelar
          </button>
          <button
            onClick={salvar}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:brightness-110 disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            Salvar
          </button>
        </div>

        <style>{`
          .input-base {
            width: 100%;
            border-radius: 0.5rem;
            border: 1px solid hsl(var(--border));
            background: hsl(var(--background));
            padding: 0.5rem 0.75rem;
            font-size: 0.875rem;
            outline: none;
          }
          .input-base:focus {
            border-color: hsl(var(--primary));
          }
        `}</style>
      </DialogContent>
    </Dialog>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <label className="mb-1 block text-xs font-semibold text-foreground">{label}</label>
    {children}
  </div>
);

export default OrcamentoFormModal;
