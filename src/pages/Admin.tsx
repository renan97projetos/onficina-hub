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
import DemoDadosOrcamento from "@/components/demo/DemoDadosOrcamento";
import DemoRelatorios from "@/components/demo/DemoRelatorios";
import DemoTreinamentos from "@/components/demo/DemoTreinamentos";
import DemoConfig from "@/components/demo/DemoConfig";
import DemoPatio from "@/components/demo/DemoPatio";
import DemoAnalytics from "@/components/demo/DemoAnalytics";
import OnboardingChecklist from "@/components/demo/OnboardingChecklist";

const pages: Record<string, React.ComponentType<any>> = {
  os: DemoOS,
  clientes: DemoClientes,
  servicos: DemoServicos,
  colaboradores: DemoColaboradores,
  agenda: DemoAgenda,
  veiculos: DemoVeiculos,
  financeiro: DemoFinanceiro,
  "dados-orcamento": DemoDadosOrcamento,
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
  const [pendingOsId, setPendingOsId] = useState<string | null>(null);
  const [pendingClienteId, setPendingClienteId] = useState<string | null>(null);

  const safeKey = !isDono && OPERADOR_BLOCKED.has(activeKey) ? "os" : activeKey;
  const Page = pages[safeKey] || DemoOS;

  const handleNavigate = (key: string, refId?: string) => {
    setActiveKey(key);
    if (refId) {
      if (key === "os") setPendingOsId(refId);
      else if (key === "clientes") setPendingClienteId(refId);
    }
  };

  let pageProps: any = { onNavigate: handleNavigate };
  if (safeKey === "os") {
    pageProps = {
      ...pageProps,
      initialOsId: pendingOsId,
      onConsumeInitialOsId: () => setPendingOsId(null),
    };
  } else if (safeKey === "clientes") {
    pageProps = {
      ...pageProps,
      initialClienteId: pendingClienteId,
      onConsumeInitialClienteId: () => setPendingClienteId(null),
    };
  }

  return (
    <DemoLayout activeKey={safeKey} onNavigate={handleNavigate}>
      {isDono && <OnboardingChecklist onNavigate={setActiveKey} />}
      <Page {...pageProps} />
    </DemoLayout>
  );
};

export default Admin;
