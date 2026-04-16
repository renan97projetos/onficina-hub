import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Plus, Wrench, Pencil, Trash2, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { Tables } from "@/integrations/supabase/types";

type Servico = Tables<"servicos_catalogo">;

const DemoServicos = () => {
  const { oficina_id } = useAuth();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Servico | null>(null);

  // Form state
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [precoBase, setPrecoBase] = useState("");
  const [tempoMedio, setTempoMedio] = useState("");
  const [etapasText, setEtapasText] = useState("");
  const [saving, setSaving] = useState(false);

  const { data: servicos = [], isLoading } = useQuery({
    queryKey: ["servicos_catalogo", oficina_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("servicos_catalogo")
        .select("*")
        .order("nome");
      if (error) throw error;
      return data || [];
    },
    enabled: !!oficina_id,
  });

  function openNew() {
    setEditing(null);
    setNome(""); setDescricao(""); setPrecoBase(""); setTempoMedio(""); setEtapasText("");
    setShowForm(true);
  }

  function openEdit(srv: Servico) {
    setEditing(srv);
    setNome(srv.nome);
    setDescricao(srv.descricao || "");
    setPrecoBase(String(srv.preco_base));
    setTempoMedio(srv.tempo_medio_horas ? String(srv.tempo_medio_horas) : "");
    const etapas = Array.isArray(srv.etapas) ? (srv.etapas as string[]) : [];
    setEtapasText(etapas.join("\n"));
    setShowForm(true);
  }

  async function handleSave() {
    if (!nome.trim()) { toast.error("Preencha o nome do serviço"); return; }
    if (!precoBase || parseFloat(precoBase) <= 0) { toast.error("Preencha o preço base"); return; }

    setSaving(true);
    const etapas = etapasText.split("\n").map(e => e.trim()).filter(Boolean);
    const payload = {
      oficina_id: oficina_id!,
      nome: nome.trim(),
      descricao: descricao.trim() || null,
      preco_base: parseFloat(precoBase),
      tempo_medio_horas: tempoMedio ? parseFloat(tempoMedio) : null,
      etapas: etapas.length > 0 ? etapas : [],
    };

    try {
      if (editing) {
        const { error } = await supabase.from("servicos_catalogo").update(payload).eq("id", editing.id);
        if (error) throw error;
        toast.success("Serviço atualizado!");
      } else {
        const { error } = await supabase.from("servicos_catalogo").insert(payload);
        if (error) throw error;
        toast.success("Serviço cadastrado!");
      }
      queryClient.invalidateQueries({ queryKey: ["servicos_catalogo"] });
      setShowForm(false);
    } catch (err: any) {
      toast.error(err.message || "Erro ao salvar");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Remover este serviço?")) return;
    const { error } = await supabase.from("servicos_catalogo").delete().eq("id", id);
    if (error) { toast.error(error.message); return; }
    queryClient.invalidateQueries({ queryKey: ["servicos_catalogo"] });
    toast.success("Serviço removido");
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wide">Serviços ({servicos.length})</h2>
        <button onClick={openNew}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110">
          <Plus className="h-4 w-4" /> Novo serviço
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      ) : servicos.length === 0 ? (
        <div className="rounded-xl border border-border bg-card p-6 sm:p-8">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Wrench className="h-5 w-5" />
          </div>
          <h3 className="mt-4 text-base font-semibold text-foreground">Nenhum serviço cadastrado</h3>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            Cadastre os serviços reais da sua oficina para montar o fluxo de execução, o atendimento e os orçamentos.
          </p>
          <div className="mt-6">
            <button onClick={openNew}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110">
              Adicionar serviço
            </button>
          </div>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {servicos.map((srv) => {
            const etapas = Array.isArray(srv.etapas) ? (srv.etapas as string[]) : [];
            return (
              <div key={srv.id} className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-foreground">{srv.nome}</p>
                    {srv.descricao && <p className="mt-1 text-xs text-muted-foreground">{srv.descricao}</p>}
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(srv)} className="rounded p-1 text-muted-foreground hover:text-foreground">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => handleDelete(srv.id)} className="rounded p-1 text-muted-foreground hover:text-red-400">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between text-sm">
                  <span className="font-bold text-primary">R$ {Number(srv.preco_base).toFixed(2)}</span>
                  {srv.tempo_medio_horas && (
                    <span className="text-xs text-muted-foreground">~{srv.tempo_medio_horas}h</span>
                  )}
                </div>
                {etapas.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {etapas.map((e, i) => (
                      <span key={i} className="rounded bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">{e}</span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Editar serviço" : "Novo serviço"}</DialogTitle>
            <DialogDescription>Preencha os dados do serviço da oficina.</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Nome *</label>
              <Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Lanternagem" />
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Descrição</label>
              <textarea value={descricao} onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descrição opcional" rows={2}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">Preço base (R$) *</label>
                <Input type="number" value={precoBase} onChange={(e) => setPrecoBase(e.target.value)} placeholder="150.00" />
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">Tempo médio (horas)</label>
                <Input type="number" value={tempoMedio} onChange={(e) => setTempoMedio(e.target.value)} placeholder="2" />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Etapas de execução (uma por linha)</label>
              <textarea value={etapasText} onChange={(e) => setEtapasText(e.target.value)}
                placeholder={"Drenar óleo antigo\nTrocar filtro\nAdicionar óleo novo\nVerificar nível"} rows={4}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
            </div>

            <button onClick={handleSave} disabled={saving}
              className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-bold text-primary-foreground hover:brightness-110 disabled:opacity-50">
              {saving ? "Salvando..." : editing ? "Salvar alterações" : "Cadastrar serviço"}
            </button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DemoServicos;
