DROP POLICY IF EXISTS "Anyone can insert avaliacoes" ON public.avaliacoes;

CREATE POLICY "Anyone can insert avaliacoes for finalized OS"
ON public.avaliacoes
FOR INSERT
TO anon, authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.ordens_servico o
    WHERE o.id = avaliacoes.os_id
      AND o.oficina_id = avaliacoes.oficina_id
      AND o.stage = 'finalizado'
  )
);