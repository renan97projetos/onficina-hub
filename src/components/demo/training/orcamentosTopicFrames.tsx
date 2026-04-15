/**
 * Focused animation frames for each topic in the Orçamentos module.
 * Each topic gets its own set of compact, relevant frames.
 */

const stages = ["Enviado", "Orçado", "Aprovado", "Ag. Carro", "Atendim.", "Pagamento", "Finaliz.", "Recusado"];
const stageCounts = [1, 3, 2, 1, 4, 2, 2, 1];

/* ─── Shared small components ─── */
const PipelineCards = ({ active }: { active: number }) => (
  <div className="flex gap-0.5">
    {stages.map((s, i) => (
      <div
        key={s}
        className={`flex-1 rounded py-1 text-center transition-all duration-500 ${
          active === i
            ? "border border-primary/40 bg-primary/5"
            : "border border-white/10 bg-white/[0.02]"
        }`}
      >
        <div className={`text-[8px] font-bold ${active === i ? "text-primary" : "text-foreground"}`}>
          {stageCounts[i]}
        </div>
        <div className="text-[5px] text-muted-foreground">{s}</div>
      </div>
    ))}
  </div>
);

const OsRow = ({ os, nome, veiculo, valor, highlight }: { os: string; nome: string; veiculo: string; valor: string; highlight?: boolean }) => (
  <div className={`flex items-center justify-between rounded px-1.5 py-1 transition-all duration-300 ${highlight ? "bg-white/[0.06] border border-primary/20" : "border border-white/5"}`}>
    <div className="flex items-center gap-1.5">
      <span className="text-[7px] font-semibold text-primary">{os}</span>
      <span className="text-[7px]">{nome}</span>
      <span className="text-[5px] text-muted-foreground">{veiculo}</span>
    </div>
    <div className="flex items-center gap-1">
      <span className="text-[6px] text-muted-foreground">{valor}</span>
      <span className="text-[7px] text-muted-foreground">→</span>
    </div>
  </div>
);

/* ─── Topic 0: Entendendo a Pipeline ─── */
export const pipelineFrames = [
  {
    label: "Pipeline com 8 estágios sequenciais",
    cursor: { x: 12, y: 35 },
    elements: (
      <div className="space-y-2">
        <PipelineCards active={0} />
        <div className="text-[6px] text-muted-foreground text-center">Enviado → Orçado → Aprovado → … → Finaliz.</div>
      </div>
    ),
  },
  {
    label: "Cada card mostra quantidade de OS",
    cursor: { x: 30, y: 35 },
    elements: (
      <div className="space-y-2">
        <PipelineCards active={1} />
        <div className="text-[6px] text-muted-foreground text-center">3 OS no estágio "Orçado"</div>
      </div>
    ),
  },
  {
    label: "Navegue entre estágios clicando",
    cursor: { x: 55, y: 35 },
    elements: (
      <div className="space-y-2">
        <PipelineCards active={4} />
        <div className="text-[6px] text-muted-foreground text-center">4 OS "Em Atendimento"</div>
      </div>
    ),
  },
  {
    label: "Acompanhe todo o fluxo da oficina",
    cursor: { x: 80, y: 35 },
    elements: (
      <div className="space-y-2">
        <PipelineCards active={6} />
        <div className="text-[6px] text-muted-foreground text-center">2 OS Finalizadas</div>
      </div>
    ),
  },
];

/* ─── Topic 1: Filtrando por estágio ─── */
export const filtrandoFrames = [
  {
    label: "Clique no card 'Enviado'",
    cursor: { x: 8, y: 35 },
    elements: (
      <div className="space-y-2">
        <PipelineCards active={0} />
        <div className="text-[6px] font-bold uppercase tracking-wide px-1">Enviado (1)</div>
        <OsRow os="OS-0149" nome="João Lucas" veiculo="HB20 2023" valor="R$ 2.400" highlight />
      </div>
    ),
  },
  {
    label: "Agora clique em 'Orçado'",
    cursor: { x: 22, y: 35 },
    elements: (
      <div className="space-y-2">
        <PipelineCards active={1} />
        <div className="text-[6px] font-bold uppercase tracking-wide px-1">Orçado (3)</div>
        <OsRow os="OS-0148" nome="Ana Paula" veiculo="Corolla 2021" valor="R$ 1.800" />
        <OsRow os="OS-0147" nome="Carlos" veiculo="Civic 2022" valor="R$ 3.200" highlight />
      </div>
    ),
  },
  {
    label: "Lista filtrada pelo estágio selecionado",
    cursor: { x: 22, y: 60 },
    elements: (
      <div className="space-y-2">
        <PipelineCards active={1} />
        <div className="text-[6px] font-bold uppercase tracking-wide px-1">Orçado (3)</div>
        <OsRow os="OS-0148" nome="Ana Paula" veiculo="Corolla 2021" valor="R$ 1.800" highlight />
        <OsRow os="OS-0147" nome="Carlos" veiculo="Civic 2022" valor="R$ 3.200" />
        <OsRow os="OS-0146" nome="Maria" veiculo="Onix 2024" valor="R$ 950" />
      </div>
    ),
  },
];

