import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline"
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "border-transparent bg-indigo-500 text-white shadow hover:bg-indigo-600",
    secondary: "border-transparent bg-neutral-800 text-neutral-100 hover:bg-neutral-700",
    destructive: "border-transparent bg-red-900/50 text-red-200 hover:bg-red-900/80 border border-red-800",
    outline: "text-neutral-100 border-neutral-700"
  }
  
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
