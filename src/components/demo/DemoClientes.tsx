import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import {
  Search, Users, Phone, Mail, Car, Plus, ChevronRight, Calendar,
} from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
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

const DemoClientes = () => {
  const { oficina_id } = useAuth();
  const [search, setSearch] = useState("");
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
      const { data: vs } = await supabase.from("veiculos").select("id, cliente_id");

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
        const totalVeiculos = (vs || []).filter((v) => v.cliente_id === c.id).length;
        return {
          ...c,
          total_os: clienteOs.length,
          total_gasto: totalGasto,
          ultima_visita: ultimaVisita,
          total_veiculos: totalVeiculos,
        };
      }).sort((a, b) => {
        if (!a.ultima_visita) return 1;
        if (!b.ultima_visita) return -1;
        return new Date(b.ultima_visita).getTime() - new Date(a.ultima_visita).getTime();
      });
    },
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return clientes;
    return clientes.filter(
      (c) =>
        c.nome.toLowerCase().includes(q) ||
        (c.telefone || "").toLowerCase().includes(q),
    );
  }, [clientes, search]);

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

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wide">Clientes</h2>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nome ou telefone..."
            className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-primary placeholder:text-muted-foreground"
          />
        </div>
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
              <th className="px-4 py-3 text-center">Veículos</th>
              <th className="w-8" />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-muted-foreground">
                  Nenhum cliente encontrado.
                </td>
              </tr>
            ) : (
              filtered.map((c) => (
                <tr
                  key={c.id}
                  onClick={() => openClienteSheet(c.id)}
                  className="cursor-pointer border-t border-border transition-colors hover:bg-muted/30"
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                        {getInitials(c.nome)}
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
                  <td className="px-4 py-3 text-center text-sm text-muted-foreground">{c.total_veiculos}</td>
                  <td className="px-2 py-3 text-muted-foreground">
                    <ChevronRight className="h-4 w-4" />
                  </td>
                </tr>
              ))
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

  const totalGasto = useMemo(
    () =>
      ordens
        .filter((o) => o.pagamento_confirmado)
        .reduce((sum, o) => sum + Number(o.valor_total || 0), 0),
    [ordens],
  );

  if (!cliente) return null;

  const whatsappUrl = cliente.telefone
    ? `https://wa.me/55${cliente.telefone.replace(/\D/g, "")}`
    : null;

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
