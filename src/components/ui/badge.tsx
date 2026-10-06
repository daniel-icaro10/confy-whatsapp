import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center gap-1.5 h-[20px] px-2 rounded-[5px] text-[11.5px] font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 [&>svg]:pointer-events-none border transition-colors select-none",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--surface-2)] text-[var(--text-2)] border-[var(--border)]",
        secondary:
          "bg-[var(--surface-3)] text-[var(--text-2)] border-transparent",
        accent:
          "bg-[var(--accent-soft)] text-[var(--accent)] border-transparent font-medium",
        green:
          "bg-[var(--green-soft)] text-[var(--green)] border-transparent",
        amber:
          "bg-[var(--amber-soft)] text-[var(--amber)] border-transparent",
        destructive:
          "bg-[var(--red-soft)] text-[var(--red)] border-transparent",
        red:
          "bg-[var(--red-soft)] text-[var(--red)] border-transparent",
        violet:
          "bg-[color-mix(in_srgb,var(--violet)_12%,transparent)] text-[var(--violet)] border-transparent",
        outline:
          "border-[var(--border)] text-[var(--text-2)] bg-[var(--surface)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
