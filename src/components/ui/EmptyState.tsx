import { cn } from "../../lib/utils"

interface EmptyStateProps {
  icon: string
  title: string
  description: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center py-12 px-4", className)}>
      <div className="text-5xl mb-4 opacity-60">{icon}</div>
      <h3 className="text-lg font-heading font-bold text-text mb-1">{title}</h3>
      <p className="text-sm text-text-muted text-center max-w-xs mb-4">{description}</p>
      {action}
    </div>
  )
}
