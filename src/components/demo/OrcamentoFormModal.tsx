import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Trash2, Save, Loader2 } from "lucide-react";
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
  const [maoObraDesc, setMaoObraDesc] = useState("");
  const [maoObraValor, setMaoObraValor] = useState<number>(0);
  const [saving, setSaving] = useState(false);

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
      setMaoObraDesc(existing.mao_obra_descricao || "");
      setMaoObraValor(Number(existing.mao_obra_valor) || 0);
    } else if (!orcamentoId) {
      setNome("");
      setTelefone("");
      setData(new Date().toISOString().slice(0, 10));
      setPlaca("");
      setVeiculo({ tipo: "", marca: "", modelo: "", versao: "", ano: "" });
      setPecas([]);
      setMaoObraDesc("");
      setMaoObraValor(0);
    }
  }, [open, orcamentoId, existing]);

  const totalPecas = pecas.reduce((s, p) => s + (Number(p.qtd) || 0) * (Number(p.valor) || 0), 0);
  const totalGeral = totalPecas + (Number(maoObraValor) || 0);

  function addPeca() {
    setPecas((prev) => [...prev, { qtd: 1, descricao: "", valor: 0 }]);
  }
  function updatePeca(idx: number, patch: Partial<Peca>) {
    setPecas((prev) => prev.map((p, i) => (i === idx ? { ...p, ...patch } : p)));
  }
  function removePeca(idx: number) {
    setPecas((prev) => prev.filter((_, i) => i !== idx));
  }

  async function salvar() {
    if (!oficina_id) return;
    if (!nome.trim()) {
      toast.error("Informe o nome do cliente.");
      return;
    }
    setSaving(true);
    const payload = {
      oficina_id,
      nome_cliente: nome.trim(),
      telefone_cliente: telefone.trim() || null,
      data_orcamento: data,
      marca: marca.trim() || null,
      modelo: modelo.trim() || null,
      placa: placa.trim() || null,
      pecas: pecas.map((p) => ({
        qtd: Number(p.qtd) || 0,
        descricao: p.descricao,
        valor: Number(p.valor) || 0,
      })),
      mao_obra_descricao: maoObraDesc.trim() || null,
      mao_obra_valor: Number(maoObraValor) || 0,
      total_pecas: totalPecas,
      total_geral: totalGeral,
    };

    const res = orcamentoId
      ? await supabase.from("orcamentos").update(payload).eq("id", orcamentoId)
      : await supabase.from("orcamentos").insert(payload);

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
          <Field label="Marca">
            <input
              value={marca}
              onChange={(e) => setMarca(e.target.value)}
              placeholder="Ex: Volkswagen"
              className="input-base"
            />
          </Field>
          <Field label="Veículo">
            <input
              value={modelo}
              onChange={(e) => setModelo(e.target.value)}
              placeholder="Ex: Gol G5 2015"
              className="input-base"
            />
          </Field>
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

        {/* Mão de obra */}
        <div className="mt-4">
          <h4 className="mb-2 text-sm font-bold">Mão de Obra</h4>
          <textarea
            value={maoObraDesc}
            onChange={(e) => setMaoObraDesc(e.target.value)}
            placeholder="Descrição dos serviços realizados..."
            rows={3}
            className="input-base resize-none"
          />
          <div className="mt-2 flex items-center justify-end gap-2">
            <span className="text-sm font-semibold">Total Mão de Obra (R$):</span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={maoObraValor}
              onChange={(e) => setMaoObraValor(Number(e.target.value))}
              className="input-base w-32 text-right"
            />
          </div>
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
