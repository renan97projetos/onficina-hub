import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  FileText, Wrench, DollarSign, TrendingUp, CheckCircle2,
  ArrowUpRight, ArrowDownRight,
} from "lucide-react";
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
} from "recharts";

const STALE_5MIN = 1000 * 60 * 5;

const formatBRL = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

const monthLabel = (d: Date) =>
  d.toLocaleDateString("pt-BR", { month: "short" }).replace(".", "");

function useDashboardData() {
  return useQuery({
    queryKey: ["dashboard-metrics"],
    staleTime: STALE_5MIN,
    queryFn: async () => {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const sixMonthsStart = new Date(now.getFullYear(), now.getMonth() - 5, 1).toISOString();

      const [openasHoje, emAtendimento, faturamentoMes, finalizadasMes, historico] =
        await Promise.all([
          supabase
            .from("ordens_servico")
            .select("id", { count: "exact", head: true })
            .gte("created_at", todayStart),
          supabase
            .from("ordens_servico")
            .select("id", { count: "exact", head: true })
            .eq("stage", "em_atendimento"),
          supabase
            .from("ordens_servico")
            .select("valor_total")
            .eq("pagamento_confirmado", true)
            .gte("pagamento_confirmado_em", monthStart),
          supabase
            .from("ordens_servico")
            .select("id", { count: "exact", head: true })
            .eq("stage", "finalizado")
            .gte("updated_at", monthStart),
          supabase
            .from("ordens_servico")
            .select("valor_total, pagamento_confirmado_em")
            .eq("pagamento_confirmado", true)
            .gte("pagamento_confirmado_em", sixMonthsStart),
        ]);

      const valoresMes = (faturamentoMes.data ?? []).map((r) => Number(r.valor_total) || 0);
      const totalMes = valoresMes.reduce((a, b) => a + b, 0);
      const ticketMedio = valoresMes.length ? totalMes / valoresMes.length : 0;

      // Últimos 6 meses (group by month)
      const buckets: Record<string, { label: string; total: number }> = {};
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        buckets[key] = { label: monthLabel(d), total: 0 };
      }
      (historico.data ?? []).forEach((r) => {
        if (!r.pagamento_confirmado_em) return;
        const d = new Date(r.pagamento_confirmado_em);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        if (buckets[key]) buckets[key].total += Number(r.valor_total) || 0;
      });

      return {
        osAbertasHoje: openasHoje.count ?? 0,
        emAtendimento: emAtendimento.count ?? 0,
        faturamentoMes: totalMes,
        ticketMedio,
        finalizadasMes: finalizadasMes.count ?? 0,
        historico: Object.values(buckets),
      };
    },
  });
}

const DemoDashboard = () => {
  const { data, isLoading } = useDashboardData();

  const kpis = [
    { label: "OS Abertas Hoje", value: isLoading ? "—" : String(data?.osAbertasHoje ?? 0), icon: FileText },
    { label: "Em Atendimento", value: isLoading ? "—" : String(data?.emAtendimento ?? 0), icon: Wrench },
    { label: "Faturamento do Mês", value: isLoading ? "—" : formatBRL(data?.faturamentoMes ?? 0), icon: DollarSign },
    { label: "Ticket Médio", value: isLoading ? "—" : formatBRL(data?.ticketMedio ?? 0), icon: TrendingUp },
    { label: "Finalizadas no Mês", value: isLoading ? "—" : String(data?.finalizadasMes ?? 0), icon: CheckCircle2 },
  ];

  const chartData = data?.historico ?? [];
  const ultimoMes = chartData.at(-1)?.total ?? 0;
  const penultimoMes = chartData.at(-2)?.total ?? 0;
  const variacao = penultimoMes > 0 ? ((ultimoMes - penultimoMes) / penultimoMes) * 100 : 0;
  const variacaoUp = variacao >= 0;

  return (
    <>
      {/* KPIs */}
      <div className="mb-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">{kpi.label}</p>
              <kpi.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="mt-2 text-2xl font-bold">{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Gráfico de faturamento */}
      <div className="mb-8 rounded-xl border border-border bg-card p-5">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">Faturamento</h2>
            <p className="text-sm text-muted-foreground">Últimos 6 meses</p>
          </div>
          {!isLoading && chartData.length > 1 && (
            <div className="flex items-center gap-1">
              {variacaoUp ? (
                <ArrowUpRight className="h-4 w-4 text-green-400" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-400" />
              )}
              <span className={`text-sm font-semibold ${variacaoUp ? "text-green-400" : "text-red-400"}`}>
                {variacao.toFixed(1)}% vs mês ant.
              </span>
            </div>
          )}
        </div>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
              <CartesianGrid stroke="hsl(var(--border))" strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="label"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => formatBRL(Number(v))}
                width={80}
              />
              <Tooltip
                contentStyle={{
                  background: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
                formatter={(value: number) => [formatBRL(value), "Faturamento"]}
              />
              <Line
                type="monotone"
                dataKey="total"
                stroke="hsl(var(--primary))"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "hsl(var(--primary))" }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

export default DemoDashboard;
