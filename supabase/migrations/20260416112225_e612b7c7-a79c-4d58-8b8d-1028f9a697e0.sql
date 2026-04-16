
-- Tabela de oficinas
CREATE TABLE public.oficinas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  telefone TEXT,
  plano TEXT NOT NULL DEFAULT 'trial',
  trial_expires_at TIMESTAMPTZ DEFAULT (now() + interval '14 days'),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.oficinas ENABLE ROW LEVEL SECURITY;

-- Tabela de clientes
CREATE TABLE public.clientes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  oficina_id UUID NOT NULL REFERENCES public.oficinas(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  telefone TEXT,
  email TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;

-- Tabela de veículos
CREATE TABLE public.veiculos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  oficina_id UUID NOT NULL REFERENCES public.oficinas(id) ON DELETE CASCADE,
  cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  placa TEXT NOT NULL,
  modelo TEXT,
  cor TEXT,
  ano INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.veiculos ENABLE ROW LEVEL SECURITY;

-- Tabela de colaboradores
CREATE TABLE public.colaboradores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  oficina_id UUID NOT NULL REFERENCES public.oficinas(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  funcao TEXT,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.colaboradores ENABLE ROW LEVEL SECURITY;

-- Catálogo de serviços
CREATE TABLE public.servicos_catalogo (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  oficina_id UUID NOT NULL REFERENCES public.oficinas(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  preco_base NUMERIC NOT NULL DEFAULT 0,
  etapas JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.servicos_catalogo ENABLE ROW LEVEL SECURITY;

-- Ordens de serviço
CREATE TABLE public.ordens_servico (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  oficina_id UUID NOT NULL REFERENCES public.oficinas(id) ON DELETE CASCADE,
  veiculo_id UUID NOT NULL REFERENCES public.veiculos(id),
  cliente_id UUID NOT NULL REFERENCES public.clientes(id),
  colaborador_id UUID REFERENCES public.colaboradores(id),
  stage TEXT NOT NULL DEFAULT 'enviado',
  valor_total NUMERIC NOT NULL DEFAULT 0,
  observacoes TEXT,
  token_cliente UUID NOT NULL DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.ordens_servico ENABLE ROW LEVEL SECURITY;

-- Serviços vinculados a uma OS
CREATE TABLE public.os_servicos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  os_id UUID NOT NULL REFERENCES public.ordens_servico(id) ON DELETE CASCADE,
  servico_id UUID NOT NULL REFERENCES public.servicos_catalogo(id),
  valor NUMERIC NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'pendente',
  etapa_atual INT NOT NULL DEFAULT 0,
  iniciado_em TIMESTAMPTZ,
  concluido_em TIMESTAMPTZ
);
ALTER TABLE public.os_servicos ENABLE ROW LEVEL SECURITY;

-- Função auxiliar para buscar oficina_id do usuário logado
CREATE OR REPLACE FUNCTION public.get_user_oficina_id()
RETURNS UUID
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.oficinas WHERE id = (
    SELECT (raw_user_meta_data->>'oficina_id')::uuid FROM auth.users WHERE id = auth.uid()
  )
$$;

-- Função para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_ordens_servico_updated_at
  BEFORE UPDATE ON public.ordens_servico
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS policies: oficinas
CREATE POLICY "Users can view their own oficina"
  ON public.oficinas FOR SELECT TO authenticated
  USING (id = public.get_user_oficina_id());

CREATE POLICY "Users can update their own oficina"
  ON public.oficinas FOR UPDATE TO authenticated
  USING (id = public.get_user_oficina_id());

-- RLS policies: clientes
CREATE POLICY "Oficina members can view clientes"
  ON public.clientes FOR SELECT TO authenticated
  USING (oficina_id = public.get_user_oficina_id());

CREATE POLICY "Oficina members can insert clientes"
  ON public.clientes FOR INSERT TO authenticated
  WITH CHECK (oficina_id = public.get_user_oficina_id());

CREATE POLICY "Oficina members can update clientes"
  ON public.clientes FOR UPDATE TO authenticated
  USING (oficina_id = public.get_user_oficina_id());

CREATE POLICY "Oficina members can delete clientes"
  ON public.clientes FOR DELETE TO authenticated
  USING (oficina_id = public.get_user_oficina_id());

-- RLS policies: veiculos
CREATE POLICY "Oficina members can view veiculos"
  ON public.veiculos FOR SELECT TO authenticated
  USING (oficina_id = public.get_user_oficina_id());

CREATE POLICY "Oficina members can insert veiculos"
  ON public.veiculos FOR INSERT TO authenticated
  WITH CHECK (oficina_id = public.get_user_oficina_id());

CREATE POLICY "Oficina members can update veiculos"
  ON public.veiculos FOR UPDATE TO authenticated
  USING (oficina_id = public.get_user_oficina_id());

CREATE POLICY "Oficina members can delete veiculos"
  ON public.veiculos FOR DELETE TO authenticated
  USING (oficina_id = public.get_user_oficina_id());

-- RLS policies: colaboradores
CREATE POLICY "Oficina members can view colaboradores"
  ON public.colaboradores FOR SELECT TO authenticated
  USING (oficina_id = public.get_user_oficina_id());

CREATE POLICY "Oficina members can insert colaboradores"
  ON public.colaboradores FOR INSERT TO authenticated
  WITH CHECK (oficina_id = public.get_user_oficina_id());

CREATE POLICY "Oficina members can update colaboradores"
  ON public.colaboradores FOR UPDATE TO authenticated
  USING (oficina_id = public.get_user_oficina_id());

CREATE POLICY "Oficina members can delete colaboradores"
  ON public.colaboradores FOR DELETE TO authenticated
  USING (oficina_id = public.get_user_oficina_id());

-- RLS policies: servicos_catalogo
CREATE POLICY "Oficina members can view servicos"
  ON public.servicos_catalogo FOR SELECT TO authenticated
  USING (oficina_id = public.get_user_oficina_id());

CREATE POLICY "Oficina members can insert servicos"
  ON public.servicos_catalogo FOR INSERT TO authenticated
  WITH CHECK (oficina_id = public.get_user_oficina_id());

CREATE POLICY "Oficina members can update servicos"
  ON public.servicos_catalogo FOR UPDATE TO authenticated
  USING (oficina_id = public.get_user_oficina_id());

CREATE POLICY "Oficina members can delete servicos"
  ON public.servicos_catalogo FOR DELETE TO authenticated
  USING (oficina_id = public.get_user_oficina_id());

-- RLS policies: ordens_servico
CREATE POLICY "Oficina members can view OS"
  ON public.ordens_servico FOR SELECT TO authenticated
  USING (oficina_id = public.get_user_oficina_id());

CREATE POLICY "Oficina members can insert OS"
  ON public.ordens_servico FOR INSERT TO authenticated
  WITH CHECK (oficina_id = public.get_user_oficina_id());

CREATE POLICY "Oficina members can update OS"
  ON public.ordens_servico FOR UPDATE TO authenticated
  USING (oficina_id = public.get_user_oficina_id());

CREATE POLICY "Oficina members can delete OS"
  ON public.ordens_servico FOR DELETE TO authenticated
  USING (oficina_id = public.get_user_oficina_id());

-- Acesso público por token (cliente acompanha OS)
CREATE POLICY "Public can view OS by token"
  ON public.ordens_servico FOR SELECT TO anon
  USING (true);

-- RLS policies: os_servicos (via join com ordens_servico)
CREATE POLICY "Oficina members can view os_servicos"
  ON public.os_servicos FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.ordens_servico o
    WHERE o.id = os_id AND o.oficina_id = public.get_user_oficina_id()
  ));

CREATE POLICY "Oficina members can insert os_servicos"
  ON public.os_servicos FOR INSERT TO authenticated
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.ordens_servico o
    WHERE o.id = os_id AND o.oficina_id = public.get_user_oficina_id()
  ));

CREATE POLICY "Oficina members can update os_servicos"
  ON public.os_servicos FOR UPDATE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.ordens_servico o
    WHERE o.id = os_id AND o.oficina_id = public.get_user_oficina_id()
  ));

CREATE POLICY "Oficina members can delete os_servicos"
  ON public.os_servicos FOR DELETE TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.ordens_servico o
    WHERE o.id = os_id AND o.oficina_id = public.get_user_oficina_id()
  ));

-- Acesso público aos serviços da OS (para acompanhamento por token)
CREATE POLICY "Public can view os_servicos by OS"
  ON public.os_servicos FOR SELECT TO anon
  USING (true);
