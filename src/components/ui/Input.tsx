import { type InputHTMLAttributes, forwardRef } from "react"
import { cn } from "../../lib/utils"

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  wrapperClassName?: string
  inline?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, id, wrapperClassName, inline, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined)

    return (
      <div className={cn({ "flex-1": inline }, wrapperClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-text-muted mb-1"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            "w-full px-4 py-2.5 bg-surface-2 border border-border rounded-lg text-text placeholder:text-text-dim focus:outline-none focus:border-copper/50 transition-colors",
            inline && "py-3 rounded-xl",
            error && "border-danger focus:border-danger",
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-sm text-danger mt-1">{error}</p>
        )}
      </div>
    )
  }
)
