import { useRef } from "react";
import { Message } from "@/server";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ModalContainer } from "@/components/Modal/ModalContainer";
import { ChatMenuMobile } from "./ChatMenuMobile";
import { DropdownOption } from "@/components/Dropdown/DropdownOption";
import {
  Reply,
  MoreVertical,
  ThumbsUp,
  ThumbsDown,
  Check,
  Copy,
  Share,
  AlertTriangle,
} from "lucide-react";
import { useOnClickOutside } from "@/hooks/use-on-click-outside";

interface Props {
  msg: Message;
  dropdown: boolean;
  setDropdown: (isOpen: boolean) => void;
  setReplyingTo?: (id: string) => void;
  isModal?: boolean;
}

const ChatMenu = ({
  msg,
  dropdown,
  setDropdown,
  setReplyingTo,
  isModal,
}: Props) => {
  return (
    <div className="relative">
      <div className="flex">
        <button
          className={cn(
            "hover:bg-jewel-200 group flex h-8 w-8 items-center justify-center rounded-full transition duration-200 ease-in-out",
          )}
          onClick={() => {
            setReplyingTo?.(msg?.id);
            document.querySelector<HTMLDivElement>(".ProseMirror")?.focus();
          }}
        >
          <Reply className="h-5 w-5" />
        </button>
        {!isModal && (
          <button
            className={cn(
              "hover:bg-jewel-200 group flex h-8 w-8 items-center justify-center rounded-full transition duration-200 ease-in-out",
              {
                "ring-jewel-300 ring-2": !!dropdown,
              },
            )}
            onClick={(e) => {
              e.stopPropagation();
              setDropdown(true);
            }}
          >
            <MoreVertical
              className={cn(
                "group-hover:text-jewel-500 h-5 w-5 text-gray-500 transition duration-200 ease-in-out",
                {
                  "text-white": !!dropdown,
                },
              )}
            />
          </button>
        )}
      </div>

      {/* Desktop dropdown - hidden on mobile */}
      <div className="hidden md:block">
        <AnimatePresence>
          {dropdown && (
            <ChatDropdownMenu
              key={msg?.id}
              handleReply={() => {
                setReplyingTo?.(msg?.id);
                setDropdown(false);
              }}
              handleClose={() => setDropdown(false)}
              msg={msg}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Mobile modal - shown only on mobile */}
      <div className="block md:hidden">
        <AnimatePresence>
          {dropdown && (
            <ModalContainer data-testid="ChatMenuContainer">
              <ChatMenuMobile
                setIsOpen={setDropdown}
                msg={msg}
                setReplyingTo={setReplyingTo}
              />
            </ModalContainer>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ChatMenu;

interface ChatDropdownMenuProps {
  handleClose: () => void;
  handleReply: () => void;
  msg: PartialMessage;
}

const ChatDropdownMenu: React.FC<ChatDropdownMenuProps> = ({
  handleClose,
  handleReply,
  msg,
}) => {
  const ref = useRef<HTMLDivElement>(null);
  useOnClickOutside(ref, handleClose);

  return (
    <motion.div
      initial={{ opacity: 0, y: -30, x: 40, scale: 0.6 }}
      animate={{ opacity: 1, y: 0, x: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, x: 50, scale: 0.7 }}
      transition={{ duration: 0.15, ease: "easeInOut" }}
      ref={ref}
      className="bg-athens-100 border-ghost-300 absolute right-0 top-10 z-10 flex w-[260px] flex-col rounded-lg border p-2 md:left-0"
      style={{
        boxShadow: "0px 30px 40px rgba(0, 0, 0, 0.7)",
      }}
    >
      <DropdownOption
        icon={<Reply className="h-4 w-4" />}
        label="Reply"
        onClick={() => {
          handleReply();
          document.querySelector<HTMLDivElement>(".ProseMirror")?.focus();
        }}
      />
      {/* !!router.pathname.startsWith("/train") && (
        <DropdownOption
          icon={<Reply className="h-4 w-4" />}
          label="Take to Chat"
          onClick={() => {
            router.push(`/chat/${msg?.thread?.id}?messageId=${msg?.id}`);
          }}
        />
      )*/}
      <DropdownOption
        icon={<ThumbsUp className="h-4 w-4" />}
        label="Like"
        disabled
      />
      <DropdownOption
        icon={<ThumbsDown className="h-4 w-4" />}
        label="Dislike"
        disabled
      />
      <hr className="border-t-ghost-300" />
      <DropdownOption
        icon={<Check className="h-4 w-4" />}
        label="Select"
        disabled
      />
      <DropdownOption
        icon={<Copy className="h-4 w-4" />}
        label="Copy Text"
        disabled
      />
      <DropdownOption
        icon={<Share className="h-4 w-4" />}
        label="Share"
        disabled
      />
      <hr className="border-t-ghost-300" />
      <DropdownOption
        icon={<AlertTriangle className="h-4 w-4" />}
        label={"Report"}
        disabled
      />
    </motion.div>
  );
};
