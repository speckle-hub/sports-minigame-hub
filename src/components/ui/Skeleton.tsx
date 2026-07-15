import { cn } from "../../lib/utils"

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "bg-surface-3/60 rounded-xl animate-pulse",
        className
      )}
    />
  )
}
