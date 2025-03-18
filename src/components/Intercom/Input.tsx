import { cn } from "@/lib/utils";
import { Spinner } from "../ui/spinner";
import { PostInput } from "../PostEditor/PostInput";
import { useCallback, useState } from "react";
import { MoveUpRight } from "lucide-react";
import { fetcher } from "@/lib/fetcher";
import { useDevaContext } from "@/DevaContext";
import type { PostChatInput } from "@/server";

export const Input = ({
  showLoading,
  threadId,
}: {
  showLoading: boolean;
  threadId?: string;
}) => {
  const [text, setText] = useState("");
  const [messageId, setMessageId] = useState(crypto.randomUUID());
  const { url, accessToken } = useDevaContext();

  const submitPost = useCallback(async () => {
    if (!text.trim().length || !threadId) {
      return;
    }
    const input: PostChatInput = { text, thread_id: threadId };

    const res = await fetcher(`${url}/api/sdk/chat/${threadId}/messages`, {
      method: "POST",
      body: JSON.stringify(input),
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    // Reset the input
    setMessageId(crypto.randomUUID());

    console.log("res: ", res);
  }, [url, threadId, text, accessToken]);

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
                  "bg-blue-500 text-gray-100": !false, // is sending,
                },
                "disabled:bg-ghost-300 bottom-1.5 right-1 mr-3 flex h-8 w-9 items-center justify-center self-end rounded-full bg-lime-300 text-black disabled:cursor-not-allowed disabled:text-gray-500 md:bottom-2.5 md:right-2",
              )}
              disabled={
                !text.trim().length || false // is sending
              }
            >
              {showLoading ? ( // is sending
                <Spinner />
              ) : (
                <MoveUpRight />
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
