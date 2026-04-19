-- Atualiza a função para aceitar CNPJ no cadastro
CREATE OR REPLACE FUNCTION public.create_oficina_for_user(
  _nome text,
  _telefone text DEFAULT NULL,
  _cnpj text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  _oficina_id UUID;
BEGIN
  INSERT INTO public.oficinas (nome, telefone, cnpj, auth_user_id)
  VALUES (_nome, _telefone, _cnpj, auth.uid())
  RETURNING id INTO _oficina_id;

  UPDATE auth.users
  SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || jsonb_build_object('oficina_id', _oficina_id::text)
  WHERE id = auth.uid();

  RETURN _oficina_id;
END;
$function$;