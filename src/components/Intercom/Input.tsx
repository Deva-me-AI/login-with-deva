import { useState, type FormEvent } from "react";
import { useDevaContext } from "@/DevaContext";
import type { Message as IMessage, PostChatInput } from "@/server";
import { useIntercom } from "./IntercomContext";
import { fetcher } from "@/lib/fetcher";
import { cn } from "@/lib/utils";
import { PostInput } from "../PostEditor/PostInput";
import { Spinner } from "../ui/spinner";
import { MoveUpRight } from "lucide-react";

interface InputProps {
  threadId?: string;
  showLoading?: boolean;
  onSubmit: (message: IMessage) => Promise<void>;
}

export const Input = ({
  threadId,
  showLoading = false,
  onSubmit,
}: InputProps) => {
  const { url, accessToken } = useDevaContext();
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messageId, setMessageId] = useState(crypto.randomUUID());
  const { scrollToBottom } = useIntercom();

  const handleSubmit = async (e?: FormEvent) => {
    e?.preventDefault();

    if (!text.trim() || !threadId || !accessToken || isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    const input: PostChatInput = { text, thread_id: threadId };

    try {
      const message = await fetcher<IMessage>(
        `${url}/api/sdk/chat/${threadId}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
            Accept: "application/json",
          },
          body: JSON.stringify(input),
        },
      );

      // updating the message id clears the input
      setMessageId(crypto.randomUUID());
      setText("");

      // Submit message to parent
      await onSubmit(message);

      // Scroll to bottom
      scrollToBottom();
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      id="support-input-container"
      className="deva-bg-gradient-to-t deva-to-transparent"
    >
      <form
        className={cn(
          "deva-flex deva-w-full deva-flex-row deva-px-5 deva-pt-2 last:deva-mb-2 md:last:deva-mb-[18px] lg:deva-mx-auto lg:deva-max-w-3xl",
          {
            "lg:deva-pt-6": !false, // is replying to specfic message
          },
        )}
        onSubmit={handleSubmit}
      >
        <div className="deva-relative deva-flex deva-h-full deva-flex-1 md:deva-flex-col">
          <div className="deva-relative deva-flex deva-w-full deva-flex-grow deva-items-center deva-rounded-[36px] deva-bg-catskill-200 deva-py-2 deva-pl-3 deva-text-white deva-shadow-[0_0_15px_rgba(0,0,0,0.10)] md:deva-py-2 md:deva-pl-4">
            <div
              id="support-input"
              className="deva-w-full deva-overflow-hidden deva-bg-catskill-200 [&>div>div]:deva-overflow-hidden" // Removes scroll in the chat input
              style={{ gridColumn: "2", gridRow: "1" }}
            >
              {threadId && (
                <PostInput
                  id="support-input-editor"
                  postId={messageId}
                  onSubmit={handleSubmit}
                  value={text}
                  placeholder="Type a message..."
                  onChange={setText}
                  className="!deva-min-h-min"
                />
              )}
            </div>

            <button
              type="submit"
              className={cn(
                {
                  "deva-bg-blue-500 deva-text-gray-100": isSubmitting, // is sending,
                },
                "disabled:deva-bg-ghost-300 deva-bottom-1.5 deva-right-1 deva-mr-3 deva-flex deva-h-8 deva-w-9 deva-items-center deva-justify-center deva-self-end deva-rounded-full deva-bg-lime-300 deva-text-black disabled:deva-cursor-not-allowed disabled:deva-text-gray-500 md:deva-bottom-2.5 md:deva-right-2",
              )}
              disabled={
                !text.trim().length || isSubmitting // is sending
              }
            >
              {showLoading || isSubmitting ? <Spinner /> : <MoveUpRight />}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
