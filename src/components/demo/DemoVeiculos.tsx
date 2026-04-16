import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Car, Search, ChevronRight, Calendar, User, Phone } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import EmptyModuleState from "./EmptyModuleState";

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

function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

const DemoVeiculos = () => {
  const { oficina_id } = useAuth();
  const [search, setSearch] = useState("");
  const [selectedVeiculoId, setSelectedVeiculoId] = useState<string | null>(null);

  const { data: veiculos = [], isLoading } = useQuery({
    queryKey: ["veiculos-list", oficina_id],
    enabled: !!oficina_id,
    queryFn: async () => {
      const { data: vs } = await supabase
        .from("veiculos")
        .select("*, clientes(nome, telefone)");
      const { data: oss } = await supabase
        .from("ordens_servico")
        .select("id, veiculo_id, created_at");

      return (vs || [])
        .map((v) => {
          const veicOs = (oss || []).filter((o) => o.veiculo_id === v.id);
          const ultimaOs = veicOs.length
            ? veicOs.reduce(
                (max, o) => (new Date(o.created_at) > new Date(max) ? o.created_at : max),
                veicOs[0].created_at,
              )
            : null;
          return {
            ...v,
            cliente_nome: (v.clientes as any)?.nome || "—",
            cliente_telefone: (v.clientes as any)?.telefone || null,
            total_os: veicOs.length,
            ultima_os: ultimaOs,
          };
        })
        .sort((a, b) => {
          if (!a.ultima_os) return 1;
          if (!b.ultima_os) return -1;
          return new Date(b.ultima_os).getTime() - new Date(a.ultima_os).getTime();
        });
    },
  });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return veiculos;
    return veiculos.filter(
      (v) =>
        (v.placa || "").toLowerCase().includes(q) ||
        (v.modelo || "").toLowerCase().includes(q) ||
        (v.marca || "").toLowerCase().includes(q),
    );
  }, [veiculos, search]);

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Carregando veículos...</p>;
  }

  if (veiculos.length === 0) {
    return (
      <EmptyModuleState
        icon={Car}
        title="Nenhum veículo cadastrado"
        description="Os veículos aparecem automaticamente quando você cria a primeira OS para um cliente."
        helperText="Vá ao módulo OS e crie sua primeira ordem de serviço."
      />
    );
  }

  return (
    <>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-sm font-bold uppercase tracking-wide">Veículos</h2>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por placa, modelo ou marca..."
            className="h-9 w-full rounded-lg border border-border bg-background pl-9 pr-3 text-sm outline-none focus:border-primary placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border">
        <table className="w-full">
          <thead className="bg-muted/30">
            <tr className="text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              <th className="px-4 py-3">Placa</th>
              <th className="px-4 py-3">Marca / Modelo</th>
              <th className="px-4 py-3">Cor / Ano</th>
              <th className="px-4 py-3">Proprietário</th>
              <th className="px-4 py-3 text-center">OS</th>
              <th className="px-4 py-3">Última visita</th>
              <th className="w-8" />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-sm text-muted-foreground">
                  Nenhum veículo encontrado.
                </td>
              </tr>
            ) : (
              filtered.map((v) => (
                <tr
                  key={v.id}
                  onClick={() => setSelectedVeiculoId(v.id)}
                  className="cursor-pointer border-t border-border transition-colors hover:bg-muted/30"
                >
                  <td className="px-4 py-3 text-sm font-semibold text-foreground">{v.placa}</td>
                  <td className="px-4 py-3 text-sm text-foreground">
                    {[v.marca, v.modelo].filter(Boolean).join(" ") || "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {[v.cor, v.ano].filter(Boolean).join(" • ") || "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-foreground">{v.cliente_nome}</td>
                  <td className="px-4 py-3 text-center text-sm font-medium text-foreground">
                    {v.total_os}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {v.ultima_os
                      ? format(new Date(v.ultima_os), "dd/MM/yyyy", { locale: ptBR })
                      : "—"}
                  </td>
                  <td className="px-2 py-3 text-muted-foreground">
                    <ChevronRight className="h-4 w-4" />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <Sheet open={!!selectedVeiculoId} onOpenChange={(o) => !o && setSelectedVeiculoId(null)}>
        <SheetContent side="right" className="w-full overflow-y-auto p-0 sm:max-w-2xl">
          {selectedVeiculoId && <VeiculoDetailSheet veiculoId={selectedVeiculoId} />}
        </SheetContent>
      </Sheet>
    </>
  );
};

interface VeiculoDetailSheetProps {
  veiculoId: string;
}

const VeiculoDetailSheet = ({ veiculoId }: VeiculoDetailSheetProps) => {
  const { data: veiculo } = useQuery({
    queryKey: ["veiculo-detail", veiculoId],
    queryFn: async () => {
      const { data } = await supabase
        .from("veiculos")
        .select("*, clientes(nome, telefone)")
        .eq("id", veiculoId)
        .maybeSingle();
      return data;
    },
  });

  const { data: ordens = [] } = useQuery({
    queryKey: ["veiculo-ordens", veiculoId],
    queryFn: async () => {
      const { data } = await supabase
        .from("ordens_servico")
        .select(
          "id, stage, valor_total, pagamento_confirmado, created_at, colaboradores(nome), os_servicos(nome_servico)",
        )
        .eq("veiculo_id", veiculoId)
        .order("created_at", { ascending: false });
      return data || [];
    },
  });

  if (!veiculo) return null;
  const cliente = veiculo.clientes as any;

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-border bg-card px-6 py-4">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/15 text-primary">
            <Car className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-foreground">{veiculo.placa}</h2>
            <p className="text-xs text-muted-foreground">
              {[veiculo.marca, veiculo.modelo].filter(Boolean).join(" ") || "Sem modelo"}
              {veiculo.ano && ` • ${veiculo.ano}`}
              {veiculo.cor && ` • ${veiculo.cor}`}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto p-6">
        <div className="rounded-xl border border-border bg-background p-4">
          <h3 className="mb-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Proprietário
          </h3>
          <p className="flex items-center gap-2 text-sm text-foreground">
            <User className="h-4 w-4 text-muted-foreground" /> {cliente?.nome || "—"}
          </p>
          {cliente?.telefone && (
            <a
              href={`https://wa.me/55${cliente.telefone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <Phone className="h-4 w-4" /> {cliente.telefone}
            </a>
          )}
        </div>

        <div>
          <h3 className="mb-3 text-xs font-bold uppercase tracking-wide text-muted-foreground">
            Histórico de OS ({ordens.length})
          </h3>
          {ordens.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nenhuma OS registrada para este veículo.</p>
          ) : (
            <div className="space-y-2">
              {ordens.map((os) => {
                const servicos = (os.os_servicos as any[] | null) || [];
                const colaborador = os.colaboradores as any;
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
                    <p className="mt-1 text-sm text-foreground">
                      {servicos.length > 0
                        ? servicos.map((s) => s.nome_servico).filter(Boolean).join(", ")
                        : "Sem serviços listados"}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <p className="text-xs text-muted-foreground">
                        {colaborador?.nome ? `Atendido por ${colaborador.nome}` : "Sem responsável"}
                      </p>
                      <p className="text-sm font-semibold text-foreground">
                        {formatBRL(Number(os.valor_total || 0))}
                        {os.pagamento_confirmado && (
                          <span className="ml-1 text-[10px] text-green-400">✓ pago</span>
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DemoVeiculos;
