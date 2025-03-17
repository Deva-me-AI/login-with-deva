import { useRef } from "react";
import type { Message } from "@/server";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ModalContainer } from "@/components/Modal/ModalContainer";
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
  setReplyingTo?: (id?: string) => void;
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
  msg: Message;
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

type MobileProps = {
  setIsOpen: (isOpen: boolean) => void;
  msg: Message;
  setReplyingTo?: (id?: string) => void;
};

const ChatMenuMobile = ({ setIsOpen, msg, setReplyingTo }: MobileProps) => {
  // const handleReply = () => {
  //   setReplyingTo?.(msg?.id);
  // };

  const options: Option[] = [
    // {
    //   icon: "/icons/chat-reply.svg",
    //   label: "Reply",
    //   onClick: () => {
    //     handleReply();
    //     // @ts-ignore -- we use a contenteditable div instead of input
    //     document.querySelector(".ProseMirror")?.focus();
    //   },
    // },
    {
      icon: "/icons/thumps-up.svg",
      label: "Like",
      disabled: true,
    },
    {
      icon: "/icons/thumps-down.svg",
      label: "Dislike",
      hr: true,
      disabled: true,
    },
    {
      icon: "/icons/checkmark.svg",
      label: "Select",
      disabled: true,
    },
    {
      icon: "/icons/copy.svg",
      label: "Copy Text",
      disabled: true,
    },
    {
      icon: "/icons/share.svg",
      label: "Share",
      hr: true,
      disabled: true,
    },
    {
      icon: "/icons/warning.svg",
      label: "Report",
      disabled: true,
    },
  ];

  const handleClose = () => setIsOpen(false);
  const ref = useRef<HTMLDivElement>(null);

  return (
    <>
      <div onClick={handleClose} className="fixed inset-0" />
      <motion.div
        className="bg-midnight-900 fixed bottom-0 z-10 flex w-full flex-col items-center justify-center rounded-t-[20px]"
        ref={ref}
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", damping: 20, stiffness: 100 }}
      >
        <div className="flex w-full flex-col px-2 py-4">
          {options.map((option) => {
            return (
              <Option
                key={option.label}
                {...option}
                handleClose={handleClose}
              />
            );
          })}
        </div>
        <div className="bg-ghost-300 h-[1px] w-[90%]" />
      </motion.div>
    </>
  );
};

type Option = {
  icon: string;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  hr?: boolean; // divider after option
};

type OptionProps = Option & {
  handleClose: () => void;
};

const Option: React.FC<OptionProps> = ({
  label,
  icon,
  onClick,
  disabled,
  handleClose,
  hr,
}) => {
  const clickHandler = () => {
    onClick?.();
    handleClose();
  };

  return (
    <>
      <button
        className={cn(
          "hover:bg-ghost-300 flex w-full items-center gap-x-3 rounded-md px-4 py-3 text-white transition-colors duration-100 ease-out",
          {
            "text-lynch-600 pointer-events-none opacity-20": disabled,
          },
        )}
        onClick={clickHandler}
        disabled={disabled}
      >
        <img src={icon} alt={label} className="h-5 w-5" />
        <span>{label}</span>
      </button>
      {hr ? <div className="bg-ghost-300 my-1 h-[1px] w-full" /> : null}
    </>
  );
};
