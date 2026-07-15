import { useEffect, useRef } from "react"
import { useAuthStore } from "../stores/authStore"
import { calculateLevel } from "../lib/utils"
import { sfxLevelUp, sfxStreak } from "../lib/sound"

const STREAK_MILESTONES = [3, 7, 14, 30, 50, 100]

export function MilestoneWatcher() {
  const profile = useAuthStore((s) => s.profile)
  const prevLevelRef = useRef(0)
  const prevStreakRef = useRef(0)

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

  return null
}
