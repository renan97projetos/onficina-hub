CREATE TABLE public.crm_lembretes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  oficina_id uuid NOT NULL REFERENCES public.oficinas(id) ON DELETE CASCADE,
  cliente_id uuid NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  tipo text NOT NULL DEFAULT 'lembrete'
    CHECK (tipo IN ('lembrete','retorno','revisao','followup')),
  descricao text NOT NULL,
  data_lembrete date NOT NULL,
  concluido boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.crm_lembretes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Oficina members can view crm_lembretes"
  ON public.crm_lembretes FOR SELECT TO authenticated
  USING (oficina_id = public.get_user_oficina_id());

CREATE POLICY "Oficina members can insert crm_lembretes"
  ON public.crm_lembretes FOR INSERT TO authenticated
  WITH CHECK (oficina_id = public.get_user_oficina_id());

CREATE POLICY "Oficina members can update crm_lembretes"
  ON public.crm_lembretes FOR UPDATE TO authenticated
  USING (oficina_id = public.get_user_oficina_id());

CREATE POLICY "Oficina members can delete crm_lembretes"
  ON public.crm_lembretes FOR DELETE TO authenticated
  USING (oficina_id = public.get_user_oficina_id());

CREATE INDEX idx_crm_lembretes_cliente ON public.crm_lembretes(cliente_id);
CREATE INDEX idx_crm_lembretes_oficina_data ON public.crm_lembretes(oficina_id, data_lembrete) WHERE concluido = false;