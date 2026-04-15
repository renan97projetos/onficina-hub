import { useState } from "react";
import { X, Printer, Send, MessageCircle, ChevronDown, ChevronUp, Receipt, Wallet, ArrowUpDown } from "lucide-react";

/* ───── Types ───── */
interface OsItem {
  recibo: string;
  os: string;
  cliente: string;
  telefone: string;
  veiculo: string;
  servicos: { nome: string; valor: number }[];
  valorTotal: number;
  forma: string;
  status: "Pago" | "Parcial" | "Pendente";
  parcelas: number;
  valorPago: number;
  valorPendente: number;
  data: string;
  pagamentos: { forma: string; valor: number; data: string }[];
}

const initialOs: OsItem[] = [
  {
    recibo: "REC-0024", os: "OS-0135", cliente: "Bruno Tavares", telefone: "(11) 99876-5432", veiculo: "SW4 2020",
    servicos: [{ nome: "Funilaria", valor: 4200 }, { nome: "Pintura", valor: 3200 }, { nome: "Polimento", valor: 800 }],
    valorTotal: 8200, forma: "PIX", status: "Pago", parcelas: 1, valorPago: 8200, valorPendente: 0, data: "09/04",
    pagamentos: [{ forma: "PIX", valor: 8200, data: "09/04/2026" }],
  },
  {
    recibo: "REC-0023", os: "OS-0136", cliente: "Amanda Gonçalves", telefone: "(11) 98765-4321", veiculo: "Compass 2021",
    servicos: [{ nome: "Pintura parcial", valor: 3100 }, { nome: "Polimento", valor: 2000 }],
    valorTotal: 5100, forma: "Crédito 3x", status: "Pago", parcelas: 3, valorPago: 5100, valorPendente: 0, data: "08/04",
    pagamentos: [{ forma: "Cartão Crédito 3x", valor: 5100, data: "08/04/2026" }],
  },
  {
    recibo: "—", os: "OS-0137", cliente: "Tatiana Lima", telefone: "(11) 97654-3210", veiculo: "Renegade 2021",
    servicos: [{ nome: "Funilaria", valor: 3500 }, { nome: "Pintura", valor: 2800 }, { nome: "Polimento", valor: 800 }],
    valorTotal: 7100, forma: "—", status: "Pendente", parcelas: 1, valorPago: 0, valorPendente: 7100, data: "—",
    pagamentos: [],
  },
  {
    recibo: "REC-0022", os: "OS-0138", cliente: "Felipe Santos", telefone: "(11) 96543-2109", veiculo: "Argo 2022",
    servicos: [{ nome: "Pintura parcial", valor: 2200 }, { nome: "Polimento", valor: 1200 }],
    valorTotal: 3400, forma: "Misto", status: "Parcial", parcelas: 1, valorPago: 2000, valorPendente: 1400, data: "14/04",
    pagamentos: [{ forma: "Dinheiro", valor: 1000, data: "14/04/2026" }, { forma: "PIX", valor: 1000, data: "14/04/2026" }],
  },
  {
    recibo: "—", os: "OS-0139", cliente: "Lucas Ferreira", telefone: "(11) 95432-1098", veiculo: "Tracker 2021",
    servicos: [{ nome: "Funilaria", valor: 3000 }, { nome: "Preparação", valor: 1200 }, { nome: "Pintura", valor: 2000 }],
    valorTotal: 6200, forma: "—", status: "Pendente", parcelas: 1, valorPago: 0, valorPendente: 6200, data: "—",
    pagamentos: [],
  },
];

/* ───── Caixa (cash register) ───── */
interface CaixaState {
  aberto: boolean;
  abertura: string;
  saldoInicial: number;
  entradas: number;
  saidas: number;
  sangrias: { motivo: string; valor: number; hora: string }[];
  reforcos: { valor: number; hora: string }[];
}

const statusColor: Record<string, string> = {
  Pago: "text-green-400",
  Parcial: "text-amber-400",
  Pendente: "text-red-400",
};

const formasPagamento = ["Dinheiro", "PIX", "Cartão Débito", "Cartão Crédito", "Misto"];