/* ─── Topic 2: Respondendo um orçamento ─── */
export const respondendoFrames = [
  {
    label: "Abra a OS na etapa 'Enviado'",
    cursor: { x: 40, y: 45 },
    elements: (
      <div className="space-y-1.5">
        <div className="text-[6px] font-bold uppercase tracking-wide">Enviado (1)</div>
        <OsRow os="OS-0149" nome="João Lucas" veiculo="HB20 2023" valor="R$ 2.400" highlight />
      </div>
    ),
  },
  {
    label: "Defina serviços e valores",
    cursor: { x: 50, y: 50 },
    elements: (
      <div className="rounded border border-white/10 bg-[#111] p-2 space-y-1">
        <div className="flex justify-between text-[7px] font-bold"><span>OS-0149 — João Lucas</span><span className="text-muted-foreground">✕</span></div>
        <div className="flex justify-between text-[6px]"><span>Funilaria</span><span>R$ 1.200</span></div>
        <div className="flex justify-between text-[6px]"><span>Pintura</span><span>R$ 800</span></div>
        <div className="flex justify-between text-[6px]"><span>Polimento</span><span>R$ 400</span></div>
        <div className="flex justify-between text-[6px] border-t border-white/10 pt-1 font-semibold"><span>Total</span><span>R$ 2.400</span></div>
      </div>
    ),
  },
  {
    label: "Envie proposta por WhatsApp ou e-mail",
    cursor: { x: 35, y: 75 },
    elements: (
      <div className="rounded border border-white/10 bg-[#111] p-2 space-y-1.5">
        <div className="text-[7px] font-bold">Enviar proposta</div>
        <div className="rounded border border-white/10 px-1.5 py-1">
          <span className="text-[5px] text-muted-foreground">Cliente</span>
          <span className="text-[6px] block">João Lucas — (11) 99123-4567</span>
        </div>
        <div className="flex gap-1">
          <div className="flex-1 rounded bg-green-500/10 border border-green-500/20 px-1.5 py-0.5 text-center">
            <span className="text-[6px] text-green-400 font-medium">WhatsApp</span>
          </div>
          <div className="flex-1 rounded bg-white/5 border border-white/10 px-1.5 py-0.5 text-center">
            <span className="text-[6px] text-muted-foreground">E-mail</span>
          </div>
        </div>
      </div>
    ),
  },
];

/* ─── Topic 3: Avançando etapas ─── */
export const avancandoFrames = [
  {
    label: "OS na etapa 'Orçado'",
    cursor: { x: 85, y: 45 },
    elements: (
      <div className="space-y-1.5">
        <div className="text-[6px] font-bold uppercase tracking-wide">Orçado (3)</div>
        <OsRow os="OS-0148" nome="Ana Paula" veiculo="Corolla 2021" valor="R$ 1.800" highlight />
      </div>
    ),
  },
  {
    label: "Confirme o avanço de etapa",
    cursor: { x: 60, y: 55 },
    elements: (
      <div className="rounded border border-white/10 bg-[#111] p-2 text-center space-y-1.5">
        <div className="text-[7px] font-bold">Avançar etapa</div>
        <div className="text-[6px] text-muted-foreground">Mover OS-0148 de Orçado → Aprovado?</div>
        <div className="flex gap-1">
          <div className="flex-1 rounded bg-white/5 border border-white/10 px-1.5 py-0.5">
            <span className="text-[6px] text-muted-foreground">Cancelar</span>
          </div>
          <div className="flex-1 rounded bg-primary/10 border border-primary/20 px-1.5 py-0.5">
            <span className="text-[6px] text-primary font-medium">Confirmar →</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    label: "OS movida para 'Aprovado'",
    cursor: { x: 35, y: 35 },
    elements: (
      <div className="space-y-2">
        <PipelineCards active={2} />
        <div className="text-[6px] text-muted-foreground text-center">✓ OS-0148 agora está em "Aprovado"</div>
      </div>
    ),
  },
];

/* ─── Topic 4: Enviando link de aprovação ─── */
export const aprovacaoFrames = [
  {
    label: "Selecione a OS para gerar link",
    cursor: { x: 40, y: 45 },
    elements: (
      <div className="space-y-1.5">
        <div className="text-[6px] font-bold uppercase tracking-wide">Orçado (3)</div>
        <OsRow os="OS-0148" nome="Ana Paula" veiculo="Corolla 2021" valor="R$ 1.800" highlight />
      </div>
    ),
  },
  {
    label: "Link gerado para o cliente",
    cursor: { x: 50, y: 50 },
    elements: (
      <div className="rounded border border-white/10 bg-[#111] p-2 space-y-1.5">
        <div className="text-[7px] font-bold">Link de aprovação</div>
        <div className="rounded border border-white/10 bg-white/5 px-1.5 py-1">
          <span className="text-[6px] font-mono text-primary break-all">onficina.com.br/aprovar/a3f2...</span>
        </div>
        <span className="text-[5px] text-muted-foreground block">Cliente aprova ou recusa sem login</span>
      </div>
    ),
  },
  {
    label: "Envie por WhatsApp ou copie o link",
    cursor: { x: 35, y: 75 },
    elements: (
      <div className="rounded border border-white/10 bg-[#111] p-2 space-y-1.5">
        <div className="text-[7px] font-bold">Link de aprovação</div>
        <div className="rounded border border-white/10 bg-white/5 px-1.5 py-1">
          <span className="text-[6px] font-mono text-primary">onficina.com.br/aprovar/a3f2...</span>
        </div>
        <div className="flex gap-1">
          <div className="flex-1 rounded bg-green-500/10 border border-green-500/20 px-1.5 py-0.5 text-center">
            <span className="text-[6px] text-green-400 font-medium">Enviar WhatsApp</span>
          </div>
          <div className="flex-1 rounded bg-white/5 border border-white/10 px-1.5 py-0.5 text-center">
            <span className="text-[6px] text-muted-foreground">Copiar link</span>
          </div>
        </div>
      </div>
    ),
  },
];
