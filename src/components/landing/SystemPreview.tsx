import { useEffect, useRef, useState } from "react";
import { Check, Clock, Loader2 } from "lucide-react";

const SystemPreview = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const enterStyle = (delay: number, distance: number) => ({
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : `translateY(${distance}px)`,
    transition: `opacity 0.6s ease-out ${delay}ms, transform 0.6s ease-out ${delay}ms`,
  });

  return (
    <section ref={sectionRef} className="bg-[#0a0a0a] py-24">
      <div className="container mx-auto max-w-[1280px] px-6 lg:px-8">
        <div className="mb-16 text-center">
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
            O sistema por dentro
          </p>
          <h2 className="mb-4 text-3xl font-extrabold sm:text-4xl">
            Veja como funciona na prática
          </h2>
          <p className="text-muted-foreground">
            Cada funcionalidade pensada para o dia a dia da sua oficina
          </p>
        </div>

        <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-start lg:justify-center lg:gap-6">
          {/* MOCKUP 2 — Pipeline (esquerda no desktop) */}
          <div
            className="order-2 w-full max-w-sm lg:order-1 lg:w-[340px] lg:translate-y-6 lg:rotate-[1.5deg]"
            style={enterStyle(150, 40)}
          >
            <MockupPipeline />
            <MockupLabel
              tag="Pipeline de OS"
              tagColor="bg-primary/15 text-primary"
              text="Da abertura à entrega, tudo visível em um lugar"
            />
          </div>

          {/* MOCKUP 1 — ServiçoAo Vivo (centro, destaque) */}
          <div
            className="order-1 w-full max-w-sm lg:order-2 lg:-mt-4 lg:w-[360px] lg:rotate-[-2deg]"
            style={enterStyle(0, 30)}
          >
            <MockupServicoAoVivo />
            <MockupLabel
              tag="ServiçoAo Vivo"
              tagColor="bg-primary/15 text-primary"
              text="O cliente acompanha em tempo real pelo celular"
            />
          </div>

          {/* MOCKUP 3 — Pátio (direita) */}
          <div
            className="order-3 w-full max-w-sm lg:w-[340px] lg:translate-y-4 lg:rotate-[-1deg]"
            style={enterStyle(300, 40)}
          >
            <MockupPatio />
            <MockupLabel
              tag="Pro"
              tagColor="bg-purple-500/15 text-purple-400"
              extraTag="Gestão de Pátio"
              text="Veja onde está cada carro agora"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

/* ───── Label compartilhado ───── */
const MockupLabel = ({
  tag,
  tagColor,
  extraTag,
  text,
}: {
  tag: string;
  tagColor: string;
  extraTag?: string;
  text: string;
}) => (
  <div className="mt-5 flex flex-col items-center gap-1.5 text-center lg:rotate-0">
    <div className="flex items-center gap-2">
      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${tagColor}`}>
        {tag}
      </span>
      {extraTag && (
        <span className="rounded-full bg-primary/15 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">
          {extraTag}
        </span>
      )}
    </div>
    <p className="max-w-[260px] text-xs text-muted-foreground">{text}</p>
  </div>
);

/* ─────────────────────────────────────
   MOCKUP 1 — ServiçoAo Vivo (mobile)
   ───────────────────────────────────── */
const MockupServicoAoVivo = () => {
  const stages = [
    { label: "Aberta", state: "done" },
    { label: "Alocado", state: "done" },
    { label: "Aguardando", state: "done" },
    { label: "Em serviço", state: "active" },
    { label: "Pagamento", state: "pending" },
    { label: "Entrega", state: "pending" },
  ];

  return (
    <div
      className="overflow-hidden rounded-[28px] border border-white/10 bg-white"
      style={{ boxShadow: "0 20px 60px rgba(232,85,0,0.18)" }}
    >
      {/* Status bar mobile */}
      <div className="flex items-center justify-between bg-white px-5 pt-3 pb-1.5 text-[10px] font-semibold text-gray-900">
        <span>9:41</span>
        <div className="flex items-center gap-1">
          <span>●●●●</span>
          <span>100%</span>
        </div>
      </div>

      {/* Header laranja */}
      <div className="bg-gradient-to-b from-[#f97316] to-[#ea580c] px-5 py-4 text-white">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-white/20 text-[10px] font-black">
            ON
          </div>
          <span className="text-xs font-semibold">ONficina</span>
        </div>
        <div className="mt-2 text-sm font-bold">ServiçoAo Vivo</div>
        <div className="text-[11px] opacity-90">Honda Civic 2022 · GHJ-4F52</div>
      </div>

      {/* Tracker */}
      <div className="bg-white px-4 py-5">
        <div className="relative flex items-start justify-between">
          {/* linha de fundo */}
          <div className="absolute left-3 right-3 top-3 h-0.5 bg-gray-200" />
          <div className="absolute left-3 top-3 h-0.5 bg-green-500" style={{ width: "42%" }} />

          {stages.map((s, i) => (
            <div key={i} className="relative z-10 flex w-10 flex-col items-center gap-1.5">
              {s.state === "done" && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </div>
              )}
              {s.state === "active" && (
                <div className="relative flex h-6 w-6 items-center justify-center">
                  <span className="absolute inset-0 animate-ping rounded-full bg-[#f97316] opacity-60" />
                  <div className="relative h-6 w-6 rounded-full bg-[#f97316] ring-4 ring-orange-100" />
                </div>
              )}
              {s.state === "pending" && (
                <div className="h-6 w-6 rounded-full border-2 border-gray-300 bg-white" />
              )}
              <span className="text-center text-[8px] font-medium leading-tight text-gray-600">
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Serviços em andamento */}
        <div className="mt-6">
          <div className="mb-2 text-[11px] font-bold text-gray-900">Serviços em andamento</div>
          <ServiceProgress label="Funilaria lateral" pct={75} />
          <ServiceProgress label="Preparação pintura" pct={40} />
        </div>

        {/* Badge atualizado */}
        <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-semibold text-green-700">
          <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
          Atualizado agora
        </div>
      </div>
    </div>
  );
};

const ServiceProgress = ({ label, pct }: { label: string; pct: number }) => (
  <div className="mb-2.5 last:mb-0">
    <div className="mb-1 flex items-center justify-between text-[10px]">
      <span className="font-medium text-gray-700">{label}</span>
      <span className="font-semibold text-gray-900">{pct}%</span>
    </div>
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100">
      <div
        className="h-full rounded-full bg-gradient-to-r from-[#f97316] to-[#ea580c]"
        style={{ width: `${pct}%` }}
      />
    </div>
  </div>
);

/* ─────────────────────────────────────
   MOCKUP 2 — Pipeline de OS
   ───────────────────────────────────── */
const MockupPipeline = () => (
  <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111] shadow-2xl">
    {/* Header */}
    <div className="flex items-center justify-between border-b border-white/5 px-4 py-3">
      <div className="text-xs font-bold text-white">Gestão de OS</div>
      <span className="rounded-full bg-white/10 px-2 py-0.5 text-[9px] font-semibold text-gray-300">
        Abril 2026
      </span>
    </div>

    {/* Colunas */}
    <div className="grid grid-cols-3 gap-2 p-3">
      <PipelineCol
        title="OS criada"
        badgeColor="bg-gray-500/30 text-gray-300"
        cards={[
          { car: "Toyota Corolla", placa: "MNO-7890", svc: "Funilaria + Pintura", val: "R$ 2.400" },
        ]}
      />
      <PipelineCol
        title="Em atendimento"
        badgeColor="bg-blue-500/25 text-blue-300"
        cards={[
          {
            car: "BMW Série 3",
            placa: "ABC-1D23",
            svc: "Pintura completa",
            val: "R$ 3.800",
            avatar: "CA",
            prazo: "2d restantes",
          },
          { car: "VW Golf", placa: "DEF-4E56", svc: "Funilaria lateral", val: "R$ 1.200", avatar: "MR" },
        ]}
      />
      <PipelineCol
        title="Pagamento"
        badgeColor="bg-purple-500/25 text-purple-300"
        cards={[
          { car: "Honda Civic", placa: "GHJ-4F52", svc: "Reparo completo", val: "R$ 2.850", aguardando: true },
        ]}
      />
    </div>
  </div>
);

const PipelineCol = ({
  title,
  badgeColor,
  cards,
}: {
  title: string;
  badgeColor: string;
  cards: Array<{
    car: string;
    placa: string;
    svc: string;
    val: string;
    avatar?: string;
    prazo?: string;
    aguardando?: boolean;
  }>;
}) => (
  <div className="flex flex-col gap-1.5">
    <div className={`rounded px-1.5 py-0.5 text-center text-[8px] font-bold uppercase ${badgeColor}`}>
      {title}
    </div>
    {cards.map((c, i) => (
      <div key={i} className="rounded-md border border-white/10 bg-white/5 p-2">
        {c.avatar && (
          <div className="mb-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary/30 text-[7px] font-bold text-primary">
            {c.avatar}
          </div>
        )}
        <div className="text-[9px] font-semibold text-white leading-tight">{c.car}</div>
        <div className="text-[8px] text-gray-400">{c.placa}</div>
        <div className="mt-1 text-[8px] text-gray-300">{c.svc}</div>
        <div className="mt-0.5 text-[9px] font-bold text-primary">{c.val}</div>
        {c.prazo && (
          <div className="mt-1 inline-block rounded bg-yellow-500/20 px-1 py-0.5 text-[7px] font-semibold text-yellow-400">
            {c.prazo}
          </div>
        )}
        {c.aguardando && (
          <div className="mt-1 inline-block rounded bg-purple-500/20 px-1 py-0.5 text-[7px] font-semibold text-purple-300">
            Aguardando
          </div>
        )}
      </div>
    ))}
  </div>
);

/* ─────────────────────────────────────
   MOCKUP 3 — Gestão de Pátio
   ───────────────────────────────────── */
const MockupPatio = () => (
  <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#111] shadow-2xl">
    {/* Tabs */}
    <div className="flex items-center gap-4 border-b border-white/5 px-4 pt-3">
      <button className="relative pb-2 text-[10px] font-semibold text-white">
        Por técnico
        <span className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full bg-primary" />
      </button>
      <button className="pb-2 text-[10px] font-medium text-gray-500">Por serviço</button>
      <button className="pb-2 text-[10px] font-medium text-gray-500">Por OS</button>
    </div>

    <div className="grid grid-cols-3 gap-2 p-3">
      <PatioCol
        nome="Carlos"
        funcao="Funileiro"
        badge="2/3"
        badgeColor="bg-green-500/25 text-green-400"
        cards={[
          { car: "BMW · ABC-1D23", status: "Em andamento", icon: <Loader2 className="h-2.5 w-2.5 text-blue-400" /> },
          { car: "VW Golf · DEF-4E56", status: "Aguardando", icon: <Clock className="h-2.5 w-2.5 text-gray-400" /> },
        ]}
      />
      <PatioCol
        nome="Marcos"
        funcao="Pintor"
        badge="3/3"
        badgeColor="bg-yellow-500/25 text-yellow-400"
        cards={[
          { car: "Civic · GHJ-4F52", status: "Secando", dot: "bg-yellow-400" },
          { car: "Corolla · JKL-5G78", status: "Na fila", icon: <Clock className="h-2.5 w-2.5 text-gray-400" /> },
          { car: "Uno · MNO-9H01", status: "Na fila", icon: <Clock className="h-2.5 w-2.5 text-gray-400" /> },
        ]}
      />
      <PatioCol
        nome="João"
        funcao="Polidor"
        badge="1/3"
        badgeColor="bg-green-500/25 text-green-400"
        cards={[
          { car: "Golf · PQR-2I34", status: "Concluído", icon: <Check className="h-2.5 w-2.5 text-green-400" strokeWidth={3} /> },
        ]}
        emptySlot="2 vagas livres"
      />
    </div>
  </div>
);

const PatioCol = ({
  nome,
  funcao,
  badge,
  badgeColor,
  cards,
  emptySlot,
}: {
  nome: string;
  funcao: string;
  badge: string;
  badgeColor: string;
  cards: Array<{ car: string; status: string; icon?: React.ReactNode; dot?: string }>;
  emptySlot?: string;
}) => (
  <div className="flex flex-col gap-1.5">
    <div className="flex items-center justify-between">
      <div>
        <div className="text-[9px] font-bold text-white leading-tight">{nome}</div>
        <div className="text-[7px] text-gray-500">{funcao}</div>
      </div>
      <span className={`rounded px-1 py-0.5 text-[7px] font-bold ${badgeColor}`}>{badge}</span>
    </div>
    {cards.map((c, i) => (
      <div key={i} className="rounded-md border border-white/10 bg-white/5 p-1.5">
        <div className="text-[8px] font-semibold text-white leading-tight">{c.car}</div>
        <div className="mt-0.5 flex items-center gap-1 text-[7px] text-gray-400">
          {c.icon}
          {c.dot && <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />}
          <span>{c.status}</span>
        </div>
      </div>
    ))}
    {emptySlot && (
      <div className="rounded-md border border-dashed border-white/15 p-1.5 text-center text-[7px] text-gray-500">
        {emptySlot}
      </div>
    )}
  </div>
);

export default SystemPreview;
