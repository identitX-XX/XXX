import type { Session } from "@supabase/supabase-js";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { configure } from "./config";
import { supabase } from "./supabase";

type EtatSession = { session: Session | null; charge: boolean };
const Contexte = createContext<EtatSession>({ session: null, charge: false });

export function FournisseurSession({ children }: { children: ReactNode }) {
  const [etat, setEtat] = useState<EtatSession>({ session: null, charge: !configure });
  useEffect(() => {
    if (!configure) return;
    supabase.auth.getSession().then(({ data }) => setEtat({ session: data.session, charge: true }));
    const { data } = supabase.auth.onAuthStateChange((_evt, session) => setEtat({ session, charge: true }));
    return () => data.subscription.unsubscribe();
  }, []);
  return <Contexte.Provider value={etat}>{children}</Contexte.Provider>;
}

export const useSession = () => useContext(Contexte);
