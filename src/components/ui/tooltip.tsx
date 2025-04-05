import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"

import { cn } from "@/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Portal>
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "deva-z-50 deva-overflow-hidden deva-rounded-md deva-bg-primary deva-px-3 deva-py-1.5 deva-text-xs deva-text-primary-foreground deva-animate-in deva-fade-in-0 deva-zoom-in-95 data-[state=closed]:deva-animate-out data-[state=closed]:deva-fade-out-0 data-[state=closed]:deva-zoom-out-95 data-[side=bottom]:deva-slide-in-from-top-2 data-[side=left]:deva-slide-in-from-right-2 data-[side=right]:deva-slide-in-from-left-2 data-[side=top]:deva-slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </TooltipPrimitive.Portal>
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
