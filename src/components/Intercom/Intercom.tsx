import { useCallback, useEffect, useState, useRef } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { HelpCircle, CircleX } from "lucide-react";
import { useSWRFetcher } from "@/lib/fetcher";
import { useDevaContext } from "@/DevaContext";
import type {
  Message as IMessage,
  PaginatedMessages,
  PagintedPersonas,
  Thread,
} from "@/server";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { ScrollArea } from "../ui/scroll-area";
import { Message } from "./Message";
import { Input } from "./Input";
import { StreamResponse } from "./StreamResponse";

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
  const [cursor, setCursor] = useState(0);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(
    null,
  );

  // TODO: add pagination
  const {
    data: res,
    isLoading: isMessagesLoading,
    error: messagesFetchError,
    mutate: internalMutate,
  } = useSWRFetcher<PaginatedMessages, Error>(
    threadId && accessToken
      ? `${url}/api/sdk/chat/${threadId}/messages?${new URLSearchParams({
          cursor: cursor.toString(),
          limit: "10",
        })}`
      : null,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  const mutate = useCallback(
    async (mes: IMessage) => {
      // Set the streaming message ID when a new message is submitted
      if (mes.id) {
        setStreamingMessageId(mes.id);
      }

      await internalMutate({
        ...res,
        items: [...(res?.items ?? []), mes],
      } as PaginatedMessages);
    },
    [internalMutate, res],
  );

  // Clear streaming message ID when streaming is complete
  const clearStreamingMessageId = useCallback(() => {
    setStreamingMessageId(null);
  }, []);

  return {
    messages: res?.items.reverse() ?? [],
    isMessagesLoading,
    hasNext: res?.total ?? 0 > cursor + 10,
    fetchNext: () => setCursor((prev) => prev + 10),
    mutate,
    messagesFetchError,
    streamingMessageId,
    clearStreamingMessageId,
  };
};

export const Intercom = () => {
  const { user, isAuthenticated } = useDevaContext();
  const [isOpen, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { support, isSupportLoading, personaFetchError } = useDevaSupport();
  const { thread, isThreadLoading, threadFetchError } = useDevaThread();
  const {
    messages,
    isMessagesLoading,
    messagesFetchError,
    mutate,
    streamingMessageId,
    clearStreamingMessageId,
  } = useDevaMessages({
    threadId: thread?.id,
  });

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
          <button className="m-3 flex items-center justify-center rounded-full bg-midnight-900">
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
        <div className="h-[90vh] max-h-[530px] w-[90vw] max-w-[400px] rounded-[20px] border border-[#22252A] bg-midnight-900">
          {error ? (
            <div className="flex h-full items-center justify-center p-4 text-center text-red-500">
              {error}
            </div>
          ) : (
            <div
              id="intercom-container"
              className="relative flex h-[100dvh-65px] w-full flex-col md:h-full"
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

              <ScrollArea className="h-full md:px-5" ref={scrollAreaRef}>
                {messages.map((message) => (
                  <Message
                    key={message.id}
                    message={message}
                    isMyMessage={message.persona_id === user?.persona?.id}
                    isModal={true}
                  />
                ))}

                {streamingMessageId && support && (
                  <StreamResponse
                    messageId={streamingMessageId}
                    threadId={thread?.id}
                    persona={{
                      username: support.username,
                      id: support.id,
                      avatar: support.avatar ?? undefined,
                      display_name: support.display_name ?? undefined,
                      user_id: support.user_id ?? "",
                    }}
                  />
                )}
              </ScrollArea>

              <Input
                threadId={thread?.id}
                showLoading={isInitializing}
                onSubmit={mutate}
              />
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
