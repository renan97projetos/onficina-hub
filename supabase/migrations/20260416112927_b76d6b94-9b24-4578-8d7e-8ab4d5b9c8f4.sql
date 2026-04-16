
-- 1. Add auth_user_id to oficinas
ALTER TABLE public.oficinas
  ADD COLUMN auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. Rewrite get_user_oficina_id to use direct FK
CREATE OR REPLACE FUNCTION public.get_user_oficina_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.oficinas WHERE auth_user_id = auth.uid()
$$;

-- 3. Update create_oficina_for_user to set auth_user_id
CREATE OR REPLACE FUNCTION public.create_oficina_for_user(
  _nome TEXT,
  _telefone TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _oficina_id UUID;
BEGIN
  INSERT INTO public.oficinas (nome, telefone, auth_user_id)
  VALUES (_nome, _telefone, auth.uid())
  RETURNING id INTO _oficina_id;

  -- Also store in metadata for quick client-side access
  UPDATE auth.users
  SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || jsonb_build_object('oficina_id', _oficina_id::text)
  WHERE id = auth.uid();

  RETURN _oficina_id;
END;
$$;

-- 4. Generic function to auto-inject oficina_id on INSERT
CREATE OR REPLACE FUNCTION public.inject_oficina_id()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.oficina_id := public.get_user_oficina_id();
  IF NEW.oficina_id IS NULL THEN
    RAISE EXCEPTION 'Usuário não possui oficina vinculada';
  END IF;
  RETURN NEW;
END;
$$;

-- 5. Attach triggers to all tenant tables
CREATE TRIGGER trg_inject_oficina_clientes
  BEFORE INSERT ON public.clientes
  FOR EACH ROW EXECUTE FUNCTION public.inject_oficina_id();

CREATE TRIGGER trg_inject_oficina_veiculos
  BEFORE INSERT ON public.veiculos
  FOR EACH ROW EXECUTE FUNCTION public.inject_oficina_id();

CREATE TRIGGER trg_inject_oficina_colaboradores
  BEFORE INSERT ON public.colaboradores
  FOR EACH ROW EXECUTE FUNCTION public.inject_oficina_id();

CREATE TRIGGER trg_inject_oficina_servicos_catalogo
  BEFORE INSERT ON public.servicos_catalogo
  FOR EACH ROW EXECUTE FUNCTION public.inject_oficina_id();

CREATE TRIGGER trg_inject_oficina_ordens_servico
  BEFORE INSERT ON public.ordens_servico
  FOR EACH ROW EXECUTE FUNCTION public.inject_oficina_id();

-- 6. Update oficinas SELECT policy to use auth_user_id directly
DROP POLICY IF EXISTS "Users can view their own oficina" ON public.oficinas;
CREATE POLICY "Users can view their own oficina"
  ON public.oficinas FOR SELECT TO authenticated
  USING (auth_user_id = auth.uid());

DROP POLICY IF EXISTS "Users can update their own oficina" ON public.oficinas;
CREATE POLICY "Users can update their own oficina"
  ON public.oficinas FOR UPDATE TO authenticated
  USING (auth_user_id = auth.uid());

-- 7. Index for performance
CREATE INDEX idx_oficinas_auth_user_id ON public.oficinas(auth_user_id);
