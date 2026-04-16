import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Star, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const avaliacaoSchema = z.object({
  nota: z.number().int().min(1, "Selecione uma nota").max(5),
  comentario: z.string().trim().max(1000, "Comentário muito longo").optional(),
  nome_cliente: z.string().trim().max(120, "Nome muito longo").optional(),
});

interface OSInfo {
  id: string;
  oficina_id: string;
  stage: string;
  cliente_nome: string | null;
  oficina_nome: string;
}

const Avaliacao = () => {
  const [searchParams] = useSearchParams();
  const osId = searchParams.get("os");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [osInfo, setOsInfo] = useState<OSInfo | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [alreadyExists, setAlreadyExists] = useState<{ nota: number; comentario: string | null } | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const [nota, setNota] = useState(0);
  const [hoverNota, setHoverNota] = useState(0);
  const [comentario, setComentario] = useState("");
  const [nomeCliente, setNomeCliente] = useState("");

  useEffect(() => {
    if (!osId) {
      setErrorMsg("Link de avaliação inválido.");
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const { data: os, error } = await supabase
          .from("ordens_servico")
          .select("id, oficina_id, stage, clientes(nome), oficinas(nome)")
          .eq("id", osId)
          .maybeSingle();

        if (error || !os) {
          setErrorMsg("Ordem de serviço não encontrada.");
          setLoading(false);
          return;
        }

        if (os.stage !== "finalizado") {
          setErrorMsg("Esta avaliação só fica disponível após a entrega do veículo.");
          setLoading(false);
          return;
        }

        setOsInfo({
          id: os.id,
          oficina_id: os.oficina_id,
          stage: os.stage,
          cliente_nome: (os.clientes as any)?.nome || null,
          oficina_nome: (os.oficinas as any)?.nome || "Oficina",
        });

        if ((os.clientes as any)?.nome) {
          setNomeCliente((os.clientes as any).nome);
        }

        // Check existing
        const { data: existing } = await supabase
          .from("avaliacoes")
          .select("nota, comentario")
          .eq("os_id", osId)
          .maybeSingle();

        if (existing) {
          setAlreadyExists(existing);
        }
      } catch (err: any) {
        setErrorMsg("Erro ao carregar avaliação.");
      } finally {
        setLoading(false);
      }
    })();
  }, [osId]);

  async function handleSubmit() {
    if (!osInfo) return;

    const parsed = avaliacaoSchema.safeParse({
      nota,
      comentario: comentario.trim() || undefined,
      nome_cliente: nomeCliente.trim() || undefined,
    });

    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("avaliacoes").insert({
        os_id: osInfo.id,
        oficina_id: osInfo.oficina_id,
        nota: parsed.data.nota,
        comentario: parsed.data.comentario || null,
        nome_cliente: parsed.data.nome_cliente || null,
      });

      if (error) {
        if (error.code === "23505") {
          toast.error("Esta OS já foi avaliada.");
        } else {
          toast.error("Não foi possível enviar a avaliação. Tente novamente.");
        }
        return;
      }

      setSubmitted(true);
      toast.success("Avaliação enviada. Obrigado!");
    } catch (err) {
      toast.error("Erro inesperado.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (errorMsg) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-md rounded-2xl border border-border bg-card p-8 text-center">
          <p className="text-base text-foreground">{errorMsg}</p>
        </div>
      </div>
    );
  }

  if (alreadyExists || submitted) {
    const finalNota = alreadyExists?.nota ?? nota;
    const finalComentario = alreadyExists?.comentario ?? (comentario.trim() || null);

    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-center shadow-lg">
          <CheckCircle2 className="mx-auto mb-4 h-12 w-12 text-green-400" />
          <h1 className="text-xl font-bold text-foreground">Obrigado pela avaliação!</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Seu feedback ajuda a {osInfo?.oficina_nome} a melhorar sempre.
          </p>

          <div className="mt-6 flex justify-center gap-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                className={`h-7 w-7 ${i <= finalNota ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"}`}
              />
            ))}
          </div>

          {finalComentario && (
            <p className="mt-4 rounded-xl border border-border bg-muted/30 p-4 text-sm italic text-foreground">
              “{finalComentario}”
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-lg">
        <h1 className="text-2xl font-bold text-foreground">Como foi seu atendimento?</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Avalie o serviço prestado pela <strong className="text-foreground">{osInfo?.oficina_nome}</strong>.
        </p>

        {/* Stars */}
        <div className="mt-6 flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((i) => {
            const active = i <= (hoverNota || nota);
            return (
              <button
                key={i}
                type="button"
                onClick={() => setNota(i)}
                onMouseEnter={() => setHoverNota(i)}
                onMouseLeave={() => setHoverNota(0)}
                className="transition-transform hover:scale-110"
                aria-label={`Nota ${i}`}
              >
                <Star className={`h-10 w-10 ${active ? "fill-amber-400 text-amber-400" : "text-muted-foreground/40"}`} />
              </button>
            );
          })}
        </div>

        {nota > 0 && (
          <p className="mt-2 text-center text-xs text-muted-foreground">
            {["", "Péssimo", "Ruim", "Regular", "Bom", "Excelente"][nota]}
          </p>
        )}

        {/* Nome */}
        <div className="mt-6">
          <label className="mb-1 block text-xs font-medium text-muted-foreground">Seu nome (opcional)</label>
          <input
            type="text"
            value={nomeCliente}
            maxLength={120}
            onChange={(e) => setNomeCliente(e.target.value)}
            className="h-11 w-full rounded-xl border border-border bg-background px-3 text-sm outline-none focus:border-primary"
          />
        </div>

        {/* Comentário */}
        <div className="mt-4">
          <label className="mb-1 block text-xs font-medium text-muted-foreground">
            Deixe um comentário (opcional)
          </label>
          <textarea
            value={comentario}
            onChange={(e) => setComentario(e.target.value)}
            rows={4}
            maxLength={1000}
            placeholder="Conte como foi sua experiência..."
            className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary"
          />
          <p className="mt-1 text-right text-[10px] text-muted-foreground">{comentario.length}/1000</p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={submitting || nota === 0}
          className="mt-6 w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {submitting ? "Enviando..." : "Enviar avaliação"}
        </button>
      </div>
    </div>
  );
};

export default Avaliacao;
