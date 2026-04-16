
CREATE TABLE public.financeiro_lancamentos (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  oficina_id uuid NOT NULL,
  tipo text NOT NULL DEFAULT 'saida',
  descricao text NOT NULL,
  valor numeric NOT NULL DEFAULT 0,
  data date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.financeiro_lancamentos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Oficina members can view lancamentos"
ON public.financeiro_lancamentos FOR SELECT TO authenticated
USING (oficina_id = public.get_user_oficina_id());

CREATE POLICY "Oficina members can insert lancamentos"
ON public.financeiro_lancamentos FOR INSERT TO authenticated
WITH CHECK (oficina_id = public.get_user_oficina_id());

CREATE POLICY "Oficina members can update lancamentos"
ON public.financeiro_lancamentos FOR UPDATE TO authenticated
USING (oficina_id = public.get_user_oficina_id());

CREATE POLICY "Oficina members can delete lancamentos"
ON public.financeiro_lancamentos FOR DELETE TO authenticated
USING (oficina_id = public.get_user_oficina_id());

CREATE TRIGGER trg_inject_oficina_financeiro
  BEFORE INSERT ON public.financeiro_lancamentos
  FOR EACH ROW EXECUTE FUNCTION public.inject_oficina_id();
