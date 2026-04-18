import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Users,
  Wrench,
  ListChecks,
  Car,
  CircleDot,
  CheckCircle2,
  Clock,
  Loader2,
} from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import OSSheetContent from "./OSSheetContent";
import EmptyModuleState from "./EmptyModuleState";
import type { Tables } from "@/integrations/supabase/types";
import type { OSWithRelations } from "./DemoOS";

type Colaborador = Tables<"colaboradores"> & { max_carros_simultaneos?: number };

const ACTIVE_STAGES = ["em_atendimento", "aguardando_carro", "alocado_patio"];

const STAGE_BADGE: Record<string, string> = {
  em_atendimento: "bg-blue-500/15 text-blue-400",
  aguardando_carro: "bg-amber-500/15 text-amber-400",
  alocado_patio: "bg-purple-500/15 text-purple-400",
};

const STAGE_LABEL: Record<string, string> = {
  em_atendimento: "Em atendimento",
  aguardando_carro: "Aguardando carro",
  alocado_patio: "No pátio",
};

type View = "tecnico" | "servico" | "os";

const DemoPatio = () => {
  const { oficina_id } = useAuth();
  const qc = useQueryClient();
  const [view, setView] = useState<View>("tecnico");
  const [selectedOS, setSelectedOS] = useState<string | null>(null);
  const [periodo, setPeriodo] = useState<"hoje" | "semana" | "todas">("todas");

  // OS ativas com relações
  const { data: ordens = [], isLoading } = useQuery({
    queryKey: ["patio-ordens", oficina_id],
    enabled: !!oficina_id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ordens_servico")
        .select("*, clientes(*), veiculos(*), colaboradores(*), os_servicos(*)")
        .in("stage", ACTIVE_STAGES)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return (data as unknown as OSWithRelations[]) || [];
    },
  });

  const { data: colaboradores = [] } = useQuery({
    queryKey: ["patio-colaboradores", oficina_id],
    enabled: !!oficina_id,
    queryFn: async () => {
      const { data } = await supabase
        .from("colaboradores")
        .select("*")
        .eq("ativo", true)
        .order("nome");
      return (data as Colaborador[]) || [];
    },
  });

  // Realtime
  useEffect(() => {
    if (!oficina_id) return;
    const ch = supabase
      .channel("patio-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "ordens_servico", filter: `oficina_id=eq.${oficina_id}` },
        () => qc.invalidateQueries({ queryKey: ["patio-ordens", oficina_id] }),
      )
      .on("postgres_changes", { event: "*", schema: "public", table: "os_servicos" }, () =>
        qc.invalidateQueries({ queryKey: ["patio-ordens", oficina_id] }),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [oficina_id, qc]);

  const selectedOSData = ordens.find((o) => o.id === selectedOS) || null;

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Carregando pátio...
      </div>
    );
  }

  if (ordens.length === 0) {
    return (
      <EmptyModuleState
        icon={Car}
        title="Pátio vazio"
        description="Quando houver OS em atendimento, aguardando carro ou alocadas no pátio, elas aparecerão aqui distribuídas por técnico, serviço ou OS."
      />
    );
  }

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-bold uppercase tracking-wide">Pátio</h2>
        <div className="flex items-center gap-1 rounded-lg border border-border bg-card p-1">
          <TabBtn active={view === "tecnico"} onClick={() => setView("tecnico")} icon={Users}>
            Por técnico
          </TabBtn>
          <TabBtn active={view === "servico"} onClick={() => setView("servico")} icon={Wrench}>
            Por serviço
          </TabBtn>
          <TabBtn active={view === "os"} onClick={() => setView("os")} icon={ListChecks}>
            Por OS
          </TabBtn>
        </div>
      </div>

      {view === "tecnico" && (
        <ViewByTecnico
          ordens={ordens}
          colaboradores={colaboradores}
          onOpenOS={setSelectedOS}
        />
      )}
      {view === "servico" && <ViewByServico ordens={ordens} onOpenOS={setSelectedOS} />}
      {view === "os" && (
        <ViewByOS
          ordens={ordens}
          periodo={periodo}
          onPeriodoChange={setPeriodo}
          onOpenOS={setSelectedOS}
        />
      )}

      <Sheet open={!!selectedOS} onOpenChange={(o) => !o && setSelectedOS(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-3xl">
          {selectedOSData && (
            <OSSheetContent os={selectedOSData} onClose={() => setSelectedOS(null)} />
          )}
        </SheetContent>
      </Sheet>
    </>
  );
};

