import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Session, User } from "@supabase/supabase-js";

interface Oficina {
  id: string;
  nome: string;
  plano: string;
  trial_expires_at: string | null;
}

export type UserRole = "dono" | "operador";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  oficina_id: string | null;
  oficina: Oficina | null;
  role: UserRole | null;
  isDono: boolean;
  loading: boolean;
  trialExpired: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  oficina_id: null,
  oficina: null,
  role: null,
  isDono: false,
  loading: true,
  trialExpired: false,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [oficina, setOficina] = useState<Oficina | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [memberOficinaId, setMemberOficinaId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchContext = async (userId: string) => {
    // 1) Tenta como membro (operador ou dono via vínculo)
    const { data: membro } = await supabase
      .from("usuarios_oficina")
      .select("oficina_id, role, ativo")
      .eq("user_id", userId)
      .eq("ativo", true)
      .maybeSingle();

    let ofId: string | null = null;
    let r: UserRole | null = null;

    if (membro) {
      ofId = membro.oficina_id as string;
      r = membro.role as UserRole;
    } else {
      // 2) Fallback: dono pelo auth_user_id (oficinas antigas sem vínculo)
      const { data: of } = await supabase
        .from("oficinas")
        .select("id")
        .eq("auth_user_id", userId)
        .maybeSingle();
      if (of) {
        ofId = of.id;
        r = "dono";
      }
    }

    setMemberOficinaId(ofId);
    setRole(r);

    if (ofId) {
      const { data } = await supabase
        .from("oficinas")
        .select("id, nome, plano, trial_expires_at")
        .eq("id", ofId)
        .maybeSingle();
      setOficina(data);
    } else {
      setOficina(null);
    }
  };

  useEffect(() => {
    // Listener PRIMEIRO
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        // Usar setTimeout para evitar deadlock no callback do auth
        setTimeout(() => {
          fetchContext(session.user.id).finally(() => setLoading(false));
        }, 0);
      } else {
        setOficina(null);
        setRole(null);
        setMemberOficinaId(null);
        setLoading(false);
      }
    });

    // Depois do listener: pega sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchContext(session.user.id).finally(() => setLoading(false));
      } else {
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const user = session?.user ?? null;
  const oficina_id = memberOficinaId ?? oficina?.id ?? user?.user_metadata?.oficina_id ?? null;

  const trialExpired =
    oficina?.plano === "trial" &&
    !!oficina?.trial_expires_at &&
    new Date(oficina.trial_expires_at) < new Date();

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        oficina_id,
        oficina,
        role,
        isDono: role === "dono",
        loading,
        trialExpired,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
