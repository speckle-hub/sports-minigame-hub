import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "../../lib/utils"
import { useAuthStore } from "../../stores/authStore"
import { calculateLevel } from "../../lib/utils"

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/leaderboards", label: "Leaderboards" },
]

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const { profile, isGuest } = useAuthStore()
  const level = profile ? calculateLevel(profile.total_xp) : 0

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-base/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-copper flex items-center justify-center font-heading font-bold text-base text-sm group-hover:scale-105 transition-transform">
            S
          </div>
          <span className="font-heading font-bold text-lg text-text hidden sm:block">
            Sports Hub
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={cn(
                "relative px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                location.pathname === link.to
                  ? "text-copper"
                  : "text-text-muted hover:text-text hover:bg-surface-2"
              )}
            >
              {location.pathname === link.to && (
                <motion.div
                  layoutId="nav-indicator"
                  className="absolute inset-0 bg-surface-2 rounded-lg"
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10">{link.label}</span>
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          {isGuest ? (
            <Link
              to="/login"
              className="px-4 py-2 text-sm font-heading font-bold bg-copper text-base rounded-lg hover:bg-copper-hover transition-colors"
            >
              Sign In
            </Link>
          ) : (
            <Link
              to={`/profile/${profile?.username || "me"}`}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-surface-2 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-copper/20 flex items-center justify-center text-xs font-heading font-bold text-copper">
                {profile?.username?.[0]?.toUpperCase() || "?"}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-text leading-tight">
                  {profile?.username || "Player"}
                </p>
                <p className="text-xs text-text-muted">Lv.{level}</p>
              </div>
            </Link>
          )}
        </div>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden p-2 rounded-lg text-text-muted hover:text-text hover:bg-surface-2 transition-colors"
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-base/95 backdrop-blur-xl border-b border-border"
          >
            <div className="px-4 py-4 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "block px-4 py-3 text-sm font-medium rounded-lg transition-colors",
                    location.pathname === link.to
                      ? "text-copper bg-surface-2"
                      : "text-text-muted hover:text-text hover:bg-surface-2"
                  )}
                >
                  {link.label}
                </Link>
              ))}
              <div className="border-t border-border pt-2 mt-2">
                {isGuest ? (
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-3 text-sm font-heading font-bold bg-copper text-base rounded-lg text-center hover:bg-copper-hover transition-colors"
                  >
                    Sign In
                  </Link>
                ) : (
                  <Link
                    to={`/profile/${profile?.username || "me"}`}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-surface-2 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-copper/20 flex items-center justify-center text-sm font-heading font-bold text-copper">
                      {profile?.username?.[0]?.toUpperCase() || "?"}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text">
                        {profile?.username || "Player"}
                      </p>
                      <p className="text-xs text-text-muted">Lv.{level}</p>
                    </div>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
