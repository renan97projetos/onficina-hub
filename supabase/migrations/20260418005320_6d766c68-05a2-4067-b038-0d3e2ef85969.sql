-- 1. Tabela
CREATE TABLE IF NOT EXISTS public.usuarios_oficina (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  oficina_id uuid NOT NULL REFERENCES public.oficinas(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'operador' CHECK (role IN ('dono','operador')),
  nome text,
  ativo boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id)
);

CREATE INDEX IF NOT EXISTS idx_usuarios_oficina_oficina ON public.usuarios_oficina(oficina_id);
CREATE INDEX IF NOT EXISTS idx_usuarios_oficina_user ON public.usuarios_oficina(user_id);

ALTER TABLE public.usuarios_oficina ENABLE ROW LEVEL SECURITY;

-- 2. Atualizar função get_user_oficina_id para considerar membros
CREATE OR REPLACE FUNCTION public.get_user_oficina_id()
RETURNS uuid
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT oficina_id FROM public.usuarios_oficina
       WHERE user_id = auth.uid() AND ativo = true LIMIT 1),
    (SELECT id FROM public.oficinas WHERE auth_user_id = auth.uid() LIMIT 1)
  )
$$;

-- 3. Função utilitária: role do usuário atual
CREATE OR REPLACE FUNCTION public.get_user_role()
RETURNS text
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(
    (SELECT role FROM public.usuarios_oficina
       WHERE user_id = auth.uid() AND ativo = true LIMIT 1),
    CASE WHEN EXISTS (SELECT 1 FROM public.oficinas WHERE auth_user_id = auth.uid())
         THEN 'dono' ELSE NULL END
  )
$$;

-- 4. RLS policies
CREATE POLICY "Membros podem ver equipe da oficina"
  ON public.usuarios_oficina FOR SELECT
  TO authenticated
  USING (oficina_id = public.get_user_oficina_id());

CREATE POLICY "Donos podem inserir membros"
  ON public.usuarios_oficina FOR INSERT
  TO authenticated
  WITH CHECK (
    oficina_id = public.get_user_oficina_id()
    AND public.get_user_role() = 'dono'
  );

CREATE POLICY "Donos podem atualizar membros"
  ON public.usuarios_oficina FOR UPDATE
  TO authenticated
  USING (
    oficina_id = public.get_user_oficina_id()
    AND public.get_user_role() = 'dono'
  );

CREATE POLICY "Donos podem remover membros (exceto a si mesmos)"
  ON public.usuarios_oficina FOR DELETE
  TO authenticated
  USING (
    oficina_id = public.get_user_oficina_id()
    AND public.get_user_role() = 'dono'
    AND user_id <> auth.uid()
  );

-- 5. Trigger: ao criar oficina, registrar o dono em usuarios_oficina
CREATE OR REPLACE FUNCTION public.registrar_dono_oficina()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.auth_user_id IS NOT NULL THEN
    INSERT INTO public.usuarios_oficina (oficina_id, user_id, role, nome, ativo)
    VALUES (NEW.id, NEW.auth_user_id, 'dono', NEW.nome, true)
    ON CONFLICT (user_id) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_registrar_dono_oficina ON public.oficinas;
CREATE TRIGGER trg_registrar_dono_oficina
AFTER INSERT ON public.oficinas
FOR EACH ROW EXECUTE FUNCTION public.registrar_dono_oficina();

-- 6. Backfill: oficinas existentes ganham seu dono
INSERT INTO public.usuarios_oficina (oficina_id, user_id, role, nome, ativo)
SELECT o.id, o.auth_user_id, 'dono', o.nome, true
FROM public.oficinas o
WHERE o.auth_user_id IS NOT NULL
ON CONFLICT (user_id) DO NOTHING;