import { useEffect, useRef, useState } from "react";
import type { ChatLLMQueryStreamTypes, Message, Persona } from "../../server";
import { useDevaContext } from "@/DevaContext";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { ChatBubble } from "./Bubble";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import { useIntercom } from "./IntercomContext";

const debug = false;
const log = (...args: Parameters<typeof console.log>) => {
  if (debug) {
    console.log("[deva-sdk/stream_response", ...args);
  }
};

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
  const controllerRef = useRef<AbortController | null>(null);

  const { notifyStreamingUpdate, handleStreamComplete } = useIntercom();

  useEffect(() => {
    // If messageId becomes undefined, abort any existing stream
    if (!messageId) {
      if (controllerRef.current) {
        controllerRef.current.abort();
        controllerRef.current = null;
      }
      setIsStreaming(false);
      setIsDone(true);
      return;
    }

    // Return if other required params are missing
    if (!threadId || !accessToken) {
      return;
    }

    // Reset accumulated content when starting a new stream
    let accumulatedContent = "";

    // Abort any existing stream before starting a new one
    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    setIsStreaming(true);
    setError(null);
    setIsDone(false);

    // Create a local AbortController for this effect run
    const controller = new AbortController();
    controllerRef.current = controller;
    const streamUrl = `${url}/api/sdk/chat/${threadId}/messages/${messageId}/query/stream`;

    fetchEventSource(streamUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "text/event-stream",
      },
      signal: controller.signal,
      openWhenHidden: true, // Keep connection open even when page is hidden

      onopen: async (response) => {
        if (response.ok) {
          log("Stream connection opened");
        } else {
          console.error("Stream connection failed:", response.status);
          throw new Error(
            `Failed to open stream: ${response.status} ${response.statusText}`,
          );
        }
      },

      onmessage: (msg) => {
        log("Stream message:", msg);
        const type = msg.event as ChatLLMQueryStreamTypes;
        try {
          // Parse the data from the event

          if (type === "content") {
            const g = JSON.parse(msg.data) as string;
            // Accumulate the content
            accumulatedContent += g || "";

            // Update the message with the accumulated content
            setMessage((prevMessage): Message => {
              if (!prevMessage) {
                return {
                  id: `${messageId}-response`,
                  text: accumulatedContent,
                } as Message;
              }

              return {
                ...prevMessage,
                text: accumulatedContent,
              };
            });
            log("Stream content", g);
            notifyStreamingUpdate();
          } else if (type === "response_message") {
            const message = JSON.parse(msg.data) as Message;
            // We received the persisted message object
            setMessage(message);

            // If the message has complete content, we're done
            setIsDone(true);
            setIsStreaming(false);
            log("Stream complete", message);
            void handleStreamComplete(message);
            controllerRef.current?.abort();
          } else if (type === "completion") {
            // happens when query completes, but stream is still open
            log("Stream complete", msg);
          }
        } catch (err) {
          console.error("Error parsing stream data:", err);
          setError(
            err instanceof Error ? err : new Error("Error parsing stream data"),
          );
        }
      },

      onerror: (err: Error) => {
        console.error("[useStreamResponse] onerror called:", err);
        setError(new Error(err.message || "Error streaming message"));
        setIsStreaming(false);
      },

      onclose: () => {
        log("Stream connection closed");
        void handleStreamComplete();
        setIsStreaming(false);
        setIsDone(true);
      },
    })
      .catch((err) => {
        console.error("[useStreamResponse] Error setting up stream:", err);
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to set up stream connection"),
        );
      })
      .finally(() => {
        setIsStreaming(false);
        if (controllerRef.current === controller) {
          controllerRef.current = null;
        }
      });

    // Cleanup function - uses local controller variable
    return () => {
      controller.abort();
      if (controllerRef.current === controller) {
        controllerRef.current = null;
      }
      setIsStreaming(false);
    };
  }, [
    messageId,
    threadId,
    url,
    accessToken,
    handleStreamComplete,
    notifyStreamingUpdate,
  ]);

  return {
    message,
    isStreaming,
    error,
    isDone,
  };
};

