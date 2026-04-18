-- 1) Slug em oficinas (sem unaccent — basic ASCII)
ALTER TABLE public.oficinas
  ADD COLUMN IF NOT EXISTS slug text UNIQUE;

UPDATE public.oficinas
SET slug = COALESCE(
  NULLIF(regexp_replace(regexp_replace(lower(nome), '[^a-z0-9]+', '-', 'g'), '-+', '-', 'g'), ''),
  'oficina'
) || '-' || substring(id::text, 1, 6)
WHERE slug IS NULL;

-- 2) agenda_config
CREATE TABLE IF NOT EXISTS public.agenda_config (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  oficina_id uuid NOT NULL UNIQUE REFERENCES public.oficinas(id) ON DELETE CASCADE,
  limite_por_dia integer NOT NULL DEFAULT 4,
  modo_cliente_ativo boolean NOT NULL DEFAULT false,
  dias_antecedencia_min integer NOT NULL DEFAULT 1,
  dias_antecedencia_max integer NOT NULL DEFAULT 14,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.agenda_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Oficina members can view agenda_config"
  ON public.agenda_config FOR SELECT TO authenticated
  USING (oficina_id = public.get_user_oficina_id());
CREATE POLICY "Oficina members can insert agenda_config"
  ON public.agenda_config FOR INSERT TO authenticated
  WITH CHECK (oficina_id = public.get_user_oficina_id());
CREATE POLICY "Oficina members can update agenda_config"
  ON public.agenda_config FOR UPDATE TO authenticated
  USING (oficina_id = public.get_user_oficina_id());
CREATE POLICY "Oficina members can delete agenda_config"
  ON public.agenda_config FOR DELETE TO authenticated
  USING (oficina_id = public.get_user_oficina_id());

CREATE TRIGGER update_agenda_config_updated_at
  BEFORE UPDATE ON public.agenda_config
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3) agendamentos
CREATE TABLE IF NOT EXISTS public.agendamentos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  oficina_id uuid NOT NULL REFERENCES public.oficinas(id) ON DELETE CASCADE,
  os_id uuid REFERENCES public.ordens_servico(id) ON DELETE SET NULL,
  data_entrada date NOT NULL,
  cliente_nome text,
  cliente_telefone text,
  veiculo_placa text,
  veiculo_modelo text,
  observacao text,
  confirmado boolean NOT NULL DEFAULT false,
  origem text NOT NULL DEFAULT 'oficina',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_agendamentos_oficina_data
  ON public.agendamentos(oficina_id, data_entrada);

ALTER TABLE public.agendamentos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Oficina members can view agendamentos"
  ON public.agendamentos FOR SELECT TO authenticated
  USING (oficina_id = public.get_user_oficina_id());
CREATE POLICY "Oficina members can insert agendamentos"
  ON public.agendamentos FOR INSERT TO authenticated
  WITH CHECK (oficina_id = public.get_user_oficina_id());
CREATE POLICY "Oficina members can update agendamentos"
  ON public.agendamentos FOR UPDATE TO authenticated
  USING (oficina_id = public.get_user_oficina_id());
CREATE POLICY "Oficina members can delete agendamentos"
  ON public.agendamentos FOR DELETE TO authenticated
  USING (oficina_id = public.get_user_oficina_id());

CREATE TRIGGER update_agendamentos_updated_at
  BEFORE UPDATE ON public.agendamentos
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 4) Funções públicas
CREATE OR REPLACE FUNCTION public.get_oficina_publica_by_slug(_slug text)
RETURNS jsonb
LANGUAGE plpgsql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _oficina record;
  _config record;
  _result jsonb;
