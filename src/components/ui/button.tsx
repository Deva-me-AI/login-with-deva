import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "deva-inline-flex deva-items-center deva-justify-center deva-gap-2 deva-whitespace-nowrap deva-rounded-md deva-text-sm deva-font-medium deva-transition-colors focus-visible:deva-outline-none focus-visible:deva-ring-1 focus-visible:deva-ring-ring disabled:deva-pointer-events-none disabled:deva-opacity-50 [&_svg]:deva-pointer-events-none [&_svg]:deva-size-4 [&_svg]:deva-shrink-0",
  {
    variants: {
      variant: {
        default:
          "deva-bg-primary deva-text-primary-foreground deva-shadow hover:deva-bg-primary/90",
        destructive:
          "deva-bg-destructive deva-text-destructive-foreground deva-shadow-sm hover:deva-bg-destructive/90",
        outline:
          "deva-border deva-border-input deva-bg-background deva-shadow-sm hover:deva-bg-accent hover:deva-text-accent-foreground",
        secondary:
          "deva-bg-secondary deva-text-secondary-foreground deva-shadow-sm hover:deva-bg-secondary/80",
        ghost: "hover:deva-bg-accent hover:deva-text-accent-foreground",
        link: "deva-text-primary deva-underline-offset-4 hover:deva-underline",
      },
      size: {
        default: "deva-h-9 deva-px-4 deva-py-2",
        sm: "deva-h-8 deva-rounded-md deva-px-3 deva-text-xs",
        lg: "deva-h-10 deva-rounded-md deva-px-8",
        icon: "deva-h-9 deva-w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
