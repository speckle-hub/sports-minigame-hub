import { motion } from "framer-motion"
import { cn, calculateLevel, progressToNextLevel, xpForCurrentLevel, xpForNextLevel } from "../../lib/utils"

interface XPBarProps {
  xp: number
  className?: string
  animated?: boolean
}

export function XPBar({ xp, className, animated = true }: XPBarProps) {
  const level = calculateLevel(xp)
  const progress = progressToNextLevel(xp)
  const currentLevelXp = xpForCurrentLevel(level)
  const nextLevelXp = xpForNextLevel(level)
  const xpInLevel = Math.round(xp - currentLevelXp)
  const xpNeeded = Math.round(nextLevelXp - currentLevelXp)

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="flex-1">
        <div className="h-2 bg-surface-3 rounded-full overflow-hidden relative">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(to right, #FF6B35, #FF8E5E)' }}
            initial={animated ? { width: 0 } : undefined}
            animate={{ width: `${progress * 100}%` }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-[11px] text-text-muted font-medium">
            {xpInLevel.toLocaleString()} / {xpNeeded.toLocaleString()} XP
          </span>
          <span className="text-[11px] font-heading font-bold text-text-muted">
            Lv.{level}
          </span>
        </div>
      </div>
    </div>
  )
}
