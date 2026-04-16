import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import {
  FileText, Car, Wrench, CreditCard, Truck, CheckCircle2, Circle, Check,
} from "lucide-react";
import Logo from "@/components/Logo";

const STAGES_ORDER = [
  { key: "criado", label: "Criado", icon: FileText },
  { key: "aguardando_carro", label: "Aguardando", icon: Car },
  { key: "em_atendimento", label: "Atendimento", icon: Wrench },
  { key: "pagamento", label: "Pagamento", icon: CreditCard },
  { key: "entrega", label: "Entrega", icon: Truck },
  { key: "finalizado", label: "Finalizado", icon: CheckCircle2 },
];

const MESSAGES: Record<string, string> = {
  criado: "Sua OS foi aberta e está sendo preparada.",
  aguardando_carro: "Aguardando a chegada do veículo na oficina.",
  em_atendimento: "Seu veículo está sendo atendido. Acompanhe o progresso abaixo.",
  pagamento: "Serviço concluído! Dirija-se à oficina para pagamento e retirada.",
  entrega: "Pagamento confirmado. Seu veículo está pronto para retirada!",
  finalizado: "Serviço finalizado. Obrigado pela preferência!",
  recusado: "Esta ordem de serviço foi recusada.",
};

const Acompanhar = () => {
  const { token } = useParams<{ token: string }>();
  const queryClient = useQueryClient();
  const [osId, setOsId] = useState<string | null>(null);

  const { data: os, isLoading, error } = useQuery({
    queryKey: ["acompanhar", token],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ordens_servico")
        .select("*, clientes(*), veiculos(*), os_servicos(*)")
        .eq("token_cliente", token!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!token,
  });

  // Track OS id for realtime
  useEffect(() => {
    if (os?.id) setOsId(os.id);
  }, [os?.id]);

  // Realtime filtered by OS id
  useEffect(() => {
    if (!osId) return;
    const channel = supabase
      .channel(`acompanhar-${osId}`)
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "ordens_servico",
        filter: `id=eq.${osId}`,
      }, () => {
        queryClient.invalidateQueries({ queryKey: ["acompanhar", token] });
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [osId, token, queryClient]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!os || error) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background px-4">
        <Logo size="md" />
        <p className="text-muted-foreground">OS não encontrada ou link inválido.</p>
      </div>
    );
  }

  const currentIdx = STAGES_ORDER.findIndex((s) => s.key === os.stage);
  const veiculo = os.veiculos as any;
  const cliente = os.clientes as any;
  const servicos = os.os_servicos as any[] || [];

  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <div className="mx-auto max-w-lg">
        {/* Header */}
        <div className="mb-8 text-center">
          <Logo size="sm" />
          <h1 className="mt-4 text-lg font-bold text-foreground">
            {veiculo?.marca} {veiculo?.modelo} — {veiculo?.placa}
          </h1>
          <p className="text-sm text-muted-foreground">{cliente?.nome}</p>
        </div>

        {/* Tracker */}
        <div className="mb-8 pb-12">
          <div className="relative">
            <div className="flex items-center justify-between">
              {STAGES_ORDER.map((stage, i) => {
                const Icon = stage.icon;
                const isPast = i < currentIdx;
                const isCurrent = i === currentIdx;
                return (
                  <div key={stage.key} className="relative z-10 flex flex-col items-center gap-1 bg-background px-1">
                    <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      isPast ? "bg-green-600" : isCurrent ? "bg-primary" : "bg-muted"
                    }`}>
                      {isPast ? (
                        <Check className="h-5 w-5 text-white" />
                      ) : (
                        <Icon className={`h-5 w-5 ${isCurrent ? "text-primary-foreground" : "text-muted-foreground"}`} />
                      )}
                    </div>
                    <span className={`text-[10px] text-center leading-tight ${
                      isCurrent ? "font-bold text-primary" : isPast ? "text-green-400" : "text-muted-foreground"
                    }`}>
                      {stage.label}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="absolute left-5 right-5 top-5 flex items-center">
              {STAGES_ORDER.slice(0, -1).map((_, i) => (
                <div key={i} className={`h-0.5 flex-1 ${i < currentIdx ? "bg-green-600" : "bg-muted"}`} />
              ))}
            </div>
          </div>
        </div>

        {/* Message */}
        <div className="mb-6 rounded-xl border border-border bg-card p-5 text-center">
          <p className="text-sm text-foreground">{MESSAGES[os.stage] || ""}</p>
        </div>

        {/* Services (only in em_atendimento) */}
        {os.stage === "em_atendimento" && servicos.length > 0 && (
          <div className="space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wide text-muted-foreground">Serviços</h2>
            {servicos.map((srv: any) => {
              const etapas = (srv.etapas_snapshot as string[]) || [];
              const total = etapas.length || 1;
              const current = srv.status === "concluido" ? total : srv.etapa_atual;
              const pct = Math.round((current / total) * 100);
              return (
                <div key={srv.id} className="rounded-lg border border-border bg-card p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">{srv.nome_servico}</span>
                    <span className="text-xs text-muted-foreground">{pct}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Acompanhar;
