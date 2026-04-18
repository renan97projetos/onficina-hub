CREATE INDEX IF NOT EXISTS idx_os_oficina_stage ON public.ordens_servico(oficina_id, stage);
CREATE INDEX IF NOT EXISTS idx_os_token ON public.ordens_servico(token_cliente);
CREATE INDEX IF NOT EXISTS idx_os_servicos_os ON public.os_servicos(os_id);
CREATE INDEX IF NOT EXISTS idx_orcamentos_oficina ON public.orcamentos(oficina_id, status);