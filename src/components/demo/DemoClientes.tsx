import { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Search, Users, Phone, Mail, Car, Plus, ChevronRight, Calendar,
  Bell, RotateCcw, Wrench, MessageCircle, Trash2,
} from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
import EmptyModuleState from "./EmptyModuleState";
import OSFormModal from "./OSFormModal";

const STAGE_COLORS: Record<string, string> = {
  criado: "bg-muted text-muted-foreground",
  aguardando_carro: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
  em_atendimento: "bg-primary/15 text-primary border border-primary/30",
  pagamento: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
  entrega: "bg-purple-500/15 text-purple-400 border border-purple-500/30",
  finalizado: "bg-green-500/15 text-green-400 border border-green-500/30",
  recusado: "bg-red-500/15 text-red-400 border border-red-500/30",
};

const STAGE_LABELS: Record<string, string> = {
  criado: "Criado",
  aguardando_carro: "Aguardando carro",
  em_atendimento: "Em atendimento",
  pagamento: "Pagamento",
  entrega: "Entrega",
  finalizado: "Finalizado",
  recusado: "Recusado",
};

const TIPO_LEMBRETE_LABELS: Record<string, string> = {
  lembrete: "Lembrete",
  retorno: "Retorno",
  revisao: "Revisão",
  followup: "Follow-up",
};

const TIPO_LEMBRETE_ICONS: Record<string, typeof Bell> = {
  lembrete: Bell,
  retorno: RotateCcw,
  revisao: Wrench,
  followup: MessageCircle,
};

