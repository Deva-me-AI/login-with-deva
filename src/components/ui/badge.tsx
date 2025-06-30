import type * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "deva-inline-flex deva-items-center deva-rounded-md deva-border deva-px-2.5 deva-py-0.5 deva-text-xs deva-font-semibold deva-transition-colors deva-focus:outline-none deva-focus:ring-2 deva-focus:ring-ring deva-focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "deva-border-transparent deva-bg-primary deva-text-primary-foreground deva-shadow hover:deva-bg-primary/80",
        secondary:
          "deva-border-transparent deva-bg-secondary deva-text-secondary-foreground hover:deva-bg-secondary/80",
        destructive:
          "deva-border-transparent deva-bg-destructive deva-text-destructive-foreground deva-shadow hover:deva-bg-destructive/80",
        outline: "deva-text-foreground",
        jewel: "deva-border-transparent deva-bg-jewel-500 deva-text-background hover:deva-bg-secondary/80 hover:deva-text-secondary-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  )
}

export { Badge, badgeVariants }
