import { useState } from "react";
import { X } from "lucide-react";

const osList = [
  { recibo: "REC-0024", os: "OS-0135", cliente: "Bruno Tavares", veiculo: "SW4 2020", valor: "R$ 8.200,00", forma: "PIX", status: "Pago", data: "09/04" },
  { recibo: "REC-0023", os: "OS-0136", cliente: "Amanda Gonçalves", veiculo: "Compass 2021", valor: "R$ 5.100,00", forma: "Cartão", status: "Pago", data: "08/04" },
  { recibo: "—", os: "OS-0137", cliente: "Tatiana Lima", veiculo: "Renegade 2021", valor: "R$ 7.100,00", forma: "—", status: "Pendente", data: "—" },
  { recibo: "REC-0022", os: "OS-0138", cliente: "Felipe Santos", veiculo: "Argo 2022", valor: "R$ 3.400,00", forma: "Misto", status: "Parcial", data: "14/04" },
  { recibo: "—", os: "OS-0139", cliente: "Lucas Ferreira", veiculo: "Tracker 2021", valor: "R$ 6.200,00", forma: "—", status: "Pendente", data: "—" },
];

const statusColor: Record<string, string> = {
  "Pago": "text-green-400",
  "Parcial": "text-amber-400",
  "Pendente": "text-red-400",
};

const DemoFinanceiro = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wide">Financeiro</h2>
        <select className="h-8 rounded-lg border border-white/10 bg-white/5 px-3 text-xs outline-none focus:border-primary">
          <option>Abril 2026</option>
          <option>Março 2026</option>
        </select>
      </div>

      {/* Simple metrics row */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Faturamento", value: "R$ 47.280,00" },
          { label: "Ticket médio", value: "R$ 1.970,00" },
          { label: "A receber", value: "R$ 18.400,00" },
          { label: "OS finalizadas", value: "24" },
        ].map((m) => (
          <div key={m.label} className="rounded-lg border border-white/10 p-3">
            <p className="text-xs text-muted-foreground">{m.label}</p>
            <p className="mt-1 text-lg font-bold">{m.value}</p>
          </div>
        ))}
      </div>

      {/* OS list */}
      <div className="space-y-1">
        {osList.map((o) => (
          <div
            key={o.os}
            onClick={() => o.status === "Pendente" && setShowModal(true)}
            className={`flex items-center justify-between rounded-lg border border-white/10 px-4 py-3 ${o.status === "Pendente" ? "cursor-pointer hover:bg-white/[0.02]" : ""}`}
          >
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono text-muted-foreground w-16">{o.recibo}</span>
              <span className="text-sm font-semibold text-primary">{o.os}</span>
              <span className="text-sm">{o.cliente}</span>
              <span className="text-xs text-muted-foreground hidden sm:block">— {o.veiculo}</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <span className="text-xs text-muted-foreground hidden sm:block">{o.forma}</span>
              <span className={`text-xs font-medium ${statusColor[o.status]}`}>{o.status}</span>
              <span className="font-medium">{o.valor}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Payment modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md rounded-xl border border-white/10 bg-[#111] p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wide">Fechamento — OS-0137</h3>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                {["Funilaria — R$ 3.500,00", "Pintura — R$ 2.800,00", "Polimento — R$ 800,00"].map((s) => (
                  <div key={s} className="flex items-center justify-between text-sm border-b border-white/5 pb-2">
                    <span>{s.split(" — ")[0]}</span>
                    <input defaultValue={s.split(" — ")[1]} className="w-28 rounded border border-white/10 bg-white/5 px-2 py-1 text-right text-sm outline-none focus:border-primary" />
                  </div>
                ))}
                <div className="flex justify-between text-sm font-semibold pt-1">
                  <span>Total</span>
                  <span>R$ 7.100,00</span>
                </div>
              </div>

              <div>
                <label className="block text-xs text-muted-foreground mb-1">Forma de pagamento</label>
                <select className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-primary">
                  <option>Dinheiro</option><option>PIX</option><option>Cartão Débito</option><option>Cartão Crédito</option><option>Misto</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-muted-foreground mb-1">Status</label>
                <div className="flex gap-2">
                  {["Pago", "Parcial", "Pendente"].map((s) => (
                    <button key={s} className={`flex-1 rounded-lg border py-1.5 text-xs font-medium ${s === "Pago" ? "border-green-500/40 text-green-400" : "border-white/10 text-muted-foreground"}`}>{s}</button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>Recibo nº</span>
                <span className="font-mono text-primary">REC-0025</span>
              </div>

              <button className="w-full rounded-lg bg-primary py-2 text-sm font-semibold text-primary-foreground hover:brightness-110">
                Registrar pagamento
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DemoFinanceiro;
