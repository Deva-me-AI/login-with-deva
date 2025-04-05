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
    <div className="deva-chat-menu-container deva-relative">
      <div className="deva-flex">
        <button
          className={cn(
            "hover:deva-bg-jewel-200 deva-group deva-flex deva-h-8 deva-w-8 deva-items-center deva-justify-center deva-rounded-full deva-transition deva-duration-200 deva-ease-in-out",
          )}
          onClick={() => {
            setReplyingTo?.(msg?.id);
            document.querySelector<HTMLDivElement>(".ProseMirror")?.focus();
          }}
        >
          <Reply className="deva-h-5 deva-w-5" />
        </button>
        {!isModal && (
          <>
            {/* Desktop button - hidden on mobile */}
            <div className="deva-hidden md:deva-block">
              <button
                className={cn(
                  "hover:deva-bg-jewel-200 deva-group deva-flex deva-h-8 deva-w-8 deva-items-center deva-justify-center deva-rounded-full deva-transition deva-duration-200 deva-ease-in-out",
                  {
                    "deva-ring-jewel-300 deva-ring-2": !!dropdown,
                  },
                )}
                onClick={(e) => {
                  e.stopPropagation();
                  setDropdown(true);
                }}
              >
                <MoreVertical
                  className={cn(
                    "group-hover:deva-text-jewel-500 deva-h-5 deva-w-5 deva-text-gray-500 deva-transition deva-duration-200 deva-ease-in-out",
                    {
                      "deva-text-white": !!dropdown,
                    },
                  )}
                />
              </button>
            </div>

            {/* Mobile button with Dialog - shown only on mobile */}
            <div className="deva-block md:deva-hidden">
              <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
                <DialogTrigger asChild>
                  <button
                    className={cn(
                      "hover:deva-bg-jewel-200 deva-group deva-flex deva-h-8 deva-w-8 deva-items-center deva-justify-center deva-rounded-full deva-transition deva-duration-200 deva-ease-in-out",
                      {
                        "deva-ring-jewel-300 deva-ring-2": !!dropdown,
                      },
                    )}
                    onClick={handleDropdownClick}
                  >
                    <MoreVertical
                      className={cn(
                        "group-hover:deva-text-jewel-500 deva-h-5 deva-w-5 deva-text-gray-500 deva-transition deva-duration-200 deva-ease-in-out",
                        {
                          "deva-text-white": !!dropdown,
                        },
                      )}
                    />
                  </button>
                </DialogTrigger>
                <DialogContent
                  className="deva-border-0 deva-bg-transparent deva-p-0 deva-shadow-none"
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

      <div className="deva-hidden md:deva-block">
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
        className="deva-w-[260px] md:deva-left-0"
        sideOffset={5}
      >
        <DropdownMenuItem
          onClick={() => {
            handleReply();
            // document.querySelector<HTMLDivElement>(".ProseMirror")?.focus();
          }}
        >
          <Reply className="deva-mr-2 deva-h-4 deva-w-4" />
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
          <ThumbsUp className="deva-mr-2 deva-h-4 deva-w-4" />
          <span>Like</span>
        </DropdownMenuItem>

        <DropdownMenuItem disabled>
          <ThumbsDown className="deva-mr-2 deva-h-4 deva-w-4" />
          <span>Dislike</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem disabled>
          <Check className="deva-mr-2 deva-h-4 deva-w-4" />
          <span>Select</span>
        </DropdownMenuItem>

        <DropdownMenuItem disabled>
          <Copy className="deva-mr-2 deva-h-4 deva-w-4" />
          <span>Copy Text</span>
        </DropdownMenuItem>

        <DropdownMenuItem disabled>
          <Share className="deva-mr-2 deva-h-4 deva-w-4" />
          <span>Share</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem disabled>
          <AlertTriangle className="deva-mr-2 deva-h-4 deva-w-4" />
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
      icon: <ThumbsUp className="deva-h-5 deva-w-5" />,
      label: "Like",
      disabled: true,
    },
    {
      icon: <ThumbsDown className="deva-h-5 deva-w-5" />,
      label: "Dislike",
      hr: true,
      disabled: true,
    },
    {
      icon: <Check className="deva-h-5 deva-w-5" />,
      label: "Select",
      disabled: true,
    },
    {
      icon: <Copy className="deva-h-5 deva-w-5" />,
      label: "Copy Text",
      disabled: true,
    },
    {
      icon: <Share className="deva-h-5 deva-w-5" />,
      label: "Share",
      hr: true,
      disabled: true,
    },
    {
      icon: <AlertTriangle className="deva-h-5 deva-w-5" />,
      label: "Report",
      disabled: true,
    },
  ];

  const handleClose = () => setIsOpen(false);

  return (
    <div
      id="chat-menu-mobile"
      className="deva-fixed deva-bottom-0 deva-left-0 deva-right-0 deva-z-10 deva-flex deva-w-full deva-flex-col deva-items-center deva-justify-center deva-rounded-t-[20px] deva-bg-midnight-900"
    >
      <div className="deva-flex deva-w-full deva-flex-col deva-px-2 deva-py-4">
        {options.map((option) => (
          <Option key={option.label} {...option} handleClose={handleClose} />
        ))}
      </div>
      <div className="deva-bg-ghost-300 deva-h-[1px] deva-w-[90%]" />
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
          "hover:deva-bg-ghost-300 deva-flex deva-w-full deva-items-center deva-gap-x-3 deva-rounded-md deva-px-4 deva-py-3 deva-text-white deva-transition-colors deva-duration-100 deva-ease-out",
          {
            "deva-text-lynch-600 deva-pointer-events-none deva-opacity-20":
              disabled,
          },
        )}
        onClick={clickHandler}
        disabled={disabled}
      >
        {icon}
        <span>{label}</span>
      </button>
      {hr ? (
        <div className="deva-bg-ghost-300 deva-my-1 deva-h-[1px] deva-w-full" />
      ) : null}
    </>
  );
};
