import * as React from "react"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"
import { Check, ChevronRight, Circle } from "lucide-react"

import { cn } from "@/lib/utils"

const DropdownMenu = DropdownMenuPrimitive.Root

const DropdownMenuTrigger = DropdownMenuPrimitive.Trigger

const DropdownMenuGroup = DropdownMenuPrimitive.Group

const DropdownMenuPortal = DropdownMenuPrimitive.Portal

const DropdownMenuSub = DropdownMenuPrimitive.Sub

const DropdownMenuRadioGroup = DropdownMenuPrimitive.RadioGroup

const DropdownMenuSubTrigger = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubTrigger>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubTrigger> & {
    inset?: boolean
  }
>(({ className, inset, children, ...props }, ref) => (
  <DropdownMenuPrimitive.SubTrigger
    ref={ref}
    className={cn(
      "deva-flex deva-cursor-default deva-gap-2 deva-select-none deva-items-center deva-rounded-sm deva-px-2 deva-py-1.5 deva-text-sm deva-outline-none focus:deva-bg-accent data-[state=open]:deva-bg-accent [&_svg]:deva-pointer-events-none [&_svg]:deva-size-4 [&_svg]:deva-shrink-0",
      inset && "deva-pl-8",
      className
    )}
    {...props}
  >
    {children}
    <ChevronRight className="deva-ml-auto" />
  </DropdownMenuPrimitive.SubTrigger>
))
DropdownMenuSubTrigger.displayName =
  DropdownMenuPrimitive.SubTrigger.displayName

const DropdownMenuSubContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.SubContent>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.SubContent>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.SubContent
    ref={ref}
    className={cn(
      "deva-z-50 deva-min-w-[8rem] deva-overflow-hidden deva-rounded-md deva-border deva-bg-popover deva-p-1 deva-text-popover-foreground deva-shadow-lg data-[state=open]:deva-animate-in data-[state=closed]:deva-animate-out data-[state=closed]:deva-fade-out-0 data-[state=open]:deva-fade-in-0 data-[state=closed]:deva-zoom-out-95 data-[state=open]:deva-zoom-in-95 data-[side=bottom]:deva-slide-in-from-top-2 data-[side=left]:deva-slide-in-from-right-2 data-[side=right]:deva-slide-in-from-left-2 data-[side=top]:deva-slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
DropdownMenuSubContent.displayName =
  DropdownMenuPrimitive.SubContent.displayName

const DropdownMenuContent = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <DropdownMenuPrimitive.Portal>
    <DropdownMenuPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "deva-z-50 deva-min-w-[8rem] deva-overflow-hidden deva-rounded-md deva-border deva-bg-popover deva-p-1 deva-text-popover-foreground deva-shadow-md",
        "data-[state=open]:deva-animate-in data-[state=closed]:deva-animate-out data-[state=closed]:deva-fade-out-0 data-[state=open]:deva-fade-in-0 data-[state=closed]:deva-zoom-out-95 data-[state=open]:deva-zoom-in-95 data-[side=bottom]:deva-slide-in-from-top-2 data-[side=left]:deva-slide-in-from-right-2 data-[side=right]:deva-slide-in-from-left-2 data-[side=top]:deva-slide-in-from-bottom-2",
        className
      )}
      {...props}
    />
  </DropdownMenuPrimitive.Portal>
))
DropdownMenuContent.displayName = DropdownMenuPrimitive.Content.displayName

const DropdownMenuItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Item
    ref={ref}
    className={cn(
      "deva-relative deva-flex deva-cursor-default deva-select-none deva-items-center deva-gap-2 deva-rounded-sm deva-px-2 deva-py-1.5 deva-text-sm deva-outline-none deva-transition-colors focus:deva-bg-accent focus:deva-text-accent-foreground data-[disabled]:deva-pointer-events-none data-[disabled]:deva-opacity-50 [&>svg]:deva-size-4 [&>svg]:deva-shrink-0",
      inset && "deva-pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuItem.displayName = DropdownMenuPrimitive.Item.displayName

const DropdownMenuCheckboxItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.CheckboxItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.CheckboxItem>
>(({ className, children, checked, ...props }, ref) => (
  <DropdownMenuPrimitive.CheckboxItem
    ref={ref}
    className={cn(
      "deva-relative deva-flex deva-cursor-default deva-select-none deva-items-center deva-rounded-sm deva-py-1.5 deva-pl-8 deva-pr-2 deva-text-sm deva-outline-none deva-transition-colors focus:deva-bg-accent focus:deva-text-accent-foreground data-[disabled]:deva-pointer-events-none data-[disabled]:deva-opacity-50",
      className
    )}
    checked={checked}
    {...props}
  >
    <span className="deva-absolute deva-left-2 deva-flex deva-h-3.5 deva-w-3.5 deva-items-center deva-justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Check className="deva-h-4 deva-w-4" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.CheckboxItem>
))
DropdownMenuCheckboxItem.displayName =
  DropdownMenuPrimitive.CheckboxItem.displayName

const DropdownMenuRadioItem = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.RadioItem>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.RadioItem>
>(({ className, children, ...props }, ref) => (
  <DropdownMenuPrimitive.RadioItem
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className
    )}
    {...props}
  >
    <span className="deva-absolute deva-left-2 deva-flex deva-h-3.5 deva-w-3.5 deva-items-center deva-justify-center">
      <DropdownMenuPrimitive.ItemIndicator>
        <Circle className="deva-h-2 deva-w-2 deva-fill-current" />
      </DropdownMenuPrimitive.ItemIndicator>
    </span>
    {children}
  </DropdownMenuPrimitive.RadioItem>
))
DropdownMenuRadioItem.displayName = DropdownMenuPrimitive.RadioItem.displayName

const DropdownMenuLabel = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Label>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Label> & {
    inset?: boolean
  }
>(({ className, inset, ...props }, ref) => (
  <DropdownMenuPrimitive.Label
    ref={ref}
    className={cn(
      "deva-px-2 deva-py-1.5 deva-text-sm deva-font-semibold",
      inset && "deva-pl-8",
      className
    )}
    {...props}
  />
))
DropdownMenuLabel.displayName = DropdownMenuPrimitive.Label.displayName

const DropdownMenuSeparator = React.forwardRef<
  React.ElementRef<typeof DropdownMenuPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <DropdownMenuPrimitive.Separator
    ref={ref}
    className={cn("-deva-mx-1 deva-my-1 deva-h-px deva-bg-muted", className)}
    {...props}
  />
))
DropdownMenuSeparator.displayName = DropdownMenuPrimitive.Separator.displayName

const DropdownMenuShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn("deva-ml-auto deva-text-xs deva-tracking-widest deva-opacity-60", className)}
      {...props}
    />
  )
}
DropdownMenuShortcut.displayName = "DropdownMenuShortcut"

export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
}