BEGIN
  SELECT id, nome, slug, telefone, endereco, logo_url
    INTO _oficina FROM public.oficinas WHERE slug = _slug;
  IF NOT FOUND THEN RETURN NULL; END IF;

  SELECT limite_por_dia, modo_cliente_ativo, dias_antecedencia_min, dias_antecedencia_max
    INTO _config FROM public.agenda_config WHERE oficina_id = _oficina.id;

  IF NOT FOUND THEN
    _result := jsonb_build_object(
      'oficina', to_jsonb(_oficina),
      'config', jsonb_build_object(
        'limite_por_dia', 4, 'modo_cliente_ativo', false,
        'dias_antecedencia_min', 1, 'dias_antecedencia_max', 14
      ),
      'ocupacao_por_dia', '[]'::jsonb
    );
  ELSE
    _result := jsonb_build_object(
      'oficina', to_jsonb(_oficina),
      'config', to_jsonb(_config),
      'ocupacao_por_dia', COALESCE((
        SELECT jsonb_agg(jsonb_build_object('data', data_entrada, 'count', c))
        FROM (
          SELECT data_entrada, count(*)::int AS c
          FROM public.agendamentos
          WHERE oficina_id = _oficina.id
            AND data_entrada >= CURRENT_DATE
            AND data_entrada <= CURRENT_DATE + (_config.dias_antecedencia_max || ' days')::interval
          GROUP BY data_entrada
        ) t
      ), '[]'::jsonb)
    );
  END IF;
  RETURN _result;
END;
$$;

CREATE OR REPLACE FUNCTION public.criar_agendamento_publico(
  _slug text, _data_entrada date, _cliente_nome text,
  _cliente_telefone text, _veiculo_placa text,
  _veiculo_modelo text, _observacao text
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _oficina_id uuid;
  _config record;
  _count int;
  _new_id uuid;
BEGIN
  IF _cliente_nome IS NULL OR length(trim(_cliente_nome)) = 0 THEN
    RAISE EXCEPTION 'Nome do cliente é obrigatório';
  END IF;
  IF length(_cliente_nome) > 120 THEN RAISE EXCEPTION 'Nome muito longo'; END IF;
  IF _cliente_telefone IS NOT NULL AND length(_cliente_telefone) > 30 THEN
    RAISE EXCEPTION 'Telefone inválido'; END IF;
  IF _veiculo_placa IS NOT NULL AND length(_veiculo_placa) > 15 THEN
    RAISE EXCEPTION 'Placa inválida'; END IF;
  IF _observacao IS NOT NULL AND length(_observacao) > 500 THEN
    RAISE EXCEPTION 'Observação muito longa'; END IF;

  SELECT id INTO _oficina_id FROM public.oficinas WHERE slug = _slug;
  IF _oficina_id IS NULL THEN RAISE EXCEPTION 'Oficina não encontrada'; END IF;

  SELECT limite_por_dia, modo_cliente_ativo, dias_antecedencia_min, dias_antecedencia_max
    INTO _config FROM public.agenda_config WHERE oficina_id = _oficina_id;

  IF NOT FOUND OR NOT _config.modo_cliente_ativo THEN
    RAISE EXCEPTION 'Esta oficina não aceita agendamentos online';
  END IF;

  IF _data_entrada < CURRENT_DATE + (_config.dias_antecedencia_min || ' days')::interval
     OR _data_entrada > CURRENT_DATE + (_config.dias_antecedencia_max || ' days')::interval THEN
    RAISE EXCEPTION 'Data fora do período permitido';
  END IF;

  SELECT count(*)::int INTO _count
  FROM public.agendamentos
  WHERE oficina_id = _oficina_id AND data_entrada = _data_entrada;
  IF _count >= _config.limite_por_dia THEN
    RAISE EXCEPTION 'Não há mais vagas para esta data';
  END IF;

  INSERT INTO public.agendamentos (
    oficina_id, data_entrada, cliente_nome, cliente_telefone,
    veiculo_placa, veiculo_modelo, observacao, confirmado, origem
  )
  VALUES (
    _oficina_id, _data_entrada, trim(_cliente_nome), _cliente_telefone,
    upper(_veiculo_placa), _veiculo_modelo, _observacao, false, 'cliente'
  )
  RETURNING id INTO _new_id;

  RETURN _new_id;
END;
$$;

GRANT EXECUTE ON FUNCTION public.get_oficina_publica_by_slug(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.criar_agendamento_publico(text, date, text, text, text, text, text) TO anon, authenticated;