import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowDown, ArrowUp, ArrowUpDown, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const STALE_5MIN = 1000 * 60 * 5;

const formatBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 });

const formatHoras = (h: number) => {
  if (!h || !isFinite(h)) return "—";
  if (h < 1) return `${Math.round(h * 60)} min`;
  return `${h.toFixed(1)}h`;
};

const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

type Row = {
  colaborador_id: string;
  nome: string;
  funcao: string | null;
  os_atendidas: number;
  tempo_medio_horas: number;
  valor_total: number;
};

type SortKey = "nome" | "os_atendidas" | "tempo_medio_horas" | "valor_total";
type SortDir = "asc" | "desc";

function useRelatorio(mes: number, ano: number) {
  return useQuery({
    queryKey: ["relatorio-colaboradores", mes, ano],
    staleTime: STALE_5MIN,
    queryFn: async () => {
      const inicio = new Date(ano, mes, 1).toISOString();
      const fim = new Date(ano, mes + 1, 1).toISOString();

      const [colabs, ordens, servicos] = await Promise.all([
        supabase.from("colaboradores").select("id, nome, funcao").eq("ativo", true),
        supabase
          .from("ordens_servico")
          .select("id, colaborador_id, valor_total, created_at")
          .gte("created_at", inicio)
          .lt("created_at", fim)
          .not("colaborador_id", "is", null),
        supabase
          .from("os_servicos")
          .select("os_id, iniciado_em, concluido_em")
          .not("iniciado_em", "is", null)
          .not("concluido_em", "is", null)
          .gte("concluido_em", inicio)
          .lt("concluido_em", fim),
      ]);

      const osPorColab = new Map<string, { count: number; valor: number; osIds: Set<string> }>();
      (ordens.data ?? []).forEach((o) => {
        if (!o.colaborador_id) return;
        const cur = osPorColab.get(o.colaborador_id) ?? {
          count: 0, valor: 0, osIds: new Set<string>(),
        };
        cur.count += 1;
        cur.valor += Number(o.valor_total) || 0;
        cur.osIds.add(o.id);
        osPorColab.set(o.colaborador_id, cur);
      });

      // Map os_id -> colaborador para calcular tempo médio
      const osColabMap = new Map<string, string>();
      (ordens.data ?? []).forEach((o) => {
        if (o.colaborador_id) osColabMap.set(o.id, o.colaborador_id);
      });

      const tempos = new Map<string, { soma: number; n: number }>();
      (servicos.data ?? []).forEach((s) => {
        const colabId = osColabMap.get(s.os_id);
        if (!colabId || !s.iniciado_em || !s.concluido_em) return;
        const horas =
          (new Date(s.concluido_em).getTime() - new Date(s.iniciado_em).getTime()) /
          (1000 * 60 * 60);
        if (horas < 0) return;
        const cur = tempos.get(colabId) ?? { soma: 0, n: 0 };
        cur.soma += horas;
        cur.n += 1;
        tempos.set(colabId, cur);
      });

      const rows: Row[] = (colabs.data ?? []).map((c) => {
        const stats = osPorColab.get(c.id);
        const t = tempos.get(c.id);
        return {
          colaborador_id: c.id,
          nome: c.nome,
          funcao: c.funcao,
          os_atendidas: stats?.count ?? 0,
          tempo_medio_horas: t && t.n > 0 ? t.soma / t.n : 0,
          valor_total: stats?.valor ?? 0,
        };
      });

      return rows;
    },
  });
}

