import { motion } from "framer-motion"
import { cn } from "../../lib/utils"

interface StreakBadgeProps {
  count: number
  className?: string
}

export function StreakBadge({ count, className }: StreakBadgeProps) {
  return (
    <motion.div
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-copper/10 border border-copper/20",
        className
      )}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: "spring", stiffness: 400, damping: 20 }}
    >
      <span className="text-lg">🔥</span>
      <span className="font-heading font-bold text-sm text-copper">{count}</span>
      <span className="text-xs text-text-muted">day streak</span>
    </motion.div>
  )
}
