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
      className="bg-gradient-to-t to-transparent"
    >
      <form
        className={cn(
          "flex w-full flex-row px-5 pt-2 last:mb-2 md:last:mb-[18px] lg:mx-auto lg:max-w-3xl",
          {
            "lg:pt-6": !false, // is replying to specfic message
          },
        )}
        onSubmit={handleSubmit}
      >
        <div className="relative flex h-full flex-1 md:flex-col">
          <div className="relative flex w-full flex-grow items-center rounded-[36px] bg-catskill-200 py-2 pl-3 text-white shadow-[0_0_15px_rgba(0,0,0,0.10)] md:py-2 md:pl-4">
            <div
              id="support-input"
              className="h-8 w-full overflow-hidden bg-catskill-200 [&>div>div]:overflow-hidden" // Removes scroll in the chat input
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
                />
              )}
            </div>

            <button
              type="submit"
              className={cn(
                {
                  "bg-blue-500 text-gray-100": isSubmitting, // is sending,
                },
                "disabled:bg-ghost-300 bottom-1.5 right-1 mr-3 flex h-8 w-9 items-center justify-center self-end rounded-full bg-lime-300 text-black disabled:cursor-not-allowed disabled:text-gray-500 md:bottom-2.5 md:right-2",
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
