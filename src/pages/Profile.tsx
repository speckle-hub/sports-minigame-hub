import { useState } from "react"
import { useParams, Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Card, CardTitle, CardHeader, CardContent } from "../components/ui/Card"
import { StatCard } from "../components/ui/StatCard"
import { StreakBadge } from "../components/ui/StreakBadge"
import { XPBar } from "../components/ui/XPBar"
import { Button } from "../components/ui/Button"
import { EditProfileModal } from "../components/EditProfileModal"
import { ProfileSkeleton } from "../components/ui/ProfileSkeleton"
import { EmptyState } from "../components/ui/EmptyState"
import { useAuthStore } from "../stores/authStore"
import { calculateLevel, GAME_LABELS, GAME_IDS, avatarGradientClasses } from "../lib/utils"

export function Profile() {
  const { username } = useParams<{ username: string }>()
  const { profile, isLoading } = useAuthStore()
  const [editOpen, setEditOpen] = useState(false)
  const isOwn =
    username === "me" ||
    username === profile?.username ||
    !username

  if (isLoading) {
    return <ProfileSkeleton />
  }

  if (!profile) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        {isOwn ? (
          <EmptyState
            icon="👤"
            title="Not Signed In"
            description="Sign in to track your XP, streaks, and scores across all games."
            action={
              <Link to="/login">
                <Button variant="primary">Sign In</Button>
              </Link>
            }
          />
        ) : (
          <EmptyState
            icon="🔍"
            title="Player Not Found"
            description="This username doesn't exist or the player hasn't set up their profile yet."
          />
        )}
      </div>
    )
  }

  const level = calculateLevel(profile.total_xp)

  return (
    <div className="min-h-screen pt-24">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card variant="glow" className="mb-8">
            <CardContent>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                <div className="relative">
                  <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${avatarGradientClasses(profile.avatar_url)} flex items-center justify-center text-4xl font-heading font-bold text-base`}>
                    {profile.username[0].toUpperCase()}
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-surface border-2 border-base rounded-full px-2 py-0.5">
                    <span className="text-xs font-heading font-bold text-copper">
                      Lv.{level}
                    </span>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-3xl font-heading font-bold text-text">
                      {profile.username}
                    </h1>
                    {profile.current_streak > 0 && (
                      <StreakBadge count={profile.current_streak} />
                    )}
                  </div>
                  <XPBar xp={profile.total_xp} />
                  <p className="text-xs text-text-muted mt-2">
                    Joined {new Date(profile.join_date).toLocaleDateString()}
                  </p>
                </div>

                {isOwn && (
                  <Button variant="secondary" size="sm" onClick={() => setEditOpen(true)}>
                    Edit Profile
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <StatCard
              label="Total XP"
              value={profile.total_xp.toLocaleString()}
              trend={profile.total_xp > 0 ? "up" : "neutral"}
            />
            <StatCard
              label="Longest Streak"
              value={`${profile.longest_streak}d`}
            />
            <StatCard label="Level" value={level} />
            <StatCard
              label="Cosmetics"
              value={profile.unlocked_cosmetics?.length || 0}
            />
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Best Scores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {Object.entries(GAME_LABELS).map(([id, label]) => (
                  <div
                    key={id}
                    className="flex items-center justify-between p-3 rounded-lg bg-surface-2"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-copper/10 flex items-center justify-center text-sm">
                        {id === GAME_IDS.REFLEX_RUSH
                          ? "⚡"
                          : id === GAME_IDS.MATCH_CALL
                            ? "⚽"
                            : id === GAME_IDS.TRUE_OR_FALSE
                              ? "📖"
                              : "🧠"}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-text">{label}</p>
                        <Link
                          to={`/play/${id}`}
                          className="text-xs text-copper hover:underline"
                        >
                          Play
                        </Link>
                      </div>
                    </div>
                    <span className="text-lg font-heading font-bold text-copper">
                      {profile.best_scores?.[id] ?? "—"}
                      {id === GAME_IDS.REFLEX_RUSH && (
                        <span className="text-xs text-text-muted ml-1">ms</span>
                      )}
                      {id === GAME_IDS.MATCH_CALL && (
                        <span className="text-xs text-text-muted ml-1">correct</span>
                      )}
                      {id === GAME_IDS.TACTICS_DAILY && (
                        <span className="text-xs text-text-muted ml-1">guesses</span>
                      )}
                      {id === GAME_IDS.TRUE_OR_FALSE && (
                        <span className="text-xs text-text-muted ml-1">correct</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Unlocked Cosmetics</CardTitle>
            </CardHeader>
            <CardContent>
              {profile.unlocked_cosmetics && profile.unlocked_cosmetics.length > 0 ? (
                <div className="flex flex-wrap gap-3">
                  {profile.unlocked_cosmetics.map((cosmetic) => (
                    <div
                      key={cosmetic}
                      className="px-4 py-2 bg-surface-2 border border-border rounded-lg text-sm text-text"
                    >
                      {cosmetic
                        .split("-")
                        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                        .join(" ")}
                    </div>
                  ))}
                </div>
              ) : (
                <EmptyState
                  icon="🎨"
                  title="No Cosmetics Yet"
                  description="Earn cosmetics by leveling up, hitting streak milestones, and completing achievements."
                />
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <EditProfileModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
      />
    </div>
  )
}
