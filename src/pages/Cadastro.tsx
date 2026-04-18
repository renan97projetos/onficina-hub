import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Check, Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Logo from "@/components/Logo";
import { cadastroSchema } from "@/lib/validations";
import { z } from "zod";

const plans = [
  {
    name: "Starter",
    monthlyPrice: 97,
    yearlyPrice: 970,
    features: ["Pipeline completo", "Até 2 colaboradores", "Notificações", "Financeiro básico"],
  },
  {
    name: "Pro",
    monthlyPrice: 197,
    yearlyPrice: 1970,
    features: ["Tudo do Starter", "Até 5 colaboradores", "Agendamento", "CRM", "Relatórios avançados"],
  },
];

const Cadastro = () => {
  const [annual, setAnnual] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("Pro");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [nomeOficina, setNomeOficina] = useState("");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");
  const [senha, setSenha] = useState("");
  const [aceitouTermos, setAceitouTermos] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Validação reativa
  const validation = useMemo(() => {
    return cadastroSchema.safeParse({
      nomeOficina,
      email,
      telefone,
      senha,
    });
  }, [nomeOficina, email, telefone, senha]);

  const errors: Partial<Record<"nomeOficina" | "email" | "telefone" | "senha", string>> =
    validation.success
      ? {}
      : Object.fromEntries(
          Object.entries(validation.error.flatten().fieldErrors).map(
            ([k, v]) => [k, v?.[0] ?? ""],
          ),
        );

  const formValido = validation.success && aceitouTermos;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validation.success) {
      toast({ title: "Corrija os campos destacados", variant: "destructive" });
      return;
    }
    const { nomeOficina: nome, email: mail, telefone: tel, senha: pwd } = validation.data;
    setLoading(true);

    try {
      // 1. Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: mail,
        password: pwd,
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

      // 2. Create oficina via RPC (sets oficina_id in user metadata)
      const { error: rpcError } = await supabase.rpc("create_oficina_for_user", {
        _nome: nome,
        _telefone: tel || null,
      });

      if (rpcError) {
        toast({ title: "Erro ao criar oficina", description: rpcError.message, variant: "destructive" });
        setLoading(false);
        return;
      }

      // 3. Refresh session to pick up updated metadata
      await supabase.auth.refreshSession();

      toast({ title: "Conta criada com sucesso!", description: "Bem-vindo ao ONficina." });
      navigate("/admin");
    } catch (err: any) {
      toast({ title: "Erro inesperado", description: err.message, variant: "destructive" });
      setLoading(false);
    }
  };

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
                className={`w-full rounded-lg border bg-background px-4 py-3 text-sm outline-none focus:border-primary ${
                  nomeOficina && errors.nomeOficina ? "border-destructive" : "border-input"
                }`}
                required
                aria-invalid={!!(nomeOficina && errors.nomeOficina)}
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
                className={`w-full rounded-lg border bg-background px-4 py-3 text-sm outline-none focus:border-primary ${
                  telefone && errors.telefone ? "border-destructive" : "border-input"
                }`}
                aria-invalid={!!(telefone && errors.telefone)}
              />
              {telefone && errors.telefone && (
                <p className="mt-1 text-xs text-destructive">{errors.telefone}</p>
              )}
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium">E-mail *</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full rounded-lg border bg-background px-4 py-3 text-sm outline-none focus:border-primary ${
                  email && errors.email ? "border-destructive" : "border-input"
                }`}
                required
                aria-invalid={!!(email && errors.email)}
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
                  className={`w-full rounded-lg border bg-background px-4 py-3 pr-10 text-sm outline-none focus:border-primary ${
                    senha && errors.senha ? "border-destructive" : "border-input"
                  }`}
                  required
                  aria-invalid={!!(senha && errors.senha)}
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
            <div className="mb-4 flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background p-1">
                <button
                  type="button"
                  onClick={() => setAnnual(false)}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${!annual ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
                >
                  Mensal
                </button>
                <button
                  type="button"
                  onClick={() => setAnnual(true)}
                  className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${annual ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
                >
                  Anual (-17%)
                </button>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
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
                    R$ {annual ? Math.round(p.yearlyPrice / 12) : p.monthlyPrice}
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
              <a
                href="/termos"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline hover:opacity-80"
              >
                Termos de Uso
              </a>{" "}
              e a{" "}
              <a
                href="/privacidade"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline hover:opacity-80"
              >
                Política de Privacidade
              </a>
            </span>
          </label>

          <button
            type="submit"
            disabled={!aceitouTermos || loading}
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