function getInitials(nome: string) {
  return nome
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function getClienteStatus(ultimaVisita: string | null, totalOs: number) {
  if (totalOs === 0) return { label: "Novo", cls: "bg-blue-500/15 text-blue-400" };
  if (!ultimaVisita) return { label: "Novo", cls: "bg-blue-500/15 text-blue-400" };
  const dias = Math.floor(
    (Date.now() - new Date(ultimaVisita).getTime()) / (1000 * 60 * 60 * 24),
  );
  if (dias <= 90) return { label: "Ativo", cls: "bg-green-500/15 text-green-400" };
  return { label: "Inativo", cls: "bg-red-500/15 text-red-400" };
}

const DemoClientes = () => {
  const { oficina_id } = useAuth();
  const [search, setSearch] = useState("");
  const [filtroStatus, setFiltroStatus] = useState<"todos" | "ativos" | "inativos">("todos");
  const [apenasComLembretesVencidos, setApenasComLembretesVencidos] = useState(false);
  const [selectedClienteId, setSelectedClienteId] = useState<string | null>(null);
  const [osModalOpen, setOsModalOpen] = useState(false);
  const [osModalClienteId, setOsModalClienteId] = useState<string | undefined>();

  const { data: clientes = [], isLoading } = useQuery({
    queryKey: ["clientes-crm", oficina_id],
    enabled: !!oficina_id,
    queryFn: async () => {
      const { data: cs } = await supabase
        .from("clientes")
        .select("id, nome, telefone, email, created_at");
      const { data: oss } = await supabase
        .from("ordens_servico")
        .select("id, cliente_id, valor_total, pagamento_confirmado, created_at");
      const { data: vs } = await supabase.from("veiculos").select("id, cliente_id, placa");

      return (cs || []).map((c) => {
        const clienteOs = (oss || []).filter((o) => o.cliente_id === c.id);
        const totalGasto = clienteOs
          .filter((o) => o.pagamento_confirmado)
          .reduce((sum, o) => sum + Number(o.valor_total || 0), 0);
        const ultimaVisita = clienteOs.length
          ? clienteOs.reduce((max, o) =>
              new Date(o.created_at) > new Date(max) ? o.created_at : max,
              clienteOs[0].created_at,
            )
          : null;
        const veiculosCliente = (vs || []).filter((v) => v.cliente_id === c.id);
        const placas = veiculosCliente.map((v) => v.placa || "").filter(Boolean);
        return {
          ...c,
          total_os: clienteOs.length,
          total_gasto: totalGasto,
          ultima_visita: ultimaVisita,
          total_veiculos: veiculosCliente.length,
          placas,
        };
      }).sort((a, b) => {
        if (!a.ultima_visita) return 1;
        if (!b.ultima_visita) return -1;
        return new Date(b.ultima_visita).getTime() - new Date(a.ultima_visita).getTime();
      });
    },
  });

  // Lembretes pendentes (todos da oficina, para banner e badges)
  const { data: lembretesPendentes = [] } = useQuery({
    queryKey: ["crm-lembretes-pendentes", oficina_id],
    enabled: !!oficina_id,
    queryFn: async () => {
      const hoje = format(new Date(), "yyyy-MM-dd");
      const { data } = await supabase
        .from("crm_lembretes")
        .select("id, cliente_id, data_lembrete")
        .eq("concluido", false)
        .lte("data_lembrete", hoje);
      return data || [];
    },
  });

  const clientesComLembreteVencido = useMemo(
    () => new Set(lembretesPendentes.map((l) => l.cliente_id)),
    [lembretesPendentes],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = clientes;

    if (q) {
      list = list.filter(
        (c) =>
          c.nome.toLowerCase().includes(q) ||
          (c.telefone || "").toLowerCase().includes(q) ||
          c.placas?.some((p) => p.toLowerCase().includes(q)),
      );
    }

    if (filtroStatus !== "todos") {
      list = list.filter((c) => {
        const s = getClienteStatus(c.ultima_visita, c.total_os).label;
        if (filtroStatus === "ativos") return s === "Ativo";
        if (filtroStatus === "inativos") return s === "Inativo";
        return true;
      });
    }

    if (apenasComLembretesVencidos) {
      list = list.filter((c) => clientesComLembreteVencido.has(c.id));
    }

    return list;
  }, [clientes, search, filtroStatus, apenasComLembretesVencidos, clientesComLembreteVencido]);

  const openClienteSheet = (id: string) => setSelectedClienteId(id);
  const closeSheet = () => setSelectedClienteId(null);

  const openNewOSForCliente = (clienteId?: string) => {
    setOsModalClienteId(clienteId);
    setOsModalOpen(true);
  };

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Carregando clientes...</p>;
  }

  if (clientes.length === 0) {
    return (
      <EmptyModuleState
        icon={Users}
        title="Nenhum cliente ainda"
        description="Os clientes aparecem automaticamente quando você cria a primeira OS. Não é necessário cadastrar manualmente."
        helperText="Vá ao módulo OS e crie sua primeira ordem de serviço para começar."
      />
    );
  }

  const totalLembretesVencidos = lembretesPendentes.length;

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wide">Clientes</h2>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome, telefone ou placa..."
            className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-primary placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {totalLembretesVencidos > 0 && (
        <button
          onClick={() => setApenasComLembretesVencidos((v) => !v)}
          className={`mb-4 flex w-full items-center gap-2 rounded-xl border px-4 py-3 text-left text-sm transition-all ${
            apenasComLembretesVencidos
              ? "border-amber-500/50 bg-amber-500/20 text-amber-200"
              : "border-amber-500/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/15"
          }`}
        >
          <Bell className="h-4 w-4 shrink-0" />
          <span className="flex-1">
            🔔 {totalLembretesVencidos} lembrete{totalLembretesVencidos > 1 ? "s" : ""} pendente
            {totalLembretesVencidos > 1 ? "s" : ""} para hoje ou vencido
            {totalLembretesVencidos > 1 ? "s" : ""}
          </span>
          <span className="text-xs opacity-80">
            {apenasComLembretesVencidos ? "Mostrar todos" : "Filtrar"}
          </span>
        </button>
      )}

      <div className="mb-4 flex gap-2">
        {([
          { key: "todos", label: "Todos" },
          { key: "ativos", label: "Ativos" },
          { key: "inativos", label: "Inativos" },
        ] as const).map((opt) => (
          <button
            key={opt.key}
            onClick={() => setFiltroStatus(opt.key)}
            className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
              filtroStatus === opt.key
                ? "bg-primary text-primary-foreground"
                : "bg-muted/40 text-muted-foreground hover:bg-muted"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full">
          <thead className="bg-muted/30">
            <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3">Cliente</th>
              <th className="px-4 py-3">Telefone</th>
              <th className="px-4 py-3 text-center">OS</th>
              <th className="px-4 py-3 text-right">Total gasto</th>
              <th className="px-4 py-3">Última visita</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-center">Veículos</th>
              <th className="w-8" />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-sm text-muted-foreground">
                  Nenhum cliente encontrado.
                </td>
              </tr>
            ) : (
              filtered.map((c) => {
                const status = getClienteStatus(c.ultima_visita, c.total_os);
                const temLembreteVencido = clientesComLembreteVencido.has(c.id);
                return (
                  <tr
                    key={c.id}
                    onClick={() => openClienteSheet(c.id)}
                    className="cursor-pointer border-t border-border transition-colors hover:bg-muted/30"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                            {getInitials(c.nome)}
                          </div>
                          {temLembreteVencido && (
                            <span className="absolute -right-0.5 -top-0.5 flex h-2.5 w-2.5">
                              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-75" />
                              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500" />
                            </span>
                          )}
                        </div>
                        <span className="text-sm font-medium text-foreground">{c.nome}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{c.telefone || "—"}</td>
                    <td className="px-4 py-3 text-center text-sm font-medium text-foreground">{c.total_os}</td>
                    <td className="px-4 py-3 text-right text-sm font-semibold text-foreground">
                      {formatBRL(c.total_gasto)}
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {c.ultima_visita
                        ? format(new Date(c.ultima_visita), "dd/MM/yyyy", { locale: ptBR })
                        : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${status.cls}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-muted-foreground">{c.total_veiculos}</td>
                    <td className="px-2 py-3 text-muted-foreground">
                      <ChevronRight className="h-4 w-4" />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <Sheet open={!!selectedClienteId} onOpenChange={(o) => !o && closeSheet()}>
        <SheetContent side="right" className="w-full overflow-y-auto p-0 sm:max-w-3xl">
          {selectedClienteId && (
            <ClienteDetailSheet
              clienteId={selectedClienteId}
              onNovaOS={() => openNewOSForCliente(selectedClienteId)}
            />
          )}
        </SheetContent>
      </Sheet>

      <OSFormModal
        open={osModalOpen}
        onOpenChange={(o) => {
          setOsModalOpen(o);
          if (!o) setOsModalClienteId(undefined);
        }}
        clienteId={osModalClienteId}
      />
    </>
  );
};

interface ClienteDetailSheetProps {
  clienteId: string;
  onNovaOS: () => void;
}

const ClienteDetailSheet = ({ clienteId, onNovaOS }: ClienteDetailSheetProps) => {
  const { oficina_id } = useAuth();
  const queryClient = useQueryClient();
  const [novoLembreteOpen, setNovoLembreteOpen] = useState(false);
  const [novoTipo, setNovoTipo] = useState<string>("lembrete");
  const [novoDescricao, setNovoDescricao] = useState("");
  const [novoData, setNovoData] = useState(format(addDays(new Date(), 7), "yyyy-MM-dd"));

  const { data: cliente } = useQuery({
    queryKey: ["cliente-detail", clienteId],
    queryFn: async () => {
      const { data } = await supabase
        .from("clientes")
        .select("*")
        .eq("id", clienteId)
        .maybeSingle();
      return data;
    },
  });

  const { data: veiculos = [] } = useQuery({
    queryKey: ["cliente-veiculos", clienteId],
    queryFn: async () => {
      const { data } = await supabase
        .from("veiculos")
        .select("*")
        .eq("cliente_id", clienteId)
        .order("created_at", { ascending: false });
      return data || [];
    },
  });

  const { data: ordens = [] } = useQuery({
    queryKey: ["cliente-ordens", clienteId],
    queryFn: async () => {
      const { data } = await supabase
        .from("ordens_servico")
        .select("id, stage, valor_total, pagamento_confirmado, created_at, veiculos(placa, marca, modelo), os_servicos(nome_servico)")
        .eq("cliente_id", clienteId)
        .order("created_at", { ascending: false });
      return data || [];
    },
  });

  const { data: lembretes = [] } = useQuery({
    queryKey: ["crm-lembretes", clienteId],
    queryFn: async () => {
      const { data } = await supabase
        .from("crm_lembretes")
        .select("*")
        .eq("cliente_id", clienteId)
        .order("data_lembrete", { ascending: true });
      return data || [];
    },
  });

  const totalGasto = useMemo(
    () =>
      ordens
        .filter((o) => o.pagamento_confirmado)
        .reduce((sum, o) => sum + Number(o.valor_total || 0), 0),
    [ordens],
  );

  const refreshLembretes = () => {
    queryClient.invalidateQueries({ queryKey: ["crm-lembretes", clienteId] });
    queryClient.invalidateQueries({ queryKey: ["crm-lembretes-pendentes", oficina_id] });
  };

  const toggleLembreteConcluido = async (id: string, concluido: boolean) => {
    const { error } = await supabase
      .from("crm_lembretes")
      .update({ concluido })
      .eq("id", id);
    if (error) {
      toast({ title: "Erro ao atualizar lembrete", description: error.message, variant: "destructive" });
      return;
    }
    refreshLembretes();
  };

  const removerLembrete = async (id: string) => {
    const { error } = await supabase.from("crm_lembretes").delete().eq("id", id);
    if (error) {
      toast({ title: "Erro ao remover", description: error.message, variant: "destructive" });
      return;
    }
    refreshLembretes();
  };

  const salvarLembrete = async () => {
    if (!novoDescricao.trim() || !novoData || !oficina_id) {
      toast({ title: "Preencha descrição e data", variant: "destructive" });
      return;
    }
    const { error } = await supabase.from("crm_lembretes").insert({
      oficina_id,
      cliente_id: clienteId,
      tipo: novoTipo,
      descricao: novoDescricao.trim(),
      data_lembrete: novoData,
    });
    if (error) {
      toast({ title: "Erro ao salvar", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Lembrete criado" });
    setNovoLembreteOpen(false);
    setNovoTipo("lembrete");
    setNovoDescricao("");
    setNovoData(format(addDays(new Date(), 7), "yyyy-MM-dd"));
    refreshLembretes();
  };

  if (!cliente) return null;

  const whatsappUrl = cliente.telefone
    ? `https://wa.me/55${cliente.telefone.replace(/\D/g, "")}`
    : null;

  const lembretesPendentes = lembretes.filter((l) => !l.concluido);
  const hoje = format(new Date(), "yyyy-MM-dd");

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-lg font-bold text-primary">
            {getInitials(cliente.nome)}
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">{cliente.nome}</h2>
            <p className="text-xs text-muted-foreground">
              Cliente desde {format(new Date(cliente.created_at), "MMM/yyyy", { locale: ptBR })}
            </p>
          </div>
        </div>
      </div>

      <div className="grid flex-1 gap-6 overflow-y-auto p-6 lg:grid-cols-2">
        <div className="space-y-5">
          <div className="space-y-2 rounded-xl border border-border bg-background p-4">
            {cliente.telefone && (
              <a
                href={whatsappUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <Phone className="h-4 w-4" /> {cliente.telefone}
              </a>
            )}
            {cliente.email && (
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="h-4 w-4" /> {cliente.email}
              </p>
            )}
            {!cliente.telefone && !cliente.email && (
              <p className="text-xs text-muted-foreground">Sem dados de contato.</p>
            )}
          </div>

          <div>
            <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
              <Car className="h-3.5 w-3.5" /> Veículos ({veiculos.length})
            </h3>
            {veiculos.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum veículo cadastrado.</p>
            ) : (
              <div className="space-y-2">
                {veiculos.map((v) => (
                  <div
                    key={v.id}
                    className="rounded-xl border border-border bg-background p-3"
                  >
                    <p className="text-sm font-semibold text-foreground">
                      {v.placa}{" "}
                      <span className="font-normal text-muted-foreground">
                        • {[v.marca, v.modelo].filter(Boolean).join(" ") || "—"}
                      </span>
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {[v.cor, v.ano].filter(Boolean).join(" • ") || "Sem detalhes"}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                <Bell className="h-3.5 w-3.5" /> Lembretes ({lembretesPendentes.length})
              </h3>
              <Dialog open={novoLembreteOpen} onOpenChange={setNovoLembreteOpen}>
                <DialogTrigger asChild>
                  <button className="flex items-center gap-1 rounded-lg border border-border bg-background px-2 py-1 text-xs font-medium text-foreground hover:bg-muted/40">
                    <Plus className="h-3 w-3" /> Adicionar
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Novo lembrete</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-3">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-muted-foreground">Tipo</label>
                      <Select value={novoTipo} onValueChange={setNovoTipo}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(TIPO_LEMBRETE_LABELS).map(([k, v]) => (
                            <SelectItem key={k} value={k}>{v}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-muted-foreground">Descrição</label>
                      <Input
                        value={novoDescricao}
                        onChange={(e) => setNovoDescricao(e.target.value)}
                        placeholder="Ex: Ligar para confirmar retorno"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-muted-foreground">Data</label>
                      <Input
                        type="date"
                        value={novoData}
                        onChange={(e) => setNovoData(e.target.value)}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <button
                      onClick={salvarLembrete}
                      className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:brightness-110"
                    >
                      Salvar
                    </button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>

            {lembretes.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhum lembrete cadastrado.</p>
            ) : (
              <div className="space-y-2">
                {lembretes.map((l) => {
                  const Icon = TIPO_LEMBRETE_ICONS[l.tipo] || Bell;
                  const vencido = !l.concluido && l.data_lembrete <= hoje;
                  return (
                    <div
                      key={l.id}
                      className={`flex items-start gap-2 rounded-lg border p-3 ${
                        l.concluido
                          ? "border-border bg-muted/20 opacity-60"
                          : vencido
                            ? "border-red-500/30 bg-red-500/5"
                            : "border-border bg-background"
                      }`}
                    >
                      <Checkbox
                        checked={l.concluido}
                        onCheckedChange={(v) => toggleLembreteConcluido(l.id, !!v)}
                        className="mt-0.5"
                      />
                      <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${vencido ? "text-red-400" : "text-primary"}`} />
                      <div className="min-w-0 flex-1">
                        <p className={`text-sm ${l.concluido ? "line-through text-muted-foreground" : "text-foreground"}`}>
                          {l.descricao}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {TIPO_LEMBRETE_LABELS[l.tipo]} •{" "}
                          {format(new Date(l.data_lembrete + "T00:00:00"), "dd/MM/yyyy", { locale: ptBR })}
                        </p>
                      </div>
                      <button
                        onClick={() => removerLembrete(l.id)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <button
            onClick={onNovaOS}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110"
          >
            <Plus className="h-4 w-4" /> Nova OS
          </button>
        </div>

        <div className="space-y-4 rounded-xl border border-primary/25 bg-primary/10 p-5">
          <div>
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Total gasto</p>
            <p className="text-3xl font-bold text-primary">{formatBRL(totalGasto)}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {ordens.length} OS no histórico
            </p>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">
              Histórico de OS
            </h4>
            {ordens.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma OS ainda.</p>
            ) : (
              <div className="space-y-2">
                {ordens.map((os) => {
                  const servicos = (os.os_servicos as any[] | null) || [];
                  const veiculo = os.veiculos as any;
                  return (
                    <div
                      key={os.id}
                      className="rounded-lg border border-border bg-background p-3"
                    >
                      <div className="mb-1 flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {format(new Date(os.created_at), "dd/MM/yyyy", { locale: ptBR })}
                        </div>
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                            STAGE_COLORS[os.stage] || "bg-muted text-muted-foreground"
                          }`}
                        >
                          {STAGE_LABELS[os.stage] || os.stage}
                        </span>
                      </div>
                      {veiculo?.placa && (
                        <p className="text-xs text-muted-foreground">
                          {veiculo.placa} • {[veiculo.marca, veiculo.modelo].filter(Boolean).join(" ")}
                        </p>
                      )}
                      <p className="mt-1 text-sm text-foreground">
                        {servicos.length > 0
                          ? servicos.map((s) => s.nome_servico).filter(Boolean).join(", ")
                          : "Sem serviços listados"}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-foreground">
                        {formatBRL(Number(os.valor_total || 0))}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoClientes;
