import { useEffect, useState } from "react";
import { Check, Plus } from "lucide-react";

/* ---------------- MOCKUP 1: Cadastrar veículo ---------------- */
const PLACA = "GHJ-4F52";
const MODELO = "BMW Série 3";

const MockCadastro = () => {
  const [placa, setPlaca] = useState("");
  const [modelo, setModelo] = useState("");
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      while (!cancelled) {
        setPlaca(""); setModelo(""); setPulse(false);
        await wait(400);
        for (let i = 1; i <= PLACA.length && !cancelled; i++) {
          setPlaca(PLACA.slice(0, i));
          await wait(110);
        }
        await wait(300);
        for (let i = 1; i <= MODELO.length && !cancelled; i++) {
          setModelo(MODELO.slice(0, i));
          await wait(70);
        }
        if (cancelled) return;
        await wait(300);
        setPulse(true);
        await wait(1200);
      }
    };
    run();
    return () => { cancelled = true; };
  }, []);

  return (
    <MockShell>
      <div className="space-y-2.5">
        <Field label="Placa">
          <span className="font-mono tracking-wider">{placa}</span>
          <span className="ml-0.5 inline-block h-3 w-px animate-blink bg-primary align-middle" />
        </Field>
        <Field label="Modelo">
          <span>{modelo}</span>
        </Field>
        <button
          className={`mt-2 inline-flex items-center gap-1.5 rounded-md bg-primary px-2.5 py-1.5 text-[11px] font-semibold text-primary-foreground transition ${
            pulse ? "animate-pulse-soft shadow-[0_0_0_4px_hsl(var(--primary)/0.25)]" : "opacity-70"
          }`}
        >
          <Plus className="h-3 w-3" /> Criar OS
        </button>
      </div>
    </MockShell>
  );
};

/* ---------------- MOCKUP 2: Criar orçamento ---------------- */
const ORCAMENTO = [
  { nome: "Funilaria", valor: 850 },
  { nome: "Preparação", valor: 320 },
  { nome: "Pintura", valor: 1200 },
];

const MockOrcamento = () => {
  const [visiveis, setVisiveis] = useState(0);
  const [mostrarTotal, setMostrarTotal] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      while (!cancelled) {
        setVisiveis(0); setMostrarTotal(false);
        await wait(400);
        for (let i = 1; i <= ORCAMENTO.length && !cancelled; i++) {
          setVisiveis(i);
          await wait(700);
        }
        await wait(300);
        setMostrarTotal(true);
        await wait(1800);
      }
    };
    run();
    return () => { cancelled = true; };
  }, []);

  const total = ORCAMENTO.reduce((s, i) => s + i.valor, 0);

  return (
    <MockShell>
      <div className="space-y-1.5">
        {ORCAMENTO.map((item, i) => (
          <div
            key={item.nome}
            className={`flex items-center justify-between rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1.5 text-[11px] ${
              i < visiveis ? "animate-slide-in-right opacity-100" : "opacity-0"
            }`}
          >
            <span className="text-gray-500">{item.nome}</span>
            <span className="font-semibold text-gray-900">R$ {item.valor.toLocaleString("pt-BR")}</span>
          </div>
        ))}
        <div className={`mt-2 flex items-center justify-between border-t border-gray-200 pt-2 text-[11px] font-bold transition-opacity duration-300 ${mostrarTotal ? "opacity-100" : "opacity-0"}`}>
          <span className="text-gray-900">Total</span>
          <span className="text-primary">R$ {total.toLocaleString("pt-BR")}</span>
        </div>
      </div>
    </MockShell>
  );
};

/* ---------------- MOCKUP 3: Acompanhar serviço ---------------- */
const ETAPAS = ["Receb.", "Avaliação", "Funilaria", "Pintura", "Polimento", "Entrega"];

