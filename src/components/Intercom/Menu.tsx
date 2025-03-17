import { useState } from "react";
import type { Message } from "@/server";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
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

interface Props {
  msg: Message;
  dropdown: boolean;
  setDropdown: (isOpen: boolean) => void;
  setReplyingTo?: (id?: string) => void;
  isModal?: boolean;
}

export const ChatMenu = ({
  msg,
  dropdown,
  setDropdown,
  setReplyingTo,
  isModal,
}: Props) => {
  const [dialogOpen, setDialogOpen] = useState(false);

  // Sync dialog state with dropdown state
  const handleDialogChange = (open: boolean) => {
    setDialogOpen(open);
    setDropdown(open);
  };

  // Sync dropdown state with dialog state
  const handleDropdownClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDialogOpen(true);
    setDropdown(true);
  };

  return (
    <div id="chat-menu" className="relative">
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
          <>
            {/* Desktop button - hidden on mobile */}
            <div className="hidden md:block">
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
            </div>

            {/* Mobile button with Dialog - shown only on mobile */}
            <div className="block md:hidden">
              <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
                <DialogTrigger asChild>
                  <button
                    className={cn(
                      "hover:bg-jewel-200 group flex h-8 w-8 items-center justify-center rounded-full transition duration-200 ease-in-out",
                      {
                        "ring-jewel-300 ring-2": !!dropdown,
                      },
                    )}
                    onClick={handleDropdownClick}
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
                </DialogTrigger>
                <DialogContent
                  className="border-0 bg-transparent p-0 shadow-none"
                  data-testid="ChatMenuContainer"
                >
                  <ChatMenuMobile
                    setIsOpen={setDropdown}
                    msg={msg}
                    setReplyingTo={setReplyingTo}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </>
        )}
      </div>

      <div className="hidden md:block">
        {dropdown && (
          <ChatDropdownMenu
            handleReply={() => {
              setReplyingTo?.(msg?.id);
              setDropdown(false);
            }}
            handleClose={() => setDropdown(false)}
            msg={msg}
          />
        )}
      </div>
    </div>
  );
};

interface ChatDropdownMenuProps {
  handleClose: () => void;
  handleReply: () => void;
  msg: Message;
}

const ChatDropdownMenu: React.FC<ChatDropdownMenuProps> = ({
  handleClose,
  handleReply,
  // msg,
}) => {
  return (
    <DropdownMenu open={true} onOpenChange={handleClose}>
      <DropdownMenuContent
        align="start"
        className="w-[260px] md:left-0"
        sideOffset={5}
      >
        <DropdownMenuItem
          onClick={() => {
            handleReply();
            // document.querySelector<HTMLDivElement>(".ProseMirror")?.focus();
          }}
        >
          <Reply className="mr-2 h-4 w-4" />
          <span>Reply</span>
        </DropdownMenuItem>

        {/* {!!router.pathname.startsWith("/train") && (
          <DropdownMenuItem
            onClick={() => {
              router.push(`/chat/${msg?.thread?.id}?messageId=${msg?.id}`);
            }}
          >
            <Reply className="mr-2 h-4 w-4" />
            <span>Take to Chat</span>
          </DropdownMenuItem>
        )} */}

        <DropdownMenuItem disabled>
          <ThumbsUp className="mr-2 h-4 w-4" />
          <span>Like</span>
        </DropdownMenuItem>

        <DropdownMenuItem disabled>
          <ThumbsDown className="mr-2 h-4 w-4" />
          <span>Dislike</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem disabled>
          <Check className="mr-2 h-4 w-4" />
          <span>Select</span>
        </DropdownMenuItem>

        <DropdownMenuItem disabled>
          <Copy className="mr-2 h-4 w-4" />
          <span>Copy Text</span>
        </DropdownMenuItem>

        <DropdownMenuItem disabled>
          <Share className="mr-2 h-4 w-4" />
          <span>Share</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem disabled>
          <AlertTriangle className="mr-2 h-4 w-4" />
          <span>Report</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

type MobileProps = {
  setIsOpen: (isOpen: boolean) => void;
  msg: Message;
  setReplyingTo?: (id?: string) => void;
};

const ChatMenuMobile = ({ setIsOpen, msg, setReplyingTo }: MobileProps) => {
  const options: IOption[] = [
    {
      icon: <ThumbsUp className="h-5 w-5" />,
      label: "Like",
      disabled: true,
    },
    {
      icon: <ThumbsDown className="h-5 w-5" />,
      label: "Dislike",
      hr: true,
      disabled: true,
    },
    {
      icon: <Check className="h-5 w-5" />,
      label: "Select",
      disabled: true,
    },
    {
      icon: <Copy className="h-5 w-5" />,
      label: "Copy Text",
      disabled: true,
    },
    {
      icon: <Share className="h-5 w-5" />,
      label: "Share",
      hr: true,
      disabled: true,
    },
    {
      icon: <AlertTriangle className="h-5 w-5" />,
      label: "Report",
      disabled: true,
    },
  ];

  const handleClose = () => setIsOpen(false);

  return (
    <div
      id="chat-menu-mobile"
      className="bg-midnight-900 fixed bottom-0 left-0 right-0 z-10 flex w-full flex-col items-center justify-center rounded-t-[20px]"
    >
      <div className="flex w-full flex-col px-2 py-4">
        {options.map((option) => (
          <Option key={option.label} {...option} handleClose={handleClose} />
        ))}
      </div>
      <div className="bg-ghost-300 h-[1px] w-[90%]" />
    </div>
  );
};

type IOption = {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
  disabled?: boolean;
  hr?: boolean; // divider after option
};

type OptionProps = IOption & {
  handleClose: () => void;
};

const Option = ({
  label,
  icon,
  onClick,
  disabled,
  handleClose,
  hr,
}: OptionProps) => {
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
        {icon}
        <span>{label}</span>
      </button>
      {hr ? <div className="bg-ghost-300 my-1 h-[1px] w-full" /> : null}
    </>
  );
};
