import * as React from "react"
import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import { Loading03Icon } from "@hugeicons/core-free-icons"

const Spinner = React.forwardRef<SVGSVGElement, React.ComponentPropsWithoutRef<"svg">>(
  ({ className, strokeWidth, ...props }, ref) => {
    return (
      <HugeiconsIcon
        ref={ref}
        icon={Loading03Icon}
        // Tipi garantiye alıyoruz
        strokeWidth={typeof strokeWidth === 'number' ? strokeWidth : 2}
        className={cn("size-4 animate-spin", className)}
        {...props}
      />
    )
  }
)
Spinner.displayName = "Spinner"

export { Spinner }