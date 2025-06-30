import * as React from "react"
import { type DialogProps } from "@radix-ui/react-dialog"
import { Command as CommandPrimitive } from "cmdk"
import { Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { Dialog, DialogContent } from "@/components/ui/dialog"

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      "deva-flex deva-h-full deva-w-full deva-flex-col deva-overflow-hidden deva-rounded-md deva-bg-popover deva-text-popover-foreground",
      className
    )}
    {...props}
  />
))
Command.displayName = CommandPrimitive.displayName

const CommandDialog = ({ children, ...props }: DialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className="deva-overflow-hidden deva-p-0">
        <Command className="[&_[cmdk-group-heading]]:deva-px-2 [&_[cmdk-group-heading]]:deva-font-medium [&_[cmdk-group-heading]]:deva-text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:deva-pt-0 [&_[cmdk-group]]:deva-px-2 [&_[cmdk-input-wrapper]_svg]:deva-h-5 [&_[cmdk-input-wrapper]_svg]:deva-w-5 [&_[cmdk-input]]:deva-h-12 [&_[cmdk-item]]:deva-px-2 [&_[cmdk-item]]:deva-py-3 [&_[cmdk-item]_svg]:deva-h-5 [&_[cmdk-item]_svg]:deva-w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  )
}

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  // eslint-disable-next-line react/no-unknown-property
  <div className="deva-flex deva-items-center deva-border-b deva-px-3" cmdk-input-wrapper=""> 
    <Search className="deva-mr-2 deva-h-4 deva-w-4 deva-shrink-0 deva-opacity-50" />
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        "deva-flex deva-h-10 deva-w-full deva-rounded-md deva-bg-transparent deva-py-3 deva-text-sm deva-outline-none placeholder:deva-text-muted-foreground disabled:deva-cursor-not-allowed disabled:deva-opacity-50",
        className
      )}
      {...props}
    />
  </div>
))

CommandInput.displayName = CommandPrimitive.Input.displayName

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn("deva-max-h-[300px] deva-overflow-y-auto deva-overflow-x-hidden", className)}
    {...props}
  />
))

CommandList.displayName = CommandPrimitive.List.displayName

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className="deva-py-6 deva-text-center deva-text-sm"
    {...props}
  />
))

CommandEmpty.displayName = CommandPrimitive.Empty.displayName

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      "deva-overflow-hidden deva-p-1 deva-text-foreground [&_[cmdk-group-heading]]:deva-px-2 [&_[cmdk-group-heading]]:deva-py-1.5 [&_[cmdk-group-heading]]:deva-text-xs [&_[cmdk-group-heading]]:deva-font-medium [&_[cmdk-group-heading]]:deva-text-muted-foreground",
      className
    )}
    {...props}
  />
))

CommandGroup.displayName = CommandPrimitive.Group.displayName

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={cn("-deva-mx-1 deva-h-px deva-bg-border", className)}
    {...props}
  />
))
CommandSeparator.displayName = CommandPrimitive.Separator.displayName

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      "deva-relative deva-flex deva-cursor-default deva-gap-2 deva-select-none deva-items-center deva-rounded-sm deva-px-2 deva-py-1.5 deva-text-sm deva-outline-none data-[disabled=true]:deva-pointer-events-none data-[selected=true]:deva-bg-accent data-[selected=true]:deva-text-accent-foreground data-[disabled=true]:deva-opacity-50 [&_svg]:deva-pointer-events-none [&_svg]:deva-size-4 [&_svg]:deva-shrink-0",
      className
    )}
    {...props}
  />
))

CommandItem.displayName = CommandPrimitive.Item.displayName

const CommandShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={cn(
        "deva-ml-auto deva-text-xs deva-tracking-widest deva-text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}
CommandShortcut.displayName = "CommandShortcut"

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
}
