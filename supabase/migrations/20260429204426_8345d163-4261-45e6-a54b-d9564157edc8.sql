UPDATE public.orcamentos
SET os_id = NULL
WHERE os_id IS NOT NULL
  AND os_id NOT IN (SELECT id FROM public.ordens_servico);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_schema = 'public'
      AND table_name = 'orcamentos'
      AND constraint_name = 'orcamentos_os_id_fkey'
  ) THEN
    ALTER TABLE public.orcamentos
      ADD CONSTRAINT orcamentos_os_id_fkey
      FOREIGN KEY (os_id) REFERENCES public.ordens_servico(id) ON DELETE SET NULL;
  END IF;
END $$;