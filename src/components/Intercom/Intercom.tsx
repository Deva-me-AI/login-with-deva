import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { HelpCircle, CircleX } from "lucide-react";
import { useSWRFetcher } from "@/lib/fetcher";
import { useDevaContext } from "@/DevaContext";
import type { Message, PagintedPersonas, Thread } from "@/server";

const useDevaSupport = () => {
  const { url, accessToken } = useDevaContext();

  const params = new URLSearchParams({ usernames: "deva_support" });
  const {
    data: support,
    isLoading: isSupportLoading,
    error: personaFetchError,
  } = useSWRFetcher<PagintedPersonas, Error>(
    accessToken ? `${url}/api/sdk/persona/public?${params}` : null,
    {
      headers: accessToken
        ? {
            Authorization: `Bearer ${accessToken}`,
          }
        : undefined,
    },
  );

  return {
    support: support?.items[0],
    isSupportLoading,
    personaFetchError,
  };
};

const useDevaThread = () => {
  const { url, accessToken } = useDevaContext();

  const {
    data: thread,
    isLoading: isThreadLoading,
    error: threadFetchError,
  } = useSWRFetcher<Thread, Error>(
    accessToken ? `${url}/api/sdk/chat/dm/deva_support` : null,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return {
    thread,
    isThreadLoading,
    threadFetchError,
  };
};

const useDevaMessages = ({ threadId }: { threadId?: string }) => {
  const { url, accessToken } = useDevaContext();

  const {
    data: messages,
    isLoading: isMessagesLoading,
    error: messagesFetchError,
  } = useSWRFetcher<Message, Error>(
    threadId && accessToken ? `${url}/api/sdk/chat/${threadId}/messages` : null,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  return {
    messages,
    isMessagesLoading,
    messagesFetchError,
  };
};

export const Intercom = () => {
  const { isAuthenticated } = useDevaContext();
  const [isOpen, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const { support, isSupportLoading, personaFetchError } = useDevaSupport();
  const { thread, isThreadLoading, threadFetchError } = useDevaThread();
  const { messages, isMessagesLoading, messagesFetchError } = useDevaMessages({
    threadId: thread?.id,
  });

  console.log("support", support);
  console.log("thread", thread, isThreadLoading, threadFetchError);
  console.log("messages", messages, isMessagesLoading, messagesFetchError);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <div
          id="intercom-container"
          className="absolute bottom-28 right-4 z-10 md:bottom-10 md:right-10"
        >
          <button className="bg-midnight-900 m-3 flex items-center justify-center rounded-full">
            {isOpen ? (
              <CircleX className="h-[50px] w-[50px] p-2 text-white" />
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
