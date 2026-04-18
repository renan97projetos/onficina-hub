import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import PrivateRoute from "@/components/PrivateRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Assinar from "./pages/Assinar";
import Admin from "./pages/Admin";
import Orcamento from "./pages/Orcamento";
import AprovarOrcamento from "./pages/AprovarOrcamento";
import Acompanhar from "./pages/Acompanhar";
import TecnicoOS from "./pages/TecnicoOS";
import Avaliacao from "./pages/Avaliacao";
import Pagamento from "./pages/Pagamento";
import PagamentoRetorno from "./pages/PagamentoRetorno";
import PainelAssinatura from "./pages/PainelAssinatura";
import NotFound from "./pages/NotFound";
import AgendaPublica from "./pages/AgendaPublica";
import SiteOficina from "./pages/SiteOficina";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
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
            <Route
              path="/painel/assinatura"
              element={
                <PrivateRoute>
                  <PainelAssinatura />
                </PrivateRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
