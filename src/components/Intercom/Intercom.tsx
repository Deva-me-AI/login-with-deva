import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Portal } from "@radix-ui/react-portal";
import {
  Popover,
  PopoverPortal,
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
    isLoading: isPersonaLoading,
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
    persona: support?.items[0],
    isPersonaLoading,
    personaFetchError,
  };
};

const useDevaThread = ({ username }: { username?: string }) => {
  const { url, accessToken } = useDevaContext();

  const {
    data: thread,
    isLoading: isThreadLoading,
    error: threadFetchError,
  } = useSWRFetcher<Thread, Error>(
    accessToken && username ? `${url}/api/sdk/chat/dm/${username}` : null,
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

  // clear messages when threadId changes
  useEffect(() => {
    setMessageMap(new Map<string, IMessage>());
    setCursor(0);
  }, [threadId]);

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
  }, [isMessagesLoading, isMessagesEmpty, scrollPosition, scrollAreaRef]);

  return (
    <div
      id="intercom-container"
      className="deva-relative deva-flex deva-h-full deva-w-full deva-flex-col"
    >
      <div
        id="support-header"
        className="deva-flex deva-h-20 deva-w-full deva-items-center deva-justify-between deva-px-6 deva-text-white"
      >
        <div className="deva-flex deva-flex-initial deva-flex-row deva-items-center deva-justify-start deva-gap-x-4">
          <div className="deva-flex-none">
            <Avatar className="deva-h-10 deva-w-10 deva-rounded-full">
              <AvatarImage
                src={persona?.avatar ?? "/placeholder.svg"}
                alt={persona?.display_name ?? persona?.username ?? "User"}
              />
              <AvatarFallback className="deva-text-black">
                {persona?.display_name?.charAt(0) ?? "U"}
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="xs:deva-max-w-[150px] deva-min-w-0 deva-max-w-[100px] deva-overflow-hidden sm:deva-max-w-[400px] md:deva-max-w-[500px]">
            <h1
              aria-label={persona?.display_name ?? persona?.username}
              className="deva-block deva-max-w-xl deva-overflow-hidden deva-text-ellipsis deva-whitespace-nowrap"
            >
              {persona?.display_name ?? persona?.username}
            </h1>
            <ul className="deva-text-lynch-600 deva-flex deva-text-sm">
              <li>{thread?.members?.length ?? 0} members</li>
            </ul>
          </div>
        </div>
      </div>

      <ScrollArea className="deva-h-full" ref={scrollAreaRef}>
        <div className="deva-flex deva-flex-col deva-space-y-4 md:deva-px-5">
          {/* Loading indicator at the top for infinite scroll */}
          {hasNext && (
            <div
              ref={loadingRef}
              className="deva-py-2 deva-text-center deva-text-sm deva-text-gray-400"
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

export const Intercom = ({
  username,
  fetchOnMount = false,
}: {
  username: string;
  fetchOnMount?: boolean;
}) => {
  const { isAuthenticated } = useDevaContext();
  const [isOpen, setOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [isPersonaNotFound, setIsPersonaNotFound] = useState(false);

  const { persona, isPersonaLoading, personaFetchError } = useDevaPersona({
    username,
  });

  useEffect(() => {
    setIsPersonaNotFound(isOpen && !!username && !isPersonaLoading && !persona);
  }, [isOpen, username, isPersonaLoading, persona]);

  const { thread, isThreadLoading, threadFetchError } = useDevaThread({
    username: persona ? username : undefined,
  });

  const {
    messages,
    isMessagesLoading,
    messagesFetchError,
    mutate,
    handleStreamComplete,
    hasNext,
    fetchNext,
  } = useDevaMessages({
    threadId: fetchOnMount ? thread?.id : isOpen ? thread?.id : undefined,
  });

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
  };

  useEffect(() => {
    if (isPersonaLoading || isThreadLoading || isMessagesLoading) {
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
    isPersonaLoading,
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
      <Portal id="intercom-trigger-container">
        <PopoverTrigger asChild>
          <div
            id="intercom-trigger"
            className="deva-absolute deva-bottom-28 deva-right-4 deva-z-10 md:deva-bottom-10 md:deva-right-10"
          >
            <button className="deva-m-3 deva-flex deva-items-center deva-justify-center deva-rounded-full deva-bg-midnight-900">
              {isOpen ? (
                <CircleX className="deva-h-[50px] deva-w-[50px] deva-p-2 deva-text-white" />
              ) : (
                <HelpCircle className="deva-h-[50px] deva-w-[50px] deva-p-2 deva-text-white" />
              )}
            </button>
          </div>
        </PopoverTrigger>
      </Portal>

      <PopoverContent
        className="deva-w-auto deva-border-none deva-bg-transparent deva-p-0 deva-shadow-none"
        align="end"
        side="top"
        sideOffset={16}
      >
        <div className="deva-h-[90vh] deva-max-h-[530px] deva-w-[90vw] deva-max-w-[400px] deva-rounded-[20px] deva-border deva-border-[#22252A] deva-bg-midnight-900">
          {isPersonaNotFound ? (
            <div className="deva-flex deva-h-full deva-flex-col deva-items-center deva-justify-center deva-p-6 deva-text-center deva-text-white">
              <div className="deva-mb-4 deva-rounded-full deva-bg-midnight-800 deva-p-4">
                <HelpCircle className="deva-h-10 deva-w-10 deva-text-red-400" />
              </div>
              <h3 className="deva-mb-2 deva-text-xl deva-font-semibold">
                Deva Not Found
              </h3>
              <p className="deva-text-lynch-400 deva-mb-4">
                The Deva for &apos;{username}&apos; doesn&apos;t exist or is not
                available.
              </p>
              <p className="deva-text-lynch-500 deva-text-sm">
                Please check the username and try again.
              </p>
            </div>
          ) : error ? (
            <div className="deva-flex deva-h-full deva-items-center deva-justify-center deva-p-4 deva-text-center deva-text-red-500">
              {error}
            </div>
          ) : (
            <IntercomProvider
              isIntercomOpen={isOpen}
              onStreamComplete={handleStreamComplete}
            >
              <IntercomContent
                persona={persona}
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
