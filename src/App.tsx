import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import PrivateRoute from "@/components/PrivateRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Assinar from "./pages/Assinar";
import Orcamento from "./pages/Orcamento";
import AprovarOrcamento from "./pages/AprovarOrcamento";
import TecnicoOS from "./pages/TecnicoOS";
import Pagamento from "./pages/Pagamento";
import PagamentoRetorno from "./pages/PagamentoRetorno";
import PainelAssinatura from "./pages/PainelAssinatura";
import NotFound from "./pages/NotFound";
import AgendaPublica from "./pages/AgendaPublica";
import SiteOficina from "./pages/SiteOficina";
import Unsubscribe from "./pages/Unsubscribe";
import Termos from "./pages/Termos";
import Privacidade from "./pages/Privacidade";
import RecuperarSenha from "./pages/RecuperarSenha";
import RedefinirSenha from "./pages/RedefinirSenha";

// Code-splitting: rotas pesadas/menos críticas carregam sob demanda
const Admin = lazy(() => import("./pages/Admin"));
const Acompanhar = lazy(() => import("./pages/Acompanhar"));
const Avaliacao = lazy(() => import("./pages/Avaliacao"));

const PageFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Suspense fallback={<PageFallback />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/cadastro" element={<Cadastro />} />
                <Route path="/recuperar-senha" element={<RecuperarSenha />} />
                <Route path="/forgot-password" element={<RecuperarSenha />} />
                <Route path="/redefinir-senha" element={<RedefinirSenha />} />
                <Route path="/reset-password" element={<RedefinirSenha />} />
                <Route path="/assinar" element={<Assinar />} />
                <Route
                  path="/admin"
                  element={
                    <PrivateRoute>
                      <Admin />
                    </PrivateRoute>
                  }
                />
                <Route path="/orcamento" element={<Orcamento />} />
                <Route path="/aprovar/:token" element={<AprovarOrcamento />} />
                <Route path="/acompanhar/:token" element={<Acompanhar />} />
                <Route
                  path="/tecnico/:osId"
                  element={
                    <PrivateRoute>
                      <TecnicoOS />
                    </PrivateRoute>
                  }
                />
                <Route path="/avaliacao" element={<Avaliacao />} />
                <Route path="/pagamento" element={<Pagamento />} />
                <Route path="/pagamento/retorno" element={<PagamentoRetorno />} />
                <Route path="/agendar/:slug" element={<AgendaPublica />} />
                <Route path="/oficina/:slug" element={<SiteOficina />} />
                <Route path="/unsubscribe" element={<Unsubscribe />} />
                <Route
                  path="/painel/assinatura"
                  element={
                    <PrivateRoute>
                      <PainelAssinatura />
                    </PrivateRoute>
                  }
                />
                <Route path="/termos" element={<Termos />} />
                <Route path="/privacidade" element={<Privacidade />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
