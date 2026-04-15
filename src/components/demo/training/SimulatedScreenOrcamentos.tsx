import { useState, useEffect } from "react";

/**
 * Each topic index maps to a sequence of animation frames
 * that visually demonstrate that specific feature.
 */

interface AnimFrame {
  cursor: { x: number; y: number };
  activeStage: number;
  highlightRow: number | null;
  overlay: null | "detail" | "advance" | "send-link" | "approval";
  label: string;
}

/* ───── Animations per topic ───── */
const topicAnimations: Record<number, AnimFrame[]> = {
  // 0: Entendendo a Pipeline
  0: [
    { cursor: { x: 10, y: 30 }, activeStage: 0, highlightRow: null, overlay: null, label: "Pipeline com 8 estágios" },
    { cursor: { x: 25, y: 30 }, activeStage: 1, highlightRow: null, overlay: null, label: "Cada card mostra a quantidade" },
    { cursor: { x: 42, y: 30 }, activeStage: 2, highlightRow: null, overlay: null, label: "Navegue pelos estágios" },
    { cursor: { x: 58, y: 30 }, activeStage: 4, highlightRow: null, overlay: null, label: "Acompanhe o fluxo completo" },
    { cursor: { x: 78, y: 30 }, activeStage: 6, highlightRow: null, overlay: null, label: "Até Finalizados ou Recusado" },
  ],
  // 1: Filtrando por estágio
  1: [
    { cursor: { x: 10, y: 30 }, activeStage: 0, highlightRow: null, overlay: null, label: "Clique no card 'Enviado'" },
    { cursor: { x: 10, y: 30 }, activeStage: 0, highlightRow: 0, overlay: null, label: "Lista filtrada: 1 OS" },
    { cursor: { x: 25, y: 30 }, activeStage: 1, highlightRow: null, overlay: null, label: "Agora clique em 'Orçado'" },
    { cursor: { x: 25, y: 30 }, activeStage: 1, highlightRow: 0, overlay: null, label: "3 OS nesse estágio" },
    { cursor: { x: 25, y: 30 }, activeStage: 1, highlightRow: 1, overlay: null, label: "Card selecionado fica destacado" },
  ],
  // 2: Respondendo um orçamento
  2: [
    { cursor: { x: 10, y: 30 }, activeStage: 0, highlightRow: null, overlay: null, label: "OS na etapa 'Enviado'" },
    { cursor: { x: 40, y: 55 }, activeStage: 0, highlightRow: 0, overlay: null, label: "Clique na OS para abrir" },
    { cursor: { x: 50, y: 50 }, activeStage: 0, highlightRow: 0, overlay: "detail", label: "Defina serviços e valores" },
    { cursor: { x: 60, y: 65 }, activeStage: 0, highlightRow: 0, overlay: "send-link", label: "Envie proposta por WhatsApp ou e-mail" },
  ],
  // 3: Avançando etapas
  3: [
    { cursor: { x: 25, y: 30 }, activeStage: 1, highlightRow: 0, overlay: null, label: "OS na etapa 'Orçado'" },
    { cursor: { x: 85, y: 55 }, activeStage: 1, highlightRow: 0, overlay: null, label: "Clique no botão avançar →" },
    { cursor: { x: 50, y: 50 }, activeStage: 1, highlightRow: 0, overlay: "advance", label: "Confirmando avanço de etapa" },
    { cursor: { x: 42, y: 30 }, activeStage: 2, highlightRow: null, overlay: null, label: "OS movida para 'Aprovado'" },
  ],
  // 4: Enviando link de aprovação
  4: [
    { cursor: { x: 25, y: 30 }, activeStage: 1, highlightRow: null, overlay: null, label: "Na etapa 'Orçado'" },
    { cursor: { x: 40, y: 55 }, activeStage: 1, highlightRow: 0, overlay: null, label: "Selecione a OS" },
    { cursor: { x: 50, y: 50 }, activeStage: 1, highlightRow: 0, overlay: "approval", label: "Gere o link de aprovação" },
    { cursor: { x: 65, y: 65 }, activeStage: 1, highlightRow: 0, overlay: "approval", label: "Envie ao cliente — ele aprova sem login" },
  ],
};

const stages = ["Enviado", "Orçado", "Aprovado", "Ag. Carro", "Atendim.", "Pagamento", "Finaliz.", "Recusado"];
const stageCounts = [1, 3, 2, 1, 4, 2, 2, 1];

const osRows = [
  { os: "OS-0149", nome: "João Lucas", veiculo: "HB20 2023", valor: "R$ 2.400,00" },
  { os: "OS-0148", nome: "Ana Paula", veiculo: "Corolla 2021", valor: "R$ 1.800,00" },
  { os: "OS-0147", nome: "Carlos Mendes", veiculo: "Civic 2022", valor: "R$ 3.200,00" },
];

