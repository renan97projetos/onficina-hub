import { DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, CreditCard, Receipt, AlertCircle } from "lucide-react";

const resumo = [
  { label: "Faturamento Mês", value: "R$ 47.280", change: "+12%", up: true, icon: DollarSign },
  { label: "A Receber", value: "R$ 18.400", change: "8 parcelas", up: true, icon: CreditCard },
  { label: "Recebido Mês", value: "R$ 28.880", change: "+8% vs anterior", up: true, icon: Receipt },
  { label: "Inadimplência", value: "R$ 3.200", change: "2 clientes", up: false, icon: AlertCircle },
];

const transacoes = [
  { id: "TX-001", descricao: "OS-0135 — SW4 2020", cliente: "Bruno Tavares", valor: "R$ 8.200", tipo: "Recebido", data: "09/04/2026", metodo: "PIX" },
  { id: "TX-002", descricao: "OS-0136 — Compass 2021", cliente: "Amanda Gonçalves", valor: "R$ 5.100", tipo: "Recebido", data: "08/04/2026", metodo: "Cartão" },
  { id: "TX-003", descricao: "OS-0139 — Tracker 2021", cliente: "Lucas Ferreira", valor: "R$ 6.200", tipo: "Pendente", data: "15/04/2026", metodo: "Boleto" },
  { id: "TX-004", descricao: "OS-0142 — Kicks 2022", cliente: "Juliana Martins", valor: "R$ 4.500", tipo: "Pendente", data: "18/04/2026", metodo: "PIX" },
  { id: "TX-005", descricao: "OS-0143 — Onix 2022", cliente: "Maria Santos", valor: "R$ 4.100", tipo: "Pendente", data: "20/04/2026", metodo: "Cartão" },
  { id: "TX-006", descricao: "Compra de tinta PU", cliente: "—", valor: "-R$ 1.200", tipo: "Despesa", data: "12/04/2026", metodo: "—" },
  { id: "TX-007", descricao: "Lixa e massa", cliente: "—", valor: "-R$ 340", tipo: "Despesa", data: "10/04/2026", metodo: "—" },
];

const tipoColor: Record<string, string> = {
  "Recebido": "text-green-400 bg-green-400/10",
  "Pendente": "text-amber-400 bg-amber-400/10",
  "Despesa": "text-red-400 bg-red-400/10",
};

const DemoFinanceiro = () => (
  <>
    <div className="mb-6">
      <h1 className="text-2xl font-bold">Financeiro</h1>
      <p className="text-sm text-muted-foreground">Resumo de abril 2026</p>
    </div>

    <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {resumo.map((r) => (
        <div key={r.label} className="rounded-xl border border-white/10 bg-[#111] p-5">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">{r.label}</p>
            <r.icon className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="mt-2 text-2xl font-bold">{r.value}</p>
          <div className="mt-1 flex items-center gap-1">
            {r.up ? <ArrowUpRight className="h-3 w-3 text-green-400" /> : <ArrowDownRight className="h-3 w-3 text-red-400" />}
            <span className={`text-xs ${r.up ? "text-green-400" : "text-red-400"}`}>{r.change}</span>
          </div>
        </div>
      ))}
    </div>

    <div className="rounded-xl border border-white/10 bg-[#111]">
      <div className="border-b border-white/10 px-5 py-4">
        <h2 className="text-lg font-bold">Movimentações</h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/10 text-left">
              {["Descrição", "Cliente", "Valor", "Tipo", "Método", "Data"].map((h) => (
                <th key={h} className="px-5 py-3 text-xs font-semibold uppercase text-muted-foreground">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {transacoes.map((t) => (
              <tr key={t.id} className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-3 text-sm font-medium">{t.descricao}</td>
                <td className="px-5 py-3 text-sm text-muted-foreground">{t.cliente}</td>
                <td className={`px-5 py-3 text-sm font-semibold ${t.tipo === "Despesa" ? "text-red-400" : ""}`}>{t.valor}</td>
                <td className="px-5 py-3">
                  <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${tipoColor[t.tipo]}`}>{t.tipo}</span>
                </td>
                <td className="px-5 py-3 text-sm text-muted-foreground">{t.metodo}</td>
                <td className="px-5 py-3 text-sm text-muted-foreground">{t.data}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  </>
);

export default DemoFinanceiro;
