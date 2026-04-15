import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Demo access — any credentials work
    navigate("/demo");
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
              placeholder="demo@oficina.com"
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm outline-none transition-colors focus:border-primary"
            />
          </div>
          <button type="submit" className="w-full rounded-lg bg-primary py-3 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110">
            Entrar
          </button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border" /></div>
            <div className="relative flex justify-center"><span className="bg-card px-3 text-xs text-muted-foreground">ou</span></div>
          </div>
          <Link
            to="/demo"
            className="block w-full rounded-lg border border-border py-3 text-center text-sm font-semibold text-foreground transition-all hover:bg-muted"
          >
            Acessar demonstração
          </Link>
        </form>

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
