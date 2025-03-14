import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { HelpCircle, X } from "lucide-react";

export const Intercom = () => {
  const [isOpen, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
  };

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
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
      </PopoverTrigger>

      <PopoverContent
        className="w-auto border-none bg-transparent p-0 shadow-none"
        align="end"
        side="top"
        sideOffset={16}
      >
        <div className="bg-midnight-900 h-[90vh] max-h-[530px] w-[90vw] max-w-[400px] rounded-[20px] border border-[#22252A]">
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
      </PopoverContent>
    </Popover>
  );
};
