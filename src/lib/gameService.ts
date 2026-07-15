import { supabase } from "./supabase"
import { useAuthStore } from "../stores/authStore"
import { useGameStore } from "../stores/gameStore"
import { checkAndUnlockCosmetics } from "./unlockCosmetics"
import { useChallengeStore } from "../stores/challengeStore"
import type { Profile } from "../stores/authStore"

const GUEST_STORAGE_KEY = "sports-hub-guest-results"

interface GameResultPayload {
  gameId: string
  score: number
  details: Record<string, number | string>
  xpEarned: number
}

function getToday(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

function getYesterday(): string {
  const d = new Date()
  d.setDate(d.getDate() - 1)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
}

export function getGuestResults(): GameResultPayload[] {
  try {
    const raw = localStorage.getItem(GUEST_STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function addGuestResult(result: GameResultPayload) {
  const existing = getGuestResults()
  existing.push(result)
  localStorage.setItem(GUEST_STORAGE_KEY, JSON.stringify(existing))
}

function clearGuestResults() {
  localStorage.removeItem(GUEST_STORAGE_KEY)
}

export async function migrateGuestResults(userId: string) {
  const results = getGuestResults()
  if (results.length === 0) return

  let totalXp = 0
  const resultsToInsert = results.map((r) => ({
    user_id: userId,
    game_id: r.gameId,
    score: r.score,
    details: r.details,
    xp_earned: r.xpEarned,
  }))

  const { error: insertError } = await supabase
    .from("game_results")
    .insert(resultsToInsert)

  if (insertError) {
    console.error("Failed to migrate guest results:", insertError)
    return
  }

  totalXp = results.reduce((sum, r) => sum + r.xpEarned, 0)

  // Get current XP
  const { data: currentProfile } = await supabase
    .from("profiles")
    .select("total_xp")
    .eq("id", userId)
    .single()

  const newTotalXp = (currentProfile?.total_xp || 0) + totalXp
  await supabase
    .from("profiles")
    .update({ total_xp: newTotalXp })
    .eq("id", userId)

  clearGuestResults()

  // Reload profile
  const store = useAuthStore.getState()
  store.loadProfile(userId)
}

export async function saveGameResult(result: GameResultPayload) {
  const { user, profile, isGuest } = useAuthStore.getState()

  if (isGuest || !user) {
    addGuestResult(result)
    const guestProfile = useAuthStore.getState().profile
    if (guestProfile) {
      useAuthStore.setState({
        profile: {
          ...guestProfile,
          total_xp: guestProfile.total_xp + result.xpEarned,
        },
      })
    }
    useGameStore.getState().setLastResult({
      ...result,
      timestamp: Date.now(),
    })
    return
  }

  // Authenticated — save to Supabase
  const { error: insertError } = await supabase.from("game_results").insert({
    user_id: user.id,
    game_id: result.gameId,
    score: result.score,
    details: result.details,
    xp_earned: result.xpEarned,
  })

  if (insertError) {
    console.error("Failed to save game result:", insertError)
    return
  }

  // Update total_xp
  const { error: xpError } = await supabase
    .from("profiles")
    .update({ total_xp: (profile?.total_xp || 0) + result.xpEarned })
    .eq("id", user.id)

  if (xpError) {
    console.error("Failed to update XP:", xpError)
  }

  const newTotalXp = (profile?.total_xp || 0) + result.xpEarned

  // Reload profile
  useAuthStore.getState().loadProfile(user.id)

  // Check and unlock cosmetics (pass updated XP)
  const updatedProfile = profile ? { ...profile, total_xp: newTotalXp } : profile
  checkAndUnlockCosmetics(user.id, updatedProfile as Profile, {
    gameId: result.gameId,
    score: result.score,
    details: result.details,
    xpEarned: result.xpEarned,
  }).catch(console.error)

  // Check and resolve pending head-to-head challenges
  useChallengeStore.getState().checkAndResolveChallenge(user.id, result.gameId, result.score)

  useGameStore.getState().setLastResult({
    ...result,
    timestamp: Date.now(),
  })
}

export async function saveTacticsDailyResult(result: GameResultPayload) {
  const { user, profile, isGuest } = useAuthStore.getState()
  const today = getToday()

  if (isGuest || !user) {
    // Store result + fake streak increment in localStorage as well
    addGuestResult(result)
    const guestProfile = useAuthStore.getState().profile
    if (guestProfile) {
      const yesterday = getYesterday()
      const newStreak =
        guestProfile.last_streak_date === yesterday
          ? guestProfile.current_streak + 1
          : guestProfile.last_streak_date === today
            ? guestProfile.current_streak
            : 1
      useAuthStore.setState({
        profile: {
          ...guestProfile,
          total_xp: guestProfile.total_xp + result.xpEarned,
          current_streak: newStreak,
          longest_streak: Math.max(guestProfile.longest_streak, newStreak),
          last_streak_date: today,
        },
      })
    }
    useGameStore.getState().setLastResult({
      ...result,
      timestamp: Date.now(),
    })
    return
  }

  // Authenticated
  const { error: insertError } = await supabase.from("game_results").insert({
    user_id: user.id,
    game_id: result.gameId,
    score: result.score,
    details: result.details,
    xp_earned: result.xpEarned,
  })

  if (insertError) {
    console.error("Failed to save tactics result:", insertError)
    return
  }

  // Check if already completed today
  const { data: existingChallenge } = await supabase
    .from("daily_challenges")
    .select("id")
    .eq("user_id", user.id)
    .eq("game_id", "tactics-daily")
    .eq("completed_date", today)
    .maybeSingle()

  if (!existingChallenge) {
    // Calculate streak
    const lastDate = profile?.last_streak_date
    let newStreak = 1
    if (lastDate === getYesterday()) {
      newStreak = (profile?.current_streak || 0) + 1
    } else if (lastDate === today) {
      newStreak = profile?.current_streak || 1
    }

    const newLongest = Math.max(profile?.longest_streak || 0, newStreak)

    // Insert daily challenge record
    await supabase.from("daily_challenges").insert({
      user_id: user.id,
      game_id: "tactics-daily",
      completed_date: today,
      guesses_used: result.score,
          won: result.details.won === "true",
    })

    // Update profile streak + XP
    await supabase
      .from("profiles")
      .update({
        current_streak: newStreak,
        longest_streak: newLongest,
        last_streak_date: today,
        total_xp: (profile?.total_xp || 0) + result.xpEarned,
      })
      .eq("id", user.id)
  }

  const newTotalXpTactics = (profile?.total_xp || 0) + result.xpEarned

  // Reload profile
  useAuthStore.getState().loadProfile(user.id)

  const updatedProfileTactics = profile ? { ...profile, total_xp: newTotalXpTactics } : profile
  checkAndUnlockCosmetics(user.id, updatedProfileTactics as any, {
    gameId: result.gameId,
    score: result.score,
    details: result.details,
    xpEarned: result.xpEarned,
  }).catch(console.error)

  // Check and resolve pending head-to-head challenges
  useChallengeStore.getState().checkAndResolveChallenge(user.id, result.gameId, result.score)

  useGameStore.getState().setLastResult({
    ...result,
    timestamp: Date.now(),
  })
}
