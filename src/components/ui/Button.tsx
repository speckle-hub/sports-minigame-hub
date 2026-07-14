import { type ButtonHTMLAttributes, forwardRef } from "react"
import { motion } from "framer-motion"
import { cn } from "../../lib/utils"

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "danger" | "success"
  size?: "sm" | "md" | "lg"
  isLoading?: boolean
}

const variants = {
  primary:
    "bg-copper text-base hover:bg-copper-hover glow-copper hover:glow-copper-strong",
  secondary:
    "bg-surface-2 text-text border border-border hover:bg-surface-3 hover:border-copper/30",
  ghost:
    "bg-transparent text-text-muted hover:text-text hover:bg-surface-2",
  danger:
    "bg-danger/10 text-danger border border-danger/20 hover:bg-danger/20",
  success:
    "bg-pitch text-text border border-pitch-light/30 hover:bg-pitch-light",
}

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-5 py-2.5 text-sm",
  lg: "px-8 py-3.5 text-base",
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className={cn(
          "relative inline-flex items-center justify-center font-heading font-bold rounded-lg transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed",
          variants[variant],
          sizes[size],
          className
        )}
        disabled={disabled || isLoading}
        {...(props as any)}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            Loading...
          </span>
        ) : (
          children
        )}
      </motion.button>
    )
  }
)
