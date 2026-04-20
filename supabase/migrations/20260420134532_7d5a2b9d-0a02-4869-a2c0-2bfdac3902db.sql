-- 1) Novos campos em orcamentos
ALTER TABLE public.orcamentos
  ADD COLUMN IF NOT EXISTS tipo_veiculo text,
  ADD COLUMN IF NOT EXISTS versao text,
  ADD COLUMN IF NOT EXISTS ano integer;

-- 2) KM inicial e final na OS
ALTER TABLE public.ordens_servico
  ADD COLUMN IF NOT EXISTS km_inicial integer,
  ADD COLUMN IF NOT EXISTS km_final integer;

-- 3) Tabela de marcas/modelos customizados por oficina
CREATE TABLE IF NOT EXISTS public.veiculos_customizados (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  oficina_id uuid NOT NULL,
  tipo text NOT NULL,
  marca text NOT NULL,
  modelo text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_veiculos_customizados_oficina_tipo
  ON public.veiculos_customizados(oficina_id, tipo);

-- evitar duplicatas (marca por tipo, e modelo por marca/tipo)
CREATE UNIQUE INDEX IF NOT EXISTS uq_veiculos_customizados_marca
  ON public.veiculos_customizados(oficina_id, tipo, lower(marca))
  WHERE modelo IS NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_veiculos_customizados_modelo
  ON public.veiculos_customizados(oficina_id, tipo, lower(marca), lower(modelo))
  WHERE modelo IS NOT NULL;

ALTER TABLE public.veiculos_customizados ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Oficina members can view veiculos_customizados"
  ON public.veiculos_customizados FOR SELECT TO authenticated
  USING (oficina_id = public.get_user_oficina_id());

CREATE POLICY "Oficina members can insert veiculos_customizados"
  ON public.veiculos_customizados FOR INSERT TO authenticated
  WITH CHECK (oficina_id = public.get_user_oficina_id());

CREATE POLICY "Oficina members can update veiculos_customizados"
  ON public.veiculos_customizados FOR UPDATE TO authenticated
  USING (oficina_id = public.get_user_oficina_id());

CREATE POLICY "Oficina members can delete veiculos_customizados"
  ON public.veiculos_customizados FOR DELETE TO authenticated
  USING (oficina_id = public.get_user_oficina_id());