const MockAcompanhar = () => {
  const [completas, setCompletas] = useState(0); // quantos check verdes
  const [funilaria, setFunilaria] = useState(0);
  const [pintura, setPintura] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      while (!cancelled) {
        setCompletas(0); setFunilaria(0); setPintura(0);
        await wait(400);
        for (let i = 1; i <= 3 && !cancelled; i++) {
          setCompletas(i);
          await wait(800);
        }
        // barras avançam suavemente em paralelo
        const start = Date.now();
        const dur = 2200;
        while (!cancelled) {
          const t = Math.min(1, (Date.now() - start) / dur);
          setFunilaria(t * 65);
          setPintura(t * 30);
          if (t >= 1) break;
          await wait(40);
        }
        await wait(900);
      }
    };
    run();
    return () => { cancelled = true; };
  }, []);

  return (
    <MockShell>
      <div className="space-y-3">
        {/* Tracker */}
        <div className="flex items-center justify-between">
          {ETAPAS.map((_, i) => {
            const done = i < completas;
            const active = i === 3 && completas >= 3;
            return (
              <div key={i} className="flex flex-1 items-center">
                <div
                  className={`flex h-5 w-5 items-center justify-center rounded-full border text-[9px] font-bold transition-all duration-300 ${
                    done
                      ? "border-green-500 bg-green-500 text-white"
                      : active
                      ? "animate-pulse-ring border-primary bg-primary text-primary-foreground"
                      : "border-gray-300 bg-gray-100 text-gray-400"
                  }`}
                >
                  {done ? <Check className="h-3 w-3" /> : i + 1}
                </div>
                {i < ETAPAS.length - 1 && (
                  <div className={`h-px flex-1 ${i < completas - 1 ? "bg-green-500" : "bg-gray-200"}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Barras */}
        <div className="space-y-2">
          <ProgressRow label="Funilaria" pct={funilaria} />
          <ProgressRow label="Pintura" pct={pintura} />
        </div>
      </div>
    </MockShell>
  );
};

const ProgressRow = ({ label, pct }: { label: string; pct: number }) => (
  <div>
    <div className="mb-0.5 flex items-center justify-between text-[10px]">
      <span className="text-gray-500">{label}</span>
      <span className="font-semibold text-gray-900">{Math.round(pct)}%</span>
    </div>
    <div className="h-1.5 overflow-hidden rounded-full bg-gray-200">
      <div
        className="h-full rounded-full bg-primary transition-[width] duration-100 ease-linear"
        style={{ width: `${pct}%` }}
      />
    </div>
  </div>
);

/* ---------------- MOCKUP 4: Finalizar e receber ---------------- */
const MockFinalizar = () => {
  const [showPix, setShowPix] = useState(false);
  const [confirmado, setConfirmado] = useState(false);
  const [finalizado, setFinalizado] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      while (!cancelled) {
        setShowPix(false); setConfirmado(false); setFinalizado(false);
        await wait(500);
        setShowPix(true);
        await wait(1100);
        setConfirmado(true);
        await wait(800);
        setFinalizado(true);
        await wait(1500);
      }
    };
    run();
    return () => { cancelled = true; };
  }, []);

  return (
    <MockShell>
      <div className="space-y-2.5">
        <div className="rounded-md border border-gray-200 bg-gray-50 p-2.5">
          <p className="text-[10px] uppercase tracking-wide text-gray-500">Total</p>
          <p className="text-lg font-extrabold text-gray-900">R$ 2.370</p>
        </div>
        <div className={`transition-all duration-300 ${showPix ? "opacity-100" : "opacity-0"}`}>
          <span className="inline-flex items-center gap-1 rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
            PIX
          </span>
        </div>
        {!finalizado ? (
          <button
            className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-[11px] font-semibold transition ${
              confirmado
                ? "bg-green-500 text-white"
                : "bg-primary text-primary-foreground"
            }`}
          >
            {confirmado ? <Check className="h-3 w-3" /> : null}
            {confirmado ? "Confirmado" : "Confirmar"}
          </button>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full border border-green-500/40 bg-green-500/10 px-2.5 py-1 text-[11px] font-semibold text-green-600 animate-scale-in">
            <Check className="h-3 w-3" /> Finalizado
          </span>
        )}
      </div>
    </MockShell>
  );
};

/* ---------------- Helpers ---------------- */
const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

const MockShell = ({ children }: { children: React.ReactNode }) => (
  <div className="mock-light mb-5 h-[200px] overflow-hidden rounded-xl border border-gray-200 bg-white p-4 text-gray-900 shadow-inner">
    {children}
  </div>
);

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="rounded-md border border-gray-200 bg-gray-50 px-2.5 py-1.5">
    <p className="text-[9px] uppercase tracking-wide text-gray-500">{label}</p>
    <p className="text-xs font-semibold text-gray-900">{children}</p>
  </div>
);

/* ---------------- Section ---------------- */
const steps = [
  {
    num: "01",
    title: "Cadastre o veículo",
    description: "Registre o carro com fotos, dados do cliente e descrição do problema. Tudo em menos de 2 minutos.",
    Mock: MockCadastro,
  },
  {
    num: "02",
    title: "Crie o orçamento",
    description: "Adicione peças, mão de obra e prazos. Envie para aprovação do cliente por WhatsApp ou email.",
    Mock: MockOrcamento,
  },
  {
    num: "03",
    title: "Acompanhe o serviço",
    description: "Atualize o status em tempo real. Funilaria, preparação, pintura, polimento. Cada etapa registrada.",
    Mock: MockAcompanhar,
  },
  {
    num: "04",
    title: "Finalize e receba",
    description: "Gere a nota, registre o pagamento e encerre a OS. Histórico completo salvo automaticamente.",
    Mock: MockFinalizar,
  },
];

const HowItWorks = () => {
  return (
    <section id="como-funciona" className="py-24">
      <style>{`
        @keyframes blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
        .animate-blink { animation: blink 1s steps(1) infinite; }

        @keyframes pulse-soft {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 hsl(var(--primary) / 0.5); }
          50% { transform: scale(1.04); box-shadow: 0 0 0 8px hsl(var(--primary) / 0); }
        }
        .animate-pulse-soft { animation: pulse-soft 1.2s ease-in-out infinite; }

        @keyframes pulse-ring {
          0%, 100% { box-shadow: 0 0 0 0 hsl(var(--primary) / 0.6); }
          50% { box-shadow: 0 0 0 6px hsl(var(--primary) / 0); }
        }
        .animate-pulse-ring { animation: pulse-ring 1.4s ease-in-out infinite; }
      `}</style>

      <div className="container mx-auto max-w-[1280px] px-6 lg:px-8">
        <div className="mb-6 max-w-2xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
            Como funciona
          </p>
          <h2 className="mb-4 text-3xl font-extrabold sm:text-4xl">
            Simples como deve ser
          </h2>
          <p className="text-muted-foreground">
            Você não precisa ser expert em tecnologia. O sistema foi feito para ser usado no dia a dia da oficina.
          </p>
        </div>

        <div className="mt-12 grid max-w-6xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <div key={i} className="relative">
              <step.Mock />
              <div className="mb-3 flex items-end gap-2">
                <span className="text-6xl font-bold text-white/20 leading-none">{step.num}</span>
                {i < steps.length - 1 && (
                  <div className="mb-3 hidden h-px flex-1 bg-white/10 lg:block" />
                )}
              </div>
              <h3 className="mb-2 text-base font-semibold text-foreground">{step.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
