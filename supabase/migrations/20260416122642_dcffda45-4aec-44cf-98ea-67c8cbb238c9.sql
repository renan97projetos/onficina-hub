
-- 1. Add new columns to ordens_servico
ALTER TABLE public.ordens_servico
  ADD COLUMN IF NOT EXISTS prazo_estimado timestamptz,
  ADD COLUMN IF NOT EXISTS prazo_horas_calculado numeric(6,2),
  ADD COLUMN IF NOT EXISTS motivo_recusa text,
  ADD COLUMN IF NOT EXISTS pagamento_forma text,
  ADD COLUMN IF NOT EXISTS pagamento_confirmado boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS pagamento_confirmado_em timestamptz,
  ADD COLUMN IF NOT EXISTS cliente_notificado_entrega boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS fotos_entrada jsonb DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS fotos_saida jsonb DEFAULT '[]';

-- Add check constraint for pagamento_forma
ALTER TABLE public.ordens_servico
  ADD CONSTRAINT ordens_servico_pagamento_forma_check
  CHECK (pagamento_forma IN ('dinheiro','pix','cartao','boleto','pendente'));

-- Update stage values: drop old default, set new default, update existing data
ALTER TABLE public.ordens_servico ALTER COLUMN stage SET DEFAULT 'criado';

-- Update any existing 'enviado' stage rows to 'criado'
UPDATE public.ordens_servico SET stage = 'criado' WHERE stage = 'enviado';

-- Add check constraint for valid stages
ALTER TABLE public.ordens_servico
  ADD CONSTRAINT ordens_servico_stage_check
  CHECK (stage IN ('criado','aguardando_carro','em_atendimento','pagamento','entrega','finalizado','recusado'));

-- 2. Add new columns to os_servicos
ALTER TABLE public.os_servicos
  ADD COLUMN IF NOT EXISTS nome_servico text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS etapas_snapshot jsonb DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();

-- Drop old status default and add check constraint
ALTER TABLE public.os_servicos
  ADD CONSTRAINT os_servicos_status_check
  CHECK (status IN ('pendente','em_andamento','concluido'));

-- 3. Add new columns to servicos_catalogo
ALTER TABLE public.servicos_catalogo
  ADD COLUMN IF NOT EXISTS descricao text,
  ADD COLUMN IF NOT EXISTS tempo_medio_horas numeric(5,2);

-- 4. Add marca column to veiculos
ALTER TABLE public.veiculos
  ADD COLUMN IF NOT EXISTS marca text;

-- 5. Create os_movimentacoes table
CREATE TABLE IF NOT EXISTS public.os_movimentacoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  os_id uuid REFERENCES public.ordens_servico(id) ON DELETE CASCADE NOT NULL,
  stage_anterior text,
  stage_novo text,
  descricao text NOT NULL,
  valor_anterior numeric(10,2),
  valor_novo numeric(10,2),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.os_movimentacoes ENABLE ROW LEVEL SECURITY;

-- RLS policies for os_movimentacoes
CREATE POLICY "Oficina members can view os_movimentacoes"
  ON public.os_movimentacoes FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.ordens_servico o
    WHERE o.id = os_movimentacoes.os_id AND o.oficina_id = public.get_user_oficina_id()
  ));

CREATE POLICY "Oficina members can insert os_movimentacoes"
  ON public.os_movimentacoes FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.ordens_servico o
    WHERE o.id = os_movimentacoes.os_id AND o.oficina_id = public.get_user_oficina_id()
  ));

CREATE POLICY "Oficina members can delete os_movimentacoes"
  ON public.os_movimentacoes FOR DELETE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.ordens_servico o
    WHERE o.id = os_movimentacoes.os_id AND o.oficina_id = public.get_user_oficina_id()
  ));

-- Public access for client tracking
CREATE POLICY "Public can view os_movimentacoes"
  ON public.os_movimentacoes FOR SELECT TO anon
  USING (true);

-- 6. Create storage bucket for OS photos
INSERT INTO storage.buckets (id, name, public) VALUES ('os-fotos', 'os-fotos', true)
  ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Authenticated users can upload OS photos"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'os-fotos');

CREATE POLICY "Anyone can view OS photos"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'os-fotos');

CREATE POLICY "Authenticated users can delete OS photos"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'os-fotos');

-- 7. Enable realtime for ordens_servico
ALTER PUBLICATION supabase_realtime ADD TABLE public.ordens_servico;
