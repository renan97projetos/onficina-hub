ALTER TABLE public.ordens_servico
  DROP CONSTRAINT IF EXISTS ordens_servico_stage_check;

ALTER TABLE public.ordens_servico
  ADD CONSTRAINT ordens_servico_stage_check
  CHECK (stage IN (
    'orcamento',
    'criado',
    'alocado_patio',
    'aguardando_carro',
    'em_atendimento',
    'pagamento',
    'entrega',
    'finalizado',
    'recusado'
  ));

-- Tornar cliente_id e veiculo_id opcionais (orçamento pode existir sem cliente/veículo cadastrado ainda)
ALTER TABLE public.ordens_servico
  ALTER COLUMN cliente_id DROP NOT NULL,
  ALTER COLUMN veiculo_id DROP NOT NULL;

-- Mudar default do stage para 'orcamento' (toda OS nasce como orçamento)
ALTER TABLE public.ordens_servico
  ALTER COLUMN stage SET DEFAULT 'orcamento';