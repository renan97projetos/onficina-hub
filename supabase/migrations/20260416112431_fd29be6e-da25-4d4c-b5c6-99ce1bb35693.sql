
-- Drop the overly permissive policy
DROP POLICY "Users can create their own oficina" ON public.oficinas;

-- Restrict: only allow insert if user doesn't already have an oficina
CREATE POLICY "Users can create their own oficina"
  ON public.oficinas FOR INSERT TO authenticated
  WITH CHECK (
    (SELECT raw_user_meta_data->>'oficina_id' FROM auth.users WHERE id = auth.uid()) IS NULL
  );
