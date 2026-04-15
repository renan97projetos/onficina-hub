import { useState } from "react";
import { DollarSign, TrendingUp, ArrowUpRight, ArrowDownRight, CreditCard, Receipt, AlertCircle, X } from "lucide-react";

const resumo = [
  { label: "Faturamento Mês", value: "R$ 47.280,00", change: "+12%", up: true, icon: DollarSign },
  { label: "Ticket Médio", value: "R$ 1.970,00", change: "+8% vs anterior", up: true, icon: TrendingUp },
  { label: "Contas a Receber", value: "R$ 18.400,00", change: "8 OS pendentes", up: true, icon: CreditCard },
  { label: "OS Finalizadas", value: "24", change: "no mês", up: true, icon: Receipt },
];

const osList = [
  { id: "REC-0024", os: "OS-0135", cliente: "Bruno Tavares", veiculo: "SW4 2020", valor: "R$ 8.200,00", forma: "PIX", status: "Pago", data: "09/04/2026" },
  { id: "REC-0023", os: "OS-0136", cliente: "Amanda Gonçalves", veiculo: "Compass 2021", valor: "R$ 5.100,00", forma: "Cartão Crédito", status: "Pago", data: "08/04/2026" },
  { id: "—", os: "OS-0137", cliente: "Tatiana Lima", veiculo: "Renegade 2021", valor: "R$ 7.100,00", forma: "—", status: "Pendente", data: "—" },
  { id: "REC-0022", os: "OS-0138", cliente: "Felipe Santos", veiculo: "Argo 2022", valor: "R$ 3.400,00", forma: "Misto", status: "Parcial", data: "14/04/2026" },
  { id: "—", os: "OS-0139", cliente: "Lucas Ferreira", veiculo: "Tracker 2021", valor: "R$ 6.200,00", forma: "—", status: "Pendente", data: "—" },
  { id: "—", os: "OS-0142", cliente: "Juliana Martins", veiculo: "Kicks 2022", valor: "R$ 4.500,00", forma: "—", status: "Pendente", data: "—" },
];

const statusColor: Record<string, string> = {
  "Pago": "text-green-400 bg-green-400/10",
  "Parcial": "text-amber-400 bg-amber-400/10",
  "Pendente": "text-red-400 bg-red-400/10",
};

const DemoFinanceiro = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Financeiro</h1>
          <p className="text-sm text-muted-foreground">Abril 2026</p>
        </div>
        <select className="h-9 rounded-lg border border-white/10 bg-white/5 px-3 text-sm outline-none focus:border-primary">
          <option>Abril 2026</option>
          <option>Março 2026</option>
          <option>Fevereiro 2026</option>
          <option>Janeiro 2026</option>
        </select>
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
        <div className="border-b border-white/10 px-5 py-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">Ordens de Serviço</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 text-left">
                {["Recibo", "OS", "Cliente", "Veículo", "Valor", "Forma Pgto", "Status", "Data"].map((h) => (
                  <th key={h} className="px-5 py-3 text-xs font-semibold uppercase text-muted-foreground whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {osList.map((o) => (
                <tr
                  key={o.os}
                  className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors cursor-pointer"
                  onClick={() => o.status === "Pendente" && setShowModal(true)}
                >
                  <td className="px-5 py-3 text-sm font-mono text-muted-foreground">{o.id}</td>
                  <td className="px-5 py-3 text-sm font-semibold text-primary">{o.os}</td>
                  <td className="px-5 py-3 text-sm">{o.cliente}</td>
                  <td className="px-5 py-3 text-sm text-muted-foreground">{o.veiculo}</td>
                  <td className="px-5 py-3 text-sm font-semibold">{o.valor}</td>
                  <td className="px-5 py-3 text-sm text-muted-foreground">{o.forma}</td>
                  <td className="px-5 py-3">
                    <span className={`inline-block rounded-full px-2.5 py-1 text-xs font-medium ${statusColor[o.status]}`}>{o.status}</span>
                  </td>
                  <td className="px-5 py-3 text-sm text-muted-foreground">{o.data}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payment Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#111] p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold">Fechamento Financeiro — OS-0137</h3>
              <button onClick={() => setShowModal(false)} className="rounded-lg p-1 text-muted-foreground hover:bg-white/5">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
                <p className="text-sm text-muted-foreground mb-2">Serviços</p>
                <div className="space-y-2">
                  {[
                    { servico: "Funilaria", orcado: "R$ 3.500,00" },
                    { servico: "Pintura", orcado: "R$ 2.800,00" },
                    { servico: "Polimento", orcado: "R$ 800,00" },
                  ].map((s) => (
                    <div key={s.servico} className="flex items-center justify-between">
                      <span className="text-sm">{s.servico}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-muted-foreground">Orçado: {s.orcado}</span>
                        <input
                          defaultValue={s.orcado}
                          className="w-32 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-right outline-none focus:border-primary"
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-3 pt-3 border-t border-white/10 flex justify-between font-semibold">
                  <span>Total</span>
                  <span>R$ 7.100,00</span>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">Forma de Pagamento</label>
                <select className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-sm outline-none focus:border-primary">
                  <option>Dinheiro</option>
                  <option>PIX</option>
                  <option>Cartão de Débito</option>
                  <option>Cartão de Crédito</option>
                  <option>Misto</option>
                </select>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium">Status do Pagamento</label>
                <div className="flex gap-3">
                  {["Pago", "Parcial", "Pendente"].map((s) => (
                    <button key={s} className={`flex-1 rounded-lg border py-2 text-sm font-medium transition-colors ${
                      s === "Pago" ? "border-green-500 bg-green-500/10 text-green-400" : "border-white/10 text-muted-foreground hover:border-white/20"
                    }`}>{s}</button>
                  ))}
                </div>
              </div>

              <div className="rounded-lg border border-white/10 bg-white/[0.02] p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Recibo nº</span>
                  <span className="font-mono font-semibold text-primary">REC-0025</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex-1 rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:brightness-110">
                  Registrar Pagamento
                </button>
                <button className="rounded-lg border border-white/10 px-4 py-2.5 text-sm font-medium text-muted-foreground hover:bg-white/5">
                  Enviar Recibo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DemoFinanceiro;
