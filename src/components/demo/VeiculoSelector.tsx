import { useEffect, useMemo, useState } from "react";
import { Check, ChevronsUpDown, Plus } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import {
  TIPOS_VEICULO_ORDER,
  TIPO_VEICULO_LABELS,
  TipoVeiculo,
  getMarcasPorTipo,
  getModelosPorMarca,
  getVersoesPorModelo,
} from "@/data/veiculosCatalogo";

export interface VeiculoSelectorValue {
  tipo: TipoVeiculo | "";
  marca: string;
  modelo: string;
  versao: string;
  ano: string;
}

interface Props {
  value: VeiculoSelectorValue;
  onChange: (v: VeiculoSelectorValue) => void;
}

const VeiculoSelector = ({ value, onChange }: Props) => {
  const { oficina_id } = useAuth();
  const qc = useQueryClient();

  // Marcas customizadas da oficina (por tipo)
  const { data: customMarcas = [] } = useQuery({
    queryKey: ["veiculos_customizados_marcas", oficina_id, value.tipo],
    enabled: !!oficina_id && !!value.tipo,
    queryFn: async () => {
      const { data } = await supabase
        .from("veiculos_customizados")
        .select("marca")
        .eq("tipo", value.tipo)
        .is("modelo", null);
      return Array.from(new Set((data || []).map((r) => r.marca))).sort();
    },
  });

  // Modelos customizados da oficina (por tipo + marca)
  const { data: customModelos = [] } = useQuery({
    queryKey: ["veiculos_customizados_modelos", oficina_id, value.tipo, value.marca],
    enabled: !!oficina_id && !!value.tipo && !!value.marca,
    queryFn: async () => {
      const { data } = await supabase
        .from("veiculos_customizados")
        .select("modelo")
        .eq("tipo", value.tipo)
        .ilike("marca", value.marca)
        .not("modelo", "is", null);
      return Array.from(
        new Set(
          (data || [])
            .map((r) => r.modelo)
            .filter((m): m is string => !!m),
        ),
      ).sort();
    },
  });

  const catalogoMarcas = useMemo(
    () => (value.tipo ? getMarcasPorTipo(value.tipo) : []),
    [value.tipo],
  );

  const catalogoModelos = useMemo(
    () => (value.tipo && value.marca ? getModelosPorMarca(value.tipo, value.marca) : []),
    [value.tipo, value.marca],
  );

  const todasMarcas = useMemo(() => {
    const set = new Set<string>([...catalogoMarcas, ...customMarcas]);
    return Array.from(set).sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [catalogoMarcas, customMarcas]);

  const todosModelos = useMemo(() => {
    const set = new Set<string>([...catalogoModelos, ...customModelos]);
    return Array.from(set).sort((a, b) => a.localeCompare(b, "pt-BR"));
  }, [catalogoModelos, customModelos]);

  const versoesSugeridas = useMemo(
    () =>
      value.tipo && value.marca && value.modelo
        ? getVersoesPorModelo(value.tipo, value.marca, value.modelo)
        : [],
    [value.tipo, value.marca, value.modelo],
  );

  // Quando o tipo muda, limpa marca/modelo
  function handleTipoChange(novoTipo: TipoVeiculo) {
    onChange({ ...value, tipo: novoTipo, marca: "", modelo: "" });
  }

  function handleMarcaChange(novaMarca: string) {
    onChange({ ...value, marca: novaMarca, modelo: "" });
  }

  function handleModeloChange(novoModelo: string) {
    onChange({ ...value, modelo: novoModelo });
  }

  async function adicionarMarcaCustom(novaMarca: string) {
    const m = novaMarca.trim();
    if (!m || !value.tipo || !oficina_id) return;
    const { error } = await supabase.from("veiculos_customizados").insert({
      oficina_id,
      tipo: value.tipo,
      marca: m,
      modelo: null,
    });
    if (error && !error.message.includes("duplicate")) {
      toast.error("Erro ao salvar marca");
      return;
    }
    toast.success(`Marca "${m}" adicionada`);
    qc.invalidateQueries({ queryKey: ["veiculos_customizados_marcas"] });
    handleMarcaChange(m);
  }

  async function adicionarModeloCustom(novoModelo: string) {
    const m = novoModelo.trim();
    if (!m || !value.tipo || !value.marca || !oficina_id) return;
    const { error } = await supabase.from("veiculos_customizados").insert({
      oficina_id,
      tipo: value.tipo,
      marca: value.marca,
      modelo: m,
    });
    if (error && !error.message.includes("duplicate")) {
      toast.error("Erro ao salvar modelo");
      return;
    }
    toast.success(`Modelo "${m}" adicionado`);
    qc.invalidateQueries({ queryKey: ["veiculos_customizados_modelos"] });
    handleModeloChange(m);
  }

  return (
    <div className="rounded-lg border border-border bg-muted/20 p-4">
      <h4 className="mb-3 text-sm font-bold text-foreground">Veículo</h4>

      {/* Tipo */}
      <div className="mb-3">
        <label className="mb-1 block text-xs font-semibold text-foreground">
          Tipo do veículo *
        </label>
        <select
          value={value.tipo}
          onChange={(e) => handleTipoChange(e.target.value as TipoVeiculo)}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
        >
          <option value="">Selecione o tipo...</option>
          {TIPOS_VEICULO_ORDER.map((t) => (
            <option key={t} value={t}>
              {TIPO_VEICULO_LABELS[t]}
            </option>
          ))}
        </select>
      </div>

      {value.tipo && (
        <div className="grid gap-3 sm:grid-cols-2">
          {/* Marca */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-foreground">
              Marca *
            </label>
            <ComboboxAddable
              value={value.marca}
              options={todasMarcas}
              placeholder={value.tipo === "outro" ? "Adicionar marca..." : "Selecione a marca..."}
              emptyText="Nenhuma marca encontrada."
              addLabel="Adicionar nova marca:"
              onSelect={handleMarcaChange}
              onAdd={adicionarMarcaCustom}
            />
          </div>

          {/* Modelo */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-foreground">
              Modelo *
            </label>
            <ComboboxAddable
              value={value.modelo}
              options={todosModelos}
              placeholder={
                !value.marca
                  ? "Selecione a marca primeiro"
                  : "Selecione o modelo..."
              }
              emptyText="Nenhum modelo encontrado."
              addLabel="Adicionar novo modelo:"
              disabled={!value.marca}
              onSelect={handleModeloChange}
              onAdd={adicionarModeloCustom}
            />
          </div>

          {/* Versão */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-foreground">
              Versão
            </label>
            <ComboboxAddable
              value={value.versao}
              options={versoesSugeridas}
              placeholder={
                !value.modelo
                  ? "Selecione o modelo primeiro"
                  : versoesSugeridas.length
                    ? "Selecione a versão..."
                    : "Digite a versão..."
              }
              emptyText="Nenhuma versão sugerida."
              addLabel="Usar versão:"
              disabled={!value.modelo}
              onSelect={(v) => onChange({ ...value, versao: v })}
              onAdd={(v) => onChange({ ...value, versao: v })}
            />
          </div>

          {/* Ano */}
          <div>
            <label className="mb-1 block text-xs font-semibold text-foreground">
              Ano
            </label>
            <input
              type="number"
              min="1900"
              max="2100"
              value={value.ano}
              onChange={(e) => onChange({ ...value, ano: e.target.value })}
              placeholder="Ex: 2018"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
            />
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * Combobox com busca + opção de adicionar item novo.
 * Mostra "Outro / Adicionar X" quando o usuário digita algo que não existe.
 */
interface ComboboxAddableProps {
  value: string;
  options: string[];
  placeholder: string;
  emptyText: string;
  addLabel: string;
  disabled?: boolean;
  onSelect: (v: string) => void;
  onAdd: (v: string) => void;
}

const ComboboxAddable = ({
  value,
  options,
  placeholder,
  emptyText,
  addLabel,
  disabled,
  onSelect,
  onAdd,
}: ComboboxAddableProps) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [outroMode, setOutroMode] = useState(false);
  const [outroValue, setOutroValue] = useState("");

  const trimmed = search.trim();
  const exactExists =
    trimmed && options.some((o) => o.toLowerCase() === trimmed.toLowerCase());

  function resetAndClose() {
    setOpen(false);
    setSearch("");
    setOutroMode(false);
    setOutroValue("");
  }

  function confirmOutro() {
    const v = outroValue.trim();
    if (!v) return;
    onAdd(v);
    resetAndClose();
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "flex w-full items-center justify-between rounded-lg border border-border bg-background px-3 py-2 text-left text-sm outline-none transition-colors hover:border-primary/50 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50",
            !value && "text-muted-foreground",
          )}
        >
          <span className="truncate">{value || placeholder}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[--radix-popover-trigger-width] p-0"
        align="start"
      >
        {outroMode ? (
          <div className="p-3 space-y-2">
            <label className="block text-xs font-semibold text-foreground">
              {addLabel}
            </label>
            <input
              autoFocus
              value={outroValue}
              onChange={(e) => setOutroValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  confirmOutro();
                } else if (e.key === "Escape") {
                  setOutroMode(false);
                }
              }}
              placeholder="Digite aqui..."
              className="w-full rounded-md border border-border bg-background px-2 py-1.5 text-sm outline-none focus:border-primary"
            />
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setOutroMode(false)}
                className="rounded-md border border-border px-2 py-1 text-xs hover:bg-muted"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={confirmOutro}
                disabled={!outroValue.trim()}
                className="rounded-md bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground disabled:opacity-50"
              >
                Adicionar
              </button>
            </div>
          </div>
        ) : (
          <Command shouldFilter>
            <CommandInput
              placeholder="Buscar ou digitar novo..."
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              <CommandEmpty>{emptyText}</CommandEmpty>
              <CommandGroup>
                {options.map((opt) => (
                  <CommandItem
                    key={opt}
                    value={opt}
                    onSelect={() => {
                      onSelect(opt);
                      resetAndClose();
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === opt ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {opt}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Outro">
                {trimmed && !exactExists && (
                  <CommandItem
                    value={`__add__${trimmed}`}
                    onSelect={() => {
                      onAdd(trimmed);
                      resetAndClose();
                    }}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    {addLabel}{" "}
                    <span className="ml-1 font-semibold">{trimmed}</span>
                  </CommandItem>
                )}
                <CommandItem
                  value="__outro_manual__"
                  onSelect={() => {
                    setOutroValue(trimmed);
                    setOutroMode(true);
                  }}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Outro (digitar manualmente)
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        )}
      </PopoverContent>
    </Popover>
  );
};

export default VeiculoSelector;
