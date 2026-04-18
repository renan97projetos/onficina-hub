import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import DemoLayout from "@/components/demo/DemoLayout";
import DemoOS from "@/components/demo/DemoOS";
import DemoClientes from "@/components/demo/DemoClientes";
import DemoServicos from "@/components/demo/DemoServicos";
import DemoColaboradores from "@/components/demo/DemoColaboradores";
import DemoAgenda from "@/components/demo/DemoAgenda";
import DemoVeiculos from "@/components/demo/DemoVeiculos";
import DemoFinanceiro from "@/components/demo/DemoFinanceiro";
import DemoRelatorios from "@/components/demo/DemoRelatorios";
import DemoTreinamentos from "@/components/demo/DemoTreinamentos";
import DemoConfig from "@/components/demo/DemoConfig";
import DemoPatio from "@/components/demo/DemoPatio";
import DemoAnalytics from "@/components/demo/DemoAnalytics";
import OnboardingChecklist from "@/components/demo/OnboardingChecklist";

const pages: Record<string, React.ComponentType> = {
  os: DemoOS,
  clientes: DemoClientes,
  servicos: DemoServicos,
  colaboradores: DemoColaboradores,
  agenda: DemoAgenda,
  veiculos: DemoVeiculos,
  financeiro: DemoFinanceiro,
  relatorios: DemoRelatorios,
  treinamentos: DemoTreinamentos,
  config: DemoConfig,
  patio: DemoPatio,
  analytics: DemoAnalytics,
};

const OPERADOR_BLOCKED = new Set(["financeiro", "config"]);

const Admin = () => {
  const { isDono } = useAuth();
  const [activeKey, setActiveKey] = useState("os");

  // Bloqueio defensivo: se operador tentar acessar página restrita, redireciona
  const safeKey = !isDono && OPERADOR_BLOCKED.has(activeKey) ? "os" : activeKey;
  const Page = pages[safeKey] || DemoOS;

  return (
    <DemoLayout activeKey={safeKey} onNavigate={setActiveKey}>
      {isDono && <OnboardingChecklist onNavigate={setActiveKey} />}
      <Page />
    </DemoLayout>
  );
};

export default Admin;

