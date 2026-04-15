import { useState, useEffect } from "react";

/**
 * Simulated screen recording for the Orçamentos module.
 * Animates through key interactions: clicking pipeline stages, viewing OS details, advancing status.
 */

/* ───── Animation steps ───── */
interface Step {
  label: string;
  activeStage: number;
  cursor: { x: number; y: number };
  showDetail: boolean;
  highlightRow: number | null;
  statusChange: boolean;
}

const steps: Step[] = [
  { label: "Visualizando pipeline", activeStage: 0, cursor: { x: 15, y: 25 }, showDetail: false, highlightRow: null, statusChange: false },
  { label: "Clicando em 'Orçado'", activeStage: 1, cursor: { x: 30, y: 25 }, showDetail: false, highlightRow: null, statusChange: false },
  { label: "Visualizando OS orçadas", activeStage: 1, cursor: { x: 30, y: 50 }, showDetail: false, highlightRow: 0, statusChange: false },
  { label: "Abrindo detalhes da OS", activeStage: 1, cursor: { x: 50, y: 50 }, showDetail: true, highlightRow: 0, statusChange: false },
  { label: "Avançando etapa", activeStage: 1, cursor: { x: 80, y: 65 }, showDetail: true, highlightRow: 0, statusChange: true },
  { label: "OS movida para 'Aprovado'", activeStage: 2, cursor: { x: 45, y: 25 }, showDetail: false, highlightRow: null, statusChange: false },
  { label: "Clicando em 'Pagamento'", activeStage: 5, cursor: { x: 72, y: 25 }, showDetail: false, highlightRow: null, statusChange: false },
  { label: "Abrindo PDV", activeStage: 5, cursor: { x: 50, y: 55 }, showDetail: false, highlightRow: 0, statusChange: false },
];

const stages = ["Enviado", "Orçado", "Aprovado", "Ag. Carro", "Atendim.", "Pagamento", "Finaliz.", "Recusado"];
const stageCounts = [1, 3, 2, 1, 4, 2, 2, 1];

