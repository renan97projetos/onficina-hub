-- 1) Vínculo direto com auth.users
ALTER TABLE public.usuarios_oficina
  DROP CONSTRAINT IF EXISTS usuarios_oficina_user_id_fkey,
  ADD  CONSTRAINT usuarios_oficina_user_id_fkey
       FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.oficinas
  DROP CONSTRAINT IF EXISTS oficinas_auth_user_id_fkey,
  ADD  CONSTRAINT oficinas_auth_user_id_fkey
       FOREIGN KEY (auth_user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2) Tabelas filhas da oficina (cascata por oficina_id)
DO $$
DECLARE
  t text;
  tables text[] := ARRAY[
    'usuarios_oficina','clientes','veiculos','veiculos_customizados',
    'colaboradores','servicos_catalogo','ordens_servico','os_servicos',
    'os_movimentacoes','orcamentos','agendamentos','agenda_config',
    'financeiro_lancamentos','crm_lembretes','avaliacoes','subscriptions'
  ];
BEGIN
  FOREACH t IN ARRAY tables LOOP
    -- garante FK com CASCADE para oficina_id quando a coluna existir
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema='public' AND table_name=t AND column_name='oficina_id'
    ) THEN
      EXECUTE format('ALTER TABLE public.%I DROP CONSTRAINT IF EXISTS %I',
                     t, t || '_oficina_id_fkey');
      EXECUTE format(
        'ALTER TABLE public.%I
           ADD CONSTRAINT %I
           FOREIGN KEY (oficina_id) REFERENCES public.oficinas(id) ON DELETE CASCADE',
        t, t || '_oficina_id_fkey');
    END IF;
  END LOOP;
END$$;

-- 3) Relações entre tabelas filhas (cascata adicional)
ALTER TABLE public.veiculos
  DROP CONSTRAINT IF EXISTS veiculos_cliente_id_fkey,
  ADD  CONSTRAINT veiculos_cliente_id_fkey
       FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE CASCADE;

ALTER TABLE public.os_servicos
  DROP CONSTRAINT IF EXISTS os_servicos_os_id_fkey,
  ADD  CONSTRAINT os_servicos_os_id_fkey
       FOREIGN KEY (os_id) REFERENCES public.ordens_servico(id) ON DELETE CASCADE;

ALTER TABLE public.os_movimentacoes
  DROP CONSTRAINT IF EXISTS os_movimentacoes_os_id_fkey,
  ADD  CONSTRAINT os_movimentacoes_os_id_fkey
       FOREIGN KEY (os_id) REFERENCES public.ordens_servico(id) ON DELETE CASCADE;

ALTER TABLE public.avaliacoes
  DROP CONSTRAINT IF EXISTS avaliacoes_os_id_fkey,
  ADD  CONSTRAINT avaliacoes_os_id_fkey
       FOREIGN KEY (os_id) REFERENCES public.ordens_servico(id) ON DELETE CASCADE;

-- ordens_servico podem referenciar cliente/veículo/colaborador opcionalmente:
-- usar SET NULL para não bloquear nem apagar OS quando esses sumirem isoladamente
ALTER TABLE public.ordens_servico
  DROP CONSTRAINT IF EXISTS ordens_servico_cliente_id_fkey,
  ADD  CONSTRAINT ordens_servico_cliente_id_fkey
       FOREIGN KEY (cliente_id) REFERENCES public.clientes(id) ON DELETE SET NULL;

ALTER TABLE public.ordens_servico
  DROP CONSTRAINT IF EXISTS ordens_servico_veiculo_id_fkey,
  ADD  CONSTRAINT ordens_servico_veiculo_id_fkey
       FOREIGN KEY (veiculo_id) REFERENCES public.veiculos(id) ON DELETE SET NULL;

ALTER TABLE public.ordens_servico
  DROP CONSTRAINT IF EXISTS ordens_servico_colaborador_id_fkey,
  ADD  CONSTRAINT ordens_servico_colaborador_id_fkey
       FOREIGN KEY (colaborador_id) REFERENCES public.colaboradores(id) ON DELETE SET NULL;