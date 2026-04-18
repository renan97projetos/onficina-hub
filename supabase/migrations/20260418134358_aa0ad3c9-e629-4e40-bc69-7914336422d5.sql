ALTER TABLE public.oficinas
  ADD COLUMN IF NOT EXISTS email_digest_ativo boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS email_digest text;