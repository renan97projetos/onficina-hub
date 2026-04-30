-- Helper: oficina tem plano Pro ativo (pago ou trial)
CREATE OR REPLACE FUNCTION public.has_pro_plan(_oficina_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.oficinas
    WHERE id = _oficina_id
      AND (
        plano = 'pro'
        OR (plano = 'trial' AND trial_expires_at > now())
      )
  );
$$;

-- Atualiza has_active_subscription para aceitar sandbox por padrão e qualquer env
CREATE OR REPLACE FUNCTION public.has_active_subscription(_oficina_id uuid, _env text DEFAULT NULL)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.subscriptions
    WHERE oficina_id = _oficina_id
      AND (_env IS NULL OR environment = _env)
      AND (
        (status IN ('active','trialing','past_due')
         AND (current_period_end IS NULL OR current_period_end > now()))
        OR (status = 'canceled' AND current_period_end > now())
      )
  );
$$;