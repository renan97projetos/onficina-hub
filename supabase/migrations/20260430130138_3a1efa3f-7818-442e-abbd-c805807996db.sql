ALTER TABLE public.agendamentos
  ADD COLUMN IF NOT EXISTS data_prevista_saida date,
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pendente';

-- Validação por trigger (CHECK constraints precisam ser imutáveis; aqui é simples mas mantemos o padrão de trigger)
CREATE OR REPLACE FUNCTION public.validate_agendamento_status()
RETURNS trigger
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.status NOT IN ('pendente','em_andamento','concluido') THEN
    RAISE EXCEPTION 'status inválido: %', NEW.status;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_validate_agendamento_status ON public.agendamentos;
CREATE TRIGGER trg_validate_agendamento_status
BEFORE INSERT OR UPDATE ON public.agendamentos
FOR EACH ROW EXECUTE FUNCTION public.validate_agendamento_status();

CREATE UNIQUE INDEX IF NOT EXISTS agendamentos_os_id_unique
  ON public.agendamentos (os_id)
  WHERE os_id IS NOT NULL;