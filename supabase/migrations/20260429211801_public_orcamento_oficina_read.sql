CREATE POLICY "Public can view linked oficina for public orcamento"
  ON public.oficinas
  FOR SELECT
  TO anon
  USING (
    EXISTS (
      SELECT 1
      FROM public.orcamentos o
      WHERE o.oficina_id = oficinas.id
        AND o.token_publico IS NOT NULL
    )
  );
