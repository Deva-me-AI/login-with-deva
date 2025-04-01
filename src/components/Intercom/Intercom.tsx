import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
  Persona,
  Thread,
} from "@/server";
import { IntercomProvider, useIntercom } from "./IntercomContext";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { ScrollArea } from "../ui/scroll-area";
import { Message } from "./Message";
import { StreamResponse } from "./StreamResponse";
import { Input } from "./Input";
import useDebouncedCallback from "@/hooks/use-debounced-callback";

const useDevaPersona = ({ username }: { username: string }) => {
  const { url, accessToken } = useDevaContext();

  const params = new URLSearchParams({ usernames: username });
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
  const [messageMap, setMessageMap] = useState<Map<string, IMessage>>(
    new Map<string, IMessage>(),
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
          skip: cursor.toString(),
          limit: "10",
        })}`
      : null,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );

  // Update messageSet when new data is fetched
  useEffect(() => {
    if (res?.items) {
      setMessageMap((prevMap) => {
        const newMap = new Map<string, IMessage>(prevMap);
        res.items.forEach((item) => newMap.set(item.id, item));
        return newMap;
      });
    }
  }, [res?.items]);

  // Add a new message to the set
  const mutate = useCallback(
    async (mes: IMessage) => {
      // Update local state immediately for better UX
      setMessageMap((prevMap) => {
        const newMap = new Map(prevMap);
        newMap.set(mes.id, mes); // Add to the end (most recent)
        return newMap;
      });

      // Update remote state
      await internalMutate(async (res) => {
        const existingItems = res?.items ?? [];
        return {
          ...(res ?? ({} as PaginatedMessages)),
          items: [mes, ...existingItems],
        } as PaginatedMessages;
      });
    },
    [internalMutate],
  );

  // Handle stream completion
  const handleStreamComplete = useCallback(
    async (message?: IMessage) => {
      if (!message) {
        console.error("stream complete: No message received");
        return;
      }

      // Update local state immediately
      setMessageMap((prevMap) => {
        // Replace the streaming message if it exists, otherwise add the new message
        const existingMsgIndex = prevMap.has(message.id);
        if (existingMsgIndex) {
          // Create a new set without the existing message
          const newMap = new Map(prevMap);
          newMap.delete(message.id);

          // Add the completed message
          return newMap;
        } else {
          // Just add the new message
          return new Map(prevMap).set(message.id, message);
        }
      });

      // Update remote state
      await internalMutate(async (res) => {
        // Find and replace the message if it exists, otherwise add it
        const existingItems = res?.items ?? [];
        const existingIndex = existingItems.findIndex(
          (item) => item.id === message.id,
        );

        let newItems;
        if (existingIndex >= 0) {
          newItems = [...existingItems];
          newItems[existingIndex] = message;
        } else {
          newItems = [message, ...existingItems];
        }

        return {
          ...(res ?? ({} as PaginatedMessages)),
          items: newItems,
        } as PaginatedMessages;
      });

    },
    [internalMutate],
  );

  // Get messages in chronological order (newest to oldest)
  const messages = useMemo(() => {
    return Array.from(messageMap.values())
      .sort((a, b) => ((a.created_at ?? 0) < (b.created_at ?? 0) ? 1 : -1))
      .reverse();
  }, [messageMap]);

  const fetchNext = useDebouncedCallback(
    () => {
      setCursor((prev) => prev + 10);
    },
    200,
    [],
  );

  return {
    messages,
    isMessagesLoading,
    hasNext: (res?.total ?? 0) > cursor + 10,
    fetchNext,
    mutate,
    messagesFetchError,
    handleStreamComplete,
  };
};

const IntercomContent = ({
  thread,
  messages,
  isInitializing,
  isMessagesLoading,
  mutate,
  persona,
  fetchNext,
  hasNext,
}: {
  thread: Thread | undefined;
  messages: IMessage[];
  isInitializing: boolean;
  isMessagesLoading: boolean;
  mutate: (message: IMessage) => Promise<void>;
  persona?: Persona;
  fetchNext: () => void;
  hasNext: boolean;
}) => {
  const { user } = useDevaContext();
  const {
    scrollAreaRef,
    streamingMessageId,
    setStreamingMessageId,
    scrollToBottom,
  } = useIntercom();
  const [scrollPosition, setScrollPosition] = useState(0);
  const loadingRef = useRef<HTMLDivElement>(null);
  const isMessagesEmpty = messages.length === 0;

  // Set up effect to scroll to bottom when messages change
  useEffect(() => {
    scrollToBottom();
  }, [isMessagesEmpty, scrollToBottom]);

  // Handle message submission
  const handleSubmit = useCallback(
    async (message: IMessage) => {
      if (message.id) {
        setStreamingMessageId(message.id);
      }
      await mutate(message);
      scrollToBottom();
    },
    [mutate, setStreamingMessageId, scrollToBottom],
  );

  // Set up intersection observer for infinite scrolling
  useEffect(() => {
    if (!hasNext || isMessagesLoading || isMessagesEmpty) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry?.isIntersecting && hasNext) {
          fetchNext();
        }
      },
      { threshold: 0.5 },
    );

    const loadingElement = loadingRef.current;
    if (loadingElement) {
      observer.observe(loadingElement);
    }

    return () => {
      if (loadingElement) {
        observer.unobserve(loadingElement);
      }
    };
  }, [hasNext, fetchNext, isMessagesLoading, isMessagesEmpty]);

  // Track scroll position to maintain position when new messages are loaded
  useEffect(() => {
    const handleScroll = () => {
      if (scrollAreaRef.current) {
        const scrollContainer = scrollAreaRef.current.querySelector(
          "[data-radix-scroll-area-viewport]",
        );
        if (scrollContainer && !isMessagesLoading) {
          setScrollPosition(scrollContainer.scrollTop);
        }
      }
    };

    const scrollContainer = scrollAreaRef.current?.querySelector(
      "[data-radix-scroll-area-viewport]",
    );

    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, [scrollAreaRef, isMessagesLoading]);

  // Maintain scroll position when new messages are loaded at the top
  useEffect(() => {
    if (!isMessagesEmpty && isMessagesLoading) {
      const scrollContainer = scrollAreaRef.current?.querySelector(
        "[data-radix-scroll-area-viewport]",
      );
      if (scrollContainer) {
        // We need to wait for the DOM to update with new messages
        requestAnimationFrame(() => {
          // Add some offset to account for the new messages
          scrollContainer.scrollTop = scrollPosition + 100;
        });
      }
    }
  }, [
    isMessagesLoading,
    isMessagesEmpty,
    scrollPosition,
    scrollAreaRef,
  ]);

  return (
    <div
      id="intercom-container"
      className="relative flex h-full w-full flex-col"
    >
      <div
        id="support-header"
        className="flex h-20 w-full items-center justify-between px-6 text-white"
      >
        <div className="flex flex-initial flex-row items-center justify-start gap-x-4">
          <div className="flex-none">
            <Avatar className="h-10 w-10 rounded-full">
              <AvatarImage
                src={persona?.avatar ?? "/placeholder.svg"}
                alt={persona?.display_name ?? persona?.username ?? "User"}
              />
              <AvatarFallback className="text-black">
                {persona?.display_name?.charAt(0) ?? "U"}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="xs:max-w-[150px] min-w-0 max-w-[100px] overflow-hidden sm:max-w-[400px] md:max-w-[500px]">
            <h1
              aria-label={persona?.display_name ?? persona?.username}
              className="block max-w-xl overflow-hidden text-ellipsis whitespace-nowrap"
            >
              {persona?.display_name ?? persona?.username}
            </h1>
            <ul className="text-lynch-600 flex text-sm">
              <li>{thread?.members?.length ?? 0} members</li>
            </ul>
          </div>
        </div>
      </div>

      <ScrollArea className="h-full" ref={scrollAreaRef}>
        <div className="flex flex-col space-y-4 md:px-5">
          {/* Loading indicator at the top for infinite scroll */}
          {hasNext && (
            <div
              ref={loadingRef}
              className="py-2 text-center text-sm text-gray-400"
            ></div>
          )}

          {messages.map((message) => (
            <Message
              key={message.id}
              message={message}
              isMyMessage={message.persona_id === user?.persona?.id}
              isModal={true}
            />
          ))}

          {streamingMessageId && persona && (
            <StreamResponse
              messageId={streamingMessageId}
              threadId={thread?.id}
              persona={{
                username: persona?.username ?? "",
                id: persona?.id ?? "",
                avatar: persona?.avatar ?? undefined,
                display_name: persona?.display_name ?? undefined,
                user_id: persona?.user_id ?? "",
              }}
            />
          )}

          {/* Invisible element to help with scrolling to the bottom */}
          <div id="scroll-anchor"></div>
        </div>
      </ScrollArea>

      <Input
        threadId={thread?.id}
        showLoading={isInitializing}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export const Intercom = ({ username }: { username: string }) => {
  const { isAuthenticated } = useDevaContext();
  const [isOpen, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);

  const { support, isSupportLoading, personaFetchError } = useDevaPersona({
    username,
  });
  const { thread, isThreadLoading, threadFetchError } = useDevaThread();
  const {
    messages,
    isMessagesLoading,
    messagesFetchError,
    mutate,
    handleStreamComplete,
    hasNext,
    fetchNext,
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
            <IntercomProvider
              isIntercomOpen={isOpen}
              onStreamComplete={handleStreamComplete}
            >
              <IntercomContent
                persona={support}
                thread={thread}
                messages={messages}
                isInitializing={isInitializing}
                isMessagesLoading={isMessagesLoading}
                mutate={mutate}
                hasNext={hasNext}
                fetchNext={fetchNext}
              />
            </IntercomProvider>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};
