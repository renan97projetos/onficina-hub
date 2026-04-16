import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Check, ChevronRight, Sparkles, X, Wrench, Users, ClipboardList } from "lucide-react";

interface OnboardingChecklistProps {
  onNavigate: (key: string) => void;
}

const LS_KEY = "onficina_onboarding_dismissed";

const OnboardingChecklist = ({ onNavigate }: OnboardingChecklistProps) => {
  const { oficina_id } = useAuth();
  const queryClient = useQueryClient();
  const [dismissed, setDismissed] = useState<boolean>(() => {
    try {
      return localStorage.getItem(LS_KEY) === "1";
    } catch {
      return false;
    }
  });

  const { data: status } = useQuery({
    queryKey: ["onboarding-status", oficina_id],
    enabled: !!oficina_id,
    queryFn: async () => {
      const [oficinaRes, servicosRes, colaboradoresRes, osRes] = await Promise.all([
        supabase.from("oficinas").select("onboarding_completed").eq("id", oficina_id!).maybeSingle(),
        supabase.from("servicos_catalogo").select("id", { count: "exact", head: true }),
        supabase.from("colaboradores").select("id", { count: "exact", head: true }),
        supabase.from("ordens_servico").select("id", { count: "exact", head: true }),
      ]);
      return {
        completed: oficinaRes.data?.onboarding_completed ?? false,
        hasServico: (servicosRes.count ?? 0) > 0,
        hasColaborador: (colaboradoresRes.count ?? 0) > 0,
        hasOS: (osRes.count ?? 0) > 0,
      };
    },
  });

  const allDone = useMemo(
    () => !!status && status.hasServico && status.hasColaborador && status.hasOS,
    [status],
  );

  // Marca no banco quando todos os 3 passos foram concluídos
  useEffect(() => {
    if (!oficina_id || !status || status.completed || !allDone) return;
    (async () => {
      await supabase
        .from("oficinas")
        .update({ onboarding_completed: true })
        .eq("id", oficina_id);
      queryClient.invalidateQueries({ queryKey: ["onboarding-status", oficina_id] });
    })();
  }, [allDone, oficina_id, status, queryClient]);

  if (!status) return null;
  if (status.completed || allDone) return null;
  if (dismissed) return null;

  const steps = [
    {
      key: "servicos",
      icon: Wrench,
      title: "Cadastrar primeiro serviço",
      desc: "Crie ao menos um serviço para usar nos orçamentos.",
      done: status.hasServico,
    },
    {
      key: "colaboradores",
      icon: Users,
      title: "Cadastrar colaborador",
      desc: "Adicione quem executa os serviços na oficina.",
      done: status.hasColaborador,
    },
    {
      key: "os",
      icon: ClipboardList,
      title: "Criar primeira OS",
      desc: "Abra sua primeira ordem de serviço e veja a pipeline funcionando.",
      done: status.hasOS,
    },
  ];

  const concluidos = steps.filter((s) => s.done).length;
  const progresso = (concluidos / steps.length) * 100;

  function handleDismiss() {
    try {
      localStorage.setItem(LS_KEY, "1");
    } catch {
      /* noop */
    }
    setDismissed(true);
  }

  return (
    <div className="mb-6 overflow-hidden rounded-xl border border-primary/30 bg-gradient-to-br from-primary/10 via-card to-card">
      <div className="flex items-start justify-between gap-3 px-5 pt-5">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-foreground">Bem-vindo à ONficina!</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">
              Conclua estes {steps.length} passos para começar a usar a plataforma com tudo configurado.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleDismiss}
          className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Dispensar"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Progresso */}
      <div className="px-5 pt-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>
            {concluidos} de {steps.length} concluídos
          </span>
          <span>{Math.round(progresso)}%</span>
        </div>
        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full bg-primary transition-all duration-500"
            style={{ width: `${progresso}%` }}
          />
        </div>
      </div>

      {/* Passos */}
      <div className="grid gap-2 p-5 sm:grid-cols-3">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <button
              key={step.key}
              type="button"
              onClick={() => onNavigate(step.key)}
              disabled={step.done}
              className={`group flex items-start gap-3 rounded-lg border p-3 text-left transition-all ${
                step.done
                  ? "cursor-default border-primary/30 bg-primary/5"
                  : "border-border bg-background hover:border-primary/40 hover:bg-muted/40"
              }`}
            >
              <div
                className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                  step.done
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground group-hover:bg-primary/15 group-hover:text-primary"
                }`}
              >
                {step.done ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
              </div>
              <div className="flex-1">
                <p
                  className={`text-sm font-semibold ${
                    step.done ? "text-muted-foreground line-through" : "text-foreground"
                  }`}
                >
                  {step.title}
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">{step.desc}</p>
              </div>
              {!step.done && (
                <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-primary" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default OnboardingChecklist;
