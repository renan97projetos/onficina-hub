import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import Logo from "@/components/Logo";
import { senhaSchema } from "@/lib/validations";

const RedefinirSenha = () => {
  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sessionPronta, setSessionPronta] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Quando o usuário clica no link do e-mail, o Supabase cria uma sessão de recovery
  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        setSessionPronta(true);
      }
    });
    // Caso a sessão já exista (refresh)
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setSessionPronta(true);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = senhaSchema.safeParse(senha);
    if (!parsed.success) {
      toast({
        title: "Senha inválida",
        description: parsed.error.issues[0]?.message ?? "Verifique a senha.",
        variant: "destructive",
      });
      return;
    }
    if (senha !== confirmacao) {
      toast({ title: "As senhas não conferem", variant: "destructive" });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password: parsed.data });
    setLoading(false);
    if (error) {
      toast({
        title: "Não foi possível atualizar",
        description: error.message,
        variant: "destructive",
      });
      return;
    }
    toast({ title: "Senha redefinida!", description: "Use sua nova senha para entrar." });
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-block">
            <Logo size="lg" />
          </Link>
          <h1 className="mt-6 text-2xl font-bold">Definir nova senha</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Escolha uma senha forte com pelo menos 8 caracteres
          </p>
        </div>

        {!sessionPronta ? (
          <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
            Validando seu link de recuperação...
            <p className="mt-3 text-xs">
              Se você abriu esta página direto, peça um novo link em{" "}
              <Link to="/recuperar-senha" className="text-primary hover:underline">
                recuperar senha
              </Link>
              .
            </p>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="space-y-4 rounded-2xl border border-border bg-card p-8"
          >
            <div>
              <label className="mb-1.5 block text-sm font-medium">Nova senha</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                  minLength={8}
                  className="w-full rounded-lg border border-input bg-background px-4 py-3 pr-10 text-sm outline-none focus:border-primary"
                  required
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-sm font-medium">Confirmar nova senha</label>
              <input
                type={showPassword ? "text" : "password"}
                value={confirmacao}
                onChange={(e) => setConfirmacao(e.target.value)}
                placeholder="Repita a senha"
                minLength={8}
                className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 disabled:opacity-50"
            >
              {loading ? "Salvando..." : "Salvar nova senha"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default RedefinirSenha;
