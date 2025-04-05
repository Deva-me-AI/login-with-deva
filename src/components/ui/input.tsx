import * as React from "react"

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "deva-flex deva-h-9 deva-w-full deva-rounded-md deva-border deva-border-input deva-bg-transparent deva-px-3 deva-py-1 deva-text-base deva-shadow-sm deva-transition-colors file:deva-border-0 file:deva-bg-transparent file:deva-text-sm file:deva-font-medium file:deva-text-foreground placeholder:deva-text-muted-foreground focus-visible:deva-outline-none focus-visible:deva-ring-1 focus-visible:deva-ring-ring disabled:deva-cursor-not-allowed disabled:deva-opacity-50 md:deva-text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"

export { Input }
