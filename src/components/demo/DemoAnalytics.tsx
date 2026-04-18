import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { TrendingUp, DollarSign, Target, UserX, MessageCircle } from "lucide-react";
import EmptyModuleState from "./EmptyModuleState";

const PRO_PLANS = ["pro", "premium", "trial"];

type Periodo = "hoje" | "7d" | "30d" | "mes" | "mes_anterior" | "custom";

const formatBRL = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const startOfDay = (d: Date) => {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
};
const endOfDay = (d: Date) => {
  const x = new Date(d);
  x.setHours(23, 59, 59, 999);
  return x;
};

const computeRange = (p: Periodo, custom: { inicio: string; fim: string }) => {
  const now = new Date();
  if (p === "hoje") return { inicio: startOfDay(now), fim: endOfDay(now) };
  if (p === "7d") {
    const i = new Date(now);
    i.setDate(i.getDate() - 6);
    return { inicio: startOfDay(i), fim: endOfDay(now) };
  }
  if (p === "30d") {
    const i = new Date(now);
    i.setDate(i.getDate() - 29);
    return { inicio: startOfDay(i), fim: endOfDay(now) };
  }
  if (p === "mes") {
    const i = new Date(now.getFullYear(), now.getMonth(), 1);
    return { inicio: startOfDay(i), fim: endOfDay(now) };
  }
  if (p === "mes_anterior") {
    const i = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const f = new Date(now.getFullYear(), now.getMonth(), 0);
    return { inicio: startOfDay(i), fim: endOfDay(f) };
  }
  // custom
  const i = custom.inicio ? new Date(custom.inicio + "T00:00:00") : startOfDay(now);
  const f = custom.fim ? new Date(custom.fim + "T23:59:59") : endOfDay(now);
  return { inicio: i, fim: f };
};

interface ServicoRow {
  nome: string;
  total_os: number;
  ticket_medio: number;
  receita_total: number;
}

interface SazonalidadeRow {
  mes: string;
  total_os: number;
  faturamento: number;
}

interface ClienteInativo {
  cliente_id: string;
  nome: string;
  telefone: string | null;
  ultima_visita: string;
  dias_ausente: number;
}

