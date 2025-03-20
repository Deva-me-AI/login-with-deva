import { cn } from "@/lib/utils";
import { Spinner } from "../ui/spinner";
import { PostInput } from "../PostEditor/PostInput";
import { type FormEvent, useCallback, useState } from "react";
import { MoveUpRight } from "lucide-react";
import { fetcher } from "@/lib/fetcher";
import { useDevaContext } from "@/DevaContext";
import type { Message, PostChatInput } from "@/server";

export const Input = ({
  showLoading,
  threadId,
  onSubmit,
}: {
  showLoading: boolean;
  threadId?: string;
  onSubmit?: (message: Message) => void;
}) => {
  const [text, setText] = useState("");
  const [messageId, setMessageId] = useState(crypto.randomUUID());
  const [isSending, setIsSending] = useState(false);
  const { url, accessToken } = useDevaContext();

  const submitPost = useCallback(
    async (e?: FormEvent<HTMLFormElement>) => {
      if (e) {
        e.preventDefault();
      }

      if (!text.trim().length || !threadId) {
        return;
      }

      setIsSending(true);
      const input: PostChatInput = { text, thread_id: threadId };

      try {
        const res = await fetcher<Message>(
          `${url}/api/sdk/chat/${threadId}/messages`,
          {
            method: "POST",
            body: JSON.stringify(input),
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
              Accept: "application/json",
            },
          },
        );

        // Reset the input
        setMessageId(crypto.randomUUID());

        // Call the onSubmit callback with the response if it exists
        if (onSubmit && res) {
          onSubmit(res);
        }
      } catch (error) {
        console.error("Failed to send message:", error);
      } finally {
        setIsSending(false);
      }
    },
    [url, threadId, text, accessToken, onSubmit],
  );

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
        onSubmit={submitPost}
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
                  onSubmit={submitPost}
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
                  "bg-blue-500 text-gray-100": isSending, // is sending,
                },
                "disabled:bg-ghost-300 bottom-1.5 right-1 mr-3 flex h-8 w-9 items-center justify-center self-end rounded-full bg-lime-300 text-black disabled:cursor-not-allowed disabled:text-gray-500 md:bottom-2.5 md:right-2",
              )}
              disabled={
                !text.trim().length || isSending // is sending
              }
            >
              {showLoading || isSending ? <Spinner /> : <MoveUpRight />}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
