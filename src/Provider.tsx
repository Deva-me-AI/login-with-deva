import { useMemo } from "react";
import { DevaContext } from "./DevaContext";
import { Toaster } from "./components/ui/toaster";

export type DevaProviderProps = {
  clientId: string;
  redirectUri: string;
  scopes: string[];
  children: React.ReactNode;
};

export function DevaProvider({
  clientId,
  redirectUri,
  scopes,
  children,
}: DevaProviderProps) {
  const context = useMemo(
    () => ({ clientId, redirectUri, scopes }),
    [clientId, redirectUri, scopes],
  );

  return (
    <DevaContext.Provider value={context}>
      {children}
      <Toaster />
    </DevaContext.Provider>
  );
}
