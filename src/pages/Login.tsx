import Logo from "@/components/Logo";
import { Link } from "react-router-dom";

const Login = () => {
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

        <div className="space-y-4 rounded-2xl border border-border bg-card p-8">
          <div>
            <label className="mb-1.5 block text-sm font-medium">E-mail</label>
            <input
              type="email"
              placeholder="seu@email.com"
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Senha</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
            />
          </div>
          <button className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110">
            Entrar
          </button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Não tem conta?{" "}
          <Link to="/cadastro" className="text-primary hover:underline">
            Cadastre-se grátis
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
