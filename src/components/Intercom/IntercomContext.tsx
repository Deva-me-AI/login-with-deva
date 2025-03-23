import React, {
  createContext,
  useContext,
  useRef,
  useCallback,
  useState,
  type ReactNode,
  useEffect,
} from "react";
import type { Message as IMessage } from "@/server";

interface IntercomContextType {
  // Scroll management
  scrollToBottom: () => void;
  scrollAreaRef: React.RefObject<HTMLDivElement>;

  // Streaming state management
  streamingMessageId: string | null;
  setStreamingMessageId: (id: string | null) => void;
  notifyStreamingUpdate: () => void;

  // Message handling
  handleStreamComplete: (message: IMessage) => Promise<void>;
}

const IntercomContext = createContext<IntercomContextType | undefined>(
  undefined,
);

export const IntercomProvider = ({
  children,
  onStreamComplete,
  isIntercomOpen,
}: {
  children: ReactNode;
  isIntercomOpen: boolean;
  onStreamComplete?: (message: IMessage) => Promise<void>;
}) => {
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [streamingMessageId, setStreamingMessageId] = useState<string | null>(
    null,
  );

  // Scroll to bottom of messages
  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]",
      );
      if (scrollContainer) {
        setTimeout(() => {
          scrollContainer.scrollTop = scrollContainer.scrollHeight;
        }, 100); // Small delay to ensure content is rendered
      }
    }
  }, []);

  // Notify about streaming updates to trigger scroll
  const notifyStreamingUpdate = useCallback(() => {
    scrollToBottom();
  }, [scrollToBottom]);

  // Handle stream completion
  const handleStreamComplete = useCallback(
    async (message: IMessage) => {
      setStreamingMessageId(null);
      if (onStreamComplete) {
        await onStreamComplete(message);
      }
      scrollToBottom();
    },
    [onStreamComplete, scrollToBottom],
  );

  // clear streaming message id when intercom is closed
  useEffect(() => {
    if (isIntercomOpen) {
      setStreamingMessageId(null);
    }
  }, [isIntercomOpen]);

  return (
    <IntercomContext.Provider
      value={{
        scrollToBottom,
        scrollAreaRef,
        streamingMessageId,
        setStreamingMessageId,
        notifyStreamingUpdate,
        handleStreamComplete,
      }}
    >
      {children}
    </IntercomContext.Provider>
  );
};

export const useIntercom = (): IntercomContextType => {
  const context = useContext(IntercomContext);
  if (context === undefined) {
    throw new Error("useIntercom must be used within an IntercomProvider");
  }
  return context;
};
