import { useRef, useEffect } from "react"
import { motion, useInView, useSpring, useTransform } from "framer-motion"
import { cn } from "../../lib/utils"

interface StatCardProps {
  label: string
  value: string | number
  icon?: string
  iconBg?: string
  className?: string
}

export function StatCard({ label, value, icon, iconBg, className }: StatCardProps) {
  const isNumeric = typeof value === "number"
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-50px" })
  const spring = useSpring(0, { stiffness: 80, damping: 25 })
  const display = useTransform(spring, (current) => Math.round(current).toLocaleString())

  useEffect(() => {
    if (isInView && isNumeric) {
      spring.set(value)
    }
  }, [isInView, value, spring, isNumeric])

  return (
    <div
      ref={ref}
      className={cn(
        "relative bg-surface-2 border border-border rounded-xl p-4 flex flex-col gap-1 overflow-hidden",
        className
      )}
    >
      <div
        className="absolute -top-6 -right-6 w-28 h-28 rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(circle, rgba(255,107,53,0.06) 0%, transparent 70%)",
        }}
      />
      <div className="relative z-10 flex items-center justify-between">
        <span className="text-xs font-medium text-text-muted uppercase tracking-wider">
          {label}
        </span>
        {icon && (
          <div
            className={cn(
              "w-8 h-8 rounded-lg bg-gradient-to-br flex items-center justify-center text-sm",
              iconBg || "from-copper to-gold"
            )}
          >
            {icon}
          </div>
        )}
      </div>
      <div className="relative z-10">
        {isNumeric ? (
          <motion.span className="text-2xl font-heading font-bold text-text">
            {display}
          </motion.span>
        ) : (
          <span className="text-2xl font-heading font-bold text-text">
            {value}
          </span>
        )}
      </div>
    </div>
  )
}
