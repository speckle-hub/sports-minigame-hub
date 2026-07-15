import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import { Card, CardTitle, CardHeader, CardContent } from "../components/ui/Card"
import { EmptyState } from "../components/ui/EmptyState"
import { Button } from "../components/ui/Button"
import { useAuthStore } from "../stores/authStore"
import { ALL_COSMETICS, isUnlocked, getCosmetic } from "../lib/cosmetics"
import { calculateLevel, GAME_IDS } from "../lib/utils"
import { supabase } from "../lib/supabase"

const ALL_GAME_IDS = Object.values(GAME_IDS)

interface BadgeGroup {
  title: string
  ids: string[]
}

const BADGE_GROUPS: BadgeGroup[] = [
  { title: "Streak", ids: ["streak-3", "streak-7", "streak-30"] },
  { title: "Level", ids: ["level-5", "level-10", "level-20"] },
  { title: "Completionist", ids: ["all-games"] },
  { title: "Skill", ids: ["top-10", "perfect-tactics"] },
  { title: "Football", ids: ["full-time", "golden-boot"] },
]

function getProgress(badgeId: string, currentLevel: number, longestStreak: number, playedGamesCount: number): { current: number; target: number; label: string } | null {
  switch (badgeId) {
    case "streak-3":
      return { current: Math.min(longestStreak, 3), target: 3, label: "day streak" }
    case "streak-7":
      return { current: Math.min(longestStreak, 7), target: 7, label: "day streak" }
    case "streak-30":
      return { current: Math.min(longestStreak, 30), target: 30, label: "day streak" }
    case "level-5":
      return { current: Math.min(currentLevel, 5), target: 5, label: "Level" }
    case "level-10":
      return { current: Math.min(currentLevel, 10), target: 10, label: "Level" }
    case "level-20":
      return { current: Math.min(currentLevel, 20), target: 20, label: "Level" }
    case "all-games":
      return { current: playedGamesCount, target: ALL_GAME_IDS.length, label: "games played" }
    default:
      return null
  }
}

export function Achievements() {
  const { profile, isGuest } = useAuthStore()
  const navigate = useNavigate()
  const [playedGames, setPlayedGames] = useState<Set<string> | null>(null)

  useEffect(() => {
    if (!profile?.id) return
    let cancelled = false
    supabase
      .from("game_results")
      .select("game_id")
      .eq("user_id", profile.id)
      .then(({ data }) => {
        if (cancelled) return
        setPlayedGames(new Set((data || []).map((r: any) => r.game_id)))
      })
    return () => { cancelled = true }
  }, [profile?.id])

  const badges = ALL_COSMETICS.filter((c) => c.type === "badge")
  const unlockedList = profile?.unlocked_cosmetics || []
  const unlockedCount = badges.filter((b) => isUnlocked(b.id, unlockedList)).length
  const currentLevel = profile ? calculateLevel(profile.total_xp) : 0
  const longestStreak = profile?.longest_streak || 0
  const playedCount = playedGames?.size ?? 0

  const content = BADGE_GROUPS.map((group) => ({
    ...group,
    items: group.ids.map((id) => {
      const badge = getCosmetic(id)
      const unlocked = isUnlocked(id, unlockedList)
      const progress = badge ? getProgress(id, currentLevel, longestStreak, playedCount) : null
      return { badge, unlocked, progress }
    }),
  }))

  return (
    <div className="min-h-screen pt-24">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          {isGuest ? (
            <Card className="mb-8">
              <CardContent>
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
              </CardContent>
            </Card>
          ) : (
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
              <CardContent className="space-y-10">
                {content.map((group) => (
                  <div key={group.title}>
                    <h3 className="text-xs font-heading font-bold text-text-muted uppercase tracking-wider mb-4">
                      {group.title}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {group.items.map(({ badge, unlocked, progress }) => {
                        if (!badge) return null
                        return (
                          <div
                            key={badge.id}
                            className={`flex items-start gap-3 p-3.5 rounded-lg border transition-colors ${
                              unlocked
                                ? "bg-surface-2 border-copper/30"
                                : "bg-surface-3/30 border-border/50 opacity-60"
                            }`}
                          >
                            <span className="text-2xl mt-0.5">{badge.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className={`text-sm font-medium ${unlocked ? "text-text" : "text-text-muted"}`}>
                                  {badge.name}
                                </span>
                                {unlocked && (
                                  <span className="text-copper text-xs">✓</span>
                                )}
                              </div>
                              <p className="text-xs text-text-muted leading-relaxed mt-0.5">
                                {badge.description}
                              </p>
                              {unlocked ? (
                                <span className="text-[11px] text-copper font-medium mt-1 block">
                                  Earned
                                </span>
                              ) : progress ? (
                                <div className="mt-2">
                                  <div className="flex items-center justify-between text-[11px] text-text-muted mb-1">
                                    <span>{progress.current}/{progress.target} {progress.label}</span>
                                    <span>{Math.round((progress.current / progress.target) * 100)}%</span>
                                  </div>
                                  <div className="w-full h-1.5 rounded-full bg-surface-3 overflow-hidden">
                                    <div
                                      className="h-full rounded-full bg-copper transition-all duration-500"
                                      style={{ width: `${(progress.current / progress.target) * 100}%` }}
                                    />
                                  </div>
                                </div>
                              ) : (
                                <span className="text-[11px] text-text-muted mt-1 block">
                                  {badge.condition}
                                </span>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </motion.div>
      </div>
    </div>
  )
}
