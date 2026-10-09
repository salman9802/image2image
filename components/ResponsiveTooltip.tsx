import * as React from "react"
import { useMediaQuery } from "@/hooks/use-media-query" // Or any standard media query hook
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils";

interface ResponsiveTooltipProps {
  children: React.ReactElement; // The element triggering the tooltip
  content: React.ReactNode;  // The text/content inside the tooltip
  side?: "top" | "bottom" | "left" | "right";
  align?: "start" | "center" | "end";
  tooltipContentclassNames?: string | undefined;
}

export function ResponsiveTooltip({
  children,
  content,
  side = "top",
  align = "center",
  tooltipContentclassNames = undefined
}: ResponsiveTooltipProps) {
  // Checks if the screen width matches a desktop device (min-width: 768px)
  const isDesktop = useMediaQuery("(min-width: 768px)")

  if (isDesktop) {
    return (
      <Tooltip>
        <TooltipTrigger render={children} />
        <TooltipContent side={side} align={align} className={tooltipContentclassNames}>
          {content}
        </TooltipContent>
      </Tooltip>
    )
  }

  return (
    <Popover>
      <PopoverTrigger nativeButton={false} render={children} />
      {/* Visual matching of Popover styling to standard Shadcn Tooltips */}
      <PopoverContent
        side={side}
        align={align}
        className={cn("z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 w-auto max-w-[280px]", tooltipContentclassNames)}
      >
        {content}
      </PopoverContent>
    </Popover>
  )
}