interface Props {
  activeTopicIndex: number | null;
}

const SimulatedScreenOrcamentos = ({ activeTopicIndex }: Props) => {
  const [frameIndex, setFrameIndex] = useState(0);

  const frames = activeTopicIndex !== null ? topicAnimations[activeTopicIndex] || topicAnimations[0] : topicAnimations[0];
  const frame = frames[frameIndex % frames.length];

  useEffect(() => {
    setFrameIndex(0);
  }, [activeTopicIndex]);

  useEffect(() => {
    const timer = setInterval(() => {
      setFrameIndex((prev) => (prev + 1) % frames.length);
    }, 2000);
    return () => clearInterval(timer);
  }, [frames.length, activeTopicIndex]);

  return (
    <div className="relative w-full aspect-video rounded-xl border border-white/10 bg-[#0a0a0a] overflow-hidden select-none">
      {/* Browser chrome */}
      <div className="flex items-center gap-1.5 bg-[#1a1a1a] px-3 py-1.5 border-b border-white/10">
        <div className="flex gap-1">
          <div className="h-2 w-2 rounded-full bg-[#ff5f57]" />
          <div className="h-2 w-2 rounded-full bg-[#ffbd2e]" />
          <div className="h-2 w-2 rounded-full bg-[#28c840]" />
        </div>
        <div className="ml-3 flex-1 rounded bg-white/5 px-2 py-0.5 text-[8px] text-muted-foreground">
          onficina.com.br/admin
        </div>
        <div className="flex items-center gap-1">
          <div className="h-1.5 w-1.5 rounded-full bg-red-400 animate-pulse" />
          <span className="text-[7px] text-muted-foreground">REC</span>
        </div>
      </div>

      {/* Header */}
      <div className="flex items-center gap-2 bg-[#111] px-3 py-1.5 border-b border-white/10">
        <span className="text-[9px] font-bold"><span className="text-primary">ON</span>ficina</span>
        <span className="text-[7px] text-muted-foreground">Painel Admin</span>
      </div>

      {/* Nav tabs */}
      <div className="flex gap-0.5 bg-[#111] px-3 py-1 border-b border-white/10">
        {["Orçamentos", "Serviços", "Colaboradores", "Agenda", "Veículos", "Em Atend.", "Financeiro", "Relatórios"].map((tab, i) => (
          <div key={tab} className={`px-1.5 py-0.5 text-[6px] rounded ${i === 0 ? "text-primary border-b border-primary" : "text-muted-foreground"}`}>
            {tab}
          </div>
        ))}
      </div>

      {/* Pipeline cards */}
      <div className="flex gap-1 px-3 py-2">
        {stages.map((s, i) => (
          <div
            key={s}
            className={`flex-1 rounded py-1.5 text-center transition-all duration-500 ${
              frame.activeStage === i
                ? "border border-primary/40 bg-primary/5"
                : "border border-white/10 bg-white/[0.02]"
            }`}
          >
            <div className={`text-[10px] font-bold ${frame.activeStage === i ? "text-primary" : "text-foreground"}`}>
              {stageCounts[i]}
            </div>
            <div className="text-[6px] text-muted-foreground">{s}</div>
          </div>
        ))}
      </div>

      {/* Stage title */}
      <div className="px-3 py-1">
        <span className="text-[8px] font-bold uppercase tracking-wide">
          {stages[frame.activeStage]} ({stageCounts[frame.activeStage]})
        </span>
      </div>

      {/* OS rows */}
      <div className="px-3 space-y-0.5">
        {osRows.map((row, i) => (
          <div
            key={row.os}
            className={`flex items-center justify-between rounded px-2 py-1.5 transition-all duration-300 ${
              frame.highlightRow === i
                ? "bg-white/[0.06] border border-primary/20"
                : "border border-white/5"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-[8px] font-semibold text-primary">{row.os}</span>
              <span className="text-[8px]">{row.nome}</span>
              <span className="text-[6px] text-muted-foreground">{row.veiculo}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[7px] text-muted-foreground">{row.valor}</span>
              <span className="text-[8px] text-muted-foreground">→</span>
            </div>
          </div>
        ))}
      </div>

      {/* ───── Overlays ───── */}
      {frame.overlay === "detail" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <div className="w-[55%] rounded-lg border border-white/10 bg-[#111] p-3 shadow-2xl">
            <div className="flex justify-between mb-2">
              <span className="text-[9px] font-bold">OS-0149 — João Lucas</span>
              <span className="text-[8px] text-muted-foreground cursor-pointer">✕</span>
            </div>
            <div className="space-y-1 mb-2">
              <div className="flex justify-between text-[7px]"><span>Funilaria</span><span>R$ 1.200,00</span></div>
              <div className="flex justify-between text-[7px]"><span>Pintura</span><span>R$ 800,00</span></div>
              <div className="flex justify-between text-[7px]"><span>Polimento</span><span>R$ 400,00</span></div>
              <div className="flex justify-between text-[7px] border-t border-white/10 pt-1 font-semibold"><span>Total</span><span>R$ 2.400,00</span></div>
            </div>
            <div className="flex gap-1">
              <div className="flex-1 rounded bg-primary/10 border border-primary/20 px-2 py-1 text-center">
                <span className="text-[7px] text-primary font-medium">Enviar orçamento</span>
              </div>
              <div className="flex-1 rounded bg-white/5 border border-white/10 px-2 py-1 text-center">
                <span className="text-[7px] text-muted-foreground">Avançar etapa →</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {frame.overlay === "send-link" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <div className="w-[50%] rounded-lg border border-white/10 bg-[#111] p-3 shadow-2xl">
            <span className="text-[9px] font-bold block mb-2">Enviar proposta</span>
            <div className="space-y-1.5 mb-3">
              <div className="rounded border border-white/10 px-2 py-1">
                <span className="text-[6px] text-muted-foreground">Cliente</span>
                <span className="text-[7px] block">João Lucas — (11) 99123-4567</span>
              </div>
              <div className="rounded border border-white/10 px-2 py-1">
                <span className="text-[6px] text-muted-foreground">Valor</span>
                <span className="text-[7px] block font-semibold">R$ 2.400,00</span>
              </div>
            </div>
            <div className="flex gap-1">
              <div className="flex-1 rounded bg-green-500/10 border border-green-500/20 px-2 py-1 text-center">
                <span className="text-[7px] text-green-400 font-medium">WhatsApp</span>
              </div>
              <div className="flex-1 rounded bg-white/5 border border-white/10 px-2 py-1 text-center">
                <span className="text-[7px] text-muted-foreground">E-mail</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {frame.overlay === "advance" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <div className="w-[45%] rounded-lg border border-white/10 bg-[#111] p-3 shadow-2xl text-center">
            <span className="text-[9px] font-bold block mb-1">Avançar etapa</span>
            <span className="text-[7px] text-muted-foreground block mb-3">Mover OS-0149 de Orçado → Aprovado?</span>
            <div className="flex gap-1">
              <div className="flex-1 rounded bg-white/5 border border-white/10 px-2 py-1">
                <span className="text-[7px] text-muted-foreground">Cancelar</span>
              </div>
              <div className="flex-1 rounded bg-primary/10 border border-primary/20 px-2 py-1">
                <span className="text-[7px] text-primary font-medium">Confirmar →</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {frame.overlay === "approval" && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <div className="w-[50%] rounded-lg border border-white/10 bg-[#111] p-3 shadow-2xl">
            <span className="text-[9px] font-bold block mb-2">Link de aprovação</span>
            <div className="rounded border border-white/10 bg-white/5 px-2 py-1.5 mb-2">
              <span className="text-[7px] font-mono text-primary break-all">onficina.com.br/aprovar/a3f2...</span>
            </div>
            <span className="text-[6px] text-muted-foreground block mb-2">O cliente aprova ou recusa sem precisar de login</span>
            <div className="flex gap-1">
              <div className="flex-1 rounded bg-green-500/10 border border-green-500/20 px-2 py-1 text-center">
                <span className="text-[7px] text-green-400 font-medium">Enviar WhatsApp</span>
              </div>
              <div className="flex-1 rounded bg-white/5 border border-white/10 px-2 py-1 text-center">
                <span className="text-[7px] text-muted-foreground">Copiar link</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cursor */}
      <div
        className="absolute w-3 h-3 pointer-events-none transition-all duration-700 ease-in-out z-20"
        style={{ left: `${frame.cursor.x}%`, top: `${frame.cursor.y}%` }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M1 1L5 11L6.5 6.5L11 5L1 1Z" fill="white" stroke="black" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Step label */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/70 border border-white/10 px-3 py-1">
        <span className="text-[8px] text-muted-foreground">{frame.label}</span>
      </div>

      {/* Progress dots */}
      <div className="absolute bottom-2 right-3 flex gap-0.5">
        {frames.map((_, i) => (
          <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === frameIndex % frames.length ? "w-3 bg-primary" : "w-1 bg-white/20"}`} />
        ))}
      </div>
    </div>
  );
};

export default SimulatedScreenOrcamentos;
