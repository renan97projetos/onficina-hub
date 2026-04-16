CREATE TABLE public.avaliacoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  os_id UUID NOT NULL UNIQUE REFERENCES public.ordens_servico(id) ON DELETE CASCADE,
  oficina_id UUID NOT NULL REFERENCES public.oficinas(id) ON DELETE CASCADE,
  nota SMALLINT NOT NULL CHECK (nota BETWEEN 1 AND 5),
  comentario TEXT,
  nome_cliente TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_avaliacoes_os_id ON public.avaliacoes(os_id);
CREATE INDEX idx_avaliacoes_oficina_id ON public.avaliacoes(oficina_id);

ALTER TABLE public.avaliacoes ENABLE ROW LEVEL SECURITY;

-- Anyone (incluindo cliente anônimo via link) pode criar avaliação
CREATE POLICY "Anyone can insert avaliacoes"
ON public.avaliacoes
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Anyone pode ler avaliações (cliente vê após enviar; oficina mostra no painel)
CREATE POLICY "Anyone can view avaliacoes"
ON public.avaliacoes
FOR SELECT
TO anon, authenticated
USING (true);

-- Só a oficina dona pode deletar
CREATE POLICY "Oficina members can delete avaliacoes"
ON public.avaliacoes
FOR DELETE
TO authenticated
USING (oficina_id = public.get_user_oficina_id());