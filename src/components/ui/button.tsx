import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-[6px] text-[13px] font-medium transition-[background,border-color,color,box-shadow,transform] duration-150 active:scale-[0.97] disabled:pointer-events-none disabled:opacity-45 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-3.5 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:outline-2 focus-visible:outline-[var(--accent)] focus-visible:outline-offset-1 select-none",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--accent)] text-[var(--on-accent)] shadow-[inset_0_-1px_0_rgba(0,0,0,0.12)] hover:brightness-105 active:brightness-95",
        destructive:
          "bg-[var(--red)] text-white hover:brightness-95 active:brightness-90",
        outline:
          "border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text)] shadow-[var(--shadow-sm)] hover:bg-[var(--surface-2)] active:bg-[var(--surface-3)]",
        secondary:
          "border border-[var(--border-strong)] bg-[var(--surface)] text-[var(--text)] shadow-[var(--shadow-sm)] hover:bg-[var(--surface-2)] active:bg-[var(--surface-3)]",
        ghost:
          "text-[var(--text-2)] hover:bg-[var(--surface-2)] hover:text-[var(--text)] active:bg-[var(--surface-3)]",
        link:
          "text-[var(--accent)] underline-offset-4 hover:underline p-0 h-auto",
        glass:
          "bg-[var(--surface)]/80 backdrop-blur-md border border-[var(--border)] text-[var(--text)] hover:bg-[var(--surface-2)] shadow-[var(--shadow-sm)]",
      },
      size: {
        default: "h-[30px] px-3",
        sm: "h-[26px] px-2 text-[12px] [&_svg:not([class*='size-'])]:size-3",
        lg: "h-[36px] px-4 text-[13.5px] [&_svg:not([class*='size-'])]:size-4",
        icon: "size-[30px] p-0 text-[var(--text-2)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]",
        "icon-sm": "size-[26px] p-0 text-[var(--text-2)] hover:bg-[var(--surface-2)] hover:text-[var(--text)] [&_svg:not([class*='size-'])]:size-3",
        "icon-lg": "size-[36px] p-0 text-[var(--text-2)] hover:bg-[var(--surface-2)] hover:text-[var(--text)]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ComponentProps<"button">,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: ButtonProps) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
