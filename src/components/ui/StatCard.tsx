import { motion } from "framer-motion"
import { cn } from "../../lib/utils"

interface StatCardProps {
  label: string
  value: string | number
  icon?: string
  trend?: "up" | "down" | "neutral"
  className?: string
}

export function StatCard({ label, value, icon, trend, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "bg-surface-2 border border-border rounded-xl p-4 flex flex-col gap-1",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
          {label}
        </span>
        {icon && <span className="text-copper text-sm">{icon}</span>}
      </div>
      <div className="flex items-end gap-2">
        <motion.span
          className="text-2xl font-heading font-bold text-text"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          {value}
        </motion.span>
        {trend && (
          <span
            className={cn(
              "text-xs font-medium mb-1",
              trend === "up" && "text-pitch-light",
              trend === "down" && "text-danger",
              trend === "neutral" && "text-text-muted"
            )}
          >
            {trend === "up" && "↑"}
            {trend === "down" && "↓"}
            {trend === "neutral" && "—"}
          </span>
        )}
      </div>
    </div>
  )
}
