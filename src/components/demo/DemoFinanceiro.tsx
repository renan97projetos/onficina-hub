import { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { format, startOfMonth, endOfMonth, startOfDay, endOfDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  DollarSign, TrendingUp, Clock, CheckCircle2, Plus, Trash2,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";

const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

const DemoFinanceiro = () => {
  const { oficina_id } = useAuth();
  const queryClient = useQueryClient();
  const now = new Date();

  const [periodo, setPeriodo] = useState<"dia" | "mes">("dia");
  const [dia, setDia] = useState(format(now, "yyyy-MM-dd"));
  const [mes, setMes] = useState(now.getMonth());
  const [ano, setAno] = useState(now.getFullYear());
  const [despesaOpen, setDespesaOpen] = useState(false);
  const [despDesc, setDespDesc] = useState("");
  const [despValor, setDespValor] = useState("");
  const [despData, setDespData] = useState(format(now, "yyyy-MM-dd"));
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const { inicio, fim, inicioISO, fimISO, periodoLabel } = useMemo(() => {
    if (periodo === "dia") {
      const d = new Date(`${dia}T12:00:00`);
      const ini = startOfDay(d);
      const f = endOfDay(d);
      return {
        inicio: ini,
        fim: f,
        inicioISO: ini.toISOString(),
        fimISO: f.toISOString(),
        periodoLabel: "do dia",
      };
    }
    const ini = startOfMonth(new Date(ano, mes));
    const f = endOfMonth(new Date(ano, mes));
    return {
      inicio: ini,
      fim: f,
      inicioISO: ini.toISOString(),
      fimISO: f.toISOString(),
      periodoLabel: "do mês",
    };
  }, [periodo, dia, mes, ano]);

  // OS pagas no período
  const { data: osPagas = [] } = useQuery({
    queryKey: ["financeiro_os_pagas", oficina_id, periodo, dia, mes, ano],
    queryFn: async () => {
      const { data } = await supabase
        .from("ordens_servico")
        .select("id, valor_total, pagamento_forma, pagamento_confirmado_em, clientes(nome), veiculos(placa)")
        .eq("pagamento_confirmado", true)
        .gte("pagamento_confirmado_em", inicioISO)
        .lte("pagamento_confirmado_em", fimISO)
        .order("pagamento_confirmado_em", { ascending: false });
      return data || [];
    },
    enabled: !!oficina_id,
  });

  // OS a receber (stage = pagamento)
  const { data: osAReceber = [] } = useQuery({
    queryKey: ["financeiro_a_receber", oficina_id],
    queryFn: async () => {
      const { data } = await supabase
        .from("ordens_servico")
        .select("valor_total")
        .eq("stage", "pagamento");
      return data || [];
    },
    enabled: !!oficina_id,
  });

  // OS finalizadas no mês
  const { data: osFinalizadas = [] } = useQuery({
    queryKey: ["financeiro_finalizadas", oficina_id, periodo, dia, mes, ano],
    queryFn: async () => {
      const { data } = await supabase
        .from("ordens_servico")
        .select("id")
        .eq("stage", "finalizado")
        .gte("updated_at", inicioISO)
        .lte("updated_at", fimISO);
      return data || [];
    },
    enabled: !!oficina_id,
  });

  // Lançamentos manuais
  const { data: lancamentos = [] } = useQuery({
    queryKey: ["financeiro_lancamentos", oficina_id, periodo, dia, mes, ano],
    queryFn: async () => {
      const inicioDate = format(inicio, "yyyy-MM-dd");
      const fimDate = format(fim, "yyyy-MM-dd");
      const { data } = await supabase
        .from("financeiro_lancamentos")
        .select("*")
        .gte("data", inicioDate)
        .lte("data", fimDate)
        .order("data", { ascending: false });
      return data || [];
    },
    enabled: !!oficina_id,
  });

  // Metrics
  const faturamento = osPagas.reduce((s, o) => s + Number(o.valor_total), 0);
  const ticketMedio = osPagas.length > 0 ? faturamento / osPagas.length : 0;
  const aReceber = osAReceber.reduce((s, o) => s + Number(o.valor_total), 0);
  const totalSaidas = lancamentos.reduce((s, l) => s + Number(l.valor), 0);
  const saldo = faturamento - totalSaidas;

  // Combined list
  type Linha = {
    id: string;
    tipo: "entrada" | "saida";
    data: string;
    descricao: string;
    valor: number;
    forma?: string | null;
  };

  const linhas: Linha[] = useMemo(() => {
    const entradas: Linha[] = osPagas.map((o: any) => ({
      id: o.id,
      tipo: "entrada" as const,
      data: o.pagamento_confirmado_em || "",
      descricao: `${o.clientes?.nome || "Cliente"} — ${o.veiculos?.placa || ""}`,
      valor: Number(o.valor_total),
      forma: o.pagamento_forma,
    }));
    const saidas: Linha[] = lancamentos.map((l) => ({
      id: l.id,
      tipo: "saida" as const,
      data: l.data,
      descricao: l.descricao,
      valor: Number(l.valor),
      forma: null,
    }));
    return [...entradas, ...saidas].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());
  }, [osPagas, lancamentos]);

  function handleRequestConfirm() {
    if (!despDesc.trim()) { toast.error("Informe a descrição"); return; }
    if (!despValor || parseFloat(despValor) <= 0) { toast.error("Informe o valor"); return; }
    setConfirmOpen(true);
  }

  async function handleSaveDespesa() {
    setSaving(true);
    try {
      const { error } = await supabase.from("financeiro_lancamentos").insert({
        oficina_id: oficina_id!,
        tipo: "saida",
        descricao: despDesc.trim(),
        valor: parseFloat(despValor),
        data: despData,
      } as any);
      if (error) throw error;
      queryClient.invalidateQueries({ queryKey: ["financeiro_lancamentos"] });
      toast.success("Despesa registrada");
      setConfirmOpen(false);
      setDespesaOpen(false);
      setDespDesc("");
      setDespValor("");
      setDespData(format(now, "yyyy-MM-dd"));
    } catch (err: any) {
      toast.error(err.message || "Erro ao registrar");
    } finally {
      setSaving(false);
    }
  }

  async function deleteLancamento(id: string) {
    await supabase.from("financeiro_lancamentos").delete().eq("id", id);
    queryClient.invalidateQueries({ queryKey: ["financeiro_lancamentos"] });
    toast.success("Lançamento removido");
  }

  const anos = Array.from({ length: 5 }, (_, i) => now.getFullYear() - 2 + i);

  return (
    <div className="space-y-6">
      {/* Filter */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-foreground">Financeiro</h2>
        <div className="flex flex-wrap items-center gap-2">
          {/* Toggle Dia / Mês */}
          <div className="inline-flex h-9 items-center rounded-lg border border-border bg-background p-0.5">
            <button
              type="button"
              onClick={() => setPeriodo("dia")}
              className={`h-8 rounded-md px-3 text-xs font-semibold transition-colors ${
                periodo === "dia" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Dia
            </button>
            <button
              type="button"
              onClick={() => setPeriodo("mes")}
              className={`h-8 rounded-md px-3 text-xs font-semibold transition-colors ${
                periodo === "mes" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Mês
            </button>
          </div>

          {periodo === "dia" ? (
            <input
              type="date"
              value={dia}
              onChange={(e) => setDia(e.target.value)}
              className="h-9 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"
            />
          ) : (
            <>
              <select value={mes} onChange={(e) => setMes(Number(e.target.value))}
                className="h-9 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary">
                {MESES.map((m, i) => <option key={i} value={i}>{m}</option>)}
              </select>
              <select value={ano} onChange={(e) => setAno(Number(e.target.value))}
                className="h-9 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary">
                {anos.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </>
          )}

          <button onClick={() => setDespesaOpen(true)}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:brightness-110">
            <Plus className="h-4 w-4" /> Registrar saída
          </button>
        </div>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard icon={DollarSign} label={`Faturamento ${periodoLabel}`} value={`R$ ${faturamento.toFixed(2)}`} color="text-green-400" />
        <MetricCard icon={TrendingUp} label="Ticket médio" value={`R$ ${ticketMedio.toFixed(2)}`} color="text-blue-400" />
        <MetricCard icon={Clock} label="A receber" value={`R$ ${aReceber.toFixed(2)}`} color="text-amber-400" />
        <MetricCard icon={CheckCircle2} label={`OS finalizadas ${periodoLabel}`} value={String(osFinalizadas.length)} color="text-primary" />
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-4 py-3 text-xs font-bold uppercase text-muted-foreground">Data</th>
                <th className="px-4 py-3 text-xs font-bold uppercase text-muted-foreground">Descrição</th>
                <th className="px-4 py-3 text-xs font-bold uppercase text-muted-foreground">Forma</th>
                <th className="px-4 py-3 text-xs font-bold uppercase text-muted-foreground text-right">Valor</th>
                <th className="px-4 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {linhas.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    Nenhum lançamento no período.
                  </td>
                </tr>
              ) : (
                linhas.map((l) => (
                  <tr key={l.id} className="border-b border-border/50 hover:bg-muted/30">
                    <td className="px-4 py-3 text-foreground">
                      {l.data ? format(new Date(l.data), "dd/MM/yyyy", { locale: ptBR }) : "—"}
                    </td>
                    <td className="px-4 py-3 text-foreground">{l.descricao}</td>
                    <td className="px-4 py-3 text-muted-foreground capitalize">{l.forma || "—"}</td>
                    <td className={`px-4 py-3 text-right font-semibold ${l.tipo === "entrada" ? "text-green-400" : "text-red-400"}`}>
                      {l.tipo === "saida" ? "- " : "+ "}R$ {l.valor.toFixed(2)}
                    </td>
                    <td className="px-4 py-3">
                      {l.tipo === "saida" && (
                        <button onClick={() => deleteLancamento(l.id)} className="text-muted-foreground hover:text-red-400">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Saldo footer */}
        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <span className="text-sm font-bold text-muted-foreground">Saldo {periodoLabel}</span>
          <span className={`text-lg font-bold ${saldo >= 0 ? "text-green-400" : "text-red-400"}`}>
            R$ {saldo.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Despesa Dialog */}
      <Dialog open={despesaOpen} onOpenChange={setDespesaOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Registrar saída</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Descrição *</label>
              <Input value={despDesc} onChange={(e) => setDespDesc(e.target.value)} placeholder="Ex: Compra de tinta" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Valor (R$) *</label>
              <Input type="number" value={despValor} onChange={(e) => setDespValor(e.target.value)} placeholder="0.00" />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Data</label>
              <Input type="date" value={despData} onChange={(e) => setDespData(e.target.value)} />
            </div>
          </div>
          <DialogFooter>
            <button onClick={() => setDespesaOpen(false)} className="rounded-lg border border-border px-4 py-2 text-sm text-foreground hover:bg-muted">
              Cancelar
            </button>
            <button onClick={handleRequestConfirm} disabled={saving}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:brightness-110 disabled:opacity-50">
              Registrar
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Confirmação de saída */}
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar nova movimentação?</AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-3 pt-2">
                <p className="text-sm text-muted-foreground">
                  Revise os dados antes de confirmar. Esta saída será adicionada ao seu financeiro.
                </p>
                <div className="rounded-lg border border-border bg-muted/40 p-3 text-sm">
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">Tipo</span>
                    <span className="font-semibold text-red-400">Saída</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">Descrição</span>
                    <span className="font-medium text-foreground text-right max-w-[60%] truncate">{despDesc}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-muted-foreground">Data</span>
                    <span className="font-medium text-foreground">
                      {despData ? format(new Date(`${despData}T12:00:00`), "dd/MM/yyyy", { locale: ptBR }) : "—"}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-2 mt-1">
                    <span className="font-bold text-foreground">Valor</span>
                    <span className="text-lg font-bold text-red-400">
                      - R$ {despValor ? parseFloat(despValor).toFixed(2) : "0,00"}
                    </span>
                  </div>
                </div>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={saving}>Voltar e revisar</AlertDialogCancel>
            <AlertDialogAction
              disabled={saving}
              onClick={(e) => {
                e.preventDefault();
                handleSaveDespesa();
              }}
            >
              {saving ? "Salvando..." : "Sim, confirmar saída"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

function MetricCard({ icon: Icon, label, value, color }: { icon: any; label: string; value: string; color: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-muted ${color}`}>
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs text-muted-foreground">{label}</p>
          <p className="text-xl font-bold text-foreground">{value}</p>
        </div>
      </div>
    </div>
  );
}

export default DemoFinanceiro;
