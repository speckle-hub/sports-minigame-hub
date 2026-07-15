import { useEffect, useRef } from "react"
import { useAuthStore } from "../stores/authStore"
import { calculateLevel } from "../lib/utils"
import { sfxLevelUp, sfxStreak } from "../lib/sound"
import { checkAndUnlockCosmetics } from "../lib/unlockCosmetics"

const STREAK_MILESTONES = [3, 7, 14, 30, 50, 100]

export function MilestoneWatcher() {
  const profile = useAuthStore((s) => s.profile)
  const prevLevelRef = useRef(0)
  const prevStreakRef = useRef(0)
  const userId = useAuthStore((s) => s.user?.id)

  useEffect(() => {
    if (!profile) return

    const newLevel = calculateLevel(profile.total_xp)
    if (prevLevelRef.current > 0 && newLevel > prevLevelRef.current) {
      sfxLevelUp()
    }
    prevLevelRef.current = newLevel

    if (STREAK_MILESTONES.includes(profile.current_streak) && profile.current_streak > prevStreakRef.current) {
      sfxStreak()
    }
    prevStreakRef.current = profile.current_streak
  }, [profile, profile?.total_xp, profile?.current_streak])

  // Check cosmetics on profile load / change
  useEffect(() => {
    if (!profile || !userId) return
    const timer = setTimeout(() => {
      checkAndUnlockCosmetics(userId, profile).catch(console.error)
    }, 500)
    return () => clearTimeout(timer)
  }, [profile?.total_xp, profile?.current_streak, profile?.longest_streak])

  return null
}