const TabBtn = ({
  active,
  onClick,
  icon: Icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-semibold transition-colors ${
      active
        ? "bg-primary text-primary-foreground"
        : "text-muted-foreground hover:bg-muted hover:text-foreground"
    }`}
  >
    <Icon className="h-3.5 w-3.5" />
    {children}
  </button>
);

/* ============================================================ */
/* VISÃO 1 — POR TÉCNICO                                         */
/* ============================================================ */
const ViewByTecnico = ({
  ordens,
  colaboradores,
  onOpenOS,
}: {
  ordens: OSWithRelations[];
  colaboradores: Colaborador[];
  onOpenOS: (id: string) => void;
}) => {
  const semColaborador = ordens.filter((o) => o.stage === "alocado_patio" && !o.colaborador_id);

  return (
    <div className="flex gap-3 overflow-x-auto pb-3">
      {colaboradores.map((c) => {
        const osCol = ordens.filter((o) => o.colaborador_id === c.id);
        const max = c.max_carros_simultaneos ?? 3;
        const pct = max > 0 ? (osCol.length / max) * 100 : 0;
        const cap =
          pct >= 90
            ? "bg-red-500/15 text-red-400 border-red-500/30"
            : pct >= 50
            ? "bg-amber-500/15 text-amber-400 border-amber-500/30"
            : "bg-emerald-500/15 text-emerald-400 border-emerald-500/30";
        return (
          <div
            key={c.id}
            className="flex w-72 shrink-0 flex-col rounded-lg border border-border bg-card"
          >
            <div className="border-b border-border p-3">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-foreground">{c.nome}</div>
                  <div className="truncate text-xs text-muted-foreground">{c.funcao || "—"}</div>
                </div>
                <span
                  className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold ${cap}`}
                >
                  {osCol.length}/{max}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2 p-3">
              {osCol.length === 0 && (
                <div className="rounded-md border border-dashed border-border py-6 text-center text-xs text-muted-foreground">
                  Sem OS no momento
                </div>
              )}
              {osCol.map((o) => (
                <OSCard key={o.id} os={o} onClick={() => onOpenOS(o.id)} />
              ))}
            </div>
          </div>
        );
      })}

      {/* Coluna sem colaborador */}
      <div className="flex w-72 shrink-0 flex-col rounded-lg border border-dashed border-border bg-muted/20">
        <div className="border-b border-border p-3">
          <div className="text-sm font-semibold text-muted-foreground">Sem colaborador</div>
          <div className="text-xs text-muted-foreground">Aguardando alocação</div>
        </div>
        <div className="flex flex-col gap-2 p-3">
          {semColaborador.length === 0 && (
            <div className="rounded-md border border-dashed border-border py-6 text-center text-xs text-muted-foreground">
              Nenhuma OS pendente
            </div>
          )}
          {semColaborador.map((o) => (
            <OSCard key={o.id} os={o} onClick={() => onOpenOS(o.id)} />
          ))}
        </div>
      </div>
    </div>
  );
};

const OSCard = ({ os, onClick }: { os: OSWithRelations; onClick: () => void }) => {
  const v = os.veiculos;
  const servPrincipal = os.os_servicos?.[0]?.nome_servico || "—";
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-md border border-border bg-background p-2.5 text-left transition-colors hover:border-primary/50 hover:bg-muted/40"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="font-mono text-xs font-bold text-foreground">{v?.placa || "—"}</span>
        <span
          className={`rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase ${
            STAGE_BADGE[os.stage] || "bg-muted text-muted-foreground"
          }`}
        >
          {STAGE_LABEL[os.stage] || os.stage}
        </span>
      </div>
      <div className="mt-1 truncate text-xs text-muted-foreground">
        {[v?.marca, v?.modelo].filter(Boolean).join(" ") || "Veículo"}
      </div>
      <div className="mt-1 truncate text-[11px] text-foreground/80">
        <Wrench className="mr-1 inline h-3 w-3" />
        {servPrincipal}
      </div>
    </button>
  );
};

