import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { ContextIcon } from "@/components/ui/icons";
import { ChatBubble } from "./Bubble";
import { ChatMenu } from "./Menu";
// import { ContextPane } from "./ContextPane";
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
  const [ctxHovered, setCtxHovered] = useState(false);
  const [contextOpened, setContextOpened] = useState(false);
  const [currentMessageText, setCurrentMessageText] = useState(message?.text);
  const [setHref] = useState("");

  const contextRef = useRef(null);

  return (
    <div
      className={cn("message-container group w-full text-gray-100", className)}
      data-timestamp={message.created_at}
      onClick={() => {
        setMsgHovered((h) => !h);
      }}
    >
      <div className="m-auto flex items-end gap-3 p-4 py-2 text-base md:max-w-2xl md:gap-3 lg:max-w-2xl lg:px-0 xl:max-w-3xl">
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
              ? "flex flex-1 flex-row items-center gap-2"
              : "w-full",
          )}
        >
          <div
            className={cn(
              "flex items-center gap-2",
              isMyMessage ? "m-auto mr-0 w-fit" : "w-full",
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
                "relative m-auto flex w-full max-w-[600px] flex-col rounded-[20px] px-4 pr-12",
                isMyMessage
                  ? "mr-0 bg-sea-700 py-[7px]"
                  : "ml-0 bg-catskill-200 py-[10px]",
              )}
            >
              {message ? (
                <ChatBubble
                  response={currentMessageText ?? ""}
                  author_type={message.author_type || "BOT"}
                  persona={message.persona}
                  createdAt={message.created_at as unknown as Date}
                  reply={message.in_reply_to}
                />
              ) : null}

              <div className="flex flex-row items-center gap-8">
                {message.author_type === "BOT" && currentMessageText && (
                  <div className="flex flex-col gap-3 pt-1">
                    <button
                      disabled={!message.retrievals?.length}
                      className="flex w-fit flex-row items-center gap-2.5 text-sm transition duration-200 ease-in-out"
                      onMouseEnter={() => setCtxHovered(true)}
                      onMouseLeave={() => setCtxHovered(false)}
                      onClick={() => {
                        setContextOpened(!contextOpened);
                      }}
                    >
                      <div className="border-midnight-700 flex h-6 w-6 items-center justify-center rounded-lg">
                        <ContextIcon
                          color={
                            ctxHovered || contextOpened ? "#CAF033" : "#6B7584"
                          }
                        />
                      </div>
                      <span>
                        {
                          message?.retrievals?.filter((r) => !!r.content)
                            ?.length
                        }
                      </span>
                    </button>
                  </div>
                )}
              </div>
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
      <AnimatePresence>
        {contextOpened ? (
          <div
            className="m-auto flex w-full md:max-w-2xl md:gap-3 lg:max-w-2xl xl:max-w-3xl"
            ref={contextRef}
          >
            <div className="hidden w-[30px] md:block"></div>
            <motion.div
              ref={contextRef}
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="bg-athens-100 flex w-full flex-col gap-6 rounded-[20px] px-6 py-5"
            >
              {/*
              <ContextPane
                retrievals={message.retrievals ?? []}
                handleClose={() => setContextOpened(false)}
                setHref={setHref}
              />
              */}
            </motion.div>
          </div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};
