
-- 1) Add logo_url, cnpj, endereco to oficinas
ALTER TABLE public.oficinas
  ADD COLUMN IF NOT EXISTS logo_url text,
  ADD COLUMN IF NOT EXISTS cnpj text,
  ADD COLUMN IF NOT EXISTS endereco text;

-- 2) Create orcamentos table
CREATE TABLE IF NOT EXISTS public.orcamentos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  oficina_id uuid NOT NULL,
  numero serial,
  nome_cliente text NOT NULL,
  telefone_cliente text,
  data_orcamento date NOT NULL DEFAULT CURRENT_DATE,
  marca text,
  modelo text,
  placa text,
  pecas jsonb NOT NULL DEFAULT '[]'::jsonb,
  mao_obra_descricao text,
  mao_obra_valor numeric NOT NULL DEFAULT 0,
  total_pecas numeric NOT NULL DEFAULT 0,
  total_geral numeric NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'rascunho',
  motivo_recusa text,
  token_publico uuid NOT NULL DEFAULT gen_random_uuid() UNIQUE,
  os_id uuid,
  enviado_em timestamptz,
  aprovado_em timestamptz,
  recusado_em timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_orcamentos_oficina ON public.orcamentos(oficina_id);
CREATE INDEX IF NOT EXISTS idx_orcamentos_status ON public.orcamentos(status);
CREATE INDEX IF NOT EXISTS idx_orcamentos_token ON public.orcamentos(token_publico);

ALTER TABLE public.orcamentos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Oficina members can view orcamentos"
  ON public.orcamentos FOR SELECT TO authenticated
  USING (oficina_id = public.get_user_oficina_id());

CREATE POLICY "Oficina members can insert orcamentos"
  ON public.orcamentos FOR INSERT TO authenticated
  WITH CHECK (oficina_id = public.get_user_oficina_id());

CREATE POLICY "Oficina members can update orcamentos"
  ON public.orcamentos FOR UPDATE TO authenticated
  USING (oficina_id = public.get_user_oficina_id());

CREATE POLICY "Oficina members can delete orcamentos"
  ON public.orcamentos FOR DELETE TO authenticated
  USING (oficina_id = public.get_user_oficina_id());

-- Public can view + update (for approval) by token (token is checked in app layer)
CREATE POLICY "Public can view orcamentos"
  ON public.orcamentos FOR SELECT TO anon
  USING (true);

CREATE POLICY "Public can update orcamento status by token"
  ON public.orcamentos FOR UPDATE TO anon
  USING (true)
  WITH CHECK (true);

-- updated_at trigger
CREATE TRIGGER update_orcamentos_updated_at
  BEFORE UPDATE ON public.orcamentos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3) Storage bucket for logos
INSERT INTO storage.buckets (id, name, public)
VALUES ('oficina-logos', 'oficina-logos', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can view oficina logos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'oficina-logos');

CREATE POLICY "Authenticated users can upload their oficina logo"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'oficina-logos'
    AND (storage.foldername(name))[1] = public.get_user_oficina_id()::text
  );

CREATE POLICY "Authenticated users can update their oficina logo"
  ON storage.objects FOR UPDATE TO authenticated
  USING (
    bucket_id = 'oficina-logos'
    AND (storage.foldername(name))[1] = public.get_user_oficina_id()::text
  );

CREATE POLICY "Authenticated users can delete their oficina logo"
  ON storage.objects FOR DELETE TO authenticated
  USING (
    bucket_id = 'oficina-logos'
    AND (storage.foldername(name))[1] = public.get_user_oficina_id()::text
  );
