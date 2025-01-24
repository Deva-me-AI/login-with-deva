import { useCallback, useState, useMemo } from "react";
import { DevaContext } from "./DevaContext";
import {
  Dialog,
  DialogHeader,
  DialogFooter,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "./components/ui/dialog";
import { Button } from "./components/ui/button";

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
      <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Login</DialogTitle>
            <DialogDescription>
              Login into to deva.me to create
            </DialogDescription>
          </DialogHeader>
          <div className="flex items-center space-x-2">Login content</div>
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DevaContext.Provider>
  );
}
