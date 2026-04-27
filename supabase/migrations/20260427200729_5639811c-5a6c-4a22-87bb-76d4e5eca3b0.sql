ALTER TABLE public.orcamentos
  ADD COLUMN IF NOT EXISTS servicos jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS observacao text;

ALTER TABLE public.ordens_servico
  ADD COLUMN IF NOT EXISTS pecas jsonb NOT NULL DEFAULT '[]'::jsonb;