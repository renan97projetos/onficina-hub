import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

interface Oficina {
  id: string;
  nome: string;
  plano: string;
  trial_expires_at: string | null;
}

interface AuthContextType {
  session: Session | null;
  user: User | null;
  oficina_id: string | null;
  oficina: Oficina | null;
  loading: boolean;
  trialExpired: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  oficina_id: null,
  oficina: null,
  loading: true,
  trialExpired: false,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [oficina, setOficina] = useState<Oficina | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOficina = async () => {
    const { data } = await supabase
      .from("oficinas")
      .select("id, nome, plano, trial_expires_at")
      .maybeSingle();
    setOficina(data);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchOficina().finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchOficina().finally(() => setLoading(false));
      } else {
        setOficina(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const user = session?.user ?? null;
  const oficina_id = oficina?.id ?? user?.user_metadata?.oficina_id ?? null;

  const trialExpired =
    oficina?.plano === "trial" &&
    !!oficina?.trial_expires_at &&
    new Date(oficina.trial_expires_at) < new Date();

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{ session, user, oficina_id, oficina, loading, trialExpired, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
