import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { AlertCircle, AlertTriangle, CheckCircle2 } from "lucide-react"

import { cn } from "@/lib/utils"

const statusBadgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      status: {
        safe:
          "border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
        warning:
          "border-transparent bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
        danger:
          "border-transparent bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400",
      },
    },
    defaultVariants: {
      status: "safe",
    },
  }
)

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusBadgeVariants> {
  label?: string;
  showIcon?: boolean;
}

function StatusBadge({ className, status, label, showIcon = true, ...props }: StatusBadgeProps) {
  const getIcon = () => {
    switch (status) {
      case "safe":
        return <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
      case "warning":
        return <AlertTriangle className="mr-1 h-3.5 w-3.5" />
      case "danger":
        return <AlertCircle className="mr-1 h-3.5 w-3.5" />
      default:
        return null
    }
  }

  const getDefaultLabel = () => {
    switch (status) {
      case "safe":
        return "Routine Workflow"
      case "warning":
        return "Doctor Review"
      case "danger":
        return "Urgent Referral"
      default:
        return ""
    }
  }

  return (
    <div className={cn(statusBadgeVariants({ status }), className)} {...props}>
      {showIcon && getIcon()}
      {label || getDefaultLabel()}
    </div>
  )
}

export { StatusBadge, statusBadgeVariants }
