import { type HTMLAttributes, forwardRef } from "react"
import { motion } from "framer-motion"
import { cn } from "../../lib/utils"

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "highlight" | "glow"
  animate?: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = "default", animate = true, children, ...props }, ref) => {
    const Component = animate ? motion.div : "div"
    const motionProps = animate
      ? {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-50px" },
          transition: { type: "spring", stiffness: 300, damping: 25 },
        }
      : {}

    return (
      <Component
        ref={ref}
        className={cn(
          "bg-surface border border-border rounded-xl p-6 grain",
          variant === "highlight" && "card-highlight border-copper/20",
          variant === "glow" && "glow-copper border-copper/20",
          className
        )}
        {...motionProps}
        {...(props as any)}
      >
        {children}
      </Component>
    )
  }
)

export function CardHeader({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("flex items-center justify-between mb-4", className)} {...props}>
      {children}
    </div>
  )
}

export function CardTitle({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn("font-heading text-lg font-bold text-text", className)} {...props}>
      {children}
    </h3>
  )
}

export function CardContent({
  className,
  children,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("", className)} {...props}>
      {children}
    </div>
  )
}
