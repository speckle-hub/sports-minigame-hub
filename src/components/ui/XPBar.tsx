import { motion } from "framer-motion"
import { cn, calculateLevel, progressToNextLevel } from "../../lib/utils"

interface XPBarProps {
  xp: number
  className?: string
  animated?: boolean
}

export function XPBar({ xp, className, animated = true }: XPBarProps) {
  const level = calculateLevel(xp)
  const progress = progressToNextLevel(xp)

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="flex-1 h-2 bg-surface-3 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-copper rounded-full"
          initial={animated ? { width: 0 } : undefined}
          animate={{ width: `${progress * 100}%` }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
        />
      </div>
      <span className="text-xs font-heading font-bold text-text-muted whitespace-nowrap">
        Lv.{level}
      </span>
    </div>
  )
}
