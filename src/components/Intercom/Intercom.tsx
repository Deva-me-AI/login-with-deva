import { useState } from "react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { HelpCircle, X } from "lucide-react";

export const Intercom = () => {
  const [isOpen, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <div
          id="intercom-container"
          className="absolute bottom-28 right-4 z-10 md:bottom-10 md:right-10"
        >
          <button className="bg-midnight-900 m-3 flex items-center justify-center rounded-full">
            {isOpen ? (
              <X className="h-[30px] w-[30px] p-2 text-white" />
            ) : (
              <HelpCircle className="h-[50px] w-[50px] p-2 text-white" />
            )}
          </button>
        </div>
      </DialogTrigger>

      <DialogContent className="border-none bg-transparent p-0 shadow-none">
        <div className="bg-midnight-900 left-1/2 h-[90vh] max-h-[530px] w-[90vw] max-w-[400px] -translate-x-1/2 rounded-[20px] border border-[#22252A] md:left-auto md:mb-32 md:mr-10 md:translate-x-0">
          {error ? (
            <div className="flex h-full items-center justify-center p-4 text-center text-red-500">
              {error}
            </div>
          ) : isInitializing ? (
            <div className="flex h-full items-center justify-center">
              Loading...
            </div>
          ) : (
            <div>Chat inside</div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
