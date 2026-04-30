import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Percent,
  Search,
  FileBarChart2,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const MESES = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
];

type Filtro = "todos" | "aprovado" | "recusado";

const fmtBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

interface Props {
  onNavigate?: (key: string, refId?: string) => void;
}

const DemoDadosOrcamento = ({ onNavigate }: Props) => {
  const { oficina_id } = useAuth();
  const now = new Date();

  const [mes, setMes] = useState(now.getMonth());
  const [ano, setAno] = useState(now.getFullYear());
  const [filtro, setFiltro] = useState<Filtro>("todos");
  const [busca, setBusca] = useState("");
  const [selecionado, setSelecionado] = useState<any | null>(null);

  const { inicioISO, fimISO } = useMemo(() => {
    const ini = startOfMonth(new Date(ano, mes));
    const f = endOfMonth(new Date(ano, mes));
    return { inicioISO: ini.toISOString(), fimISO: f.toISOString() };
  }, [mes, ano]);

  const { data: orcamentos = [] } = useQuery({
    queryKey: ["dados_orcamento", oficina_id, mes, ano],
    queryFn: async () => {
      const { data } = await supabase
        .from("orcamentos")
        .select("*")
        .in("status", ["aprovado", "recusado"])
        .gte("created_at", inicioISO)
        .lte("created_at", fimISO)
        .order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!oficina_id,
  });

  const filtrados = useMemo(() => {
    const q = busca.trim().toLowerCase();
    return orcamentos.filter((o: any) => {
      if (filtro !== "todos" && o.status !== filtro) return false;
      if (!q) return true;
      return (
        (o.nome_cliente || "").toLowerCase().includes(q) ||
        (o.placa || "").toLowerCase().includes(q)
      );
    });
  }, [orcamentos, filtro, busca]);

  const kpis = useMemo(() => {
    const total = orcamentos.reduce((s: number, o: any) => s + Number(o.total_geral || 0), 0);
    const realizado = orcamentos
      .filter((o: any) => o.status === "aprovado")
      .reduce((s: number, o: any) => s + Number(o.total_geral || 0), 0);
    const perdido = orcamentos
      .filter((o: any) => o.status === "recusado")
      .reduce((s: number, o: any) => s + Number(o.total_geral || 0), 0);
    const aprovados = orcamentos.filter((o: any) => o.status === "aprovado").length;
    const taxa = orcamentos.length > 0 ? (aprovados / orcamentos.length) * 100 : 0;
    return { total, realizado, perdido, taxa };
  }, [orcamentos]);

  const anos = Array.from({ length: 5 }, (_, i) => now.getFullYear() - 2 + i);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FileBarChart2 className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-bold text-foreground">Dados de Orçamento</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={mes}
            onChange={(e) => setMes(Number(e.target.value))}
            className="h-9 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"
          >
            {MESES.map((m, i) => (
              <option key={i} value={i}>{m}</option>
            ))}
          </select>
          <select
            value={ano}
            onChange={(e) => setAno(Number(e.target.value))}
            className="h-9 rounded-lg border border-border bg-background px-3 text-sm outline-none focus:border-primary"
          >
            {anos.map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard icon={DollarSign} label="Total orçado" value={fmtBRL(kpis.total)} color="text-blue-400" />
        <KpiCard icon={TrendingUp} label="Total realizado" value={fmtBRL(kpis.realizado)} color="text-green-400" />
        <KpiCard icon={TrendingDown} label="Total perdido" value={fmtBRL(kpis.perdido)} color="text-red-400" />
        <KpiCard icon={Percent} label="Taxa de conversão" value={`${kpis.taxa.toFixed(1)}%`} color="text-primary" />
      </div>

      {/* Filtros e busca */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex h-9 items-center rounded-lg border border-border bg-background p-0.5">
          {([
            { k: "todos", label: "Todos" },
            { k: "aprovado", label: "Realizados" },
            { k: "recusado", label: "Recusados" },
          ] as { k: Filtro; label: string }[]).map((f) => (
            <button
              key={f.k}
              type="button"
              onClick={() => setFiltro(f.k)}
              className={`h-8 rounded-md px-3 text-xs font-semibold transition-colors ${
                filtro === f.k
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            placeholder="Buscar por cliente ou placa..."
            className="h-9 w-64 rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-primary"
          />
        </div>
      </div>

      {/* Tabela */}
      <div className="rounded-xl border border-border bg-card">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-4 py-3 text-xs font-bold uppercase text-muted-foreground">#ID</th>
                <th className="px-4 py-3 text-xs font-bold uppercase text-muted-foreground">Data</th>
                <th className="px-4 py-3 text-xs font-bold uppercase text-muted-foreground">Cliente</th>
                <th className="px-4 py-3 text-xs font-bold uppercase text-muted-foreground">Veículo</th>
                <th className="px-4 py-3 text-xs font-bold uppercase text-muted-foreground text-right">Valor</th>
                <th className="px-4 py-3 text-xs font-bold uppercase text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-xs font-bold uppercase text-muted-foreground">OS</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-muted-foreground">
                    Nenhum orçamento finalizado ainda.
                  </td>
                </tr>
              ) : (
                filtrados.map((o: any) => {
                  const veic = [o.marca, o.modelo].filter(Boolean).join(" ") || "—";
                  return (
                    <tr
                      key={o.id}
                      onClick={() => setSelecionado(o)}
                      className="cursor-pointer border-b border-border last:border-0 transition-colors hover:bg-muted/50"
                    >
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                        #{String(o.numero).padStart(4, "0")}
                      </td>
                      <td className="px-4 py-3 text-foreground">
                        {format(new Date(o.created_at), "dd/MM/yyyy", { locale: ptBR })}
                      </td>
                      <td className="px-4 py-3 text-foreground">{o.nome_cliente}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {veic}
                        {o.placa && <span className="ml-1 font-mono text-xs">({o.placa})</span>}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-foreground">
                        {fmtBRL(Number(o.total_geral || 0))}
                      </td>
                      <td className="px-4 py-3">
                        {o.status === "aprovado" ? (
                          <span className="inline-flex items-center rounded-full bg-green-500/15 px-2 py-0.5 text-xs font-semibold text-green-400">
                            Realizado
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-red-500/15 px-2 py-0.5 text-xs font-semibold text-red-400">
                            Recusado
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {o.os_id ? (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onNavigate?.("os", o.os_id);
                            }}
                            className="font-mono text-xs text-primary hover:underline"
                          >
                            #{o.os_id.slice(0, 8).toUpperCase()}
                          </button>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detalhes */}
      <Sheet open={!!selecionado} onOpenChange={(o) => !o && setSelecionado(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          {selecionado && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <span className="font-mono text-sm text-muted-foreground">
                    #{String(selecionado.numero).padStart(4, "0")}
                  </span>
                  <span>Orçamento</span>
                </SheetTitle>
              </SheetHeader>

              <div className="mt-6 space-y-6">
                <div className="flex items-center gap-2">
                  {selecionado.status === "aprovado" ? (
                    <span className="inline-flex items-center rounded-full bg-green-500/15 px-2 py-0.5 text-xs font-semibold text-green-400">
                      Realizado
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-red-500/15 px-2 py-0.5 text-xs font-semibold text-red-400">
                      Recusado
                    </span>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(selecionado.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <Info label="Cliente" value={selecionado.nome_cliente} />
                  <Info label="Telefone" value={selecionado.telefone_cliente || "—"} />
                  <Info label="Veículo" value={[selecionado.marca, selecionado.modelo].filter(Boolean).join(" ") || "—"} />
                  <Info label="Placa" value={selecionado.placa || "—"} />
                </div>

                {/* Peças */}
                <div>
                  <h3 className="mb-2 text-xs font-bold uppercase text-muted-foreground">Peças</h3>
                  {Array.isArray(selecionado.pecas) && selecionado.pecas.length > 0 ? (
                    <ul className="divide-y divide-border rounded-lg border border-border">
                      {selecionado.pecas.map((p: any, i: number) => (
                        <li key={i} className="flex items-center justify-between px-3 py-2 text-sm">
                          <div>
                            <div className="text-foreground">{p.nome || p.descricao || "—"}</div>
                            {p.quantidade && (
                              <div className="text-xs text-muted-foreground">
                                Qtd: {p.quantidade}
                              </div>
                            )}
                          </div>
                          <div className="font-semibold text-foreground">
                            {fmtBRL(Number(p.valor || p.preco || 0))}
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">Sem peças.</p>
                  )}
                </div>

                {/* Mão de obra */}
                <div>
                  <h3 className="mb-2 text-xs font-bold uppercase text-muted-foreground">Mão de obra</h3>
                  <div className="rounded-lg border border-border px-3 py-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-foreground">
                        {selecionado.mao_obra_descricao || "Serviço"}
                      </span>
                      <span className="font-semibold text-foreground">
                        {fmtBRL(Number(selecionado.mao_obra_valor || 0))}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Totais */}
                <div className="space-y-1 border-t border-border pt-3 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Total peças</span>
                    <span>{fmtBRL(Number(selecionado.total_pecas || 0))}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Mão de obra</span>
                    <span>{fmtBRL(Number(selecionado.mao_obra_valor || 0))}</span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-2 text-base font-bold text-foreground">
                    <span>Total geral</span>
                    <span>{fmtBRL(Number(selecionado.total_geral || 0))}</span>
                  </div>
                </div>

                {selecionado.status === "recusado" && selecionado.motivo_recusa && (
                  <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm">
                    <div className="mb-1 text-xs font-bold uppercase text-red-400">
                      Motivo da recusa
                    </div>
                    <p className="text-foreground">{selecionado.motivo_recusa}</p>
                  </div>
                )}

                {selecionado.observacao && (
                  <div>
                    <h3 className="mb-2 text-xs font-bold uppercase text-muted-foreground">Observação</h3>
                    <p className="text-sm text-foreground">{selecionado.observacao}</p>
                  </div>
                )}

                {selecionado.os_id && (
                  <button
                    type="button"
                    onClick={() => {
                      onNavigate?.("os", selecionado.os_id);
                      setSelecionado(null);
                    }}
                    className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
                  >
                    Ver OS vinculada
                  </button>
                )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
};

const KpiCard = ({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof DollarSign;
  label: string;
  value: string;
  color: string;
}) => (
  <div className="rounded-xl border border-border bg-card p-4">
    <div className="mb-2 flex items-center gap-2">
      <Icon className={`h-4 w-4 ${color}`} />
      <span className="text-xs font-bold uppercase text-muted-foreground">{label}</span>
    </div>
    <div className="text-2xl font-bold text-foreground">{value}</div>
  </div>
);

const Info = ({ label, value }: { label: string; value: string }) => (
  <div>
    <div className="text-xs uppercase text-muted-foreground">{label}</div>
    <div className="text-foreground">{value}</div>
  </div>
);

export default DemoDadosOrcamento;