const SimulatedScreenOrcamentos = () => {
  const [stepIndex, setStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    const timer = setInterval(() => {
      setStepIndex((prev) => (prev + 1) % steps.length);
    }, 2200);
    return () => clearInterval(timer);
  }, [isPlaying]);

  const step = steps[stepIndex];

  return (
    <div
      className="relative w-full aspect-video rounded-xl border border-white/10 bg-[#0a0a0a] overflow-hidden select-none"
      onClick={() => setIsPlaying(!isPlaying)}
    >
      {/* Fake browser chrome */}
      <div className="flex items-center gap-1.5 bg-[#1a1a1a] px-3 py-1.5 border-b border-white/10">
        <div className="flex gap-1">
          <div className="h-2 w-2 rounded-full bg-red-400/60" />
          <div className="h-2 w-2 rounded-full bg-yellow-400/60" />
          <div className="h-2 w-2 rounded-full bg-green-400/60" />
        </div>
        <div className="ml-3 flex-1 rounded bg-white/5 px-2 py-0.5 text-[8px] text-muted-foreground">
          onficina.com.br/admin
        </div>
        <div className="flex items-center gap-1">
          <div className={`h-1.5 w-1.5 rounded-full ${isPlaying ? "bg-red-400 animate-pulse" : "bg-muted-foreground"}`} />
          <span className="text-[7px] text-muted-foreground">{isPlaying ? "REC" : "PAUSED"}</span>
        </div>
      </div>

      {/* Fake header */}
      <div className="flex items-center gap-2 bg-[#111] px-3 py-1.5 border-b border-white/10">
        <span className="text-[9px] font-bold"><span className="text-primary">ON</span>ficina</span>
        <span className="text-[7px] text-muted-foreground">Painel Admin</span>
      </div>

      {/* Fake nav tabs */}
      <div className="flex gap-0.5 bg-[#111] px-3 py-1 border-b border-white/10">
        {["Orçamentos", "Serviços", "Colaboradores", "Agenda", "Veículos", "Em Atend.", "Financeiro", "Relatórios"].map((tab, i) => (
          <div key={tab} className={`px-1.5 py-0.5 text-[6px] rounded ${i === 0 ? "text-primary border-b border-primary" : "text-muted-foreground"}`}>
            {tab}
          </div>
        ))}
      </div>

      {/* Pipeline cards */}
      <div className="flex gap-1 px-3 py-2">
        {stages.map((s, i) => {
          const isActive = step.activeStage === i;
          const count = i === step.activeStage && step.statusChange ? stageCounts[i] - 1 : stageCounts[i];
          return (
            <div
              key={s}
              className={`flex-1 rounded py-1.5 text-center transition-all duration-500 ${
                isActive
                  ? "border border-primary/40 bg-primary/5"
                  : "border border-white/10 bg-white/[0.02]"
              }`}
            >
              <div className={`text-[10px] font-bold ${isActive ? "text-primary" : "text-foreground"}`}>
                {count}
              </div>
              <div className="text-[6px] text-muted-foreground">{s}</div>
            </div>
          );
        })}
      </div>

      {/* Stage title */}
      <div className="px-3 py-1">
        <span className="text-[8px] font-bold uppercase tracking-wide">
          {stages[step.activeStage]} ({stageCounts[step.activeStage]})
        </span>
      </div>

      {/* Fake OS rows */}
      <div className="px-3 space-y-0.5">
        {[
          { os: "OS-0149", nome: "João Lucas", veiculo: "HB20 2023", valor: "R$ 2.400,00" },
          { os: "OS-0148", nome: "Ana Paula", veiculo: "Corolla 2021", valor: "R$ 1.800,00" },
          { os: "OS-0147", nome: "Carlos Mendes", veiculo: "Civic 2022", valor: "R$ 3.200,00" },
        ].map((row, i) => (
          <div
            key={row.os}
            className={`flex items-center justify-between rounded px-2 py-1.5 transition-all duration-300 ${
              step.highlightRow === i
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

      {/* Detail overlay */}
      {step.showDetail && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40">
          <div className="w-[55%] rounded-lg border border-white/10 bg-[#111] p-3 shadow-2xl">
            <div className="flex justify-between mb-2">
              <span className="text-[9px] font-bold">OS-0149 — João Lucas</span>
              <span className="text-[8px] text-muted-foreground">✕</span>
            </div>
            <div className="space-y-1 mb-2">
              <div className="flex justify-between text-[7px]"><span>Funilaria</span><span>R$ 1.200,00</span></div>
              <div className="flex justify-between text-[7px]"><span>Pintura</span><span>R$ 800,00</span></div>
              <div className="flex justify-between text-[7px] border-t border-white/10 pt-1 font-semibold"><span>Total</span><span>R$ 2.400,00</span></div>
            </div>
            {step.statusChange ? (
              <div className="rounded bg-green-500/10 border border-green-500/20 px-2 py-1 text-center">
                <span className="text-[7px] text-green-400 font-medium">✓ Status avançado para Aprovado</span>
              </div>
            ) : (
              <div className="flex gap-1">
                <div className="flex-1 rounded bg-primary/10 border border-primary/20 px-2 py-1 text-center">
                  <span className="text-[7px] text-primary font-medium">Enviar orçamento</span>
                </div>
                <div className="flex-1 rounded bg-white/5 border border-white/10 px-2 py-1 text-center">
                  <span className="text-[7px] text-muted-foreground">Avançar etapa →</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Animated cursor */}
      <div
        className="absolute w-3 h-3 pointer-events-none transition-all duration-700 ease-in-out z-20"
        style={{ left: `${step.cursor.x}%`, top: `${step.cursor.y}%` }}
      >
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M1 1L5 11L6.5 6.5L11 5L1 1Z" fill="white" stroke="black" strokeWidth="0.5" />
        </svg>
      </div>

      {/* Step label */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full bg-black/70 border border-white/10 px-3 py-1">
        <span className="text-[8px] text-muted-foreground">{step.label}</span>
      </div>

      {/* Progress dots */}
      <div className="absolute bottom-2 right-3 flex gap-0.5">
        {steps.map((_, i) => (
          <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i === stepIndex ? "w-3 bg-primary" : "w-1 bg-white/20"}`} />
        ))}
      </div>
    </div>
  );
};

export default SimulatedScreenOrcamentos;