const DemoAnalytics = () => {
  const { oficina_id, oficina } = useAuth();
  const isPro = !!oficina?.plano && PRO_PLANS.includes(oficina.plano);

  const [periodo, setPeriodo] = useState<Periodo>("30d");
  const [custom, setCustom] = useState({ inicio: "", fim: "" });
  const [loading, setLoading] = useState(false);

  const [conversao, setConversao] = useState({
    total: 0,
    aprovados: 0,
    recusados: 0,
    taxa: 0,
  });
  const [ticketGeral, setTicketGeral] = useState({ receita: 0, ticket: 0 });
  const [servicos, setServicos] = useState<ServicoRow[]>([]);
  const [sazonalidade, setSazonalidade] = useState<SazonalidadeRow[]>([]);
  const [inativos, setInativos] = useState<ClienteInativo[]>([]);

  const range = useMemo(() => computeRange(periodo, custom), [periodo, custom]);

  useEffect(() => {
    if (!oficina_id || !isPro) return;
    let mounted = true;

    const load = async () => {
      setLoading(true);
      const inicioIso = range.inicio.toISOString();
      const fimIso = range.fim.toISOString();

      // 1) Conversão de orçamentos
      const { data: orcs } = await supabase
        .from("orcamentos")
        .select("status")
        .eq("oficina_id", oficina_id)
        .gte("created_at", inicioIso)
        .lte("created_at", fimIso);

      const total = orcs?.length || 0;
      const aprovados = orcs?.filter((o) => o.status === "aprovado").length || 0;
      const recusados = orcs?.filter((o) => o.status === "recusado").length || 0;
      const taxa = total ? Math.round((aprovados * 1000) / total) / 10 : 0;

      // 2) Ticket médio por serviço (apenas OS finalizadas no período)
      const { data: osFin } = await supabase
        .from("ordens_servico")
        .select("id, valor_total, created_at, pagamento_confirmado, stage")
        .eq("oficina_id", oficina_id)
        .eq("stage", "finalizado")
        .gte("created_at", inicioIso)
        .lte("created_at", fimIso);

      const osIds = (osFin || []).map((o) => o.id);
      let receitaPeriodo = 0;
      let ticketPeriodo = 0;
      if (osFin && osFin.length) {
        receitaPeriodo = osFin.reduce((s, o) => s + Number(o.valor_total || 0), 0);
        ticketPeriodo = receitaPeriodo / osFin.length;
      }

      let servicosAgg: ServicoRow[] = [];
      if (osIds.length) {
        const { data: srvs } = await supabase
          .from("os_servicos")
          .select("nome_servico, valor, os_id")
          .in("os_id", osIds);

        const map = new Map<string, { os: Set<string>; receita: number }>();
        (srvs || []).forEach((s) => {
          const key = s.nome_servico || "Sem nome";
          const cur = map.get(key) || { os: new Set<string>(), receita: 0 };
          cur.os.add(s.os_id as string);
          cur.receita += Number(s.valor || 0);
          map.set(key, cur);
        });
        servicosAgg = Array.from(map.entries())
          .map(([nome, v]) => ({
            nome,
            total_os: v.os.size,
            receita_total: v.receita,
            ticket_medio: v.os.size ? v.receita / v.os.size : 0,
          }))
          .sort((a, b) => b.receita_total - a.receita_total);
      }

      // 3) Sazonalidade — últimos 12 meses, todas OS
      const inicio12 = new Date();
      inicio12.setMonth(inicio12.getMonth() - 11);
      inicio12.setDate(1);
      inicio12.setHours(0, 0, 0, 0);

      const { data: osAll } = await supabase
        .from("ordens_servico")
        .select("created_at, valor_total, pagamento_confirmado")
        .eq("oficina_id", oficina_id)
        .gte("created_at", inicio12.toISOString());

      const seasonMap = new Map<string, { total_os: number; faturamento: number }>();
      for (let i = 0; i < 12; i++) {
        const d = new Date(inicio12);
        d.setMonth(d.getMonth() + i);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        seasonMap.set(key, { total_os: 0, faturamento: 0 });
      }
      (osAll || []).forEach((o) => {
        const d = new Date(o.created_at as string);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        const cur = seasonMap.get(key);
        if (!cur) return;
        cur.total_os += 1;
        if (o.pagamento_confirmado) cur.faturamento += Number(o.valor_total || 0);
      });
      const seasonArr: SazonalidadeRow[] = Array.from(seasonMap.entries()).map(
        ([mes, v]) => ({ mes, ...v }),
      );

      // 4) Clientes inativos há +90 dias (e que já tiveram pelo menos uma OS)
      const { data: clientes } = await supabase
        .from("clientes")
        .select("id, nome, telefone")
        .eq("oficina_id", oficina_id);

      const { data: osPorCliente } = await supabase
        .from("ordens_servico")
        .select("cliente_id, created_at")
        .eq("oficina_id", oficina_id);

      const ultimaPorCliente = new Map<string, string>();
      (osPorCliente || []).forEach((o) => {
        if (!o.cliente_id) return;
        const cur = ultimaPorCliente.get(o.cliente_id);
        if (!cur || (o.created_at as string) > cur) {
          ultimaPorCliente.set(o.cliente_id, o.created_at as string);
        }
      });

      const limite = Date.now() - 90 * 24 * 60 * 60 * 1000;
      const inativosArr: ClienteInativo[] = [];
      (clientes || []).forEach((c) => {
        const u = ultimaPorCliente.get(c.id);
        if (!u) return;
        const t = new Date(u).getTime();
        if (t < limite) {
          inativosArr.push({
            cliente_id: c.id,
            nome: c.nome,
            telefone: c.telefone,
            ultima_visita: u,
            dias_ausente: Math.floor((Date.now() - t) / (24 * 60 * 60 * 1000)),
          });
        }
      });
      inativosArr.sort((a, b) => b.dias_ausente - a.dias_ausente);

      if (!mounted) return;
      setConversao({ total, aprovados, recusados, taxa });
      setTicketGeral({ receita: receitaPeriodo, ticket: ticketPeriodo });
      setServicos(servicosAgg);
      setSazonalidade(seasonArr);
      setInativos(inativosArr);
      setLoading(false);
    };

    load();
    return () => {
      mounted = false;
    };
  }, [oficina_id, isPro, range.inicio, range.fim]);

  if (!isPro) {
    return (
      <EmptyModuleState
        icon={TrendingUp}
        title="Analytics avançado"
        description="Disponível nos planos Pro e Premium. Veja conversão, ticket médio, sazonalidade e clientes inativos."
      />
    );
  }

  const periodos: { key: Periodo; label: string }[] = [
    { key: "hoje", label: "Hoje" },
    { key: "7d", label: "7 dias" },
    { key: "30d", label: "30 dias" },
    { key: "mes", label: "Este mês" },
    { key: "mes_anterior", label: "Mês anterior" },
    { key: "custom", label: "Customizado" },
  ];

  const formatMesLabel = (k: string) => {
    const [y, m] = k.split("-");
    const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    return `${meses[Number(m) - 1]}/${y.slice(2)}`;
  };

  const whatsappLink = (tel: string | null, nome: string) => {
    const limpo = (tel || "").replace(/\D/g, "");
    const msg = encodeURIComponent(
      `Olá ${nome}! Sentimos sua falta na ${oficina?.nome || "nossa oficina"}. Que tal agendar uma revisão? 🚗`,
    );
    return `https://wa.me/55${limpo}?text=${msg}`;
  };

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card className="p-4">
        <div className="flex flex-wrap items-end gap-3">
          <div className="flex flex-wrap gap-2">
            {periodos.map((p) => (
              <button
                key={p.key}
                type="button"
                onClick={() => setPeriodo(p.key)}
                className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors ${
                  periodo === p.key
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-background text-muted-foreground hover:text-foreground"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          {periodo === "custom" && (
            <div className="flex items-end gap-2">
              <div>
                <Label className="text-xs">Início</Label>
                <Input
                  type="date"
                  value={custom.inicio}
                  onChange={(e) => setCustom((c) => ({ ...c, inicio: e.target.value }))}
                  className="h-9"
                />
              </div>
              <div>
                <Label className="text-xs">Fim</Label>
                <Input
                  type="date"
                  value={custom.fim}
                  onChange={(e) => setCustom((c) => ({ ...c, fim: e.target.value }))}
                  className="h-9"
                />
              </div>
            </div>
          )}
          <div className="ml-auto text-xs text-muted-foreground">
            {range.inicio.toLocaleDateString("pt-BR")} – {range.fim.toLocaleDateString("pt-BR")}
          </div>
        </div>
      </Card>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Taxa de conversão</span>
            <Target className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-2 text-2xl font-bold">{conversao.taxa}%</div>
          <div className="mt-1 text-xs text-muted-foreground">
            {conversao.aprovados} aprovados / {conversao.total} orçamentos
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Ticket médio</span>
            <TrendingUp className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-2 text-2xl font-bold">{formatBRL(ticketGeral.ticket)}</div>
          <div className="mt-1 text-xs text-muted-foreground">OS finalizadas no período</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Receita do período</span>
            <DollarSign className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-2 text-2xl font-bold">{formatBRL(ticketGeral.receita)}</div>
          <div className="mt-1 text-xs text-muted-foreground">Soma de OS finalizadas</div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-muted-foreground">Clientes inativos</span>
            <UserX className="h-4 w-4 text-primary" />
          </div>
          <div className="mt-2 text-2xl font-bold">{inativos.length}</div>
          <div className="mt-1 text-xs text-muted-foreground">Sem visita há +90 dias</div>
        </Card>
      </div>

      {/* Sazonalidade */}
      <Card className="p-4">
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-semibold">Sazonalidade — últimos 12 meses</h3>
          <span className="text-xs text-muted-foreground">OS por mês & faturamento confirmado</span>
        </div>
        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={sazonalidade.map((s) => ({ ...s, mesLabel: formatMesLabel(s.mes) }))}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="mesLabel" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                formatter={(v: number, name: string) =>
                  name === "faturamento" ? formatBRL(v) : v
                }
              />
              <Bar dataKey="total_os" fill="hsl(var(--primary))" name="OS" radius={[4, 4, 0, 0]} />
              <Bar
                dataKey="faturamento"
                fill="hsl(var(--primary) / 0.4)"
                name="faturamento"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Ranking de serviços */}
      <Card className="p-4">
        <h3 className="mb-3 font-semibold">Ranking de serviços por receita</h3>
        {servicos.length === 0 ? (
          <p className="text-sm text-muted-foreground">Sem OS finalizadas no período.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left text-xs uppercase text-muted-foreground">
                  <th className="py-2">Serviço</th>
                  <th className="py-2 text-right">OS</th>
                  <th className="py-2 text-right">Ticket médio</th>
                  <th className="py-2 text-right">Receita</th>
                </tr>
              </thead>
              <tbody>
                {servicos.map((s) => (
                  <tr key={s.nome} className="border-b border-border/50">
                    <td className="py-2 font-medium">{s.nome}</td>
                    <td className="py-2 text-right">{s.total_os}</td>
                    <td className="py-2 text-right">{formatBRL(s.ticket_medio)}</td>
                    <td className="py-2 text-right font-semibold">{formatBRL(s.receita_total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Clientes inativos */}
      <Card className="p-4">
        <h3 className="mb-3 font-semibold">Clientes inativos há +90 dias</h3>
        {inativos.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhum cliente inativo. Sua base está ativa! 🎉
          </p>
        ) : (
          <div className="space-y-2">
            {inativos.slice(0, 50).map((c) => (
              <div
                key={c.cliente_id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-background p-3"
              >
                <div>
                  <div className="font-medium">{c.nome}</div>
                  <div className="text-xs text-muted-foreground">
                    {c.telefone || "Sem telefone"} · Última visita:{" "}
                    {new Date(c.ultima_visita).toLocaleDateString("pt-BR")} · {c.dias_ausente} dias
                  </div>
                </div>
                {c.telefone ? (
                  <Button asChild size="sm" variant="outline">
                    <a
                      href={whatsappLink(c.telefone, c.nome)}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <MessageCircle className="mr-1 h-4 w-4" />
                      WhatsApp
                    </a>
                  </Button>
                ) : (
                  <span className="text-xs text-muted-foreground">Sem WhatsApp</span>
                )}
              </div>
            ))}
            {inativos.length > 50 && (
              <p className="text-center text-xs text-muted-foreground">
                Mostrando 50 de {inativos.length} clientes inativos.
              </p>
            )}
          </div>
        )}
      </Card>

      {loading && <p className="text-center text-xs text-muted-foreground">Carregando…</p>}
    </div>
  );
};

export default DemoAnalytics;
