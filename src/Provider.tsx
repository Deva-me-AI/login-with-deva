import { useCallback, useState, useMemo } from "react";
import { DevaContext } from "./DevaContext";
import { LoginModal } from "./Login";

export type DevaProviderProps = {
  appId: string;
  children: React.ReactNode;
};

export function DevaProvider({ appId, children }: DevaProviderProps) {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const login = useCallback(() => {
    setIsLoginOpen(true);
  }, []);

  const context = useMemo(() => ({ appId, login }), [appId, login]);

  return (
    <DevaContext.Provider value={context}>
      {children}
      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </DevaContext.Provider>
  );
}
