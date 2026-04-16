import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2, Users } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { useAuth } from "@/contexts/AuthContext";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

import EmptyModuleState from "./EmptyModuleState";

type Colaborador = Tables<"colaboradores">;
type OrdemServicoResumo = Pick<Tables<"ordens_servico">, "colaborador_id">;

const DemoColaboradores = () => {
  const { oficina_id } = useAuth();
  const queryClient = useQueryClient();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [confirmInactivateOpen, setConfirmInactivateOpen] = useState(false);
  const [editingColaborador, setEditingColaborador] = useState<Colaborador | null>(null);
  const [nome, setNome] = useState("");
  const [funcao, setFuncao] = useState("");
  const [ativo, setAtivo] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: colaboradores = [], isLoading } = useQuery({
    queryKey: ["colaboradores_real", oficina_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("colaboradores")
        .select("*")
        .order("ativo", { ascending: false })
        .order("nome", { ascending: true });

      if (error) throw error;
      return data || [];
    },
    enabled: !!oficina_id,
  });

  const { data: ordens = [] } = useQuery({
    queryKey: ["colaboradores_os_count", oficina_id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ordens_servico")
        .select("colaborador_id")
        .not("colaborador_id", "is", null);

      if (error) throw error;
      return (data as OrdemServicoResumo[]) || [];
    },
    enabled: !!oficina_id,
  });

  const osCountByColaborador = useMemo(() => {
    return ordens.reduce<Record<string, number>>((acc, ordem) => {
      if (!ordem.colaborador_id) return acc;
      acc[ordem.colaborador_id] = (acc[ordem.colaborador_id] || 0) + 1;
      return acc;
    }, {});
  }, [ordens]);

  function resetForm() {
    setEditingColaborador(null);
    setNome("");
    setFuncao("");
    setAtivo(true);
    setConfirmInactivateOpen(false);
  }

  function openCreateDialog() {
    resetForm();
    setDialogOpen(true);
  }

  function openEditDialog(colaborador: Colaborador) {
    setEditingColaborador(colaborador);
    setNome(colaborador.nome);
    setFuncao(colaborador.funcao || "");
    setAtivo(colaborador.ativo);
    setConfirmInactivateOpen(false);
    setDialogOpen(true);
  }

  async function refreshColaboradores() {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: ["colaboradores_real", oficina_id] }),
      queryClient.invalidateQueries({ queryKey: ["colaboradores_os_count", oficina_id] }),
      queryClient.invalidateQueries({ queryKey: ["colaboradores", oficina_id] }),
      queryClient.invalidateQueries({ queryKey: ["colaboradores_sheet"] }),
    ]);
  }

  async function handleSave() {
    if (!oficina_id) return;
    if (!nome.trim()) {
      toast.error("Informe o nome do colaborador");
      return;
    }

    setSaving(true);

    try {
      if (editingColaborador) {
        const { error } = await supabase
          .from("colaboradores")
          .update({
            nome: nome.trim(),
            funcao: funcao.trim() || null,
            ativo,
          })
          .eq("id", editingColaborador.id);

        if (error) throw error;
        toast.success("Colaborador atualizado");
      } else {
        const { error } = await supabase.from("colaboradores").insert({
          oficina_id,
          nome: nome.trim(),
          funcao: funcao.trim() || null,
          ativo: true,
        });

        if (error) throw error;
        toast.success("Colaborador cadastrado");
      }

      await refreshColaboradores();
      setDialogOpen(false);
      resetForm();
    } catch (err: any) {
      toast.error(err.message || "Erro ao salvar colaborador");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(colaborador: Colaborador) {
    setDeletingId(colaborador.id);

    try {
      const { error } = await supabase.from("colaboradores").delete().eq("id", colaborador.id);
      if (error) throw error;

      await refreshColaboradores();
      toast.success("Colaborador excluído");
    } catch (err: any) {
      toast.error(err.message || "Erro ao excluir colaborador");
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wide">Colaboradores</h2>
          <p className="mt-1 text-xs text-muted-foreground">Cadastre sua equipe e acompanhe quem atende cada OS.</p>
        </div>
        <button
          type="button"
          onClick={openCreateDialog}
          className="flex items-center gap-2 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-all hover:brightness-110"
        >
          <Plus className="h-3.5 w-3.5" /> Novo
        </button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="rounded-xl border border-border bg-card p-5">
              <div className="h-24 animate-pulse rounded-lg bg-muted" />
            </div>
          ))}
        </div>
      ) : colaboradores.length === 0 ? (
        <EmptyModuleState
          icon={Users}
          title="Nenhum colaborador cadastrado"
          description="Adicione os membros da sua equipe para distribuir serviços nas novas OS e manter o histórico de atendimento organizado."
          primaryAction="Adicionar colaborador"
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {colaboradores.map((colaborador) => {
            const initials = colaborador.nome
              .split(" ")
              .filter(Boolean)
              .map((parte) => parte[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();

            const totalOs = osCountByColaborador[colaborador.id] || 0;
            const isDeleting = deletingId === colaborador.id;

            return (
              <div key={colaborador.id} className="rounded-xl border border-border bg-card p-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {initials || "CO"}
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-foreground">{colaborador.nome}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">{colaborador.funcao || "Função não informada"}</p>
                    </div>
                  </div>

                  <span
                    className={colaborador.ativo
                      ? "rounded-full border border-success/20 bg-success/10 px-2.5 py-1 text-[11px] font-semibold text-success"
                      : "rounded-full border border-border bg-muted px-2.5 py-1 text-[11px] font-semibold text-muted-foreground"}
                  >
                    {colaborador.ativo ? "Ativo" : "Inativo"}
                  </span>
                </div>

                <div className="mt-5 rounded-lg border border-border bg-background px-3 py-3">
                  <p className="text-xs text-muted-foreground">{totalOs} OS atendidas</p>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    type="button"
                    onClick={() => openEditDialog(colaborador)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted"
                  >
                    <Pencil className="h-3.5 w-3.5" /> Editar
                  </button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button
                        type="button"
                        className="flex items-center justify-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs font-medium text-destructive transition-colors hover:bg-destructive/15"
                      >
                        <Trash2 className="h-3.5 w-3.5" /> Excluir
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Excluir colaborador?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Essa ação remove o colaborador permanentemente. O histórico continua preservado enquanto houver vínculo de uso existente.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(colaborador)}
                          disabled={isDeleting}
                          className="bg-destructive text-destructive-foreground hover:brightness-110"
                        >
                          {isDeleting ? "Excluindo..." : "Confirmar exclusão"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Dialog
        open={dialogOpen}
        onOpenChange={(open) => {
          setDialogOpen(open);
          if (!open) resetForm();
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{editingColaborador ? "Editar colaborador" : "Novo colaborador"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Nome *</label>
              <Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Nome do colaborador" />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">Função</label>
              <Input value={funcao} onChange={(e) => setFuncao(e.target.value)} placeholder="Ex: Funileiro, Pintor, Técnico" />
            </div>

            {editingColaborador && (
              <div className="rounded-xl border border-border bg-background p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-foreground">Disponível para novas OS</p>
                    <p className="mt-1 text-xs text-muted-foreground">Inativo não aparece nos selects de criação, mas continua no histórico.</p>
                  </div>
                  <Switch
                    checked={ativo}
                    onCheckedChange={(checked) => {
                      if (!checked && ativo) {
                        setConfirmInactivateOpen(true);
                        return;
                      }

                      setAtivo(checked);
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
            <button
              type="button"
              onClick={() => setDialogOpen(false)}
              className="rounded-lg border border-border px-4 py-2 text-sm text-foreground transition-colors hover:bg-muted"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 disabled:opacity-50"
            >
              {saving ? "Salvando..." : editingColaborador ? "Salvar alterações" : "Cadastrar colaborador"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={confirmInactivateOpen} onOpenChange={setConfirmInactivateOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Inativar colaborador?</AlertDialogTitle>
            <AlertDialogDescription>
              Colaborador inativo não aparece em novas OS. Continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                setAtivo(false);
                setConfirmInactivateOpen(false);
              }}
            >
              Continuar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default DemoColaboradores;
