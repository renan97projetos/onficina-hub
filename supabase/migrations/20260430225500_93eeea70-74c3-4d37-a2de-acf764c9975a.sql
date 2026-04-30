ALTER TABLE public.os_servicos
  ALTER COLUMN servico_id DROP NOT NULL;

ALTER TABLE public.os_servicos
  DROP CONSTRAINT IF EXISTS os_servicos_servico_id_fkey,
  ADD  CONSTRAINT os_servicos_servico_id_fkey
       FOREIGN KEY (servico_id) REFERENCES public.servicos_catalogo(id) ON DELETE SET NULL;