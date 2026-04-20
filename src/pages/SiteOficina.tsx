import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, MapPin, Phone, Star, MessageCircle, Wrench } from "lucide-react";

type Servico = { id: string; nome: string; descricao: string | null; preco_base: number };
type Oficina = {
  id: string;
  nome: string;
  slug: string;
  telefone: string | null;
  endereco: string | null;
  logo_url: string | null;
  landing_template: number;
  landing_descricao: string | null;
  google_review_url: string | null;
};
type SiteData = {
  oficina: Oficina;
  servicos: Servico[];
  avaliacoes: { media: number; total: number };
};

const formatBRL = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

const waLink = (telefone: string | null, nome: string) => {
  if (!telefone) return "#";
  const digits = telefone.replace(/\D/g, "");
  const num = digits.startsWith("55") ? digits : `55${digits}`;
  const msg = encodeURIComponent(`Olá ${nome}, gostaria de um orçamento.`);
  return `https://wa.me/${num}?text=${msg}`;
};

const Footer = () => (
  <footer className="border-t border-border/40 py-6 text-center text-xs text-muted-foreground">
    Criado com{" "}
    <Link to="/" className="font-semibold text-primary hover:underline">
      ONficina
    </Link>
  </footer>
);

const Stars = ({ media, total }: { media: number; total: number }) => {
  if (!total) return null;
  return (
    <div className="flex items-center gap-1.5 text-sm">
      <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
      <span className="font-semibold">{media.toFixed(1)}</span>
      <span className="opacity-70">({total} avaliações)</span>
    </div>
  );
};

