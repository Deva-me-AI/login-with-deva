import * as React from "react"

import { cn } from "@/lib/utils"

const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.ComponentProps<"textarea">
>(({ className, ...props }, ref) => {
  return (
    <textarea
      className={cn(
        "deva-flex deva-min-h-[60px] deva-w-full deva-rounded-md deva-border deva-border-input deva-bg-transparent deva-px-3 deva-py-2 deva-text-base deva-shadow-sm placeholder:deva-text-muted-foreground focus-visible:deva-outline-none focus-visible:deva-ring-1 focus-visible:deva-ring-ring disabled:deva-cursor-not-allowed disabled:deva-opacity-50 md:deva-text-sm",
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Textarea.displayName = "Textarea"

export { Textarea }
