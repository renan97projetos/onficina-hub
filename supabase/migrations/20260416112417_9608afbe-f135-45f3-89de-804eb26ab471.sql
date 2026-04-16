
-- Allow authenticated users to insert into oficinas (for signup flow)
CREATE POLICY "Users can create their own oficina"
  ON public.oficinas FOR INSERT TO authenticated
  WITH CHECK (true);

-- Function to create oficina and set user metadata
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
  INSERT INTO public.oficinas (nome, telefone)
  VALUES (_nome, _telefone)
  RETURNING id INTO _oficina_id;

  -- Update user metadata with oficina_id
  UPDATE auth.users
  SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || jsonb_build_object('oficina_id', _oficina_id::text)
  WHERE id = auth.uid();

  RETURN _oficina_id;
END;
$$;
