import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "h-[30px] w-full min-w-0 rounded-[6px] border border-[var(--border-strong)] bg-[var(--surface)] px-2.5 py-1 text-[13px] text-[var(--text)] placeholder:text-[var(--text-3)] transition-[border-color,box-shadow] duration-150 outline-none",
        "hover:border-[color-mix(in_srgb,var(--border-strong)_60%,var(--text-3))]",
        "focus:border-[var(--accent)] focus:ring-[3px] focus:ring-[var(--accent-soft)]",
        "disabled:bg-[var(--surface-2)] disabled:text-[var(--text-3)] disabled:cursor-not-allowed disabled:opacity-75",
        "aria-invalid:border-[var(--red)] aria-invalid:ring-[3px] aria-invalid:ring-[var(--red-soft)]",
        className
      )}
      {...props}
    />
  )
}

export { Input }
