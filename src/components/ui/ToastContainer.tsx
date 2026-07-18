import { useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useToastStore, type Toast } from "../../stores/toastStore"

const TYPE_STYLES: Record<Toast["type"], string> = {
  success: "border-l-copper",
  error: "border-l-danger",
  info: "border-l-border",
}

function ToastItem({ toast }: { toast: Toast }) {
  const removeToast = useToastStore((s) => s.removeToast)
  const duration = toast.duration ?? 4000

  useEffect(() => {
    const timer = setTimeout(() => removeToast(toast.id), duration)
    return () => clearTimeout(timer)
  }, [toast.id, duration, removeToast])

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
      className={`bg-surface-2 border border-border ${TYPE_STYLES[toast.type]} border-l-2 rounded-xl p-3 shadow-lg w-80 pointer-events-auto`}
      role="alert"
    >
      <div className="flex items-start gap-2.5">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text">{toast.title}</p>
          {toast.description && (
            <p className="text-xs text-text-muted mt-0.5">{toast.description}</p>
          )}
        </div>
        <button
          onClick={() => removeToast(toast.id)}
          className="text-text-dim hover:text-text text-sm leading-none mt-0.5"
        >
          ✕
        </button>
      </div>
    </motion.div>
  )
}

export function ToastContainer() {
  const toasts = useToastStore((s) => s.toasts)

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} />
        ))}
      </AnimatePresence>
    </div>
  )
}
