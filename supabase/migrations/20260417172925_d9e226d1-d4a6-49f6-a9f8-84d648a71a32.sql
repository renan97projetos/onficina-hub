ALTER TABLE public.ordens_servico
  DROP CONSTRAINT IF EXISTS ordens_servico_stage_check;

ALTER TABLE public.ordens_servico
  ADD CONSTRAINT ordens_servico_stage_check
  CHECK (stage IN (
    'criado',
    'alocado_patio',
    'aguardando_carro',
    'em_atendimento',
    'pagamento',
    'entrega',
    'finalizado',
    'recusado'
  ));