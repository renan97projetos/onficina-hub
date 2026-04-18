import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Plus, ClipboardList } from "lucide-react";
import { differenceInHours } from "date-fns";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import OSFormModal from "./OSFormModal";
import OSSheetContent from "./OSSheetContent";
import EmptyModuleState from "./EmptyModuleState";
import DemoOrcamentos from "./DemoOrcamentos";
import OrcamentoFormModal from "./OrcamentoFormModal";
import type { Tables } from "@/integrations/supabase/types";

const STAGES = [
  { key: "orcamento",        label: "Orçamento criado",   cor: "#D97706" },
  { key: "criado",           label: "OS criada",          cor: "#888780" },
  { key: "alocado_patio",    label: "Alocado no pátio",   cor: "#7F77DD" },
  { key: "aguardando_carro", label: "Aguardando carro",   cor: "#BA7517" },
  { key: "em_atendimento",   label: "Em atendimento",     cor: "#185FA5" },
  { key: "pagamento",        label: "Pagamento",          cor: "#534AB7" },
  { key: "entrega",          label: "Entrega do veículo", cor: "#1D9E75" },
  { key: "finalizado",       label: "Finalizado",         cor: "#0F6E56" },
  { key: "recusado",         label: "Recusado",           cor: "#A32D2D" },
];

export type OSWithRelations = Tables<"ordens_servico"> & {
  clientes: Tables<"clientes"> | null;
  veiculos: Tables<"veiculos"> | null;
  colaboradores: Tables<"colaboradores"> | null;
  os_servicos: Tables<"os_servicos">[];
};

export function getPrazoBadge(prazo: string | null, stage: string) {
  if (stage === "finalizado") return { label: "Entregue", color: "bg-green-900/30 text-green-400" };
  if (stage === "recusado") return { label: "Recusado", color: "bg-red-900/30 text-red-400" };
  if (!prazo) return null;
  const diff = differenceInHours(new Date(prazo), new Date());
  if (diff < 0) {
    const dias = Math.abs(Math.ceil(diff / 24));
    return { label: `Atrasado ${dias}d`, color: "bg-red-900/30 text-red-400" };
  }
  if (diff < 24) return { label: "Vence hoje", color: "bg-yellow-900/30 text-yellow-400" };
  const dias = Math.ceil(diff / 24);
  return { label: `${dias}d restantes`, color: "bg-blue-900/30 text-blue-400" };
}

const DemoOS = () => {
  const { oficina_id } = useAuth();
  const queryClient = useQueryClient();
  const [activeStage, setActiveStage] = useState("orcamento");
  const [selectedOS, setSelectedOS] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showOrcamentoForm, setShowOrcamentoForm] = useState(false);

  const { data: ordens = [] } = useQuery({
    queryKey: ["ordens_servico", oficina_id],
    queryFn: async () => {
      if (!oficina_id) return [];
      const { data, error } = await supabase
        .from("ordens_servico")
        .select("*, clientes(*), veiculos(*), colaboradores(*), os_servicos(*)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data as unknown as OSWithRelations[]) || [];
    },
    enabled: !!oficina_id,
  });

  // Realtime
  useEffect(() => {
    if (!oficina_id) return;
    const channel = supabase
      .channel("os-changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "ordens_servico", filter: `oficina_id=eq.${oficina_id}` }, () => {
        queryClient.invalidateQueries({ queryKey: ["ordens_servico", oficina_id] });
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "os_servicos" }, () => {
        queryClient.invalidateQueries({ queryKey: ["ordens_servico", oficina_id] });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [oficina_id, queryClient]);

  const counts = STAGES.map((stage) => ({
    ...stage,
    count: ordens.filter((os) => os.stage === stage.key).length,
  }));

  const filtered = ordens.filter((os) => os.stage === activeStage);
  const activeLabel = STAGES.find((s) => s.key === activeStage)?.label || "";
  const selectedOSData = ordens.find((os) => os.id === selectedOS) || null;

  if (ordens.length === 0) {
    return (
      <>
        <EmptyModuleState
          icon={ClipboardList}
          title="Sua pipeline está vazia"
          description="Crie seu primeiro orçamento para começar a acompanhar o fluxo de atendimento, do orçamento à entrega do veículo."
          primaryAction="+ Novo Orçamento"
          onPrimaryAction={() => setShowOrcamentoForm(true)}
          helperText="Quando o orçamento for aprovado, vire OS em um clique e siga o fluxo da pipeline."
        />
        <OrcamentoFormModal open={showOrcamentoForm} onOpenChange={setShowOrcamentoForm} orcamentoId={null} />
        <OSFormModal open={showForm} onOpenChange={setShowForm} />
      </>
    );
  }

  return (
    <>
      {/* Stage tabs */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-9">
        {counts.map((stage) => (
          <button
            key={stage.key}
            type="button"
            onClick={() => setActiveStage(stage.key)}
            className={`rounded-lg border p-3 text-center transition-colors ${
              activeStage === stage.key
                ? "border-primary bg-primary/10 text-primary"
                : "border-border bg-card text-muted-foreground hover:border-primary/30"
            }`}
          >
            <div className="text-xl font-bold" style={{ color: stage.cor }}>{stage.count}</div>
            <div className="text-xs">{stage.label}</div>
          </button>
        ))}
      </div>

      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wide">
          {activeLabel}
          {activeStage !== "orcamento" && ` (${filtered.length})`}
        </h2>
        {activeStage === "orcamento" ? (
          <button
            type="button"
            onClick={() => setShowOrcamentoForm(true)}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110"
          >
            <Plus className="h-4 w-4" /> Novo Orçamento
          </button>
        ) : (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110"
          >
            <Plus className="h-4 w-4" /> Nova OS
          </button>
        )}
      </div>

      {/* Conteúdo: orçamentos na etapa "orcamento", OS nas demais */}
      {activeStage === "orcamento" ? (
        <DemoOrcamentos embedded />
      ) : filtered.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border bg-card/50 px-6 py-12 text-center">
          <p className="text-sm text-muted-foreground">Nenhuma OS nesta etapa.</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((os) => {
            const badge = getPrazoBadge(os.prazo_estimado, os.stage);
            return (
              <button
                key={os.id}
                type="button"
                onClick={() => setSelectedOS(os.id)}
                className="rounded-lg border border-border bg-card p-4 text-left transition-colors hover:border-primary/40"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-foreground">{os.clientes?.nome || "—"}</p>
                    <p className="text-xs text-muted-foreground">
                      {os.veiculos?.placa} • {os.veiculos?.marca} {os.veiculos?.modelo}
                    </p>
                  </div>
                  {os.colaboradores && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
                      {os.colaboradores.nome.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm font-bold text-foreground">
                    R$ {Number(os.valor_total).toFixed(2)}
                  </span>
                  {badge && (
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${badge.color}`}>
                      {badge.label}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Sheet lateral */}
      <Sheet open={!!selectedOS} onOpenChange={(open) => !open && setSelectedOS(null)}>
        <SheetContent side="right" className="w-full max-w-3xl overflow-y-auto p-0 sm:max-w-3xl">
          {selectedOSData && (
            <OSSheetContent os={selectedOSData} onClose={() => setSelectedOS(null)} />
          )}
        </SheetContent>
      </Sheet>

      {/* Modais */}
      <OrcamentoFormModal open={showOrcamentoForm} onOpenChange={setShowOrcamentoForm} orcamentoId={null} />
      <OSFormModal open={showForm} onOpenChange={setShowForm} />
    </>
  );
};

export default DemoOS;
