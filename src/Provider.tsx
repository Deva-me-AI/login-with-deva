import { createContext } from "react";

type DevaContext = {
  appId: string;
}

export const DevaContext = createContext<DevaContext | null>(null);

export type DevaProviderProps = {
  appId: string
  children: React.ReactNode
}

export function DevaProvider({ appId, children }: DevaProviderProps) {
  return (
    <DevaContext.Provider value={{ appId }}>
      {children}
    </DevaContext.Provider>
  );
}
