import { useEffect, useState } from "react";
import type { ChatLLMQueryStreamMessage, Message, Persona } from "../../server";
import { useDevaContext } from "@/DevaContext";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ChatBubble } from "./Bubble";

/**
 * Hook for fetching a streaming response from the AI.
 * @param {Object} params - The parameters for the hook.
 * @param {string} params.messageId - The ID of the message to stream.
 * @param {string} params.threadId - The ID of the thread containing the message.
 * @returns {Object} The streaming message data and status.
 */
export const useStreamResponse = ({
  messageId,
  threadId,
}: {
  messageId?: string;
  threadId?: string;
}): {
  message: Message | null;
  isStreaming: boolean;
  error: Error | null;
  isDone: boolean;
} => {
  const { url, accessToken } = useDevaContext();
  const [message, setMessage] = useState<Message | null>(null);
  const [isStreaming, setIsStreaming] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [isDone, setIsDone] = useState<boolean>(false);

  useEffect(() => {
    if (!messageId || !threadId || !accessToken) {
      return;
    }

    let eventSource: EventSource | null = null;
    let accumulatedContent = "";

    const startStreaming = () => {
      try {
        setIsStreaming(true);
        setError(null);
        setIsDone(false);

        // Create the EventSource for SSE
        const streamUrl = `${url}/api/sdk/chat/${threadId}/messages/${messageId}/stream`;
        eventSource = new EventSource(streamUrl, {
          withCredentials: true,
        });

        // Set up event handlers
        eventSource.onopen = () => {
          console.log("Stream connection opened");
        };

        eventSource.onerror = (event) => {
          console.error("Stream error:", event);
          setError(new Error("Error streaming message"));
          setIsStreaming(false);
          eventSource?.close();
        };

        // Handle the message chunks
        eventSource.addEventListener("message", (event) => {
          try {
            const data = event.data as ChatLLMQueryStreamMessage;

            if (data.type === "content") {
              // Accumulate the content
              accumulatedContent += data.data || "";

              // Update the message with the accumulated content
              setMessage((prevMessage) => {
                if (!prevMessage) {
                  return {
                    id: `${messageId}-response`,
                    text: accumulatedContent,
                  } as Message;
                }

                return {
                  ...prevMessage,
                  content: accumulatedContent,
                };
              });
            } else if (data.type === "response_message") {
              // We received the persisted message object
              setMessage(data.data);

              // If the message has complete content, we're done
              setIsDone(true);
              setIsStreaming(false);
              eventSource?.close();
            } else if (data.type === "completion") {
              // Stream is complete
              setIsDone(true);
              setIsStreaming(false);
              eventSource?.close();
            }
          } catch (err) {
            console.error("Error parsing stream data:", err);
            setError(err instanceof Error ? err : new Error("Unknown error"));
          }
        });
      } catch (err) {
        console.error("Error setting up stream:", err);
        setError(err instanceof Error ? err : new Error("Unknown error"));
        setIsStreaming(false);
      }
    };

    startStreaming();

    // Cleanup function
    return () => {
      if (eventSource) {
        eventSource.close();
      }
      setIsStreaming(false);
    };
  }, [messageId, threadId, url, accessToken]);

  return {
    message,
    isStreaming,
    error,
    isDone,
  };
};

export const IncomingMessageIndicator = ({
  className,
  avatar,
}: {
  avatar?: string | null;
  className?: string;
}) => {
  const [innerAnimate, setInnerAnimate] = useState(false);
  return (
    <div
      data-testid="IncomingMessageIndicator"
      className={cn(
        "m-auto mx-auto flex items-end gap-3 p-4 py-2 text-base md:max-w-2xl md:gap-3 lg:max-w-2xl lg:px-0 xl:max-w-3xl",
        className,
      )}
    >
      {avatar && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={avatar} alt="Avatar" />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
      )}
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1.0 }}
        exit={{ opacity: 0, y: 10, scale: 0.8 }}
        onAnimationComplete={() => setInnerAnimate(true)}
        onAnimationStart={() => setInnerAnimate(false)}
        className="table rounded-full bg-catskill-200 px-6 py-2"
      >
        <div className={cn({ "animate-pulse": innerAnimate }, "inline-block")}>
          <div
            className={cn(
              {
                "animate-bounce": innerAnimate,
                "[animation-delay:0.1s]": innerAnimate,
              },
              "mr-2 inline-block h-2 w-2 rounded-full bg-current",
            )}
          ></div>
        </div>
        <div className="inline-block">
          <div
            className={cn(
              {
                "animate-bounce": innerAnimate,
                "[animation-delay:0.3s]": innerAnimate,
              },
              "mr-2 inline-block h-2 w-2 rounded-full bg-current",
            )}
          ></div>
        </div>
        <div className={cn({ "animate-pulse": innerAnimate }, "inline-block")}>
          <div
            className={cn(
              {
                "animate-bounce": innerAnimate,
                "[animation-delay:0.5s]": innerAnimate,
              },
              "mr-0 inline-block h-2 w-2 rounded-full bg-current",
            )}
          ></div>
        </div>
      </motion.div>
    </div>
  );
};

