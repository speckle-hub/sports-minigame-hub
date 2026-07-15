import { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { useNotificationStore } from "../stores/notificationStore"
import { useAuthStore } from "../stores/authStore"

export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { notifications, unreadCount, loadNotifications, markRead, markAllRead } = useNotificationStore()

  useEffect(() => {
    if (user) loadNotifications()
  }, [user, loadNotifications])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg text-text-muted hover:text-text hover:bg-surface-2 transition-colors"
        aria-label="Notifications"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 rounded-full bg-danger text-base text-[10px] font-bold flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="absolute right-0 top-full mt-2 w-80 max-h-96 overflow-y-auto rounded-xl border border-border bg-surface shadow-xl z-50"
          >
            <div className="sticky top-0 bg-surface border-b border-border px-4 py-2.5 flex items-center justify-between">
              <span className="text-xs font-heading font-bold text-text">Notifications</span>
              {unreadCount > 0 && (
                <button onClick={markAllRead} className="text-[11px] text-copper hover:underline">
                  Mark all read
                </button>
              )}
            </div>
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center text-sm text-text-muted">No notifications yet</div>
            ) : (
              notifications.slice(0, 20).map((n) => (
                <button
                  key={n.id}
                  onClick={() => {
                    if (!n.read) markRead(n.id)
                    if (n.link) navigate(n.link)
                    setOpen(false)
                  }}
                  className={`w-full text-left px-4 py-3 hover:bg-surface-2 transition-colors border-b border-border/50 last:border-0 ${
                    !n.read ? "bg-copper/[0.03]" : ""
                  }`}
                >
                  <p className={`text-sm ${n.read ? "text-text-muted" : "text-text font-medium"}`}>
                    {n.title}
                  </p>
                  <p className="text-xs text-text-muted mt-0.5">{n.body}</p>
                </button>
              ))
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
