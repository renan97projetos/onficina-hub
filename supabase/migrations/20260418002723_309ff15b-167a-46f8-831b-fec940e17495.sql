ALTER TABLE public.colaboradores
  ADD COLUMN IF NOT EXISTS max_carros_simultaneos integer NOT NULL DEFAULT 3;