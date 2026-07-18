import { useState, useEffect } from "react"
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
import { useFriendStore } from "../stores/friendStore"
import { useChallengeStore } from "../stores/challengeStore"
import { supabase } from "../lib/supabase"
import { calculateLevel, GAME_LABELS, GAME_IDS, avatarGradientClasses } from "../lib/utils"
import { ALL_COSMETICS, isUnlocked } from "../lib/cosmetics"
import type { Profile } from "../stores/authStore"

export function Profile() {
  const { username } = useParams<{ username: string }>()
  const { profile: ownProfile, isLoading: ownLoading, user } = useAuthStore()
  const { isFollowing, followUser, unfollowUser, loadFollowing } = useFriendStore()
  const [editOpen, setEditOpen] = useState(false)
  const [viewedProfile, setViewedProfile] = useState<Profile | null>(null)
  const [viewedLoading, setViewedLoading] = useState(false)

  const [followActionLoading, setFollowActionLoading] = useState(false)
  const [followError, setFollowError] = useState<string | null>(null)
  const [challengeSending, setChallengeSending] = useState<string | null>(null)
  const [challengeSent, setChallengeSent] = useState<string | null>(null)

  const isOwn =
    username === "me" ||
    username === ownProfile?.username ||
    !username

  // Load own profile's following list
  useEffect(() => {
    if (user) loadFollowing()
  }, [user, loadFollowing])

  // Fetch another user's profile when viewing their page
  useEffect(() => {
    if (isOwn || !username) return

    let cancelled = false
    setViewedLoading(true)

    supabase
      .from("profiles")
      .select("*")
      .eq("username", username)
      .maybeSingle()
      .then(({ data, error }) => {
        if (cancelled) return
        setViewedLoading(false)
        if (!error && data) {
          setViewedProfile(data as unknown as Profile)
        } else {
          setViewedProfile(null)
        }
      })

    return () => { cancelled = true }
  }, [username, isOwn])

  const profile = isOwn ? ownProfile : viewedProfile
  const loading = isOwn ? ownLoading : viewedLoading

  if (loading) {
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
  const viewingOther = !isOwn && !!user
  const following = viewingOther && isFollowing(profile!.username)

  async function handleFollowToggle() {
    if (!viewingOther || !profile!.id) return
    setFollowActionLoading(true)
    setFollowError(null)
    const result = following
      ? await unfollowUser(profile!.id)
      : await followUser(profile!.id)
    if (result.error) {
      setFollowError(result.error)
    }
    setFollowActionLoading(false)
  }

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
                    {profile.bio && (
                      <p className="text-sm text-text-muted mb-2 italic">
                        {profile.bio}
                      </p>
                    )}
                    <XPBar xp={profile.total_xp} />
                    <p className="text-xs text-text-muted mt-2">
                      Joined {new Date(profile.join_date).toLocaleDateString()}
                    </p>
                  </div>

                <div className="flex flex-col items-end gap-1">
                  <div className="flex items-center gap-2">
                    {isOwn && (
                      <Button variant="secondary" size="sm" onClick={() => setEditOpen(true)}>
                        Edit Profile
                      </Button>
                    )}
                    {viewingOther && (
                      <Button
                        variant={following ? "secondary" : "primary"}
                        size="sm"
                        onClick={handleFollowToggle}
                        isLoading={followActionLoading}
                      >
                        {following ? "Following" : "Follow"}
                      </Button>
                    )}
                  </div>
                  {followError && (
                    <p className="text-[11px] text-danger">{followError}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <StatCard
              label="Total XP"
              value={profile.total_xp}
              icon="⚡"
              iconBg="from-copper to-gold"
            />
            <StatCard
              label="Longest Streak"
              value={`${profile.longest_streak}d`}
              icon="🔥"
              iconBg="from-copper to-streak"
            />
            <StatCard
              label="Level"
              value={level}
              icon="🏆"
              iconBg="from-gold to-copper"
            />
            <StatCard
              label="Cosmetics"
              value={profile.unlocked_cosmetics?.length || 0}
              icon="🎨"
              iconBg="from-pitch-light to-pitch"
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
                            {!isOwn && (
                              <span className="text-xs text-text-muted">{profile.best_scores?.[id] != null ? "Best" : "No score"}</span>
                            )}
                            {isOwn && (
                              <Link
                                to={`/play/${id}`}
                                className="text-xs text-copper hover:underline"
                              >
                                Play
                              </Link>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
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
                          {viewingOther && ownProfile?.best_scores?.[id] != null && (
                            <button
                              onClick={async () => {
                                setChallengeSending(id)
                                setChallengeSent(null)
                                const { error } = await useChallengeStore.getState().sendChallenge(
                                  profile!.id,
                                  id,
                                  ownProfile!.best_scores![id]
                                )
                                setChallengeSending(null)
                                if (!error) setChallengeSent(id)
                              }}
                              disabled={challengeSending === id}
                              className="text-[11px] font-heading font-bold px-2.5 py-1 rounded-md bg-copper/10 text-copper hover:bg-copper/20 transition-colors disabled:opacity-50"
                            >
                              {challengeSending === id ? "..." : challengeSent === id ? "✓ Sent" : "Challenge"}
                            </button>
                          )}
                        </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cosmetics</CardTitle>
              <span className="text-xs text-text-muted">
                {(profile.unlocked_cosmetics || []).length} / {ALL_COSMETICS.length}
              </span>
            </CardHeader>
            <CardContent className="space-y-6">
              {(["gradient", "badge"] as const).map((type) => {
                const items = ALL_COSMETICS.filter((c) => c.type === type)
                return (
                  <div key={type}>
                    <h4 className="text-xs font-heading font-bold text-text-muted uppercase tracking-wider mb-3">
                      {type === "gradient" ? "Avatar Gradients" : "Badges"}
                    </h4>
                    <div className="flex flex-wrap gap-2.5">
                      {items.map((cosmetic) => {
                        const unlocked = isUnlocked(cosmetic.id, profile.unlocked_cosmetics || [])
                        return (
                          <div
                            key={cosmetic.id}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm transition-colors ${
                              unlocked
                                ? "bg-surface-2 border-border text-text"
                                : "bg-surface-3/30 border-border/50 text-text-dim opacity-60"
                            }`}
                            title={unlocked ? cosmetic.description : cosmetic.condition}
                          >
                            <span>{cosmetic.icon}</span>
                            <span className="font-medium">{cosmetic.name}</span>
                            {!unlocked && (
                              <span className="text-[10px] text-text-muted ml-1">🔒</span>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
              {(profile.unlocked_cosmetics || []).length === 0 && (
                <p className="text-xs text-text-muted text-center">
                  Complete challenges and level up to earn cosmetics. They'll appear here once unlocked.
                </p>
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
