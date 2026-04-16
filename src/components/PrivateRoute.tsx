import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Logo from "@/components/Logo";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { session, loading, trialExpired } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background">
        <Logo size="lg" />
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Verificando sessão…</p>
      </div>
    );
  }

  if (!session) {
    const returnUrl = location.pathname + location.search;
    return <Navigate to={`/login?returnUrl=${encodeURIComponent(returnUrl)}`} replace />;
  }

  if (trialExpired && location.pathname !== "/assinar") {
    return <Navigate to="/assinar" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
