import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  Plus,
  Loader2,
  CalendarDays,
  Check,
  Trash2,
  CheckCircle2,
  Phone,
  Car,
  Wrench,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { format, addDays, startOfWeek, isSameDay, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Tables } from "@/integrations/supabase/types";

type Agendamento = Tables<"agendamentos">;
type AgendaConfig = Tables<"agenda_config">;

const DemoAgenda = () => {
  const { oficina_id } = useAuth();
  const qc = useQueryClient();
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());
  const [showForm, setShowForm] = useState(false);
  const [weekOffset, setWeekOffset] = useState(0);

  // Config
  const { data: config } = useQuery({
    queryKey: ["agenda-config", oficina_id],
    enabled: !!oficina_id,
    queryFn: async () => {
      const { data } = await supabase
        .from("agenda_config")
        .select("*")
        .eq("oficina_id", oficina_id!)
        .maybeSingle();
      return (data as AgendaConfig) || null;
    },
  });

  const limite = config?.limite_por_dia ?? 4;

  // Agendamentos
  const { data: agendamentos = [], isLoading } = useQuery({
    queryKey: ["agendamentos", oficina_id],
    enabled: !!oficina_id,
    queryFn: async () => {
      const { data } = await supabase
        .from("agendamentos")
        .select("*")
        .eq("oficina_id", oficina_id!)
        .order("data_entrada", { ascending: true });
      return (data as Agendamento[]) || [];
    },
  });

  // Realtime
  useEffect(() => {
    if (!oficina_id) return;
    const ch = supabase
      .channel("agenda-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "agendamentos", filter: `oficina_id=eq.${oficina_id}` },
        () => qc.invalidateQueries({ queryKey: ["agendamentos", oficina_id] }),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [oficina_id, qc]);

  const weekStart = useMemo(() => {
    const base = startOfWeek(new Date(), { weekStartsOn: 1 });
    return addDays(base, weekOffset * 7);
  }, [weekOffset]);

  const days = useMemo(() => Array.from({ length: 5 }, (_, i) => addDays(weekStart, i)), [weekStart]);

  const countByDay = (d: Date) =>
    agendamentos.filter((a) => isSameDay(parseISO(a.data_entrada), d)).length;

  const dayList = agendamentos.filter((a) => isSameDay(parseISO(a.data_entrada), selectedDay));

  async function ensureConfig() {
    if (config || !oficina_id) return;
    await supabase.from("agenda_config").insert({ oficina_id });
    qc.invalidateQueries({ queryKey: ["agenda-config", oficina_id] });
  }

  useEffect(() => {
    ensureConfig();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oficina_id]);

  async function confirmar(id: string, atual: boolean) {
    await supabase.from("agendamentos").update({ confirmado: !atual }).eq("id", id);
    qc.invalidateQueries({ queryKey: ["agendamentos", oficina_id] });
  }

  async function excluir(id: string) {
    if (!confirm("Excluir este agendamento?")) return;
    await supabase.from("agendamentos").delete().eq("id", id);
    qc.invalidateQueries({ queryKey: ["agendamentos", oficina_id] });
    toast.success("Agendamento removido.");
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" /> Carregando agenda...
      </div>
    );
  }

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-bold uppercase tracking-wide">Agenda</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setWeekOffset((w) => w - 1)}
            className="rounded-md border border-border bg-card px-2 py-1 text-xs text-muted-foreground hover:bg-muted"
          >
            ← Semana anterior
          </button>
          <button
            type="button"
            onClick={() => {
              setWeekOffset(0);
              setSelectedDay(new Date());
            }}
            className="rounded-md border border-border bg-card px-2 py-1 text-xs text-muted-foreground hover:bg-muted"
          >
            Hoje
          </button>
          <button
            type="button"
            onClick={() => setWeekOffset((w) => w + 1)}
            className="rounded-md border border-border bg-card px-2 py-1 text-xs text-muted-foreground hover:bg-muted"
          >
            Próxima semana →
          </button>
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:brightness-110"
          >
            <Plus className="h-4 w-4" /> Agendar entrada
          </button>
        </div>
      </div>

      {/* OS em andamento - barra de progresso de dias */}
      <OSEmAndamentoSection agendamentos={agendamentos} />

      {/* Grade semanal */}
      <div className="mb-6 grid grid-cols-5 gap-2">
        {days.map((d) => {
          const c = countByDay(d);
          const pct = limite > 0 ? (c / limite) * 100 : 0;
          const cls =
            pct >= 100
              ? "border-red-500/40 bg-red-500/10 text-red-400"
              : pct >= 50
              ? "border-amber-500/40 bg-amber-500/10 text-amber-400"
              : "border-emerald-500/40 bg-emerald-500/10 text-emerald-400";
          const isSel = isSameDay(d, selectedDay);
          return (
            <button
              key={d.toISOString()}
              type="button"
              onClick={() => setSelectedDay(d)}
              className={`rounded-lg border p-3 text-left transition-all ${
                isSel ? "ring-2 ring-primary" : ""
              } ${cls}`}
            >
              <div className="text-[10px] font-bold uppercase tracking-wide opacity-80">
                {format(d, "EEE", { locale: ptBR })}
              </div>
              <div className="text-lg font-bold text-foreground">
                {format(d, "dd/MM", { locale: ptBR })}
              </div>
              <div className="mt-1 text-xs">
                {c} / {limite} vagas
              </div>
            </button>
          );
        })}
      </div>

      {/* Lista do dia */}
      <div className="rounded-lg border border-border bg-card">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h3 className="text-sm font-semibold text-foreground">
            <CalendarDays className="mr-1.5 inline h-4 w-4 text-primary" />
            {format(selectedDay, "EEEE, dd 'de' MMMM", { locale: ptBR })}
          </h3>
          <span className="text-xs text-muted-foreground">
            {dayList.length} agendamento{dayList.length !== 1 ? "s" : ""}
          </span>
        </div>
        {dayList.length === 0 ? (
          <div className="px-4 py-10 text-center text-sm text-muted-foreground">
            Nenhum agendamento neste dia.
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {dayList.map((a) => (
              <li key={a.id} className="flex items-center gap-3 px-4 py-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">{a.cliente_nome || "Cliente"}</span>
                    {a.origem === "cliente" && (
                      <span className="rounded-full bg-blue-500/15 px-2 py-0.5 text-[10px] font-semibold text-blue-400">
                        Online
                      </span>
                    )}
                    {!a.confirmado && (
                      <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold text-amber-400">
                        Pendente
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 flex flex-wrap gap-x-3 text-xs text-muted-foreground">
                    {a.cliente_telefone && (
                      <span>
                        <Phone className="mr-1 inline h-3 w-3" />
                        {a.cliente_telefone}
                      </span>
                    )}
                    {a.veiculo_placa && (
                      <span>
                        <Car className="mr-1 inline h-3 w-3" />
                        {a.veiculo_placa}
                        {a.veiculo_modelo ? ` · ${a.veiculo_modelo}` : ""}
                      </span>
                    )}
                  </div>
                  {a.observacao && (
                    <div className="mt-1 text-xs text-muted-foreground">{a.observacao}</div>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => confirmar(a.id, a.confirmado)}
                    className={`rounded-md border p-1.5 transition-colors ${
                      a.confirmado
                        ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                        : "border-border text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`}
                    title={a.confirmado ? "Desfazer confirmação" : "Confirmar"}
                  >
                    {a.confirmado ? (
                      <CheckCircle2 className="h-4 w-4" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => excluir(a.id)}
                    className="rounded-md border border-border p-1.5 text-muted-foreground hover:bg-red-500/10 hover:text-red-400"
                    title="Excluir"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <AgendaFormDialog
        open={showForm}
        onOpenChange={setShowForm}
        defaultDate={selectedDay}
        oficina_id={oficina_id || ""}
        onCreated={() => qc.invalidateQueries({ queryKey: ["agendamentos", oficina_id] })}
      />
    </>
  );
};

const AgendaFormDialog = ({
  open,
  onOpenChange,
  defaultDate,
  oficina_id,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  defaultDate: Date;
  oficina_id: string;
  onCreated: () => void;
}) => {
  const [data, setData] = useState(format(defaultDate, "yyyy-MM-dd"));
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [placa, setPlaca] = useState("");
  const [modelo, setModelo] = useState("");
  const [obs, setObs] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setData(format(defaultDate, "yyyy-MM-dd"));
      setNome("");
      setTelefone("");
      setPlaca("");
      setModelo("");
      setObs("");
    }
  }, [open, defaultDate]);

  const { data: clientes = [] } = useQuery({
    queryKey: ["clientes-suggest", oficina_id, nome],
    enabled: !!oficina_id && nome.length >= 2,
    queryFn: async () => {
      const { data } = await supabase
        .from("clientes")
        .select("id, nome, telefone")
        .eq("oficina_id", oficina_id)
        .ilike("nome", `%${nome}%`)
        .limit(5);
      return data || [];
    },
  });

  async function salvar() {
    if (!nome.trim()) {
      toast.error("Informe o nome do cliente.");
      return;
    }
    if (nome.length > 120) {
      toast.error("Nome muito longo.");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("agendamentos").insert({
      oficina_id,
      data_entrada: data,
      cliente_nome: nome.trim(),
      cliente_telefone: telefone.trim() || null,
      veiculo_placa: placa.trim().toUpperCase() || null,
      veiculo_modelo: modelo.trim() || null,
      observacao: obs.trim() || null,
      confirmado: true,
      origem: "oficina",
    });
    setSaving(false);
    if (error) {
      toast.error("Erro ao agendar.");
      return;
    }
    toast.success("Agendamento criado!");
    onCreated();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Agendar entrada</DialogTitle>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">Data de entrada</label>
            <input
              type="date"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
          <div className="relative">
            <label className="mb-1 block text-xs text-muted-foreground">Cliente</label>
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome do cliente"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
            {clientes.length > 0 && nome.length >= 2 && (
              <div className="absolute z-10 mt-1 w-full rounded-md border border-border bg-popover shadow-lg">
                {clientes.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      setNome(c.nome);
                      setTelefone(c.telefone || "");
                    }}
                    className="block w-full px-3 py-2 text-left text-sm hover:bg-muted"
                  >
                    <div className="font-medium text-foreground">{c.nome}</div>
                    {c.telefone && (
                      <div className="text-xs text-muted-foreground">{c.telefone}</div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Telefone</label>
              <input
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(11) 99999-0000"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-muted-foreground">Placa</label>
              <input
                value={placa}
                onChange={(e) => setPlaca(e.target.value.toUpperCase())}
                placeholder="ABC1D23"
                maxLength={10}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm uppercase outline-none focus:border-primary"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">Modelo do veículo</label>
            <input
              value={modelo}
              onChange={(e) => setModelo(e.target.value)}
              placeholder="Ex: Honda Civic"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs text-muted-foreground">Observação</label>
            <textarea
              value={obs}
              onChange={(e) => setObs(e.target.value)}
              rows={2}
              placeholder="Detalhes do serviço a ser feito..."
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
        </div>
        <DialogFooter>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-lg border border-border bg-background px-4 py-2 text-sm text-muted-foreground hover:bg-muted"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={salvar}
            disabled={saving}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:brightness-110 disabled:opacity-50"
          >
            {saving ? "Salvando..." : "Agendar"}
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const OSEmAndamentoSection = ({ agendamentos }: { agendamentos: Agendamento[] }) => {
  const emAndamento = agendamentos.filter(
    (a: any) => a.status === "em_andamento" && a.data_prevista_saida,
  );

  if (emAndamento.length === 0) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="mb-6 rounded-lg border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <h3 className="text-sm font-semibold text-foreground">
          <Wrench className="mr-1.5 inline h-4 w-4 text-primary" />
          OS em andamento
        </h3>
        <span className="text-xs text-muted-foreground">
          {emAndamento.length} em execução
        </span>
      </div>
      <ul className="divide-y divide-border">
        {emAndamento.map((a: any) => {
          const entrada = parseISO(a.data_entrada);
          const saida = parseISO(a.data_prevista_saida);
          const totalMs = Math.max(saida.getTime() - entrada.getTime(), 24 * 60 * 60 * 1000);
          const decorridoMs = today.getTime() - entrada.getTime();
          const pct = Math.min(Math.max((decorridoMs / totalMs) * 100, 0), 100);
          const totalDias = Math.max(
            Math.round(totalMs / (24 * 60 * 60 * 1000)),
            1,
          );
          const diasDecorridos = Math.max(
            Math.round(decorridoMs / (24 * 60 * 60 * 1000)),
            0,
          );
          const atrasada = today.getTime() > saida.getTime();
          const barCls = atrasada
            ? "bg-red-500"
            : pct >= 80
              ? "bg-amber-500"
              : "bg-emerald-500";

          return (
            <li key={a.id} className="px-4 py-3">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-semibold text-foreground">
                      {a.cliente_nome || "Cliente"}
                    </span>
                    {atrasada && (
                      <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-semibold text-red-400">
                        Atrasada
                      </span>
                    )}
                  </div>
                  <div className="mt-0.5 flex flex-wrap gap-x-3 text-xs text-muted-foreground">
                    {a.veiculo_placa && (
                      <span>
                        <Car className="mr-1 inline h-3 w-3" />
                        {a.veiculo_placa}
                      </span>
                    )}
                    <span>
                      Entrada: {format(entrada, "dd/MM", { locale: ptBR })}
                    </span>
                    <span>
                      Saída prevista: {format(saida, "dd/MM", { locale: ptBR })}
                    </span>
                  </div>
                </div>
                <div className="text-right text-xs text-muted-foreground">
                  Dia {Math.min(diasDecorridos, totalDias)} de {totalDias}
                </div>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full ${barCls} transition-all`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default DemoAgenda;