const DemoRelatorios = () => {
  const now = new Date();
  const [mes, setMes] = useState<number>(now.getMonth());
  const [ano, setAno] = useState<number>(now.getFullYear());
  const [sortKey, setSortKey] = useState<SortKey>("valor_total");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const { data: rows = [], isLoading } = useRelatorio(mes, ano);

  const sorted = useMemo(() => {
    const copy = [...rows];
    copy.sort((a, b) => {
      const av = a[sortKey];
      const bv = b[sortKey];
      if (typeof av === "string" && typeof bv === "string") {
        return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      return sortDir === "asc" ? Number(av) - Number(bv) : Number(bv) - Number(av);
    });
    return copy;
  }, [rows, sortKey, sortDir]);

  const totais = useMemo(
    () => ({
      os: sorted.reduce((acc, r) => acc + r.os_atendidas, 0),
      valor: sorted.reduce((acc, r) => acc + r.valor_total, 0),
      tempoMedio:
        sorted.length > 0
          ? sorted.reduce((acc, r) => acc + r.tempo_medio_horas, 0) /
            sorted.filter((r) => r.tempo_medio_horas > 0).length || 0
          : 0,
    }),
    [sorted],
  );

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir(sortDir === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortDir(key === "nome" ? "asc" : "desc");
    }
  };

  const exportCSV = () => {
    const header = ["Colaborador", "Função", "OS Atendidas", "Tempo Médio (h)", "Valor Total (R$)"];
    const lines = sorted.map((r) => [
      `"${r.nome.replace(/"/g, '""')}"`,
      `"${(r.funcao ?? "").replace(/"/g, '""')}"`,
      r.os_atendidas,
      r.tempo_medio_horas.toFixed(2),
      r.valor_total.toFixed(2),
    ]);
    const csv = [header.join(";"), ...lines.map((l) => l.join(";"))].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `relatorio-colaboradores-${ano}-${String(mes + 1).padStart(2, "0")}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const anos = useMemo(() => {
    const atual = now.getFullYear();
    return [atual - 2, atual - 1, atual, atual + 1];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const SortIcon = ({ k }: { k: SortKey }) => {
    if (sortKey !== k) return <ArrowUpDown className="h-3 w-3 opacity-40" />;
    return sortDir === "asc" ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />;
  };

  return (
    <>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-bold uppercase tracking-wide">Relatórios — Por Colaborador</h2>
        <div className="flex flex-wrap items-center gap-2">
          <Select value={String(mes)} onValueChange={(v) => setMes(Number(v))}>
            <SelectTrigger className="w-[160px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {MESES.map((m, i) => (
                <SelectItem key={m} value={String(i)}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={String(ano)} onValueChange={(v) => setAno(Number(v))}>
            <SelectTrigger className="w-[110px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              {anos.map((a) => (
                <SelectItem key={a} value={String(a)}>{a}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={exportCSV} disabled={!sorted.length} size="sm" variant="outline">
            <Download className="mr-2 h-4 w-4" /> Exportar CSV
          </Button>
        </div>
      </div>

      {/* Totais */}
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">OS atendidas no período</p>
          <p className="mt-1 text-lg font-bold text-foreground">{totais.os}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Tempo médio geral</p>
          <p className="mt-1 text-lg font-bold text-foreground">{formatHoras(totais.tempoMedio)}</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Valor total no período</p>
          <p className="mt-1 text-lg font-bold text-foreground">{formatBRL(totais.valor)}</p>
        </div>
      </div>

      {/* Tabela */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/30 text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left">
                  <button onClick={() => toggleSort("nome")} className="inline-flex items-center gap-1 hover:text-foreground">
                    Colaborador <SortIcon k="nome" />
                  </button>
                </th>
                <th className="px-4 py-3 text-left">Função</th>
                <th className="px-4 py-3 text-right">
                  <button onClick={() => toggleSort("os_atendidas")} className="inline-flex items-center gap-1 hover:text-foreground">
                    OS atendidas <SortIcon k="os_atendidas" />
                  </button>
                </th>
                <th className="px-4 py-3 text-right">
                  <button onClick={() => toggleSort("tempo_medio_horas")} className="inline-flex items-center gap-1 hover:text-foreground">
                    Tempo médio <SortIcon k="tempo_medio_horas" />
                  </button>
                </th>
                <th className="px-4 py-3 text-right">
                  <button onClick={() => toggleSort("valor_total")} className="inline-flex items-center gap-1 hover:text-foreground">
                    Valor total <SortIcon k="valor_total" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">Carregando…</td></tr>
              ) : sorted.length === 0 ? (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-muted-foreground">Nenhum colaborador ativo encontrado.</td></tr>
              ) : (
                sorted.map((r) => (
                  <tr key={r.colaborador_id} className="border-b border-border last:border-0 hover:bg-muted/20">
                    <td className="px-4 py-3 font-medium text-foreground">{r.nome}</td>
                    <td className="px-4 py-3 text-muted-foreground">{r.funcao ?? "—"}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{r.os_atendidas}</td>
                    <td className="px-4 py-3 text-right tabular-nums">{formatHoras(r.tempo_medio_horas)}</td>
                    <td className="px-4 py-3 text-right tabular-nums font-semibold">{formatBRL(r.valor_total)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};

export default DemoRelatorios;
