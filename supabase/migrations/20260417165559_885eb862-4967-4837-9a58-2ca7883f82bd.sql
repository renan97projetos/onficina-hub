
DROP POLICY IF EXISTS "Public can update orcamento status by token" ON public.orcamentos;

CREATE POLICY "Public can approve or reject orcamento"
  ON public.orcamentos FOR UPDATE TO anon
  USING (status IN ('enviado','aguardando'))
  WITH CHECK (status IN ('aprovado','recusado'));
