import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "deva-fixed deva-top-0 deva-z-[100] deva-flex deva-max-h-screen deva-w-full deva-flex-col-reverse deva-p-4 sm:deva-bottom-0 sm:deva-right-0 sm:deva-top-auto sm:deva-flex-col md:deva-max-w-[420px]",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  "deva-group deva-pointer-events-auto deva-relative deva-flex deva-w-full deva-items-center deva-justify-between deva-space-x-2 deva-overflow-hidden deva-rounded-md deva-border deva-p-4 deva-pr-6 deva-shadow-lg deva-transition-all data-[swipe=cancel]:deva-translate-x-0 data-[swipe=end]:deva-translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:deva-translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:deva-transition-none data-[state=open]:deva-animate-in data-[state=closed]:deva-animate-out data-[swipe=end]:deva-animate-out data-[state=closed]:deva-fade-out-80 data-[state=closed]:deva-slide-out-to-right-full data-[state=open]:deva-slide-in-from-top-full data-[state=open]:sm:deva-slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "deva-border deva-bg-background deva-text-foreground",
        destructive:
          "destructive deva-group deva-border-destructive deva-bg-destructive deva-text-destructive-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "deva-inline-flex deva-h-8 deva-shrink-0 deva-items-center deva-justify-center deva-rounded-md deva-border deva-bg-transparent deva-px-3 deva-text-sm deva-font-medium deva-transition-colors hover:deva-bg-secondary focus:deva-outline-none focus:deva-ring-1 focus:deva-ring-ring disabled:deva-pointer-events-none disabled:deva-opacity-50 group-[.destructive]:deva-border-muted/40 group-[.destructive]:hover:deva-border-destructive/30 group-[.destructive]:hover:deva-bg-destructive group-[.destructive]:hover:deva-text-destructive-foreground group-[.destructive]:focus:deva-ring-destructive",
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "deva-absolute deva-right-1 deva-top-1 deva-rounded-md deva-p-1 deva-text-foreground/50 deva-opacity-0 deva-transition-opacity hover:deva-text-foreground focus:deva-opacity-100 focus:deva-outline-none focus:deva-ring-1 group-hover:deva-opacity-100 group-[.destructive]:deva-text-red-300 group-[.destructive]:hover:deva-text-red-50 group-[.destructive]:focus:deva-ring-red-400 group-[.destructive]:focus:deva-ring-offset-red-600",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="deva-h-4 deva-w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("deva-text-sm deva-font-semibold [&+div]:deva-text-xs", className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("deva-text-sm deva-opacity-90", className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}
