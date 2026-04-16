import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import Logo from "@/components/Logo";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session } = useAuth();

  const [searchParams] = useSearchParams();
  const returnUrl = searchParams.get("returnUrl") || "/admin";

  // If already logged in, redirect via useEffect
  const [redirecting, setRedirecting] = useState(false);
  
  useState(() => {
    if (session) {
      setRedirecting(true);
    }
  });

  if (session && !redirecting) {
    // Already handled by effect below
  }

  // Use effect for navigation to avoid React warning
  import { useEffect } from "react";
  

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      const msg =
        error.message === "Invalid login credentials"
          ? "E-mail ou senha incorretos. Verifique e tente novamente."
          : error.message === "Email not confirmed"
          ? "Seu e-mail ainda não foi confirmado. Verifique sua caixa de entrada."
          : "Não foi possível fazer login. Tente novamente.";
      toast({ title: "Não foi possível entrar", description: msg, variant: "destructive" });
      setLoading(false);
      return;
    }

    navigate(returnUrl);
  };

  // Dev bypass
  const handleDevAccess = async () => {
    setLoading(true);
    const devEmail = "admin@onficina.dev";
    const devPassword = "dev123456!A";

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: devEmail,
      password: devPassword,
    });

    if (!signInError) {
      navigate("/admin");
      return;
    }

    // Create dev account + oficina
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: devEmail,
      password: devPassword,
    });

    if (signUpError) {
      toast({ title: "Erro", description: signUpError.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    if (data.session) {
      // Create oficina for dev user
      await supabase.rpc("create_oficina_for_user", {
        _nome: "Oficina Dev",
        _telefone: null,
      });
      await supabase.auth.refreshSession();
      navigate("/admin");
      return;
    }

    // Fallback login
    const { error } = await supabase.auth.signInWithPassword({
      email: devEmail,
      password: devPassword,
    });

    if (error) {
      toast({ title: "Erro", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    navigate("/admin");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link to="/" className="inline-block">
            <Logo size="lg" />
          </Link>
          <h1 className="mt-6 text-2xl font-bold">Entrar na sua conta</h1>
          <p className="mt-2 text-sm text-muted-foreground">Acesse o painel da sua oficina</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 rounded-2xl border border-border bg-card p-8">
          <div>
            <label className="mb-1.5 block text-sm font-medium">E-mail</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Senha</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-input bg-background px-4 py-3 pr-10 text-sm outline-none transition-colors focus:border-primary"
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
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="text-center text-sm text-muted-foreground">
          Não tem conta?{" "}
          <Link to="/cadastro" className="text-primary hover:underline">
            Cadastre-se grátis
          </Link>
        </p>

        {/* Dev bypass — remover em produção */}
        <div className="border-t border-border pt-4">
          <button
            onClick={handleDevAccess}
            disabled={loading}
            className="w-full rounded-lg border border-dashed border-primary/30 py-2.5 text-xs font-medium text-muted-foreground transition-all hover:border-primary hover:text-primary disabled:opacity-50"
          >
            🔧 Acesso dev
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
