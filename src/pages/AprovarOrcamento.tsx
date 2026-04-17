import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, CheckCircle2, XCircle, Download, FileText } from "lucide-react";
import { toast } from "sonner";
import { downloadOrcamentoPdf } from "@/lib/orcamentoPdf";

const brl = (n: number) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n || 0);

const STATUS_BADGE: Record<string, { label: string; cls: string }> = {
  rascunho: { label: "Rascunho", cls: "bg-muted text-muted-foreground" },
  enviado: { label: "Enviado", cls: "bg-blue-500/20 text-blue-300" },
  aguardando: { label: "Aguardando sua aprovação", cls: "bg-amber-500/20 text-amber-300" },
  aprovado: { label: "Aprovado", cls: "bg-emerald-500/20 text-emerald-300" },
  recusado: { label: "Recusado", cls: "bg-red-500/20 text-red-300" },
};

const AprovarOrcamento = () => {
  const { token } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(true);
  const [orc, setOrc] = useState<any>(null);
  const [oficina, setOficina] = useState<any>(null);
  const [showRecusa, setShowRecusa] = useState(false);
  const [motivo, setMotivo] = useState("");
  const [acting, setActing] = useState(false);

  useEffect(() => {
    if (!token) return;
    (async () => {
      setLoading(true);
      const { data: o } = await supabase
        .from("orcamentos")
        .select("*")
        .eq("token_publico", token)
        .maybeSingle();
      if (o) {
        const { data: of } = await supabase
          .from("oficinas")
          .select("nome, telefone, cnpj, endereco, logo_url")
          .eq("id", o.oficina_id)
          .maybeSingle();
        setOrc(o);
        setOficina(of);
      }
      setLoading(false);
    })();
  }, [token]);

  async function aprovar() {
    if (!orc) return;
    setActing(true);
    const nowIso = new Date().toISOString();

    // 1) Atualiza status
    const { error: e1 } = await supabase
      .from("orcamentos")
      .update({ status: "aprovado", aprovado_em: nowIso })
      .eq("token_publico", token!);

    if (e1) {
      setActing(false);
      toast.error("Erro ao aprovar. Tente novamente.");
      return;
    }

    // 2) Cria OS automaticamente em 'criado'
    try {
      // garantir cliente
      const { data: cli } = await supabase
        .from("clientes")
        .insert({
          oficina_id: orc.oficina_id,
          nome: orc.nome_cliente,
          telefone: orc.telefone_cliente,
        } as any)
        .select("id")
        .maybeSingle();

      const cliente_id = cli?.id;
      let veiculo_id: string | undefined;

      if (cliente_id) {
        const { data: veic } = await supabase
          .from("veiculos")
          .insert({
            oficina_id: orc.oficina_id,
            cliente_id,
            marca: orc.marca,
            modelo: orc.modelo,
            placa: orc.placa || "S/PLACA",
          } as any)
          .select("id")
          .maybeSingle();
        veiculo_id = veic?.id;
      }

      if (cliente_id && veiculo_id) {
        const { data: os } = await supabase
          .from("ordens_servico")
          .insert({
            oficina_id: orc.oficina_id,
            cliente_id,
            veiculo_id,
            stage: "criado",
            valor_total: orc.total_geral,
            observacoes: `Criada a partir do orçamento #${orc.numero}`,
          } as any)
          .select("id")
          .maybeSingle();

        if (os?.id) {
          await supabase
            .from("orcamentos")
            .update({ os_id: os.id })
            .eq("token_publico", token!);
        }
      }
    } catch (err) {
      console.error("Erro criando OS:", err);
    }

    setActing(false);
    setOrc({ ...orc, status: "aprovado", aprovado_em: nowIso });
    toast.success("Orçamento aprovado!");
  }

  async function recusar() {
    if (!motivo.trim()) {
      toast.error("Informe o motivo da recusa.");
      return;
    }
    setActing(true);
    const { error } = await supabase
      .from("orcamentos")
      .update({
        status: "recusado",
        motivo_recusa: motivo.trim().slice(0, 500),
        recusado_em: new Date().toISOString(),
      })
      .eq("token_publico", token!);
    setActing(false);
    if (error) {
      toast.error("Erro ao recusar.");
      return;
    }
    setOrc({ ...orc, status: "recusado", motivo_recusa: motivo.trim() });
    setShowRecusa(false);
    toast.success("Orçamento recusado. A oficina foi notificada.");
  }

  async function baixarPdf() {
    if (!orc || !oficina) return;
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
        `orcamento-${orc.numero}.pdf`,
      );
    } catch (err) {
      toast.error("Erro ao gerar PDF.");
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!orc) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background p-6">
        <FileText className="mb-3 h-10 w-10 text-muted-foreground" />
        <p className="text-muted-foreground">Orçamento não encontrado.</p>
      </div>
    );
  }

  const st = STATUS_BADGE[orc.status] || STATUS_BADGE.enviado;
  const finalizado = orc.status === "aprovado" || orc.status === "recusado";

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header escuro */}
      <header className="bg-slate-900 px-6 py-6 text-white">
        <div className="mx-auto flex max-w-3xl items-center gap-4">
          {oficina?.logo_url ? (
            <img
              src={oficina.logo_url}
              alt={oficina.nome}
              className="h-20 w-20 rounded-full border-2 border-white/20 object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-white/20 bg-white/10 text-2xl font-bold">
              {(oficina?.nome || "O").charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold uppercase">{oficina?.nome}</h1>
            {oficina?.cnpj && <p className="text-xs opacity-80">CNPJ: {oficina.cnpj}</p>}
            {oficina?.telefone && <p className="text-xs opacity-80">{oficina.telefone}</p>}
            {oficina?.endereco && <p className="text-xs opacity-80">{oficina.endereco}</p>}
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-4 py-6">
        {/* Card principal */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold">Orçamento Nº {orc.numero}</h2>
              <p className="text-xs text-muted-foreground">
                Data: {new Date(orc.data_orcamento).toLocaleDateString("pt-BR")}
              </p>
            </div>
            <span className={`rounded-full px-3 py-1 text-xs font-semibold ${st.cls}`}>
              {st.label}
            </span>
          </div>

          <div className="mb-4 grid gap-2 text-sm sm:grid-cols-2">
            <div>
              <span className="text-xs text-muted-foreground">Cliente</span>
              <p className="font-medium">{orc.nome_cliente}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Veículo</span>
              <p className="font-medium">
                {[orc.marca, orc.modelo].filter(Boolean).join(" ") || "—"}
                {orc.placa ? ` · ${orc.placa}` : ""}
              </p>
            </div>
          </div>

          {/* Peças */}
          <div className="overflow-hidden rounded-lg border border-border">
            <div className="grid grid-cols-[60px_1fr_120px] gap-2 bg-slate-900 px-3 py-2 text-xs font-bold text-white">
              <span>QTD</span>
              <span>Descrição</span>
              <span className="text-right">Valor (R$)</span>
            </div>
            {(Array.isArray(orc.pecas) ? orc.pecas : []).length === 0 ? (
              <div className="px-3 py-4 text-center text-xs text-muted-foreground">
                Sem peças
              </div>
            ) : (
              (orc.pecas as any[]).map((p, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[60px_1fr_120px] gap-2 border-t border-border px-3 py-2 text-sm"
                >
                  <span className="text-center">{p.qtd}</span>
                  <span>{p.descricao}</span>
                  <span className="text-right">{brl(Number(p.valor) * Number(p.qtd))}</span>
                </div>
              ))
            )}
            <div className="flex items-center justify-between bg-muted/40 px-3 py-2 text-sm font-bold">
              <span>Total Peças:</span>
              <span>{brl(Number(orc.total_pecas))}</span>
            </div>
          </div>

          {/* Mão de obra */}
          {(orc.mao_obra_descricao || Number(orc.mao_obra_valor) > 0) && (
            <div className="mt-4">
              <h4 className="mb-1 text-sm font-bold">Mão de Obra</h4>
              <p className="mb-2 text-sm text-muted-foreground whitespace-pre-wrap">
                {orc.mao_obra_descricao || "—"}
              </p>
              <div className="flex justify-end gap-2 text-sm font-semibold">
                <span>Total Mão de Obra:</span>
                <span>{brl(Number(orc.mao_obra_valor))}</span>
              </div>
            </div>
          )}

          {/* Total geral */}
          <div className="mt-4 flex items-center justify-between rounded-lg bg-slate-900 px-4 py-3 text-white">
            <span className="text-sm font-bold">TOTAL GERAL:</span>
            <span className="text-lg font-bold">{brl(Number(orc.total_geral))}</span>
          </div>

          {orc.status === "recusado" && orc.motivo_recusa && (
            <div className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-300">
              <strong>Motivo da recusa:</strong> {orc.motivo_recusa}
            </div>
          )}

          {/* Ações */}
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <button
              onClick={baixarPdf}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-semibold hover:bg-muted"
            >
              <Download className="h-4 w-4" /> Baixar PDF
            </button>

            {!finalizado && (
              <>
                <button
                  onClick={aprovar}
                  disabled={acting}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-emerald-600 disabled:opacity-50"
                >
                  <CheckCircle2 className="h-4 w-4" /> Aprovar Orçamento
                </button>
                <button
                  onClick={() => setShowRecusa(true)}
                  disabled={acting}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-red-500/40 bg-red-500/10 px-4 py-2.5 text-sm font-bold text-red-400 hover:bg-red-500/20 disabled:opacity-50"
                >
                  <XCircle className="h-4 w-4" /> Recusar
                </button>
              </>
            )}
          </div>

          {showRecusa && !finalizado && (
            <div className="mt-3 rounded-lg border border-border bg-muted/30 p-3">
              <label className="mb-1 block text-xs font-semibold">Motivo da recusa</label>
              <textarea
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                rows={3}
                maxLength={500}
                placeholder="Ex: Valor acima do esperado, prefiro outro orçamento..."
                className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
              <div className="mt-2 flex justify-end gap-2">
                <button
                  onClick={() => setShowRecusa(false)}
                  className="rounded-md border border-border bg-background px-3 py-1.5 text-xs hover:bg-muted"
                >
                  Cancelar
                </button>
                <button
                  onClick={recusar}
                  disabled={acting}
                  className="rounded-md bg-red-500 px-3 py-1.5 text-xs font-semibold text-white hover:bg-red-600 disabled:opacity-50"
                >
                  Confirmar recusa
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="mt-4 text-center text-xs text-muted-foreground">Powered by ONficina</p>
      </main>
    </div>
  );
};

export default AprovarOrcamento;
