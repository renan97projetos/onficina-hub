UPDATE public.oficinas
SET trial_expires_at = now() + interval '30 days',
    plano = 'trial'
WHERE id = 'fa40abe9-3873-4978-83a1-92b6f10f7e2e';