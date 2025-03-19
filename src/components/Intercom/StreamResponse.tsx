import { useEffect, useState } from "react";
import type { ChatLLMQueryStreamMessage, Message } from "../../server";
import { useDevaContext } from "@/DevaContext";

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
                    id: messageId,
                    content: accumulatedContent,
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
