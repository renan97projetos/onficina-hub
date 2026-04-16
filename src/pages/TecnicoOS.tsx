import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CheckCircle2, Circle, Wrench, PartyPopper } from "lucide-react";
import Logo from "@/components/Logo";
import type { Json } from "@/integrations/supabase/types";

const TecnicoOS = () => {
  const { osId } = useParams<{ osId: string }>();
  const queryClient = useQueryClient();

  const { data: os, isLoading } = useQuery({
    queryKey: ["tecnico-os", osId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ordens_servico")
        .select("*, clientes(*), veiculos(*), os_servicos(*)")
        .eq("id", osId!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!osId,
  });

  useEffect(() => {
    if (!osId) return;
    const channel = supabase
      .channel(`tecnico-${osId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "ordens_servico",
          filter: `id=eq.${osId}`,
        },
        () => queryClient.invalidateQueries({ queryKey: ["tecnico-os", osId] })
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "os_servicos",
          filter: `os_id=eq.${osId}`,
        },
        () => queryClient.invalidateQueries({ queryKey: ["tecnico-os", osId] })
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [osId, queryClient]);

  async function iniciarServico(srvId: string) {
    const { error } = await supabase
      .from("os_servicos")
      .update({
        status: "em_andamento",
        iniciado_em: new Date().toISOString(),
        etapa_atual: 0,
      })
      .eq("id", srvId);

    if (error) {
      console.error("Erro ao iniciar serviço:", error);
      toast.error("Erro ao iniciar serviço. Tente novamente.");
      return;
    }

    await queryClient.refetchQueries({ queryKey: ["tecnico-os", osId] });
    toast.success("Serviço iniciado");
  }

  async function concluirEtapa(srv: any) {
    const etapas = (srv.etapas_snapshot as string[]) || [];
    const novaEtapa = srv.etapa_atual + 1;
    const finalizarServico = etapas.length === 0 || novaEtapa >= etapas.length;

    const { error } = await supabase
      .from("os_servicos")
      .update(
        finalizarServico
          ? {
              etapa_atual: etapas.length === 0 ? 1 : novaEtapa,
              status: "concluido",
              concluido_em: new Date().toISOString(),
            }
          : { etapa_atual: novaEtapa }
      )
      .eq("id", srv.id);

    if (error) {
      console.error("Erro ao concluir etapa:", error);
      toast.error("Erro ao atualizar. Tente novamente.");
      return;
    }

    await queryClient.refetchQueries({ queryKey: ["tecnico-os", osId] });
    toast.success(finalizarServico ? "Serviço concluído!" : `Etapa ${novaEtapa} concluída`);
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!os) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">OS não encontrada.</p>
      </div>
    );
  }

  const servicos = (os.os_servicos as any[]) || [];
  const allDone = servicos.every((s: any) => s.status === "concluido");

  return (
    <div className="min-h-screen bg-background px-4 py-6">
      <div className="mx-auto max-w-lg">
        <div className="mb-6 text-center">
          <Logo size="sm" />
          <h1 className="mt-3 text-xl font-bold text-foreground">Painel do Técnico</h1>
          <p className="text-sm text-muted-foreground">
            {(os.veiculos as any)?.placa} • {(os.veiculos as any)?.marca} {(os.veiculos as any)?.modelo}
          </p>
          <p className="text-xs text-muted-foreground">{(os.clientes as any)?.nome}</p>
        </div>

        {allDone && (
          <div className="mb-6 rounded-xl border border-green-800/40 bg-green-900/20 p-4 text-center">
            <PartyPopper className="mx-auto mb-2 h-8 w-8 text-green-400" />
            <p className="text-sm font-bold text-green-400">Todos os serviços concluídos!</p>
            <p className="text-xs text-muted-foreground">Avise o responsável para mover para Pagamento.</p>
          </div>
        )}

        <div className="space-y-4">
          {servicos.map((srv: any) => {
            const etapas = (srv.etapas_snapshot as string[]) || [];
            return (
              <div key={srv.id} className="rounded-xl border border-border bg-card p-4">
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wrench className="h-5 w-5 text-primary" />
                    <span className="font-bold text-foreground">{srv.nome_servico}</span>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      srv.status === "concluido"
                        ? "bg-green-900/30 text-green-400"
                        : srv.status === "em_andamento"
                          ? "bg-blue-900/30 text-blue-400"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {srv.status === "concluido"
                      ? "Concluído"
                      : srv.status === "em_andamento"
                        ? "Em andamento"
                        : "Pendente"}
                  </span>
                </div>

                {srv.status === "pendente" && (
                  <button
                    onClick={() => iniciarServico(srv.id)}
                    className="w-full rounded-lg bg-green-600 px-4 py-3 text-base font-bold text-white hover:bg-green-700"
                  >
                    Iniciar serviço
                  </button>
                )}

                {srv.status === "em_andamento" && etapas.length > 0 && (
                  <div className="space-y-2">
                    {etapas.map((etapa: string, i: number) => (
                      <div key={i} className="flex items-center gap-3">
                        {i < srv.etapa_atual ? (
                          <CheckCircle2 className="h-5 w-5 text-green-400" />
                        ) : (
                          <Circle className="h-5 w-5 text-muted-foreground" />
                        )}
                        <span className={`flex-1 text-sm ${i < srv.etapa_atual ? "text-green-400 line-through" : "text-foreground"}`}>
                          {etapa}
                        </span>
                        {i === srv.etapa_atual && (
                          <button
                            onClick={() => concluirEtapa(srv)}
                            className="rounded-lg bg-primary px-3 py-2 text-xs font-bold text-primary-foreground hover:brightness-110"
                          >
                            Concluir
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {srv.status === "em_andamento" && etapas.length === 0 && (
                  <button
                    onClick={() => concluirEtapa(srv)}
                    className="w-full rounded-lg bg-primary px-4 py-3 text-base font-bold text-primary-foreground hover:brightness-110"
                  >
                    Concluir serviço
                  </button>
                )}

                {srv.status === "concluido" && (
                  <div className="flex items-center gap-2 text-green-400">
                    <CheckCircle2 className="h-5 w-5" />
                    <span className="text-sm font-medium">Concluído</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TecnicoOS;
