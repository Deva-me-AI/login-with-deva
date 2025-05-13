import { useState } from "react";
import { cn } from "@/lib/utils";
import { ChatBubble } from "./Bubble";
import { ChatMenu } from "./Menu";
import { AnimatePresence, motion } from "framer-motion";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { Message as MessageType } from "@/server";

interface MessageProps {
  className?: string;
  message: MessageType;
  isMyMessage?: boolean;
  isModal?: boolean;
  setReplyingTo?: (msg: MessageType) => void;
}

export const Message = ({
  className,
  message,
  isMyMessage = false,
  isModal = false,
  // setReplyingTo,
}: MessageProps) => {
  const [msgHovered, setMsgHovered] = useState(false);
  const [dropdown, setDropdown] = useState(false);

  return (
    <div
      className={cn(
        "message-container group deva-w-full deva-text-gray-100",
        className,
      )}
      data-timestamp={message.created_at}
      onClick={() => {
        setMsgHovered((h) => !h);
      }}
    >
      <div className="deva-m-auto deva-flex deva-items-end deva-gap-3 deva-p-4 deva-py-2 deva-text-base md:deva-max-w-2xl md:deva-gap-3 lg:deva-max-w-2xl lg:deva-px-0 xl:deva-max-w-3xl">
        {(message.author_type === "BOT" || !isMyMessage) && (
          <div>
            <Avatar>
              <AvatarImage
                src={message.persona?.avatar ?? "/icons/profile.svg"}
                alt={message.persona?.username || "User"}
              />
              <AvatarFallback>
                {message.persona?.username?.[0] ?? "U"}
              </AvatarFallback>
            </Avatar>
          </div>
        )}

        <div
          className={cn(
            message.author_type === "BOT"
              ? "deva-flex deva-flex-1 deva-flex-row deva-items-center deva-gap-2"
              : "deva-w-full",
          )}
        >
          <div
            className={cn(
              "deva-flex deva-items-center deva-gap-2",
              isMyMessage ? "deva-m-auto deva-mr-0 deva-w-fit" : "deva-w-full",
            )}
          >
            <AnimatePresence>
              {isMyMessage && (msgHovered || dropdown) ? (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <ChatMenu
                    msg={message}
                    dropdown={dropdown}
                    setDropdown={setDropdown}
                    // setReplyingTo={setReplyingTo}
                    isModal={isModal}
                  />
                </motion.div>
              ) : null}
            </AnimatePresence>
            <div
              className={cn(
                "deva-relative deva-m-auto deva-flex deva-w-full deva-max-w-[600px] deva-flex-col deva-rounded-[20px] deva-px-4 deva-pr-12",
                isMyMessage
                  ? "deva-mr-0 deva-bg-sea-700 deva-py-[7px]"
                  : "deva-ml-0 deva-bg-catskill-200 deva-py-[10px]",
              )}
            >
              {message ? (
                <ChatBubble
                  response={message.text}
                  author_type={message.author_type || "BOT"}
                  persona={message.persona}
                  createdAt={message.created_at as unknown as Date}
                  reply={message.in_reply_to}
                />
              ) : null}
            </div>
            <AnimatePresence>
              {!isMyMessage && msgHovered ? (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <ChatMenu
                    msg={message}
                    dropdown={dropdown}
                    setDropdown={setDropdown}
                    // setReplyingTo={setReplyingTo}
                    isModal={isModal}
                  />
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};
