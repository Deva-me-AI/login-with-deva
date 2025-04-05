import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("deva-animate-pulse deva-rounded-md deva-bg-primary/40", className)}
      {...props}
    />
  )
}

export { Skeleton }