// ============ TEMPLATE 1 — Dark / Bold / Funilaria ============
const Template1 = ({ data }: { data: SiteData }) => {
  const { oficina, servicos, avaliacoes } = data;
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50">
      <header className="border-b border-zinc-800 px-4 py-6">
        <div className="mx-auto flex max-w-5xl items-center gap-4">
          {oficina.logo_url && (
            <img src={oficina.logo_url} alt={oficina.nome} className="h-14 w-14 rounded-full object-cover" />
          )}
          <div className="flex-1">
            <h1 className="text-2xl font-bold uppercase tracking-tight">{oficina.nome}</h1>
            <Stars media={avaliacoes.media} total={avaliacoes.total} />
          </div>
        </div>
      </header>

      <section className="px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <p className="mb-2 text-sm font-bold uppercase tracking-widest text-amber-500">
            Funilaria & Pintura
          </p>
          <h2 className="mb-6 text-3xl font-bold leading-snug md:text-5xl">
            {oficina.landing_descricao || "Restauração que devolve o brilho do seu carro."}
          </h2>
          <a
            href={waLink(oficina.telefone, oficina.nome)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-md bg-amber-500 px-6 py-3 font-bold uppercase tracking-wide text-zinc-950 transition hover:bg-amber-400"
          >
            <MessageCircle className="h-5 w-5" /> Chamar no WhatsApp
          </a>
        </div>
      </section>

      {servicos.length > 0 && (
        <section className="border-t border-zinc-800 px-4 py-12">
          <div className="mx-auto max-w-5xl">
            <h3 className="mb-6 text-xs font-bold uppercase tracking-widest text-amber-500">
              Nossos serviços
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              {servicos.map((s) => (
                <div key={s.id} className="border border-zinc-800 bg-zinc-900 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="font-semibold uppercase">{s.nome}</h4>
                    <span className="whitespace-nowrap text-amber-500">
                      a partir de {formatBRL(Number(s.preco_base))}
                    </span>
                  </div>
                  {s.descricao && <p className="mt-2 text-sm text-zinc-400">{s.descricao}</p>}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-zinc-800 px-4 py-10">
        <div className="mx-auto max-w-5xl space-y-3 text-sm">
          {oficina.endereco && (
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-amber-500" /> {oficina.endereco}
            </p>
          )}
          {oficina.telefone && (
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-amber-500" /> {oficina.telefone}
            </p>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

// ============ TEMPLATE 2 — White / Clean / Estética ============
const Template2 = ({ data }: { data: SiteData }) => {
  const { oficina, servicos, avaliacoes } = data;
  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <header className="px-4 py-10">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-3 text-center">
          {oficina.logo_url && (
            <img
              src={oficina.logo_url}
              alt={oficina.nome}
              className="h-28 w-28 rounded-full object-cover shadow-md"
            />
          )}
          <h1 className="text-3xl font-light tracking-wide">{oficina.nome}</h1>
          <div className="mx-auto w-16 border-t border-zinc-200" />
          {oficina.landing_descricao && (
            <p className="max-w-xl text-sm leading-relaxed text-zinc-500">
              {oficina.landing_descricao}
            </p>
          )}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            {servicos.length > 0 && (
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-2 text-center">
                <p className="text-lg font-semibold text-zinc-900">{servicos.length}</p>
                <p className="text-[10px] uppercase tracking-wider text-zinc-500">
                  Serviços disponíveis
                </p>
              </div>
            )}
            {avaliacoes.total > 0 && (
              <div className="rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-2">
                <Stars media={avaliacoes.media} total={avaliacoes.total} />
              </div>
            )}
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-xs font-medium text-emerald-700">
              Orçamento grátis
            </div>
          </div>
          <a
            href={waLink(oficina.telefone, oficina.nome)}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-zinc-900 px-6 py-3 text-sm font-medium transition hover:bg-zinc-900 hover:text-white"
          >
            <MessageCircle className="h-4 w-4" /> Falar no WhatsApp
          </a>
        </div>
      </header>

      {servicos.length > 0 && (
        <section className="bg-zinc-50 px-4 py-16">
          <div className="mx-auto max-w-4xl">
            <h3 className="mb-8 text-center text-xs font-medium uppercase tracking-[0.3em] text-zinc-500">
              Serviços
            </h3>
            <div className="grid gap-3 md:grid-cols-3">
              {servicos.map((s, idx) => (
                <div
                  key={s.id}
                  className="rounded-lg border border-transparent bg-white p-5 shadow-sm transition hover:border-zinc-300 hover:shadow-md"
                >
                  <p className="mb-3 text-3xl font-light text-zinc-300">
                    {String(idx + 1).padStart(2, "0")}
                  </p>
                  <h4 className="text-sm font-semibold">{s.nome}</h4>
                  {s.descricao && <p className="mt-1 text-xs text-zinc-500">{s.descricao}</p>}
                  <p className="mt-3 text-sm font-medium">
                    {formatBRL(Number(s.preco_base))}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="px-4 py-12">
        <div className="mx-auto flex max-w-3xl flex-col items-center gap-2 text-center text-sm text-zinc-600">
          {oficina.endereco && (
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4" /> {oficina.endereco}
            </p>
          )}
          {oficina.telefone && (
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4" /> {oficina.telefone}
            </p>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

// ============ TEMPLATE 3 — Primary color / Energético ============
const Template3 = ({ data }: { data: SiteData }) => {
  const { oficina, servicos, avaliacoes } = data;
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="bg-gradient-to-br from-primary to-primary/70 px-4 py-12 text-primary-foreground">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-4 text-center md:flex-row md:text-left">
          {oficina.logo_url && (
            <img
              src={oficina.logo_url}
              alt={oficina.nome}
              className="h-28 w-28 rounded-full border-4 border-primary-foreground/30 object-cover shadow-xl"
            />
          )}
          <div className="flex-1">
            <h1 className="text-4xl font-extrabold">{oficina.nome}</h1>
            <p className="mt-2 text-lg opacity-90">
              {oficina.landing_descricao || "Energia e qualidade para o seu veículo."}
            </p>
            <div className="mt-3 flex justify-center md:justify-start">
              <Stars media={avaliacoes.media} total={avaliacoes.total} />
            </div>
          </div>
          <a
            href={waLink(oficina.telefone, oficina.nome)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-primary-foreground px-6 py-3 font-bold text-primary shadow-lg transition hover:scale-105"
          >
            <MessageCircle className="h-5 w-5" /> WhatsApp
          </a>
        </div>
      </header>

      {servicos.length > 0 && (
        <section className="px-4 py-12">
          <div className="mx-auto max-w-5xl">
            <h3 className="mb-6 text-center text-2xl font-extrabold">
              O que fazemos por você
            </h3>
            <div className="grid gap-4 md:grid-cols-3">
              {servicos.map((s) => (
                <div
                  key={s.id}
                  className="rounded-2xl border-2 border-primary/20 bg-card p-5 transition hover:border-primary hover:shadow-lg"
                >
                  <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Wrench className="h-5 w-5 text-primary" />
                  </div>
                  <h4 className="font-bold">{s.nome}</h4>
                  {s.descricao && (
                    <p className="mt-1 text-sm text-muted-foreground">{s.descricao}</p>
                  )}
                  <p className="mt-3 font-bold text-primary">
                    {formatBRL(Number(s.preco_base))}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-muted/30 px-4 py-10">
        <div className="mx-auto max-w-5xl space-y-3 text-sm">
          {oficina.endereco && (
            <p className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" /> {oficina.endereco}
            </p>
          )}
          {oficina.telefone && (
            <p className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-primary" /> {oficina.telefone}
            </p>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

const SiteOficina = () => {
  const { slug } = useParams<{ slug: string }>();
  const [data, setData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;
    document.title = "Carregando...";
    (async () => {
      const { data: res, error } = await supabase.rpc("get_site_oficina_by_slug" as any, {
        _slug: slug,
      });
      if (error || !res) {
        setNotFound(true);
        document.title = "Site não encontrado";
      } else {
        const parsed = res as unknown as SiteData;
        setData(parsed);
        document.title = `${parsed.oficina.nome} — Oficina`;
        const meta = document.querySelector('meta[name="description"]');
        const desc =
          parsed.oficina.landing_descricao ||
          `${parsed.oficina.nome} — serviços automotivos.`;
        if (meta) meta.setAttribute("content", desc.slice(0, 160));
      }
      setLoading(false);
    })();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (notFound || !data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background px-4 text-center">
        <h1 className="text-2xl font-bold">Site não encontrado</h1>
        <p className="text-sm text-muted-foreground">
          Esta oficina não tem um site público ativo.
        </p>
        <Link to="/" className="text-sm font-semibold text-primary hover:underline">
          Voltar para ONficina
        </Link>
      </div>
    );
  }

  const tpl = data.oficina.landing_template || 1;
  if (tpl === 2) return <Template2 data={data} />;
  if (tpl === 3) return <Template3 data={data} />;
  return <Template1 data={data} />;
};

export default SiteOficina;
