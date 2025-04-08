import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"

import { cn } from "@/lib/utils"

const Popover = PopoverPrimitive.Root

const PopoverTrigger = PopoverPrimitive.Trigger

const PopoverAnchor = PopoverPrimitive.Anchor

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "center", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "deva-z-50 deva-w-72 deva-rounded-md deva-border deva-bg-popover deva-p-4 deva-text-popover-foreground deva-shadow-md deva-outline-none data-[state=open]:deva-animate-in data-[state=closed]:deva-animate-out data-[state=closed]:deva-fade-out-0 data-[state=open]:deva-fade-in-0 data-[state=closed]:deva-zoom-out-95 data-[state=open]:deva-zoom-in-95 data-[side=bottom]:deva-slide-in-from-top-2 data-[side=left]:deva-slide-in-from-right-2 data-[side=right]:deva-slide-in-from-left-2 data-[side=top]:deva-slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
))
PopoverContent.displayName = PopoverPrimitive.Content.displayName

export { Popover, PopoverTrigger, PopoverContent, PopoverAnchor }
