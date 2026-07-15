import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "./ui/Button"
import { useAuthStore } from "../stores/authStore"

const ONBOARDING_KEY = "sports-hub-onboarding-done"

const tips = [
  { icon: "🎮", title: "Play Games", body: "Choose from 9 minigames — quizzes, reaction tests, and football trivia" },
  { icon: "⭐", title: "Earn XP & Level Up", body: "Every game gives XP. The more you play, the higher your level" },
  { icon: "🔥", title: "Build Streaks", body: "Play Tactics Daily every day to build your streak and earn bonus XP" },
  { icon: "🏆", title: "Unlock Cosmetics", body: "Reach milestones to unlock new avatar gradients and achievement badges" },
  { icon: "👥", title: "Challenge Friends", body: "Visit a friend's profile and challenge them to beat your best score" },
]

export function Onboarding() {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)
  const { isGuest } = useAuthStore()

  useEffect(() => {
    if (isGuest) return
    const done = localStorage.getItem(ONBOARDING_KEY)
    if (!done) {
      const timer = setTimeout(() => setOpen(true), 600)
      return () => clearTimeout(timer)
    }
  }, [isGuest])

  function dismiss() {
    localStorage.setItem(ONBOARDING_KEY, "true")
    setOpen(false)
  }

  const current = tips[step]

  return (
    <AnimatePresence>
      {open && current && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={dismiss}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="relative w-full max-w-sm bg-surface border border-border rounded-2xl p-6 shadow-2xl"
          >
            <div className="text-5xl text-center mb-4">{current.icon}</div>
            <h2 className="text-xl font-heading font-bold text-text text-center mb-2">
              {current.title}
            </h2>
            <p className="text-sm text-text-muted text-center mb-6">
              {current.body}
            </p>
            <div className="flex items-center justify-center gap-2 mb-6">
              {tips.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === step ? "bg-copper" : "bg-surface-3"
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-3">
              {step < tips.length - 1 ? (
                <>
                  <Button variant="ghost" size="sm" onClick={dismiss} className="flex-1">
                    Skip
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => setStep((s) => s + 1)} className="flex-1">
                    Next
                  </Button>
                </>
              ) : (
                <Button variant="primary" size="sm" onClick={dismiss} className="flex-1">
                  Get Started
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