interface InProgressMessageProps {
  className?: string;
  persona: {
    username: string;
    id: string;
    avatar?: string;
    display_name?: string;
    user_id: string;
  };
  msg: {
    id: string;
    text: string;
    reply?: { text?: string; persona?: Persona } | null;
  };
}

/** It may be useful to unifiy this with ChatMessage at some point */
export const InProgressMessage = ({
  className,
  msg,
  persona,
}: InProgressMessageProps) => {
  return (
    <div
      data-message-id={msg.id}
      data-testid="PendingChatMessage"
      className={cn(
        "ChatMessage PendingChatMessage Message group w-full text-gray-100",
        className,
      )}
    >
      <div className="m-auto flex items-end gap-3 p-4 py-2 text-base md:max-w-2xl md:gap-3 lg:max-w-2xl lg:px-0 xl:max-w-3xl">
        <Avatar className="h-8 w-8">
          <AvatarImage
            src={persona?.avatar ?? "/icons/profile.svg"}
            alt="Avatar"
          />
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
        <div className={`flex flex-row items-center gap-2`}>
          <div className={cn("flex w-fit items-center gap-2")}>
            <div
              className={cn(
                `relative m-auto flex w-fit max-w-[600px] flex-col rounded-[20px] px-4 pr-12`,
                "ml-0 bg-catskill-200 py-[10px]",
              )}
            >
              {msg ? (
                <ChatBubble
                  response={msg.text}
                  persona={persona}
                  reply={msg.reply}
                  author_type={"BOT"}
                  createdAt={new Date()}
                />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const MessageStreamError = ({
  title = "Problem",
  text,
}: {
  title?: string;
  text: string;
}) => {
  return (
    <div
      data-testid="MessageStreamError"
      className={cn(
        "ChatMessage",
        "m-auto mx-auto flex items-end gap-3 p-4 py-2 text-base md:max-w-2xl md:gap-3 lg:max-w-2xl lg:px-0 xl:max-w-3xl",
      )}
    >
      <div className="Placeholder pl-2 pr-1">{"🚧"}</div>
      <div
        className={`flex flex-row items-center gap-2 rounded-xl bg-red-500 p-2 text-white`}
      >
        <div className={cn("flex w-fit items-center gap-2")}>
          <div
            className={cn(
              `relative m-auto flex w-fit max-w-[600px] flex-col rounded-[20px] px-2 pr-12`,
            )}
          >
            <p className="font-bold tracking-widest">{title}</p>
            <p className="font-mono text-sm">{text}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export const StreamResponse = ({
  messageId,
  threadId,
  persona,
}: {
  messageId?: string;
  threadId?: string;
  persona: {
    username: string;
    id: string;
    avatar?: string;
    display_name?: string;
    user_id: string;
  };
}) => {
  const { message, isStreaming, error, isDone } = useStreamResponse({
    messageId,
    threadId,
  });

  // If there's an error, show the error message
  if (error) {
    return <MessageStreamError text={error.message} />;
  }

  // If streaming is in progress and we have a message, show the in-progress message
  if (isStreaming && message) {
    return (
      <InProgressMessage
        msg={{
          id: message.id ?? `${messageId}-stream`,
          text: message.text ?? "",
          // reply: message.reply,
        }}
        persona={persona}
      />
    );
  }

  // If streaming is in progress but no message yet, show the typing indicator
  if (isStreaming && !message) {
    return <IncomingMessageIndicator avatar={persona.avatar} />;
  }

  // If streaming is done and we have a message, show nothing (the actual message will be shown by the parent component)
  if (isDone && message) {
    return null;
  }

  // Default case - show nothing
  return null;
};
