import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CalendarDays, Loader2, CheckCircle2 } from "lucide-react";
import { addDays, format, isSameDay, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";

interface OficinaPublica {
  id: string;
  nome: string;
  slug: string;
  telefone: string | null;
  endereco: string | null;
  logo_url: string | null;
}
interface ConfigPublica {
  limite_por_dia: number;
  modo_cliente_ativo: boolean;
  dias_antecedencia_min: number;
  dias_antecedencia_max: number;
}
interface Ocupacao {
  data: string;
  count: number;
}

const AgendaPublica = () => {
  const { slug } = useParams<{ slug: string }>();
  const [loading, setLoading] = useState(true);
  const [oficina, setOficina] = useState<OficinaPublica | null>(null);
  const [config, setConfig] = useState<ConfigPublica | null>(null);
  const [ocupacao, setOcupacao] = useState<Ocupacao[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [placa, setPlaca] = useState("");
  const [modelo, setModelo] = useState("");
  const [obs, setObs] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);

  async function carregar() {
    if (!slug) return;
    setLoading(true);
    const { data, error } = await supabase.rpc("get_oficina_publica_by_slug", { _slug: slug });
    setLoading(false);
    if (error || !data) {
      setErro("Oficina não encontrada.");
      return;
    }
    const d = data as unknown as { oficina: OficinaPublica; config: ConfigPublica; ocupacao_por_dia: Ocupacao[] };
    if (!d.config?.modo_cliente_ativo) {
      setOficina(d.oficina);
      setConfig(d.config);
      setErro("Esta oficina não está aceitando agendamentos online no momento.");
      return;
    }
    setOficina(d.oficina);
    setConfig(d.config);
    setOcupacao(d.ocupacao_por_dia || []);
  }

  useEffect(() => {
    carregar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

  const dias = useMemo(() => {
    if (!config) return [];
    const arr: Date[] = [];
    for (let i = config.dias_antecedencia_min; i <= config.dias_antecedencia_max; i++) {
      arr.push(addDays(new Date(), i));
    }
    return arr;
  }, [config]);

  function vagasDoDia(d: Date) {
    if (!config) return 0;
    const found = ocupacao.find((o) => isSameDay(parseISO(o.data), d));
    const usadas = found?.count || 0;
    return Math.max(0, config.limite_por_dia - usadas);
  }

  async function agendar() {
    if (!slug || !selectedDate) return;
    if (!nome.trim()) {
      toast.error("Informe seu nome.");
      return;
    }
    setEnviando(true);
    const { error } = await supabase.rpc("criar_agendamento_publico", {
      _slug: slug,
      _data_entrada: selectedDate,
      _cliente_nome: nome.trim(),
      _cliente_telefone: telefone.trim() || null,
      _veiculo_placa: placa.trim().toUpperCase() || null,
      _veiculo_modelo: modelo.trim() || null,
      _observacao: obs.trim() || null,
    });
    setEnviando(false);
    if (error) {
      toast.error(error.message || "Erro ao agendar.");
      return;
    }
    setSucesso(true);
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (erro) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="max-w-md rounded-lg border border-border bg-card p-6 text-center">
          {oficina?.logo_url && (
            <img
              src={oficina.logo_url}
              alt={oficina.nome}
              className="mx-auto mb-3 h-16 w-16 rounded-full object-cover"
            />
          )}
          {oficina?.nome && (
            <h1 className="mb-1 text-lg font-bold text-foreground">{oficina.nome}</h1>
          )}
          <p className="text-sm text-muted-foreground">{erro}</p>
        </div>
      </div>
    );
  }

  if (sucesso) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="max-w-md rounded-lg border border-border bg-card p-8 text-center">
          <CheckCircle2 className="mx-auto mb-3 h-12 w-12 text-emerald-400" />
          <h1 className="mb-2 text-xl font-bold text-foreground">Agendamento solicitado!</h1>
          <p className="text-sm text-muted-foreground">
            A oficina <strong>{oficina?.nome}</strong> recebeu seu pedido para{" "}
            <strong>{format(parseISO(selectedDate!), "dd/MM/yyyy", { locale: ptBR })}</strong> e
            entrará em contato para confirmar.
          </p>
          {oficina?.telefone && (
            <a
              href={`tel:${oficina.telefone}`}
              className="mt-4 inline-block text-sm text-primary hover:underline"
            >
              Falar com a oficina: {oficina.telefone}
            </a>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3 rounded-lg border border-border bg-card p-4">
          {oficina?.logo_url && (
            <img
              src={oficina.logo_url}
              alt={oficina.nome}
              className="h-14 w-14 shrink-0 rounded-full object-cover"
            />
          )}
          <div>
            <h1 className="text-lg font-bold text-foreground">{oficina?.nome}</h1>
            {oficina?.endereco && (
              <p className="text-xs text-muted-foreground">{oficina.endereco}</p>
            )}
          </div>
        </div>

        <div className="mb-4 flex items-center gap-2">
          <CalendarDays className="h-5 w-5 text-primary" />
          <h2 className="text-base font-semibold text-foreground">
            Escolha a data para deixar seu veículo
          </h2>
        </div>

        {/* Calendário */}
        <div className="mb-6 grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
          {dias.map((d) => {
            const dataStr = format(d, "yyyy-MM-dd");
            const vagas = vagasDoDia(d);
            const disabled = vagas === 0;
            const sel = selectedDate === dataStr;
            return (
              <button
                key={dataStr}
                type="button"
                disabled={disabled}
                onClick={() => setSelectedDate(dataStr)}
                className={`rounded-lg border p-3 text-left transition-all ${
                  disabled
                    ? "cursor-not-allowed border-border bg-muted/20 opacity-50"
                    : sel
                    ? "border-primary bg-primary/15 ring-2 ring-primary"
                    : "border-border bg-card hover:border-primary/50"
                }`}
              >
                <div className="text-[10px] font-bold uppercase tracking-wide text-muted-foreground">
                  {format(d, "EEE", { locale: ptBR })}
                </div>
                <div className="text-base font-bold text-foreground">
                  {format(d, "dd/MM", { locale: ptBR })}
                </div>
                <div className={`mt-1 text-[11px] ${disabled ? "text-red-400" : "text-emerald-400"}`}>
                  {disabled ? "Sem vagas" : `${vagas} vaga${vagas !== 1 ? "s" : ""}`}
                </div>
              </button>
            );
          })}
        </div>

        {/* Form */}
        {selectedDate && (
          <div className="rounded-lg border border-border bg-card p-4">
            <h3 className="mb-3 text-sm font-semibold text-foreground">
              Seus dados — entrada em{" "}
              <span className="text-primary">
                {format(parseISO(selectedDate), "dd/MM/yyyy", { locale: ptBR })}
              </span>
            </h3>
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">Seu nome *</label>
                <input
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  maxLength={120}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="mb-1 block text-xs text-muted-foreground">Telefone</label>
                  <input
                    value={telefone}
                    onChange={(e) => setTelefone(e.target.value)}
                    placeholder="(11) 99999-0000"
                    maxLength={30}
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
                  placeholder="Ex: Honda Civic 2020"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs text-muted-foreground">
                  Observação (o que precisa fazer?)
                </label>
                <textarea
                  value={obs}
                  onChange={(e) => setObs(e.target.value)}
                  rows={3}
                  maxLength={500}
                  placeholder="Ex: Troca de óleo + revisão geral"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>
              <button
                type="button"
                onClick={agendar}
                disabled={enviando}
                className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 disabled:opacity-50"
              >
                {enviando ? "Enviando..." : "Solicitar agendamento"}
              </button>
              <p className="text-center text-[11px] text-muted-foreground">
                A oficina entrará em contato para confirmar seu agendamento.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgendaPublica;
