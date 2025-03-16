import { useEffect, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { HelpCircle, CircleX, MoveUpRight } from "lucide-react";
import { useSWRFetcher } from "@/lib/fetcher";
import { useDevaContext } from "@/DevaContext";
import type { Message, PagintedPersonas, Thread } from "@/server";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { ScrollArea } from "../ui/scroll-area";
import { cn } from "@/lib/utils";
import { Spinner } from "../ui/spinner";

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
  const [text, setText] = useState("");

  console.log("support", support);
  console.log("thread", thread, isThreadLoading, threadFetchError);
  console.log("messages", messages, isMessagesLoading, messagesFetchError);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
  };

  useEffect(() => {
    if (isSupportLoading || isThreadLoading || isMessagesLoading) {
      setIsInitializing(true);
    } else {
      setIsInitializing(false);
    }

    if (personaFetchError) {
      setError(personaFetchError.message);
    } else if (threadFetchError) {
      setError(threadFetchError.message);
    } else if (messagesFetchError) {
      setError(messagesFetchError.message);
    } else {
      setError(null);
    }
  }, [
    isSupportLoading,
    isThreadLoading,
    isMessagesLoading,
    personaFetchError,
    threadFetchError,
    messagesFetchError,
  ]);

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
          ) : (
            <div
              id="intercom-container"
              className="relative h-[100dvh-65px] w-full flex flex-col md:h-full"
            >
              <div
                id="support-header"
                className="flex h-20 w-full items-center justify-between px-6 text-white"
              >
                <div className="flex flex-initial flex-row items-center justify-start gap-x-4">
                  <div className="flex-none">
                    <Avatar className="h-10 w-10 rounded-full">
                      <AvatarImage
                        src={support?.avatar ?? "/placeholder.svg"}
                        alt={
                          support?.display_name ?? support?.username ?? "User"
                        }
                      />
                      <AvatarFallback className="text-black">
                        {support?.display_name?.charAt(0) ?? "U"}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="xs:max-w-[150px] min-w-0 max-w-[100px] overflow-hidden sm:max-w-[400px] md:max-w-[500px]">
                    <h1
                      aria-label={support?.display_name ?? support?.username}
                      className="block max-w-xl overflow-hidden text-ellipsis whitespace-nowrap"
                    >
                      {support?.display_name ?? support?.username}
                    </h1>
                    <ul className="text-lynch-600 flex text-sm">
                      <li>{thread?.members?.length ?? 0} members</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div id="support-messages-container" className="flex-grow">
                <ScrollArea className="h-full"></ScrollArea>
              </div>

              <div
                id="support-input-container"
                className={"bg-gradient-to-t to-transparent"}
              >
                <form
                  className={cn(
                    "flex w-full flex-row px-5 pt-2 last:mb-2 md:last:mb-[18px] lg:mx-auto lg:max-w-3xl",
                    {
                      "lg:pt-6": !false, // is replying to specfic message
                    },
                  )}
                >
                  <div className="relative flex h-full flex-1 md:flex-col">
                    <div className="bg-catskill-200 relative flex w-full flex-grow items-center rounded-[36px] py-2 pl-3 text-white shadow-[0_0_15px_rgba(0,0,0,0.10)] md:py-2 md:pl-4">
                      <div
                        id="support-input"
                        className="w-full overflow-hidden [&>div>div]:overflow-hidden" // Removes scroll in the chat input
                        style={{ gridColumn: "2", gridRow: "1" }}
                      >
                        {thread && (
                          <input
                            type="text"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            placeholder="Type a message..."
                            className="h-full w-full bg-transparent text-white outline-none"
                          />
                        )}
                      </div>

                      <button
                        type="submit"
                        className={cn(
                          {
                            "bg-blue-500 text-gray-100": !false, // is sending,
                          },
                          "disabled:bg-ghost-300 bottom-1.5 right-1 mr-3 flex h-8 w-9 items-center justify-center self-end rounded-full bg-lime-300 text-black disabled:cursor-not-allowed disabled:text-gray-500 md:bottom-2.5 md:right-2",
                        )}
                        disabled={
                          !text.trim().length || false // is sending
                        }
                      >
                        {isInitializing ? ( // is sending
                          <Spinner />
                        ) : (
                          <MoveUpRight />
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
