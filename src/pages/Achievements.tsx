import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Card, CardTitle, CardHeader, CardContent } from "../components/ui/Card"
import { EmptyState } from "../components/ui/EmptyState"
import { Button } from "../components/ui/Button"
import { useAuthStore } from "../stores/authStore"
import { ALL_COSMETICS, isUnlocked } from "../lib/cosmetics"

export function Achievements() {
  const { profile, isGuest } = useAuthStore()
  const navigate = useNavigate()

  const badges = ALL_COSMETICS.filter((c) => c.type === "badge")
  const unlockedCount = badges.filter((b) => isUnlocked(b.id, profile?.unlocked_cosmetics || [])).length

  return (
    <div className="min-h-screen pt-24">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="mb-8">
            <CardHeader>
              <div>
                <CardTitle>Achievements</CardTitle>
                <p className="text-xs text-text-muted mt-1">
                  Complete challenges and reach milestones to earn badges
                </p>
              </div>
              <span className="text-xs font-heading font-bold text-copper whitespace-nowrap">
                {unlockedCount} / {badges.length}
              </span>
            </CardHeader>
            <CardContent>
              {isGuest ? (
                <EmptyState
                  icon="🏆"
                  title="Sign in to track achievements"
                  description="Create an account or sign in to start earning badges."
                  action={
                    <Button variant="primary" onClick={() => navigate("/login")}>
                      Sign In
                    </Button>
                  }
                />
              ) : badges.length === 0 ? (
                <EmptyState
                  icon="📭"
                  title="No achievements yet"
                  description="Badges will appear here once they're created."
                />
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {badges.map((badge, i) => {
                    const unlocked = isUnlocked(badge.id, profile?.unlocked_cosmetics || [])
                    return (
                      <motion.div
                        key={badge.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className={`relative rounded-xl border p-5 transition-all duration-300 ${
                          unlocked
                            ? "bg-surface-2 border-copper/30 shadow-[0_0_12px_-4px_rgba(200,120,60,0.15)]"
                            : "bg-surface-3/30 border-border/50 opacity-60"
                        }`}
                      >
                        {unlocked && (
                          <div className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-copper flex items-center justify-center shadow-lg">
                            <svg className="w-3.5 h-3.5 text-base" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          </div>
                        )}
                        <div className={`text-4xl mb-3 ${unlocked ? "" : "grayscale"}`}>
                          {badge.icon}
                        </div>
                        <h3 className={`text-sm font-heading font-bold mb-1 ${
                          unlocked ? "text-text" : "text-text-muted"
                        }`}>
                          {badge.name}
                        </h3>
                        <p className="text-xs text-text-muted leading-relaxed mb-3">
                          {badge.description}
                        </p>
                        <div className={`text-[11px] font-medium px-2.5 py-1 rounded-full inline-block ${
                          unlocked
                            ? "bg-copper/10 text-copper"
                            : "bg-surface-3 text-text-muted"
                        }`}>
                          {unlocked ? "Earned" : badge.condition}
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
