import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Camera, X } from "lucide-react";
import type { Tables } from "@/integrations/supabase/types";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const OSFormModal = ({ open, onOpenChange }: Props) => {
  const { oficina_id } = useAuth();
  const queryClient = useQueryClient();

  // Client
  const [clienteId, setClienteId] = useState("");
  const [novoCliente, setNovoCliente] = useState(false);
  const [nomeCliente, setNomeCliente] = useState("");
  const [telefoneCliente, setTelefoneCliente] = useState("");
  const [emailCliente, setEmailCliente] = useState("");

  // Vehicle
  const [veiculoId, setVeiculoId] = useState("");
  const [novoVeiculo, setNovoVeiculo] = useState(false);
  const [placa, setPlaca] = useState("");
  const [marca, setMarca] = useState("");
  const [modelo, setModelo] = useState("");
  const [cor, setCor] = useState("");
  const [ano, setAno] = useState("");

  // Services
  const [selectedServicos, setSelectedServicos] = useState<Record<string, number>>({});

  // Assignment
  const [colaboradorId, setColaboradorId] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [prazoManual, setPrazoManual] = useState("");

  // Photos
  const [fotosEntrada, setFotosEntrada] = useState<File[]>([]);
  const [fotoPreviews, setFotoPreviews] = useState<string[]>([]);

  const [saving, setSaving] = useState(false);

  const { data: clientes = [] } = useQuery({
    queryKey: ["clientes", oficina_id],
    queryFn: async () => {
      const { data } = await supabase.from("clientes").select("*").order("nome");
      return data || [];
    },
    enabled: open && !!oficina_id,
  });

  const { data: veiculos = [] } = useQuery({
    queryKey: ["veiculos", oficina_id, clienteId],
    queryFn: async () => {
      if (!clienteId) return [];
      const { data } = await supabase.from("veiculos").select("*").eq("cliente_id", clienteId);
      return data || [];
    },
    enabled: open && !!clienteId,
  });

  const { data: servicos = [] } = useQuery({
    queryKey: ["servicos_catalogo", oficina_id],
    queryFn: async () => {
      const { data } = await supabase.from("servicos_catalogo").select("*").order("nome");
      return data || [];
    },
    enabled: open && !!oficina_id,
  });

  const { data: colaboradores = [] } = useQuery({
    queryKey: ["colaboradores", oficina_id],
    queryFn: async () => {
      const { data } = await supabase.from("colaboradores").select("*").eq("ativo", true).order("nome");
      return data || [];
    },
    enabled: open && !!oficina_id,
  });

  const valorTotal = Object.values(selectedServicos).reduce((sum, v) => sum + v, 0);
  const tempoTotal = Object.keys(selectedServicos).reduce((sum, id) => {
    const srv = servicos.find((s) => s.id === id);
    return sum + (srv?.tempo_medio_horas || 0);
  }, 0);

  // Compute default prazo when services change
  const defaultPrazo = tempoTotal > 0
    ? new Date(Date.now() + tempoTotal * 3600000).toISOString().slice(0, 16)
    : "";

  function toggleServico(id: string, precoBase: number) {
    setSelectedServicos((prev) => {
      const next = { ...prev };
      if (next[id] !== undefined) { delete next[id]; } else { next[id] = precoBase; }
      return next;
    });
  }

  function handleFotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || []);
    setFotosEntrada((prev) => [...prev, ...files]);
    files.forEach((f) => {
      const reader = new FileReader();
      reader.onload = () => setFotoPreviews((prev) => [...prev, reader.result as string]);
      reader.readAsDataURL(f);
    });
    e.target.value = "";
  }

  function removeFoto(index: number) {
    setFotosEntrada((prev) => prev.filter((_, i) => i !== index));
    setFotoPreviews((prev) => prev.filter((_, i) => i !== index));
  }

  async function uploadFotos(osId: string): Promise<string[]> {
    const urls: string[] = [];
    for (const file of fotosEntrada) {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${osId}/entrada/${Date.now()}_${Math.random().toString(36).slice(2)}.${ext}`;
      const { error } = await supabase.storage.from("os-fotos").upload(path, file);
      if (error) { console.error("Upload error:", error); continue; }
      const { data: urlData } = supabase.storage.from("os-fotos").getPublicUrl(path);
      urls.push(urlData.publicUrl);
    }
    return urls;
  }

  async function handleSave() {
    if (!oficina_id) return;
    setSaving(true);
    try {
      // 1. Client
      let cid = clienteId;
      if (novoCliente) {
        if (!nomeCliente.trim() || !telefoneCliente.trim()) { toast.error("Preencha nome e telefone do cliente"); setSaving(false); return; }
        const { data, error } = await supabase.from("clientes").insert({
          oficina_id, nome: nomeCliente.trim(), telefone: telefoneCliente.trim(), email: emailCliente.trim() || null,
        }).select("id").single();
        if (error) throw error;
        cid = data.id;
      }
      if (!cid) { toast.error("Selecione ou cadastre um cliente"); setSaving(false); return; }

      // 2. Vehicle
      let vid = veiculoId;
      if (novoVeiculo) {
        if (!placa.trim()) { toast.error("Preencha a placa do veículo"); setSaving(false); return; }
        const { data, error } = await supabase.from("veiculos").insert({
          oficina_id, cliente_id: cid, placa: placa.trim().toUpperCase(), marca: marca.trim() || null,
          modelo: modelo.trim() || null, cor: cor.trim() || null, ano: ano ? parseInt(ano) : null,
        }).select("id").single();
        if (error) throw error;
        vid = data.id;
      }
      if (!vid) { toast.error("Selecione ou cadastre um veículo"); setSaving(false); return; }

      // 3. Services check
      const servicoIds = Object.keys(selectedServicos);
      if (servicoIds.length === 0) { toast.error("Selecione pelo menos um serviço"); setSaving(false); return; }

      // 4. Create OS
      const prazoFinal = prazoManual || defaultPrazo || null;
      const prazoEstimado = prazoFinal ? new Date(prazoFinal).toISOString() : null;
      const { data: osData, error: osError } = await supabase.from("ordens_servico").insert({
        oficina_id, cliente_id: cid, veiculo_id: vid, colaborador_id: colaboradorId || null,
        valor_total: valorTotal, observacoes: observacoes.trim() || null,
        prazo_estimado: prazoEstimado, prazo_horas_calculado: tempoTotal || null,
      }).select("id").single();
      if (osError) throw osError;

      // 5. Upload entry photos
      if (fotosEntrada.length > 0) {
        const urls = await uploadFotos(osData.id);
        if (urls.length > 0) {
          await supabase.from("ordens_servico").update({ fotos_entrada: urls }).eq("id", osData.id);
        }
      }

      // 6. Insert os_servicos
      const osServicos = servicoIds.map((sid) => {
        const srv = servicos.find((s) => s.id === sid)!;
        return {
          os_id: osData.id, servico_id: sid, nome_servico: srv.nome,
          valor: selectedServicos[sid], etapas_snapshot: srv.etapas || [],
        };
      });
      await supabase.from("os_servicos").insert(osServicos);

      // 7. Movimentação
      await supabase.from("os_movimentacoes").insert({ os_id: osData.id, stage_novo: "criado", descricao: "OS criada" });

      queryClient.invalidateQueries({ queryKey: ["ordens_servico"] });
      toast.success("OS criada com sucesso!");
      onOpenChange(false);
      resetForm();
    } catch (err: any) {
      toast.error(err.message || "Erro ao criar OS");
    } finally {
      setSaving(false);
    }
  }

  function resetForm() {
    setClienteId(""); setNovoCliente(false); setNomeCliente(""); setTelefoneCliente("");
    setEmailCliente(""); setVeiculoId(""); setNovoVeiculo(false); setPlaca(""); setMarca("");
    setModelo(""); setCor(""); setAno(""); setSelectedServicos({}); setColaboradorId(""); setObservacoes("");
    setPrazoManual(""); setFotosEntrada([]); setFotoPreviews([]);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nova Ordem de Serviço</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* CLIENT */}
          <section>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">Dados do cliente</h3>
            <div className="flex items-center gap-3 mb-3">
              <Checkbox id="novo-cli" checked={novoCliente} onCheckedChange={(v) => { setNovoCliente(!!v); setClienteId(""); }} />
              <label htmlFor="novo-cli" className="text-sm text-foreground">Novo cliente</label>
            </div>
            {novoCliente ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <Input placeholder="Nome *" value={nomeCliente} onChange={(e) => setNomeCliente(e.target.value)} />
                <Input placeholder="WhatsApp *" value={telefoneCliente} onChange={(e) => setTelefoneCliente(e.target.value)} />
                <Input placeholder="Email" value={emailCliente} onChange={(e) => setEmailCliente(e.target.value)} className="sm:col-span-2" />
              </div>
            ) : (
              <select value={clienteId} onChange={(e) => { setClienteId(e.target.value); setVeiculoId(""); }}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary">
                <option value="">Selecione um cliente...</option>
                {clientes.map((c) => <option key={c.id} value={c.id}>{c.nome} — {c.telefone}</option>)}
              </select>
            )}
          </section>

          {/* VEHICLE */}
          <section>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">Dados do veículo</h3>
            <div className="flex items-center gap-3 mb-3">
              <Checkbox id="novo-veic" checked={novoVeiculo} onCheckedChange={(v) => { setNovoVeiculo(!!v); setVeiculoId(""); }} />
              <label htmlFor="novo-veic" className="text-sm text-foreground">Novo veículo</label>
            </div>
            {novoVeiculo ? (
              <div className="grid gap-3 sm:grid-cols-3">
                <Input placeholder="Placa *" value={placa} onChange={(e) => setPlaca(e.target.value)} />
                <Input placeholder="Marca" value={marca} onChange={(e) => setMarca(e.target.value)} />
                <Input placeholder="Modelo" value={modelo} onChange={(e) => setModelo(e.target.value)} />
                <Input placeholder="Cor" value={cor} onChange={(e) => setCor(e.target.value)} />
                <Input placeholder="Ano" value={ano} onChange={(e) => setAno(e.target.value)} />
              </div>
            ) : (
              <select value={veiculoId} onChange={(e) => setVeiculoId(e.target.value)}
                className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary">
                <option value="">{clienteId ? "Selecione um veículo..." : "Selecione um cliente primeiro"}</option>
                {veiculos.map((v) => <option key={v.id} value={v.id}>{v.placa} — {v.marca} {v.modelo}</option>)}
              </select>
            )}
          </section>

          {/* SERVICES */}
          <section>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">Serviços</h3>
            {servicos.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum serviço cadastrado. Cadastre no módulo Serviços primeiro.</p>
            ) : (
              <div className="space-y-2">
                {servicos.map((srv) => {
                  const selected = selectedServicos[srv.id] !== undefined;
                  return (
                    <div key={srv.id} className={`flex items-center gap-3 rounded-lg border p-3 transition-colors ${
                      selected ? "border-primary bg-primary/5" : "border-border"
                    }`}>
                      <Checkbox checked={selected} onCheckedChange={() => toggleServico(srv.id, srv.preco_base)} />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-foreground">{srv.nome}</p>
                        {srv.tempo_medio_horas && (
                          <p className="text-xs text-muted-foreground">~{srv.tempo_medio_horas}h estimadas</p>
                        )}
                      </div>
                      {selected ? (
                        <Input type="number" value={selectedServicos[srv.id]} className="w-28"
                          onChange={(e) => setSelectedServicos((p) => ({ ...p, [srv.id]: parseFloat(e.target.value) || 0 }))} />
                      ) : (
                        <span className="text-sm text-muted-foreground">R$ {srv.preco_base.toFixed(2)}</span>
                      )}
                    </div>
                  );
                })}
                <div className="flex items-center justify-between rounded-lg bg-primary/10 px-4 py-2">
                  <span className="text-sm font-semibold text-foreground">Total</span>
                  <span className="text-lg font-bold text-primary">R$ {valorTotal.toFixed(2)}</span>
                </div>
              </div>
            )}
          </section>

          {/* ASSIGNMENT */}
          <section>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">Atendimento</h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <select value={colaboradorId} onChange={(e) => setColaboradorId(e.target.value)}
                className="h-10 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary">
                <option value="">Responsável (opcional)</option>
                {colaboradores.map((c) => <option key={c.id} value={c.id}>{c.nome}</option>)}
              </select>
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">Prazo estimado</label>
                <Input
                  type="datetime-local"
                  value={prazoManual || defaultPrazo}
                  onChange={(e) => setPrazoManual(e.target.value)}
                />
              </div>
            </div>
            <textarea value={observacoes} onChange={(e) => setObservacoes(e.target.value)}
              placeholder="Observações (opcional)" rows={3}
              className="mt-3 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary" />
          </section>

          {/* ENTRY PHOTOS */}
          <section>
            <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-muted-foreground">
              <Camera className="inline h-4 w-4 mr-1" /> Fotos de entrada
            </h3>
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border bg-background px-4 py-6 text-sm text-muted-foreground hover:border-primary hover:text-foreground transition-colors">
              <Camera className="h-5 w-5" />
              Clique para selecionar fotos do veículo
              <input type="file" accept="image/*" multiple onChange={handleFotoChange} className="hidden" />
            </label>
            {fotoPreviews.length > 0 && (
              <div className="mt-3 grid grid-cols-4 gap-2">
                {fotoPreviews.map((src, i) => (
                  <div key={i} className="group relative aspect-square overflow-hidden rounded-lg border border-border">
                    <img src={src} alt={`Foto ${i + 1}`} className="h-full w-full object-cover" />
                    <button onClick={() => removeFoto(i)}
                      className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <X className="h-3.5 w-3.5 text-white" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* SUBMIT */}
          <button onClick={handleSave} disabled={saving}
            className="w-full rounded-lg bg-primary px-4 py-3 text-sm font-bold text-primary-foreground hover:brightness-110 disabled:opacity-50">
            {saving ? "Salvando..." : "Criar Ordem de Serviço"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OSFormModal;
