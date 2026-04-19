import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check, Eye, EyeOff, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Logo from "@/components/Logo";
import { cadastroSchema, formatCep, formatCnpj, isCnpjValido } from "@/lib/validations";
import { publicUrl } from "@/lib/publicUrl";

const plans = [
  {
    name: "Starter",
    monthlyPrice: 97,
    features: [
      "Pipeline completa de OS",
      "Orçamentos em PDF + WhatsApp",
      "Serviço Ao Vivo para o cliente",
      "CRM, Financeiro e Avaliações",
      "1 usuário",
    ],
  },
  {
    name: "Pro",
    monthlyPrice: 197,
    features: [
      "Tudo do Starter",
      "Gestão de Pátio",
      "Agendamento online",
      "Site próprio da oficina",
      "Equipe + permissões",
      "Suporte prioritário",
    ],
  },
];


type CnpjStatus =
  | { state: "idle" }
  | { state: "checking" }
  | { state: "ok"; razaoSocial: string }
  | { state: "error"; message: string };




const Cadastro = () => {
  const [selectedPlan, setSelectedPlan] = useState("Pro");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nomeOficina, setNomeOficina] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [cnpjStatus, setCnpjStatus] = useState<CnpjStatus>({ state: "idle" });

  // Endereço
  const [cep, setCep] = useState("");
  const [estado, setEstado] = useState("");
  const [cidade, setCidade] = useState("");
  const [endereco, setEndereco] = useState("");
  const [numero, setNumero] = useState("");
  const [bairro, setBairro] = useState("");
  const [complemento, setComplemento] = useState("");

  const [loadingCep, setLoadingCep] = useState(false);
  const [cepEncontrado, setCepEncontrado] = useState(false);

  const [aceitouTermos, setAceitouTermos] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Auto-preencher endereço, estado e cidade ao digitar CEP completo (ViaCEP)
  const lastCepRef = useRef("");
  useEffect(() => {
    const digits = cep.replace(/\D/g, "");
    if (digits.length !== 8) {
      setCepEncontrado(false);
      lastCepRef.current = "";
      return;
    }
    if (digits === lastCepRef.current) return;
    lastCepRef.current = digits;
    setLoadingCep(true);
    fetch(`https://viacep.com.br/ws/${digits}/json/`)
      .then((r) => r.json())
      .then((data: any) => {
        if (data?.erro) {
          toast({ title: "CEP não encontrado", variant: "destructive" });
          setCepEncontrado(false);
          setEstado("");
          setCidade("");
          return;
        }
        setEstado(data.uf || "");
        setCidade(data.localidade || "");
        if (data.logradouro) setEndereco(data.logradouro);
        if (data.bairro) setBairro(data.bairro);
        setCepEncontrado(true);
      })
      .catch(() => {
        toast({ title: "Falha ao buscar CEP", variant: "destructive" });
        setCepEncontrado(false);
      })
      .finally(() => setLoadingCep(false));
  }, [cep, toast]);

  // Validação reativa
  const validation = useMemo(() => {
    return cadastroSchema.safeParse({
      nomeOficina,
      email,
      telefone,
      senha,
      cnpj,
      cep,
      estado,
      cidade,
      endereco,
      numero,
      bairro,
      complemento,
    });
  }, [nomeOficina, email, telefone, senha, cnpj, cep, estado, cidade, endereco, numero, bairro, complemento]);

  type FieldKey =
    | "nomeOficina" | "email" | "telefone" | "senha" | "cnpj"
    | "cep" | "estado" | "cidade" | "endereco" | "numero" | "bairro" | "complemento";
  const errors: Partial<Record<FieldKey, string>> = validation.success
    ? {}
    : Object.fromEntries(
        Object.entries(validation.error.flatten().fieldErrors).map(
          ([k, v]) => [k, v?.[0] ?? ""],
        ),
      );

  // Consulta BrasilAPI quando CNPJ for válido (debounce + cancelamento)
  const lastCheckedRef = useRef<string>("");
  useEffect(() => {
    const digits = cnpj.replace(/\D/g, "");
    if (digits.length !== 14 || !isCnpjValido(digits)) {
      setCnpjStatus({ state: "idle" });
      lastCheckedRef.current = "";
      return;
    }
    if (digits === lastCheckedRef.current) return;

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setCnpjStatus({ state: "checking" });
      try {
        const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${digits}`, {
          signal: controller.signal,
        });
        if (!res.ok) {
          if (res.status === 404) {
            setCnpjStatus({ state: "error", message: "CNPJ não encontrado na Receita" });
          } else {
            setCnpjStatus({ state: "error", message: "Não foi possível validar o CNPJ agora. Tente novamente." });
          }
          return;
        }
        const data = await res.json();
        const razao: string = data.razao_social || data.nome_fantasia || "Empresa encontrada";
        const situacao: string | undefined = data.descricao_situacao_cadastral;
        if (situacao && situacao.toUpperCase() !== "ATIVA") {
          setCnpjStatus({ state: "error", message: `CNPJ com situação "${situacao}" — não é possível cadastrar` });
          return;
        }
        lastCheckedRef.current = digits;
        setCnpjStatus({ state: "ok", razaoSocial: razao });
      } catch (err: any) {
        if (err.name === "AbortError") return;
        setCnpjStatus({ state: "error", message: "Falha ao consultar a Receita. Verifique sua conexão." });
      }
    }, 400);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [cnpj]);

  const cnpjOk = cnpjStatus.state === "ok";
  const formValido = validation.success && aceitouTermos && cnpjOk;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validation.success) {
      toast({ title: "Corrija os campos destacados", variant: "destructive" });
      return;
    }
    if (!cnpjOk) {
      toast({
        title: "Valide o CNPJ",
        description: "Aguarde a confirmação do CNPJ na Receita antes de continuar.",
        variant: "destructive",
      });
      return;
    }
    const data = validation.data;
    setLoading(true);

    // Monta endereço completo em uma string única
    const enderecoCompleto = [
      `${data.endereco}, ${data.numero}`,
      data.complemento ? data.complemento : null,
      data.bairro,
      `${data.cidade} - ${data.estado}`,
      `CEP ${data.cep}`,
    ]
      .filter(Boolean)
      .join(" • ");

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.senha,
      });
      if (authError) {
        toast({ title: "Erro ao criar conta", description: authError.message, variant: "destructive" });
        setLoading(false);
        return;
      }
      if (!authData.session) {
        toast({ title: "Erro", description: "Sessão não criada. Tente novamente.", variant: "destructive" });
        setLoading(false);
        return;
      }

      const { error: rpcError } = await supabase.rpc("create_oficina_for_user", {
        _nome: data.nomeOficina,
        _telefone: data.telefone || null,
        _cnpj: data.cnpj.replace(/\D/g, ""),
      });
      if (rpcError) {
        toast({ title: "Erro ao criar oficina", description: rpcError.message, variant: "destructive" });
        setLoading(false);
        return;
      }

      // Salva o endereço na oficina recém-criada
      const { error: updError } = await supabase
        .from("oficinas")
        .update({ endereco: enderecoCompleto })
        .eq("auth_user_id", authData.user!.id);
      if (updError) {
        // não bloqueia o cadastro
        console.warn("Falha ao salvar endereço:", updError.message);
      }

      await supabase.auth.refreshSession();
      toast({ title: "Conta criada com sucesso!", description: "Bem-vindo ao ONficina." });
      navigate("/admin");
    } catch (err: any) {
      toast({ title: "Erro inesperado", description: err.message, variant: "destructive" });
      setLoading(false);
    }
  };

  const inputCls = (hasError: boolean, ok = false) =>
    `w-full rounded-lg border bg-background px-4 py-3 text-sm outline-none focus:border-primary ${
      hasError ? "border-destructive" : ok ? "border-primary" : "border-input"
    }`;

  return (
    <div className="min-h-screen bg-background px-4 py-12">
      <div className="mx-auto max-w-2xl space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-block">
            <Logo size="lg" />
          </Link>
          <h1 className="mt-6 text-2xl font-bold">Cadastre sua oficina</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Teste grátis por 14 dias — sem cartão de crédito
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-border bg-card p-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">Nome da oficina *</label>
              <input
                value={nomeOficina}
                onChange={(e) => setNomeOficina(e.target.value)}
                className={inputCls(!!(nomeOficina && errors.nomeOficina))}
                required
              />
              {nomeOficina && errors.nomeOficina && (
                <p className="mt-1 text-xs text-destructive">{errors.nomeOficina}</p>
              )}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Telefone</label>
              <input
                type="tel"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(11) 91234-5678"
                className={inputCls(!!(telefone && errors.telefone))}
              />
              {telefone && errors.telefone && (
                <p className="mt-1 text-xs text-destructive">{errors.telefone}</p>
              )}
            </div>
          </div>

          {/* CNPJ */}
          <div>
            <label className="mb-1.5 block text-sm font-medium">CNPJ *</label>
            <div className="relative">
              <input
                inputMode="numeric"
                value={cnpj}
                onChange={(e) => setCnpj(formatCnpj(e.target.value))}
                placeholder="00.000.000/0000-00"
                maxLength={18}
                className={`${inputCls(!!(cnpj && (errors.cnpj || cnpjStatus.state === "error")), cnpjStatus.state === "ok")} pr-10`}
                required
              />
              {cnpjStatus.state === "checking" && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
              )}
              {cnpjStatus.state === "ok" && (
                <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary" />
              )}
            </div>
            {cnpj && errors.cnpj && <p className="mt-1 text-xs text-destructive">{errors.cnpj}</p>}
            {!errors.cnpj && cnpjStatus.state === "checking" && (
              <p className="mt-1 text-xs text-muted-foreground">Consultando Receita Federal…</p>
            )}
            {!errors.cnpj && cnpjStatus.state === "ok" && (
              <p className="mt-1 text-xs text-primary">✓ {cnpjStatus.razaoSocial}</p>
            )}
            {!errors.cnpj && cnpjStatus.state === "error" && (
              <p className="mt-1 text-xs text-destructive">{cnpjStatus.message}</p>
            )}
          </div>

          {/* Endereço */}
          <div className="space-y-4 rounded-xl border border-border/60 bg-background/40 p-4">
            <h3 className="text-sm font-semibold">Endereço da oficina</h3>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="sm:col-span-1">
                <label className="mb-1.5 block text-sm font-medium">CEP *</label>
                <div className="relative">
                  <input
                    inputMode="numeric"
                    value={cep}
                    onChange={(e) => setCep(formatCep(e.target.value))}
                    placeholder="00000-000"
                    maxLength={9}
                    className={`${inputCls(!!(cep && errors.cep))} pr-10`}
                    required
                  />
                  {loadingCep && (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
                  )}
                </div>
                {cep && errors.cep && <p className="mt-1 text-xs text-destructive">{errors.cep}</p>}
              </div>

              <div className="sm:col-span-1">
                <label className="mb-1.5 block text-sm font-medium">Estado *</label>
                <select
                  value={estado}
                  onChange={(e) => {
                    setEstado(e.target.value);
                    setCidade(""); // reseta cidade ao trocar estado
                  }}
                  className={inputCls(!!(estado && errors.estado))}
                  required
                >
                  <option value="">Selecione…</option>
                  {ufs.map((u) => (
                    <option key={u.sigla} value={u.sigla}>
                      {u.sigla} — {u.nome}
                    </option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-1">
                <label className="mb-1.5 block text-sm font-medium">Cidade *</label>
                <select
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  disabled={!estado || loadingMunicipios}
                  className={`${inputCls(!!(cidade && errors.cidade))} disabled:cursor-not-allowed disabled:opacity-50`}
                  required
                >
                  <option value="">
                    {!estado
                      ? "Escolha o estado primeiro"
                      : loadingMunicipios
                      ? "Carregando…"
                      : "Selecione…"}
                  </option>
                  {municipios.map((m) => (
                    <option key={m.id} value={m.nome}>
                      {m.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <label className="mb-1.5 block text-sm font-medium">Endereço (rua/avenida) *</label>
                <input
                  value={endereco}
                  onChange={(e) => setEndereco(e.target.value)}
                  placeholder="Av. Brasil"
                  className={inputCls(!!(endereco && errors.endereco))}
                  required
                />
                {endereco && errors.endereco && (
                  <p className="mt-1 text-xs text-destructive">{errors.endereco}</p>
                )}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Número *</label>
                <input
                  value={numero}
                  onChange={(e) => setNumero(e.target.value)}
                  placeholder="123"
                  className={inputCls(!!(numero && errors.numero))}
                  required
                />
                {numero && errors.numero && (
                  <p className="mt-1 text-xs text-destructive">{errors.numero}</p>
                )}
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-sm font-medium">Bairro *</label>
                <input
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                  placeholder="Centro"
                  className={inputCls(!!(bairro && errors.bairro))}
                  required
                />
                {bairro && errors.bairro && (
                  <p className="mt-1 text-xs text-destructive">{errors.bairro}</p>
                )}
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium">Complemento</label>
                <input
                  value={complemento}
                  onChange={(e) => setComplemento(e.target.value)}
                  placeholder="Sala 2 (opcional)"
                  className={inputCls(!!(complemento && errors.complemento))}
                />
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">E-mail *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={inputCls(!!(email && errors.email))}
                required
              />
              {email && errors.email && (
                <p className="mt-1 text-xs text-destructive">{errors.email}</p>
              )}
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Senha *</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  minLength={8}
                  placeholder="Mínimo 8 caracteres"
                  className={`${inputCls(!!(senha && errors.senha))} pr-10`}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {senha && errors.senha && (
                <p className="mt-1 text-xs text-destructive">{errors.senha}</p>
              )}
            </div>
          </div>

          {/* Plan selector */}
          <div>
            <label className="mb-3 block text-sm font-medium">Escolha seu plano</label>
            <div className="mx-auto grid max-w-md gap-3 sm:grid-cols-2">
              {plans.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => setSelectedPlan(p.name)}
                  className={`rounded-xl border p-4 text-left transition-all ${
                    selectedPlan === p.name
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <div className="text-sm font-semibold">{p.name}</div>
                  <div className="mt-1 text-lg font-bold">
                    R$ {p.monthlyPrice}
                    <span className="text-xs font-normal text-muted-foreground">/mês</span>
                  </div>
                  <ul className="mt-2 space-y-1">
                    {p.features.map((f) => (
                      <li key={f} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Check className="h-3 w-3 text-primary shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </button>
              ))}
            </div>
          </div>

          <label className="flex cursor-pointer items-start gap-3 mt-2">
            <input
              type="checkbox"
              checked={aceitouTermos}
              onChange={(e) => setAceitouTermos(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-border accent-primary"
            />
            <span className="text-xs leading-relaxed text-muted-foreground">
              Li e aceito os{" "}
              <a href={publicUrl("/termos")} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:opacity-80">
                Termos de Uso
              </a>{" "}
              e a{" "}
              <a href={publicUrl("/privacidade")} target="_blank" rel="noopener noreferrer" className="text-primary underline hover:opacity-80">
                Política de Privacidade
              </a>
            </span>
          </label>

          <button
            type="submit"
            disabled={!formValido || loading}
            className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 disabled:opacity-50"
          >
            {loading ? "Criando conta..." : "Iniciar teste grátis de 14 dias"}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Já tem conta?{" "}
          <Link to="/login" className="text-primary hover:underline">
            Fazer login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Cadastro;
