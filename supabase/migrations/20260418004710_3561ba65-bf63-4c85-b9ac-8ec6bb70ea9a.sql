ALTER TABLE public.oficinas
  ADD COLUMN IF NOT EXISTS landing_template int DEFAULT 1,
  ADD COLUMN IF NOT EXISTS landing_ativo bool DEFAULT false,
  ADD COLUMN IF NOT EXISTS landing_descricao text,
  ADD COLUMN IF NOT EXISTS landing_servicos_exibidos jsonb DEFAULT '[]'::jsonb;

-- slug já existe; garantir unicidade
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'oficinas_slug_key'
  ) THEN
    ALTER TABLE public.oficinas ADD CONSTRAINT oficinas_slug_key UNIQUE (slug);
  END IF;
END $$;

-- RPC pública para buscar a landing pelo slug (oficina + serviços + nota média)
CREATE OR REPLACE FUNCTION public.get_site_oficina_by_slug(_slug text)
RETURNS jsonb
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _of record;
  _servicos jsonb;
  _avg numeric;
  _count int;
BEGIN
  SELECT id, nome, slug, telefone, endereco, logo_url,
         landing_template, landing_ativo, landing_descricao,
         landing_servicos_exibidos, google_review_url
    INTO _of
  FROM public.oficinas
  WHERE slug = _slug AND landing_ativo = true;

  IF NOT FOUND THEN RETURN NULL; END IF;

  SELECT COALESCE(jsonb_agg(jsonb_build_object(
    'id', s.id, 'nome', s.nome, 'descricao', s.descricao, 'preco_base', s.preco_base
  )), '[]'::jsonb)
  INTO _servicos
  FROM public.servicos_catalogo s
  WHERE s.oficina_id = _of.id
    AND (
      jsonb_array_length(COALESCE(_of.landing_servicos_exibidos, '[]'::jsonb)) = 0
      OR _of.landing_servicos_exibidos ? s.id::text
    );

  SELECT COALESCE(avg(nota), 0)::numeric(3,2), count(*)::int
    INTO _avg, _count
  FROM public.avaliacoes WHERE oficina_id = _of.id;

  RETURN jsonb_build_object(
    'oficina', to_jsonb(_of),
    'servicos', _servicos,
    'avaliacoes', jsonb_build_object('media', _avg, 'total', _count)
  );
END;
$$;