/* ============================================================ */
/* VISÃO 2 — POR SERVIÇO                                         */
/* ============================================================ */
const ViewByServico = ({
  ordens,
  onOpenOS,
}: {
  ordens: OSWithRelations[];
  onOpenOS: (id: string) => void;
}) => {
  const grupos = useMemo(() => {
    const map = new Map<string, { os: OSWithRelations; servico: Tables<"os_servicos"> }[]>();
    ordens.forEach((o) => {
      o.os_servicos?.forEach((s) => {
        if (s.status === "concluido") return;
        const key = s.nome_servico || "Serviço";
        if (!map.has(key)) map.set(key, []);
        map.get(key)!.push({ os: o, servico: s });
      });
    });
    return Array.from(map.entries());
  }, [ordens]);

  if (grupos.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
        Nenhum serviço ativo no momento.
      </div>
    );
  }

  return (
    <div className="flex gap-3 overflow-x-auto pb-3">
      {grupos.map(([nome, items]) => (
        <div
          key={nome}
          className="flex w-72 shrink-0 flex-col rounded-lg border border-border bg-card"
        >
          <div className="flex items-center justify-between border-b border-border p-3">
            <div className="truncate text-sm font-semibold text-foreground">{nome}</div>
            <span className="rounded-full bg-muted px-2 py-0.5 font-mono text-[10px] text-muted-foreground">
              {items.length}
            </span>
          </div>
          <div className="flex flex-col gap-2 p-3">
            {items.map(({ os, servico }) => {
              const etapas = Array.isArray(servico.etapas_snapshot)
                ? (servico.etapas_snapshot as unknown[])
                : [];
              const total = etapas.length || 1;
              const atual = servico.etapa_atual || 0;
              const pct = Math.min(100, Math.round((atual / total) * 100));
              return (
                <button
                  key={servico.id}
                  type="button"
                  onClick={() => onOpenOS(os.id)}
                  className="rounded-md border border-border bg-background p-2.5 text-left transition-colors hover:border-primary/50 hover:bg-muted/40"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-bold text-foreground">
                      {os.veiculos?.placa || "—"}
                    </span>
                    <span className="text-[10px] font-semibold text-muted-foreground">{pct}%</span>
                  </div>
                  <div className="mt-1 truncate text-xs text-muted-foreground">
                    {[os.veiculos?.marca, os.veiculos?.modelo].filter(Boolean).join(" ") || "—"}
                  </div>
                  <div className="mt-1 truncate text-[11px] text-foreground/80">
                    👤 {os.colaboradores?.nome || "Sem colaborador"}
                  </div>
                  <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

/* ============================================================ */
/* VISÃO 3 — POR OS                                              */
/* ============================================================ */
const ViewByOS = ({
  ordens,
  periodo,
  onPeriodoChange,
  onOpenOS,
}: {
  ordens: OSWithRelations[];
  periodo: "hoje" | "semana" | "todas";
  onPeriodoChange: (p: "hoje" | "semana" | "todas") => void;
  onOpenOS: (id: string) => void;
}) => {
  const filtered = useMemo(() => {
    if (periodo === "todas") return ordens;
    const now = new Date();
    return ordens.filter((o) => {
      const created = new Date(o.created_at);
      if (periodo === "hoje") {
        return created.toDateString() === now.toDateString();
      }
      const diff = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
      return diff <= 7;
    });
  }, [ordens, periodo]);

  const servicosUnicos = useMemo(() => {
    const set = new Set<string>();
    filtered.forEach((o) => o.os_servicos?.forEach((s) => set.add(s.nome_servico || "Serviço")));
    return Array.from(set);
  }, [filtered]);

  return (
    <div>
      <div className="mb-3 flex items-center gap-1 rounded-lg border border-border bg-card p-1 w-fit">
        {(["hoje", "semana", "todas"] as const).map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPeriodoChange(p)}
            className={`rounded-md px-3 py-1 text-xs font-semibold transition-colors ${
              periodo === p
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {p === "hoje" ? "Hoje" : p === "semana" ? "Última semana" : "Todas abertas"}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border py-10 text-center text-sm text-muted-foreground">
          Nenhuma OS no período.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-3 py-2 text-left">OS / Placa</th>
                <th className="px-3 py-2 text-left">Cliente</th>
                {servicosUnicos.map((s) => (
                  <th key={s} className="px-3 py-2 text-center">
                    {s}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr
                  key={o.id}
                  className="cursor-pointer border-t border-border hover:bg-muted/20"
                  onClick={() => onOpenOS(o.id)}
                >
                  <td className="px-3 py-2 font-mono text-xs">
                    <div className="font-bold">{o.veiculos?.placa || "—"}</div>
                    <div className="text-[10px] text-muted-foreground">
                      #{o.id.slice(0, 6)}
                    </div>
                  </td>
                  <td className="px-3 py-2">{o.clientes?.nome || "—"}</td>
                  {servicosUnicos.map((sNome) => {
                    const s = o.os_servicos?.find((x) => x.nome_servico === sNome);
                    return (
                      <td key={sNome} className="px-3 py-2 text-center">
                        {!s ? (
                          <span className="text-muted-foreground/40">—</span>
                        ) : s.status === "concluido" ? (
                          <CheckCircle2 className="mx-auto h-4 w-4 text-emerald-400" />
                        ) : s.status === "em_andamento" ? (
                          <Loader2 className="mx-auto h-4 w-4 animate-spin text-blue-400" />
                        ) : (
                          <Clock className="mx-auto h-4 w-4 text-muted-foreground" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default DemoPatio;
