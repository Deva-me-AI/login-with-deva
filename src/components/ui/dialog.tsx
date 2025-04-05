import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

const Dialog = DialogPrimitive.Root;

const DialogTrigger = DialogPrimitive.Trigger;

const DialogPortal = DialogPrimitive.Portal;

const DialogClose = DialogPrimitive.Close;

const DialogOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "deva-fixed deva-inset-0 deva-z-50 deva-bg-black/80 data-[state=open]:deva-animate-in data-[state=closed]:deva-animate-out data-[state=closed]:deva-fade-out-0 data-[state=open]:deva-fade-in-0",
      className,
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPortal>
    <DialogOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "deva-flex deva-min-h-dvh deva-w-dvw deva-items-center deva-justify-center deva-p-4 sm:deva-p-6",
        "deva-fixed deva-inset-0 deva-z-50",
      )}
      {...props}
    >
      <div 
        className={cn(
          "deva-w-full deva-max-w-lg deva-rounded-lg deva-border deva-bg-background deva-p-6 deva-shadow-lg",
          "deva-duration-200 data-[state=open]:deva-animate-in data-[state=closed]:deva-animate-out",
          "data-[state=closed]:deva-fade-out-0 data-[state=open]:deva-fade-in-0",
          "data-[state=closed]:deva-zoom-out-95 data-[state=open]:deva-zoom-in-95",
          className,
        )}
      >
        {children}
        <DialogPrimitive.Close className="deva-absolute deva-right-4 deva-top-4 deva-rounded-sm deva-opacity-70 deva-ring-offset-background deva-transition-opacity hover:deva-opacity-100 focus:deva-outline-none focus:deva-ring-2 focus:deva-ring-ring focus:deva-ring-offset-2 disabled:deva-pointer-events-none data-[state=open]:deva-bg-accent data-[state=open]:deva-text-muted-foreground">
          <X className="deva-h-4 deva-w-4" />
          <span className="deva-sr-only">Close</span>
        </DialogPrimitive.Close>
      </div>
    </DialogPrimitive.Content>
  </DialogPortal>
));
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "deva-flex deva-flex-col deva-space-y-1.5 deva-text-center sm:deva-text-left",
      className,
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "deva-flex deva-flex-col-reverse sm:deva-flex-row sm:deva-justify-end sm:deva-space-x-2",
      className,
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "deva-text-lg deva-font-semibold deva-leading-none deva-tracking-tight",
      className,
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("deva-text-sm deva-text-muted-foreground", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