export const IncomingMessageIndicator = ({
  className,
  persona,
}: {
  persona?: {
    username: string;
    id: string;
    avatar?: string;
    display_name?: string;
    user_id: string;
  };
  className?: string;
}) => {
  const [innerAnimate, setInnerAnimate] = useState(false);
  return (
    <div
      data-testid="IncomingMessageIndicator"
      className={cn(
        "message-container group deva-w-full deva-text-gray-100",
        className,
      )}
    >
      <div className="deva-m-auto deva-flex deva-items-end deva-gap-3 deva-p-4 deva-py-2 deva-text-base md:deva-max-w-2xl md:deva-gap-3 lg:deva-max-w-2xl lg:deva-px-0 xl:deva-max-w-3xl">
        {persona && (
          <Avatar>
            <AvatarImage
              src={persona?.avatar ?? "/icons/profile.svg"}
              alt={persona?.username || "User"}
            />
            <AvatarFallback>{persona?.username?.[0] ?? "AI"}</AvatarFallback>
          </Avatar>
        )}
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1.0 }}
          exit={{ opacity: 0, y: 10, scale: 0.8 }}
          onAnimationComplete={() => setInnerAnimate(true)}
          onAnimationStart={() => setInnerAnimate(false)}
          className="deva-table deva-rounded-full deva-bg-catskill-200 deva-px-6 deva-py-2"
        >
          <div
            className={cn(
              { "deva-animate-pulse": innerAnimate },
              "deva-inline-block",
            )}
          >
            <div
              className={cn(
                {
                  "deva-animate-bounce": innerAnimate,
                  "[animation-delay:0.1s]": innerAnimate,
                },
                "deva-mr-2 deva-inline-block deva-h-2 deva-w-2 deva-rounded-full deva-bg-current",
              )}
            ></div>
          </div>
          <div className="deva-inline-block">
            <div
              className={cn(
                {
                  "deva-animate-bounce": innerAnimate,
                  "[animation-delay:0.3s]": innerAnimate,
                },
                "deva-mr-2 deva-inline-block deva-h-2 deva-w-2 deva-rounded-full deva-bg-current",
              )}
            ></div>
          </div>
          <div
            className={cn(
              { "deva-animate-pulse": innerAnimate },
              "deva-inline-block",
            )}
          >
            <div
              className={cn(
                {
                  "deva-animate-bounce": innerAnimate,
                  "[animation-delay:0.5s]": innerAnimate,
                },
                "deva-mr-0 deva-inline-block deva-h-2 deva-w-2 deva-rounded-full deva-bg-current",
              )}
            ></div>
          </div>
        </motion.div>
      </div>
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
    reply?: {
      text?: string;
      persona?: Persona;
      author_type: "USER" | "BOT" | "SYSTEM";
    } | null;
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
      className={cn("deva-group deva-w-full deva-text-gray-100", className)}
    >
      <div className="deva-m-auto deva-flex deva-items-end deva-gap-3 deva-p-4 deva-py-2 deva-text-base md:deva-max-w-2xl md:deva-gap-3 lg:deva-max-w-2xl lg:deva-px-0 xl:deva-max-w-3xl">
        <Avatar>
          <AvatarImage
            src={persona?.avatar ?? "/icons/profile.svg"}
            alt={persona?.username || "Deva"}
          />
          <AvatarFallback>{persona?.username?.[0] ?? "Deva"}</AvatarFallback>
        </Avatar>
        <div className={`deva-flex deva-flex-row deva-items-center deva-gap-2`}>
          <div
            className={cn("deva-flex deva-w-fit deva-items-center deva-gap-2")}
          >
            <div
              className={cn(
                `deva-relative deva-m-auto deva-flex deva-w-fit deva-max-w-[600px] deva-flex-col deva-rounded-[20px] deva-px-4 deva-pr-12`,
                "deva-ml-0 deva-bg-catskill-200 deva-py-[10px]",
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
        "deva-m-auto deva-mx-auto deva-flex deva-items-end deva-gap-3 deva-p-4 deva-py-2 deva-text-base md:deva-max-w-2xl md:deva-gap-3 lg:deva-max-w-2xl lg:deva-px-0 xl:deva-max-w-3xl",
      )}
    >
      <div className="Placeholder deva-pl-2 deva-pr-1">{"🚧"}</div>
      <div
        className={`deva-flex deva-flex-row deva-items-center deva-gap-2 deva-rounded-xl deva-bg-red-500 deva-p-2 deva-text-white`}
      >
        <div
          className={cn("deva-flex deva-w-fit deva-items-center deva-gap-2")}
        >
          <div
            className={cn(
              `deva-relative deva-m-auto deva-flex deva-w-fit deva-max-w-[600px] deva-flex-col deva-rounded-[20px] deva-px-2 deva-pr-12`,
            )}
          >
            <p className="deva-font-bold deva-tracking-widest">{title}</p>
            <p className="deva-font-mono deva-text-sm">{text}</p>
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
  onStreamComplete?: (msg: Message) => void;
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
      <>
        <InProgressMessage
          msg={{
            id: message.id ?? `01-stream`,
            text: message.text ?? "",
            reply: message.in_reply_to,
          }}
          persona={persona}
        />
      </>
    );
  }

  // If streaming is in progress but no message yet, show the typing indicator
  if (isStreaming && !message) {
    return <IncomingMessageIndicator persona={persona} />;
  }

  // If streaming is done and we have a message, show nothing (the actual message will be shown by the parent component)
  if (isDone && message) {
    return null;
  }

  // Default case - show nothing
  return null;
};