const DemoFinanceiro = () => {
  const [osList, setOsList] = useState(initialOs);
  const [showModal, setShowModal] = useState(false);
  const [showRecibo, setShowRecibo] = useState(false);
  const [showCaixa, setShowCaixa] = useState(false);
  const [selectedOs, setSelectedOs] = useState<OsItem | null>(null);
  const [expandedOs, setExpandedOs] = useState<string | null>(null);

  /* PDV state */
  const [pdvForma, setPdvForma] = useState("Dinheiro");
  const [pdvStatus, setPdvStatus] = useState("Pago");
  const [pdvDesconto, setPdvDesconto] = useState(0);
  const [pdvDescontoTipo, setPdvDescontoTipo] = useState<"%" | "R$">("R$");
  const [pdvParcelas, setPdvParcelas] = useState(1);
  const [pdvValorRecebido, setPdvValorRecebido] = useState(0);
  const [pdvObs, setPdvObs] = useState("");
  const [pdvServicos, setPdvServicos] = useState<{ nome: string; valor: number }[]>([]);

  /* Misto state */
  const [mistoEntradas, setMistoEntradas] = useState<{ forma: string; valor: number }[]>([
    { forma: "Dinheiro", valor: 0 },
    { forma: "PIX", valor: 0 },
  ]);

  /* Caixa state */
  const [caixa, setCaixa] = useState<CaixaState>({
    aberto: true, abertura: "08:00", saldoInicial: 200, entradas: 13300, saidas: 500,
    sangrias: [{ motivo: "Depósito bancário", valor: 500, hora: "12:30" }],
    reforcos: [{ valor: 200, hora: "08:00" }],
  });
  const [sangriaValor, setSangriaValor] = useState("");
  const [sangriaMotivo, setSangriaMotivo] = useState("");

  const calcTotal = () => {
    const bruto = pdvServicos.reduce((a, s) => a + s.valor, 0);
    const desconto = pdvDescontoTipo === "%" ? bruto * (pdvDesconto / 100) : pdvDesconto;
    return Math.max(0, bruto - desconto);
  };

  const calcTroco = () => {
    if (pdvForma !== "Dinheiro") return 0;
    return Math.max(0, pdvValorRecebido - calcTotal());
  };

  const calcMistoTotal = () => mistoEntradas.reduce((a, e) => a + e.valor, 0);

  const openPdv = (os: OsItem) => {
    setSelectedOs(os);
    setPdvServicos(os.servicos.map((s) => ({ ...s })));
    setPdvForma("Dinheiro");
    setPdvStatus("Pago");
    setPdvDesconto(0);
    setPdvDescontoTipo("R$");
    setPdvParcelas(1);
    setPdvValorRecebido(0);
    setPdvObs("");
    setMistoEntradas([{ forma: "Dinheiro", valor: 0 }, { forma: "PIX", valor: 0 }]);
    setShowModal(true);
  };

  const registrarPagamento = () => {
    if (!selectedOs) return;
    const total = calcTotal();
    const isPago = pdvStatus === "Pago";
    const valorPago = isPago ? total : pdvForma === "Misto" ? calcMistoTotal() : pdvValorRecebido || total;

    setOsList((prev) =>
      prev.map((o) =>
        o.os === selectedOs.os
          ? {
              ...o,
              recibo: `REC-${String(25 + prev.filter((x) => x.recibo !== "—").length).padStart(4, "0")}`,
              forma: pdvForma === "Cartão Crédito" && pdvParcelas > 1 ? `Crédito ${pdvParcelas}x` : pdvForma,
              status: pdvStatus as "Pago" | "Parcial" | "Pendente",
              valorTotal: total,
              valorPago,
              valorPendente: total - valorPago,
              parcelas: pdvParcelas,
              data: new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" }),
              pagamentos: pdvForma === "Misto"
                ? mistoEntradas.filter((e) => e.valor > 0).map((e) => ({ forma: e.forma, valor: e.valor, data: new Date().toLocaleDateString("pt-BR") }))
                : [{ forma: pdvForma, valor: valorPago, data: new Date().toLocaleDateString("pt-BR") }],
            }
          : o
      )
    );
    setShowModal(false);
  };

  const faturamento = osList.filter((o) => o.status !== "Pendente").reduce((a, o) => a + o.valorPago, 0);
  const aReceber = osList.reduce((a, o) => a + o.valorPendente, 0);
  const osFin = osList.filter((o) => o.status === "Pago").length;
  const ticketMedio = osFin > 0 ? faturamento / osFin : 0;

  return (
    <>
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-bold uppercase tracking-wide">Financeiro</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowCaixa(true)}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-xs font-medium hover:bg-white/5"
          >
            <Wallet className="h-3.5 w-3.5" />
            Caixa
            <span className={`ml-1 h-1.5 w-1.5 rounded-full ${caixa.aberto ? "bg-green-400" : "bg-red-400"}`} />
          </button>
          <select className="h-8 rounded-lg border border-white/10 bg-white/5 px-3 text-xs outline-none focus:border-primary">
            <option>Abril 2026</option>
            <option>Março 2026</option>
          </select>
        </div>
      </div>

      {/* Metrics */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Faturamento", value: `R$ ${faturamento.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` },
          { label: "Ticket médio", value: `R$ ${ticketMedio.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` },
          { label: "A receber", value: `R$ ${aReceber.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` },
          { label: "OS finalizadas", value: String(osFin) },
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
          <div key={o.os}>
            <div
              onClick={() => o.status === "Pendente" ? openPdv(o) : setExpandedOs(expandedOs === o.os ? null : o.os)}
              className="flex items-center justify-between rounded-lg border border-white/10 px-4 py-3 cursor-pointer hover:bg-white/[0.02]"
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
                <span className="font-medium">R$ {o.valorTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                {o.status !== "Pendente" && (
                  expandedOs === o.os ? <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" /> : <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                )}
              </div>
            </div>

            {/* Expanded detail */}
            {expandedOs === o.os && o.status !== "Pendente" && (
              <div className="mx-4 mb-1 rounded-b-lg border border-t-0 border-white/10 bg-white/[0.02] p-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Serviços</p>
                    {o.servicos.map((s) => (
                      <div key={s.nome} className="flex justify-between text-sm py-0.5">
                        <span>{s.nome}</span>
                        <span>R$ {s.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                      </div>
                    ))}
                    <div className="flex justify-between text-sm font-semibold border-t border-white/10 pt-1 mt-1">
                      <span>Total</span>
                      <span>R$ {o.valorTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Pagamentos registrados</p>
                    {o.pagamentos.map((p, i) => (
                      <div key={i} className="flex justify-between text-sm py-0.5">
                        <span>{p.forma}</span>
                        <span>R$ {p.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                      </div>
                    ))}
                    {o.valorPendente > 0 && (
                      <div className="flex justify-between text-sm text-red-400 border-t border-white/10 pt-1 mt-1">
                        <span>Saldo pendente</span>
                        <span>R$ {o.valorPendente.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                      </div>
                    )}
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => setShowRecibo(true)}
                        className="flex items-center gap-1 rounded border border-white/10 px-2.5 py-1 text-xs hover:bg-white/5"
                      >
                        <Receipt className="h-3 w-3" /> Ver recibo
                      </button>
                      <button className="flex items-center gap-1 rounded border border-white/10 px-2.5 py-1 text-xs hover:bg-white/5">
                        <Printer className="h-3 w-3" /> Imprimir
                      </button>
                      <button className="flex items-center gap-1 rounded border border-white/10 px-2.5 py-1 text-xs text-green-400 hover:bg-white/5">
                        <MessageCircle className="h-3 w-3" /> WhatsApp
                      </button>
                      <button className="flex items-center gap-1 rounded border border-white/10 px-2.5 py-1 text-xs hover:bg-white/5">
                        <Send className="h-3 w-3" /> E-mail
                      </button>
                    </div>
                    {o.status === "Parcial" && (
                      <button
                        onClick={() => openPdv(o)}
                        className="mt-2 w-full rounded-lg bg-primary py-1.5 text-xs font-semibold text-primary-foreground hover:brightness-110"
                      >
                        Registrar pagamento restante
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ═══════ PDV MODAL ═══════ */}
      {showModal && selectedOs && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl border border-white/10 bg-[#111] p-6">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wide">PDV — {selectedOs.os}</h3>
                <p className="text-xs text-muted-foreground mt-0.5">{selectedOs.cliente} — {selectedOs.veiculo}</p>
              </div>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Serviços editáveis */}
            <div className="mb-4">
              <p className="text-xs text-muted-foreground mb-2">Serviços</p>
              <div className="space-y-1.5">
                {pdvServicos.map((s, i) => (
                  <div key={i} className="flex items-center justify-between text-sm border-b border-white/5 pb-1.5">
                    <span>{s.nome}</span>
                    <input
                      type="number"
                      value={s.valor}
                      onChange={(e) => {
                        const updated = [...pdvServicos];
                        updated[i].valor = Number(e.target.value) || 0;
                        setPdvServicos(updated);
                      }}
                      className="w-28 rounded border border-white/10 bg-white/5 px-2 py-1 text-right text-sm outline-none focus:border-primary"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Desconto */}
            <div className="mb-4 flex items-end gap-2">
              <div className="flex-1">
                <label className="block text-xs text-muted-foreground mb-1">Desconto</label>
                <input
                  type="number"
                  value={pdvDesconto || ""}
                  onChange={(e) => setPdvDesconto(Number(e.target.value) || 0)}
                  placeholder="0"
                  className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>
              <div className="flex rounded-lg border border-white/10 overflow-hidden">
                {(["R$", "%"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setPdvDescontoTipo(t)}
                    className={`px-3 py-2 text-xs font-medium ${pdvDescontoTipo === t ? "bg-primary text-primary-foreground" : "bg-white/5 text-muted-foreground"}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Total */}
            <div className="mb-4 flex justify-between rounded-lg border border-primary/30 bg-primary/5 px-4 py-2.5">
              <span className="text-sm font-semibold">Total</span>
              <span className="text-lg font-bold text-primary">
                R$ {calcTotal().toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </span>
            </div>

            {/* Forma de pagamento */}
            <div className="mb-4">
              <label className="block text-xs text-muted-foreground mb-1">Forma de pagamento</label>
              <div className="grid grid-cols-5 gap-1">
                {formasPagamento.map((f) => (
                  <button
                    key={f}
                    onClick={() => setPdvForma(f)}
                    className={`rounded-lg border py-2 text-xs font-medium transition-colors ${
                      pdvForma === f ? "border-primary bg-primary/10 text-primary" : "border-white/10 text-muted-foreground hover:bg-white/5"
                    }`}
                  >
                    {f}
                  </button>
                ))}
              </div>
            </div>

            {/* Parcelas (cartão crédito) */}
            {pdvForma === "Cartão Crédito" && (
              <div className="mb-4">
                <label className="block text-xs text-muted-foreground mb-1">Parcelas</label>
                <div className="flex gap-1 flex-wrap">
                  {[1, 2, 3, 4, 5, 6, 10, 12].map((p) => (
                    <button
                      key={p}
                      onClick={() => setPdvParcelas(p)}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-medium ${
                        pdvParcelas === p ? "border-primary bg-primary/10 text-primary" : "border-white/10 text-muted-foreground"
                      }`}
                    >
                      {p}x {p > 1 ? `R$ ${(calcTotal() / p).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}` : "à vista"}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Dinheiro: valor recebido + troco */}
            {pdvForma === "Dinheiro" && (
              <div className="mb-4 grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Valor recebido</label>
                  <input
                    type="number"
                    value={pdvValorRecebido || ""}
                    onChange={(e) => setPdvValorRecebido(Number(e.target.value) || 0)}
                    placeholder={calcTotal().toFixed(2)}
                    className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground mb-1">Troco</label>
                  <div className="flex h-[38px] items-center rounded-lg border border-white/10 bg-white/5 px-3 text-sm font-semibold text-green-400">
                    R$ {calcTroco().toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            )}

            {/* Misto: múltiplas formas */}
            {pdvForma === "Misto" && (
              <div className="mb-4">
                <p className="text-xs text-muted-foreground mb-2">Distribuir valor entre formas</p>
                <div className="space-y-2">
                  {mistoEntradas.map((e, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <select
                        value={e.forma}
                        onChange={(ev) => {
                          const updated = [...mistoEntradas];
                          updated[i].forma = ev.target.value;
                          setMistoEntradas(updated);
                        }}
                        className="flex-1 rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-xs outline-none focus:border-primary"
                      >
                        {["Dinheiro", "PIX", "Cartão Débito", "Cartão Crédito"].map((f) => (
                          <option key={f}>{f}</option>
                        ))}
                      </select>
                      <input
                        type="number"
                        value={e.valor || ""}
                        onChange={(ev) => {
                          const updated = [...mistoEntradas];
                          updated[i].valor = Number(ev.target.value) || 0;
                          setMistoEntradas(updated);
                        }}
                        placeholder="0,00"
                        className="w-28 rounded-lg border border-white/10 bg-white/5 px-2 py-1.5 text-right text-xs outline-none focus:border-primary"
                      />
                      {mistoEntradas.length > 2 && (
                        <button onClick={() => setMistoEntradas(mistoEntradas.filter((_, j) => j !== i))} className="text-muted-foreground hover:text-red-400">
                          <X className="h-3.5 w-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => setMistoEntradas([...mistoEntradas, { forma: "PIX", valor: 0 }])}
                    className="text-xs text-primary hover:underline"
                  >
                    + Adicionar forma
                  </button>
                  <div className="flex justify-between text-xs pt-1">
                    <span className="text-muted-foreground">Total informado</span>
                    <span className={calcMistoTotal() >= calcTotal() ? "text-green-400" : "text-red-400"}>
                      R$ {calcMistoTotal().toLocaleString("pt-BR", { minimumFractionDigits: 2 })} / R$ {calcTotal().toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Status */}
            <div className="mb-4">
              <label className="block text-xs text-muted-foreground mb-1">Status do pagamento</label>
              <div className="flex gap-2">
                {(["Pago", "Parcial", "Pendente"] as const).map((s) => (
                  <button
                    key={s}
                    onClick={() => setPdvStatus(s)}
                    className={`flex-1 rounded-lg border py-1.5 text-xs font-medium transition-colors ${
                      pdvStatus === s
                        ? s === "Pago" ? "border-green-500/40 bg-green-500/10 text-green-400"
                        : s === "Parcial" ? "border-amber-500/40 bg-amber-500/10 text-amber-400"
                        : "border-red-500/40 bg-red-500/10 text-red-400"
                        : "border-white/10 text-muted-foreground"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Observação */}
            <div className="mb-4">
              <label className="block text-xs text-muted-foreground mb-1">Observação</label>
              <textarea
                value={pdvObs}
                onChange={(e) => setPdvObs(e.target.value)}
                placeholder="Anotação interna sobre o pagamento..."
                rows={2}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm outline-none resize-none focus:border-primary"
              />
            </div>

            {/* Recibo */}
            <div className="mb-4 flex items-center justify-between text-xs text-muted-foreground">
              <span>Recibo nº</span>
              <span className="font-mono text-primary">
                REC-{String(25 + osList.filter((x) => x.recibo !== "—").length).padStart(4, "0")}
              </span>
            </div>

            {/* Ações */}
            <button
              onClick={registrarPagamento}
              className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:brightness-110"
            >
              Registrar pagamento
            </button>

            <div className="flex gap-2 mt-3">
              <button className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-white/10 py-2 text-xs text-muted-foreground hover:bg-white/5">
                <Printer className="h-3.5 w-3.5" /> Imprimir recibo
              </button>
              <button className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-white/10 py-2 text-xs text-green-400 hover:bg-white/5">
                <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
              </button>
              <button className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-white/10 py-2 text-xs text-muted-foreground hover:bg-white/5">
                <Send className="h-3.5 w-3.5" /> E-mail
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════ RECIBO MODAL ═══════ */}
      {showRecibo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-sm rounded-xl border border-white/10 bg-[#111] p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold uppercase tracking-wide">Recibo</h3>
              <button onClick={() => setShowRecibo(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="border border-white/10 rounded-lg p-4 space-y-3">
              <div className="text-center border-b border-dashed border-white/10 pb-3">
                <p className="text-sm font-bold">Demo Oficina</p>
                <p className="text-[10px] text-muted-foreground">CNPJ: 12.345.678/0001-90</p>
                <p className="text-[10px] text-muted-foreground">Rua das Oficinas, 123 — São Paulo</p>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Recibo</span>
                <span className="font-mono text-primary">REC-0024</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Data</span>
                <span>09/04/2026</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Cliente</span>
                <span>Bruno Tavares</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Veículo</span>
                <span>SW4 2020</span>
              </div>
              <div className="border-t border-dashed border-white/10 pt-2">
                <p className="text-[10px] text-muted-foreground mb-1">Serviços</p>
                <div className="flex justify-between text-xs"><span>Funilaria</span><span>R$ 4.200,00</span></div>
                <div className="flex justify-between text-xs"><span>Pintura</span><span>R$ 3.200,00</span></div>
                <div className="flex justify-between text-xs"><span>Polimento</span><span>R$ 800,00</span></div>
              </div>
              <div className="border-t border-dashed border-white/10 pt-2 flex justify-between text-sm font-semibold">
                <span>Total</span>
                <span>R$ 8.200,00</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Pagamento</span>
                <span>PIX</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Status</span>
                <span className="text-green-400 font-medium">Pago</span>
              </div>
            </div>

            <div className="flex gap-2 mt-4">
              <button className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-white/10 py-2 text-xs hover:bg-white/5">
                <Printer className="h-3.5 w-3.5" /> Imprimir
              </button>
              <button className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-white/10 py-2 text-xs text-green-400 hover:bg-white/5">
                <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
              </button>
              <button className="flex-1 flex items-center justify-center gap-1 rounded-lg border border-white/10 py-2 text-xs hover:bg-white/5">
                <Send className="h-3.5 w-3.5" /> E-mail
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════ CAIXA MODAL ═══════ */}
      {showCaixa && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
          <div className="w-full max-w-md max-h-[90vh] overflow-y-auto rounded-xl border border-white/10 bg-[#111] p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold uppercase tracking-wide">Caixa</h3>
                <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${caixa.aberto ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
                  {caixa.aberto ? "Aberto" : "Fechado"}
                </span>
              </div>
              <button onClick={() => setShowCaixa(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Resumo */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { label: "Saldo inicial", value: caixa.saldoInicial },
                { label: "Entradas", value: caixa.entradas, color: "text-green-400" },
                { label: "Saídas/Sangrias", value: caixa.saidas, color: "text-red-400" },
                { label: "Saldo atual", value: caixa.saldoInicial + caixa.entradas - caixa.saidas, color: "text-primary" },
              ].map((m) => (
                <div key={m.label} className="rounded-lg border border-white/10 p-3">
                  <p className="text-[10px] text-muted-foreground">{m.label}</p>
                  <p className={`text-sm font-bold ${m.color || ""}`}>
                    R$ {m.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </p>
                </div>
              ))}
            </div>

            {/* Sangria */}
            <div className="mb-4">
              <p className="text-xs text-muted-foreground mb-2">Registrar sangria</p>
              <div className="flex gap-2">
                <input
                  value={sangriaMotivo}
                  onChange={(e) => setSangriaMotivo(e.target.value)}
                  placeholder="Motivo"
                  className="flex-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-xs outline-none focus:border-primary"
                />
                <input
                  type="number"
                  value={sangriaValor}
                  onChange={(e) => setSangriaValor(e.target.value)}
                  placeholder="Valor"
                  className="w-24 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-right text-xs outline-none focus:border-primary"
                />
                <button
                  onClick={() => {
                    if (!sangriaValor || !sangriaMotivo) return;
                    setCaixa((prev) => ({
                      ...prev,
                      saidas: prev.saidas + Number(sangriaValor),
                      sangrias: [...prev.sangrias, { motivo: sangriaMotivo, valor: Number(sangriaValor), hora: new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }) }],
                    }));
                    setSangriaValor("");
                    setSangriaMotivo("");
                  }}
                  className="rounded-lg bg-red-500/10 px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-red-500/20"
                >
                  <ArrowUpDown className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Histórico */}
            <div className="mb-4">
              <p className="text-xs text-muted-foreground mb-2">Movimentações</p>
              <div className="space-y-1 max-h-40 overflow-y-auto">
                {caixa.reforcos.map((r, i) => (
                  <div key={`r${i}`} className="flex justify-between text-xs py-1 border-b border-white/5">
                    <span className="text-green-400">Reforço — {r.hora}</span>
                    <span className="text-green-400">+ R$ {r.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                  </div>
                ))}
                {caixa.sangrias.map((s, i) => (
                  <div key={`s${i}`} className="flex justify-between text-xs py-1 border-b border-white/5">
                    <span className="text-red-400">{s.motivo} — {s.hora}</span>
                    <span className="text-red-400">- R$ {s.valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Fechar caixa */}
            <button
              onClick={() => setCaixa((prev) => ({ ...prev, aberto: !prev.aberto }))}
              className={`w-full rounded-lg py-2 text-sm font-semibold ${
                caixa.aberto
                  ? "bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20"
                  : "bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500/20"
              }`}
            >
              {caixa.aberto ? "Fechar caixa" : "Abrir caixa"}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default DemoFinanceiro;
