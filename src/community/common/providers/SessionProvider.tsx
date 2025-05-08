// lib/SessionContext.js
import { createContext, useContext, ReactNode } from "react";
import { useSession } from "next-auth/react";

const SessionContext = createContext<ReturnType<typeof useSession>>(null as any);

export function SessionContextProvider({ children }: { children: ReactNode }) {
  const sessionData = useSession();
  return (
    <SessionContext.Provider value={sessionData}>
      {children}
    </SessionContext.Provider>
  );
}

export function useAppSession() {
  return useContext(SessionContext);
}